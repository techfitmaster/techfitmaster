'use client';

import { useEffect, useState } from 'react';

export default function TrendingCard({ trend }: { trend: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryColors: Record<string, string> = {
    tech: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    sports: 'bg-orange-100 text-orange-800',
    entertainment: 'bg-pink-100 text-pink-800',
    politics: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
  };

  const categoryEmojis: Record<string, string> = {
    tech: '💻',
    business: '💼',
    sports: '⚽',
    entertainment: '🎬',
    politics: '🏛️',
    general: '📰',
  };

  // 防止 Hydration 错误
  const timeDisplay = mounted 
    ? new Date(trend.created_at).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[trend.category] || categoryColors.general
          }`}
        >
          {categoryEmojis[trend.category] || '📰'} {trend.category}
        </span>
        <span className="text-xs text-gray-500">
          {timeDisplay}
        </span>
      </div>

      {/* Topic */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        🔥 {trend.topic}
      </h3>

      {/* Stats */}
      <div className="flex gap-4 mb-3 text-sm text-gray-600">
        <span>💬 {(trend.tweet_count || 0).toLocaleString()} 讨论</span>
        <span>📊 热度 {trend.engagement_score?.toLocaleString()}</span>
      </div>

      {/* AI Summary */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        🤖 {trend.ai_summary || '正在生成摘要...'}
      </p>

      {/* Key Points */}
      {trend.key_points && trend.key_points.length > 0 && (
        <div className="mb-3">
          <ul className="text-xs text-gray-600 space-y-1">
            {trend.key_points.slice(0, 3).map((point: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t">
        <a
          href={trend.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 
                   rounded text-sm font-medium hover:bg-blue-100 transition"
        >
          查看详情 →
        </a>
        <button
          className="px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm 
                   hover:bg-gray-100 transition"
          title="分享"
        >
          🔗
        </button>
      </div>
    </div>
  );
}
