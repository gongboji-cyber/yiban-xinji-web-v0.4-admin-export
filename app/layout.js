import './globals.css';
import Header from '@/components/Header';
import { siteMeta } from '@/lib/content';

export const metadata = {
  title: `${siteMeta.name} | 校园心理支持原型`,
  description: '注册登录、聊天留痕、风险分层、后台 Excel 导出的校园心理支持原型。'
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
