export function buildMockResponse(input) {
  return {
    reply: `我看见你在扛很多东西：${input.slice(0, 28)}${input.length > 28 ? '…' : ''}。先别急着要求自己立刻变好，先把状态说清楚就已经有价值。`,
    insight: '你当前更像是被持续压力和自我要求拉扯，而不是单一事件导致的短暂低落。',
    journal_draft:
      '今天我感觉自己很累，脑子一直停不下来。白天我还能假装稳定，到了安静的时候，那种被压住的情绪会往上翻。我不想继续用“没事”糊弄自己，我想先把这些感受承认下来。',
    abc: {
      activating_event: '近期学业、人际或生活压力持续堆叠',
      belief: '我必须撑住，不能出错，否则就说明我不够好',
      consequence: '焦虑上升，反复内耗，休息质量下降'
    },
    follow_up: [
      '先把今天最压你的那件事写成一句话',
      '把“必须全部解决”改成“先处理一个最小动作”',
      '如果这种状态持续多日，尽快联系现实中的老师、朋友或心理中心'
    ],
    emotion_scores: {
      anxiety: 62,
      depression: 48,
      stress: 67,
      hopelessness: 36
    }
  };
}
