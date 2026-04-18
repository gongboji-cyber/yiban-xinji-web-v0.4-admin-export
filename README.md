# 易伴·心迹 v0.4

这一版补了三件事：

1. **取消邮箱验证依赖**
   - 代码层面不再要求“收邮件后再继续”。
   - 但 **Supabase 后台必须关闭 Confirm email**，否则 Supabase 仍会强制发验证邮件。

2. **后台导出 Excel**
   - 页面：`/admin/alerts`
   - 输入后台导出访问码后，可导出最近 N 天的风险总表与事件明细。

3. **页面文案集中管理**
   - 绝大部分页面文字统一放在 `lib/content.js`
   - AI 提示词放在 `lib/prompt.js`

## 一、部署前必须做的事

### 1）Supabase 关闭邮箱验证
进入：
- `Supabase -> Authentication -> Providers -> Email`
把 **Confirm email** 关闭。

### 2）执行建表 SQL
打开：
- `Supabase -> SQL Editor`
运行文件：
- `supabase/schema.sql`

### 3）在 Vercel 配环境变量
必须配置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EXPORT_KEY`
- `ADMIN_EMAILS`
- `SCHOOL_APPOINTMENT_URL`

可选：
- `DEEPSEEK_API_KEY`

## 二、页面路径
- 首页：`/`
- 注册登录：`/auth`
- 聊天工作台：`/chat`
- 历史记录：`/history`
- 后台导出：`/admin/alerts`

## 三、每一页的页面文字去哪里改

### 最常改的文案
统一改这里：
- `lib/content.js`

里面有这些对象：
- `homeContent`
- `authContent`
- `chatContent`
- `historyContent`
- `adminContent`

### AI 回复格式和引导词
改这里：
- `lib/prompt.js`

### 首页/页面结构本身
如果不是只改文字，而是要改布局结构，再看这些文件：
- `app/page.js`
- `app/auth/page.js`
- `app/chat/page.js`
- `app/history/page.js`
- `app/admin/alerts/page.js`

## 四、后台导出 Excel 的说明
后台页支持导出最近 N 天数据，生成一个 `.xlsx` 文件，包含两个 sheet：
1. `用户风险总览`
2. `风险事件明细`

### 当前版本的后台访问控制
为了让你快速跑通，这一版用了 **后台导出访问码**：
- 页面输入访问码
- 服务端对比 `ADMIN_EXPORT_KEY`
- 一致才允许导出

## 五、当前风险逻辑
文件：
- `lib/risk.js`

### 高风险触发
- 明确自伤/自杀/实施类表达
- 或者负性关键词密集命中
- 或者“绝望 + 无助 + 计划性”之类的组合

这只是工程规则，不是临床诊断。

## 六、学校心理处预约链接
页面里的高风险卡片会读取：
- `SCHOOL_APPOINTMENT_URL`

你可以在 Vercel 环境变量里直接换成学校最新地址。
