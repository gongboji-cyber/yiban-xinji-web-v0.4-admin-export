export const siteMeta = {
  name: '易伴·心迹',
  shortName: '心迹'
};

export const homeContent = {
  badge: 'EMOTIONAL COMPANION PROTOTYPE',
  title: '把“陪聊”做成一套能留痕、能复盘、能导出的校园心理支持原型',
  subtitle:
    '这一版不再只是展示页。现在它支持注册登录、会话留存、风险分层，以及后台 Excel 导出。',
  primaryButton: '进入聊天工作台',
  secondaryButton: '查看后台导出',
  featureCards: [
    { no: '01', title: '真登录', desc: '支持邮箱注册登录，但不再依赖邮箱验证链路。' },
    { no: '02', title: '真存储', desc: '聊天内容、洞察、风险事件写入数据库。' },
    { no: '03', title: '后台导出', desc: '管理员可导出最近 7 天/30 天 Excel。' }
  ],
  flowTitle: '当前版本主链路',
  flowItems: [
    '用户注册登录',
    '进入聊天并形成洞察',
    '高风险时显示预约入口',
    '后台导出每周风险总表'
  ],
  noticeTitle: '公告栏',
  zhCardTitle: '注意',
  zhNotes: [
    '本产品仍处于实验测试阶段',
    '它不能替代临床诊断或正式心理治疗',
    '如出现明显危机，请优先联系现实中的老师、家人、医生或急救资源',
    '测试阶段欢迎校内试用'
  ],
  enCardTitle: 'CAUTION',
  enNotes: [
    'This product is still in the experimental testing stage.',
    'It does not replace formal clinical diagnosis or therapy.',
    'In a crisis, contact real-world support first.',
    'Internal pilot use is welcome during this phase.'
  ]
};

export const authContent = {
  title: '注册 / 登录',
  subtitle: '这一版默认走“无需邮箱验证”的注册策略，但前提是你已在 Supabase 关闭 Confirm email。',
  signUpTitle: '创建账号',
  signInTitle: '登录账号',
  emailLabel: '邮箱',
  passwordLabel: '密码',
  signUpButton: '注册并进入',
  signInButton: '登录',
  helper: '如果注册后仍提示邮件确认，说明不是代码问题，而是你没有在 Supabase 后台关闭 Confirm email。'
};

export const chatContent = {
  title: '今日对话工作台',
  subtitle: '把一句情绪表达，转成可回看、可反思、可导出的记录。',
  textareaLabel: '你今天想说什么？',
  textareaPlaceholder:
    '例如：我最近压力很大，白天还撑得住，晚上会突然很空，感觉什么都做不好。',
  sendButton: '发送并生成洞察',
  working: '正在生成...',
  cards: {
    reply: '回应',
    insight: '今日洞察',
    journal: '日记草稿',
    abc: 'ABC 分析',
    followup: '下一步建议',
    risk: '风险提醒'
  },
  consentLabel: '我同意在达到高风险阈值时，将本周风险摘要纳入后台导出给学校心理处。',
  appointmentButton: '前往学校心理处预约',
  appointmentHint: '注意：当前版本是“用户主动点击跳转”，不是系统擅自替你预约。'
};

export const historyContent = {
  title: '历史记录',
  subtitle: '查看你过往的会话与风险记录。',
  empty: '还没有历史记录。先去聊天页生成第一条记录。'
};

export const adminContent = {
  title: '后台导出',
  subtitle: '这里给老师或管理员导出风险汇总表，不展示全量八卦，只导出必要的预警线索。',
  accessKeyLabel: '后台导出访问码',
  daysLabel: '统计最近天数',
  exportButton: '导出 Excel',
  helper:
    '当前版本用访问码保护导出接口，后面再升级成正式后台角色系统。'
};
