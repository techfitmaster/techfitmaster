import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI资讯速报 - X平台热点智能聚合',
  description: '实时追踪X平台热门话题，AI智能摘要，让你3分钟掌握全球动态',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
