const HIGH_RISK_PATTERNS = [
  /自杀/,
  /结束自己/,
  /不想活/,
  /活着没意思/,
  /伤害自己/,
  /割腕/,
  /跳楼/,
  /服药自尽/,
  /留下遗书/,
  /今晚就结束/,
  /准备好了去死/,
  /想从这个世界消失/
];

const MEDIUM_RISK_PATTERNS = [
  /崩溃/,
  /绝望/,
  /撑不住/,
  /失眠/,
  /焦虑/,
  /害怕/,
  /自责/,
  /无助/,
  /痛苦/,
  /压得喘不过气/
];

export function assessRisk(input = '', emotionScores = {}) {
  const normalized = String(input).replace(/\s+/g, '');

  const highHits = HIGH_RISK_PATTERNS.filter((re) => re.test(normalized)).map((re) => re.source);
  const mediumHits = MEDIUM_RISK_PATTERNS.filter((re) => re.test(normalized)).map((re) => re.source);

  const hopelessness = Number(emotionScores.hopelessness || 0);
  const anxiety = Number(emotionScores.anxiety || 0);
  const depression = Number(emotionScores.depression || 0);
  const stress = Number(emotionScores.stress || 0);

  if (highHits.length > 0) {
    return {
      level: 'high',
      score: 90,
      reason: `命中高危表达：${highHits.join(' / ')}`,
      keywords: highHits
    };
  }

  const cumulativeDistress = [anxiety, depression, stress, hopelessness].filter((v) => v >= 70).length;
  if (mediumHits.length >= 3 || (hopelessness >= 75 && cumulativeDistress >= 2)) {
    return {
      level: 'high',
      score: 80,
      reason: '负性表达密集，且情绪分数达到高危组合阈值',
      keywords: mediumHits
    };
  }

  if (
    mediumHits.length >= 1 ||
    anxiety >= 60 ||
    depression >= 60 ||
    stress >= 65 ||
    hopelessness >= 60
  ) {
    return {
      level: 'medium',
      score: 58,
      reason: '存在明显压力、焦虑、抑郁或无助表达',
      keywords: mediumHits
    };
  }

  return {
    level: 'low',
    score: 20,
    reason: '当前未见明显高危线索',
    keywords: []
  };
}
