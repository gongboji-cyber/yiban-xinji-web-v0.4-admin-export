import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getServerSupabase } from '@/lib/supabase-server';

export async function GET(req) {
  try {
    const accessKey = req.headers.get('x-admin-export-key') || '';
    if (!process.env.ADMIN_EXPORT_KEY || accessKey !== process.env.ADMIN_EXPORT_KEY) {
      return new NextResponse('后台访问码错误', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = Math.max(1, Math.min(365, Number(searchParams.get('days') || 7)));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const server = getServerSupabase();
    const [{ data: events, error: eventError }, { data: profiles, error: profileError }] = await Promise.all([
      server.from('risk_events')
        .select('id, user_id, conversation_id, risk_level, trigger_reason, keywords, score, user_consented, school_notified, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false }),
      server.from('profiles')
        .select('user_id, email, display_name, student_no, consent_school_share')
    ]);

    if (eventError) throw eventError;
    if (profileError) throw profileError;

    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const userAgg = new Map();

    for (const item of events || []) {
      const current = userAgg.get(item.user_id) || {
        user_id: item.user_id,
        email: profileMap.get(item.user_id)?.email || '',
        display_name: profileMap.get(item.user_id)?.display_name || '',
        student_no: profileMap.get(item.user_id)?.student_no || '',
        event_count: 0,
        high_count: 0,
        medium_count: 0,
        latest_risk_level: item.risk_level,
        latest_time: item.created_at,
        consent_school_share: profileMap.get(item.user_id)?.consent_school_share ?? false
      };
      current.event_count += 1;
      if (item.risk_level === 'high') current.high_count += 1;
      if (item.risk_level === 'medium') current.medium_count += 1;
      if (new Date(item.created_at) > new Date(current.latest_time)) {
        current.latest_time = item.created_at;
        current.latest_risk_level = item.risk_level;
      }
      userAgg.set(item.user_id, current);
    }

    const workbook = new ExcelJS.Workbook();
    const summary = workbook.addWorksheet('用户风险总览');
    summary.columns = [
      { header: '用户ID', key: 'user_id', width: 38 },
      { header: '邮箱', key: 'email', width: 28 },
      { header: '姓名', key: 'display_name', width: 18 },
      { header: '学号', key: 'student_no', width: 18 },
      { header: '最近天数内事件数', key: 'event_count', width: 16 },
      { header: '高风险次数', key: 'high_count', width: 14 },
      { header: '中风险次数', key: 'medium_count', width: 14 },
      { header: '最近一次风险等级', key: 'latest_risk_level', width: 16 },
      { header: '最近一次时间', key: 'latest_time', width: 22 },
      { header: '用户已授权纳入导出', key: 'consent_school_share', width: 18 }
    ];
    summary.addRows(Array.from(userAgg.values()));
    summary.getRow(1).font = { bold: true };

    const detail = workbook.addWorksheet('风险事件明细');
    detail.columns = [
      { header: '事件ID', key: 'id', width: 38 },
      { header: '用户ID', key: 'user_id', width: 38 },
      { header: '风险等级', key: 'risk_level', width: 14 },
      { header: '触发原因', key: 'trigger_reason', width: 42 },
      { header: '关键词', key: 'keywords', width: 28 },
      { header: '得分', key: 'score', width: 10 },
      { header: '用户已授权', key: 'user_consented', width: 12 },
      { header: '是否已通知', key: 'school_notified', width: 12 },
      { header: '触发时间', key: 'created_at', width: 22 }
    ];
    detail.addRows((events || []).map((item) => ({
      ...item,
      keywords: Array.isArray(item.keywords) ? item.keywords.join(' | ') : ''
    })));
    detail.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="心理预警周报_${days}d.xlsx"`
      }
    });
  } catch (error) {
    return new NextResponse(error.message || '导出失败', { status: 500 });
  }
}
