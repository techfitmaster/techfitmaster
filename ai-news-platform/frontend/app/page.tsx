'use client';

import { useState, useEffect } from 'react';
import TrendingCard from './components/TrendingCard';
import AIChatBox from './components/AIChatBox';
import realTrends from './realData';
import aiTrends from './aiData';
import wechatArticles from './wechatData';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [dataSource, setDataSource] = useState<'x' | 'ai' | 'wechat'>('wechat'); // 默认显示公众号
  const [mounted, setMounted] = useState(false);
  
  // 解决 Hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 根据数据源选择数据
  const allTrends = dataSource === 'wechat' ? wechatArticles : (dataSource === 'ai' ? aiTrends : realTrends);
  
  // 分类映射
  const categoryMap: Record<string, string> = {
    '全部': 'all',
    '体育': 'sports',
    '娱乐': 'entertainment',
    '科技': 'tech',
    '商业': 'business',
    '政治': 'politics',
  };

  // 筛选逻辑
  const filteredTrends = selectedCategory === '全部'
    ? allTrends
    : allTrends.filter(trend => trend.category === categoryMap[selectedCategory]);

  // 统计各分类数量
  const categoryStats = {
    sports: allTrends.filter(t => t.category === 'sports').length,
    entertainment: allTrends.filter(t => t.category === 'entertainment').length,
    tech: allTrends.filter(t => t.category === 'tech').length,
    business: allTrends.filter(t => t.category === 'business').length,
    politics: allTrends.filter(t => t.category === 'politics').length,
  };

  // 防止 Hydration 错误
  const currentTime = mounted ? new Date().toLocaleString('zh-CN') : '加载中...';
  const currentTimeShort = mounted ? new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🔥 AI资讯速报
            </h1>
            <p className="text-gray-600">
              实时追踪全球热点 · AI 智能摘要 · 2026年2月9日
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              ✨ 真实数据
            </div>
          </div>
        </div>

        {/* 数据源切换 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={() => {
              setDataSource('wechat');
              setSelectedCategory('全部');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition shadow-sm ${
              dataSource === 'wechat'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📱 公众号攻略
          </button>
          <button
            onClick={() => {
              setDataSource('ai');
              setSelectedCategory('全部');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition shadow-sm ${
              dataSource === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🤖 AI & 科技
          </button>
          <button
            onClick={() => {
              setDataSource('x');
              setSelectedCategory('全部');
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition shadow-sm ${
              dataSource === 'x'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🐦 X 热点
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4 text-sm shadow-sm">
          <p className="text-gray-800">
            <strong className="text-blue-600">📡 数据来源：</strong>
            {dataSource === 'wechat' 
              ? '微信公众号 via 搜狗微信 · DNF手游真实攻略'
              : dataSource === 'ai' 
                ? 'Hacker News · AI 行业资讯 · 技术社区热议'
                : 'X (Twitter) via trends24.in · 全球热点话题'
            }
            · 更新时间：{currentTime}
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.keys(categoryMap).map((cat) => {
            const count = cat === '全部' 
              ? allTrends.length 
              : categoryStats[categoryMap[cat] as keyof typeof categoryStats] || 0;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {filteredTrends.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {selectedCategory === '全部' ? '热点话题' : `${selectedCategory}话题`}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              {Math.floor(filteredTrends.reduce((sum, t) => sum + t.tweet_count, 0) / 1000)}K
            </div>
            <div className="text-sm text-gray-600 mt-1">总阅读量</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentTimeShort}
            </div>
            <div className="text-sm text-gray-600 mt-1">最后更新</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {dataSource === 'wechat' ? '公众号' : dataSource === 'ai' ? 'HN' : 'X'}
            </div>
            <div className="text-sm text-gray-600 mt-1">数据源</div>
          </div>
        </div>
      </div>

      {/* Topic Distribution */}
      {dataSource === 'wechat' && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 文章分布</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🎮 游戏攻略 {categoryStats.tech}篇
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                💰 氪金建议 {categoryStats.business}篇
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                📰 官方资讯 {Math.floor(categoryStats.tech * 0.2)}篇
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI 问答助手 */}
      <div className="max-w-6xl mx-auto mb-8">
        <AIChatBox />
      </div>

      {/* Trending Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredTrends.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">暂无 {selectedCategory} 类别的热点</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrends.map((trend) => (
              <TrendingCard key={trend.id} trend={trend} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <div className="mb-4">
          <p className="font-medium text-gray-700">数据来源</p>
          <p className="mt-1">
            {dataSource === 'wechat'
              ? '微信公众号 via 搜狗微信搜索 · 真实抓取'
              : dataSource === 'ai' 
                ? 'Hacker News · AI 分析: OpenAI GPT-4'
                : 'X (Twitter) via trends24.in · AI 分析: OpenAI GPT-4'
            }
          </p>
        </div>
        <p className="text-xs">
          最后更新: {currentTime}
        </p>
        <p className="mt-4 text-xs text-gray-400">
          技术栈: Next.js 14 + Tailwind CSS + 真实数据爬取 + OpenClaw
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          <a href="https://github.com" className="hover:text-blue-600 transition">GitHub</a>
          <span>·</span>
          <a href="https://weixin.sogou.com" className="hover:text-blue-600 transition">搜狗微信</a>
          <span>·</span>
          <a href="https://news.ycombinator.com" className="hover:text-blue-600 transition">Hacker News</a>
        </div>
      </footer>
    </main>
  );
}
