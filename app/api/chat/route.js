import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompt';
import { assessRisk } from '@/lib/risk';
import { buildMockResponse } from '@/lib/mock';
import { getServerSupabase, getAnonServerSupabase } from '@/lib/supabase-server';

async function getUserFromAuthHeader(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;

  const anonClient = getAnonServerSupabase();
  const { data, error } = await anonClient.auth.getUser(token);
  if (error) return null;
  return data.user || null;
}

async function createAiResult(input) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return buildMockResponse(input);

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input }
      ]
    })
  });

  if (!response.ok) return buildMockResponse(input);

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(raw);
  } catch {
    return buildMockResponse(input);
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: '未登录或会话已失效' }, { status: 401 });

    const { input, conversationId, consentSchoolShare } = await req.json();
    if (!input || !conversationId) return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });

    const ai = await createAiResult(input);
    const risk = assessRisk(input, ai.emotion_scores || {});
    const server = getServerSupabase();

    const { data: messageRow, error: messageError } = await server
      .from('messages')
      .insert({
        user_id: user.id,
        conversation_id: conversationId,
        role: 'user',
        content: input,
        insight: ai.insight || '',
        journal_draft: ai.journal_draft || '',
        abc_analysis: ai.abc || {},
        follow_up: ai.follow_up || [],
        emotion_scores: ai.emotion_scores || {},
        risk_level: risk.level,
        risk_reason: risk.reason
      })
      .select('id')
      .single();

    if (messageError) return NextResponse.json({ error: messageError.message }, { status: 500 });

    await server
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        title: input.slice(0, 24)
      })
      .eq('id', conversationId)
      .eq('user_id', user.id);

    await server
      .from('profiles')
      .update({
        consent_school_share: Boolean(consentSchoolShare),
        email: user.email || null
      })
      .eq('user_id', user.id);

    if (risk.level !== 'low') {
      await server.from('risk_events').insert({
        user_id: user.id,
        conversation_id: conversationId,
        message_id: messageRow.id,
        risk_level: risk.level,
        trigger_reason: risk.reason,
        keywords: risk.keywords,
        score: risk.score,
        user_consented: Boolean(consentSchoolShare)
      });
    }

    return NextResponse.json({
      ...ai,
      risk_level: risk.level,
      risk_reason: risk.reason,
      risk_keywords: risk.keywords
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || '服务器异常' }, { status: 500 });
  }
}
