'use client';

import { useState } from 'react';

interface Source {
  title: string;
  url: string;
  relevance: number;
}

export default function AIChatBox() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{q: string, a: string}>>([]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    setSources([]);
    setSuggestions([]);
    setNeedsHelp(false);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      
      setAnswer(data.answer || '抱歉，暂时无法回答您的问题。');
      setSources(data.sources || []);
      setSuggestions(data.suggestions || []);
      setNeedsHelp(data.needsHelp || false);
      setHistory(prev => [{ q: question, a: data.answer }, ...prev.slice(0, 4)]);
      
    } catch (error) {
      setAnswer('网络错误，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // 快捷问题（更新为2026年相关）
  const quickQuestions = [
    '2026新春活动有哪些福利？',
    '太初武器怎么获取？',
    '女法师新职业怎么样？',
    '魔界人奇遇记活动攻略',
    '理查德赛马怎么玩？',
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🤖 AI 攻略助手
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            基于真实数据
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            10篇公众号
          </span>
        </div>
      </div>

      {/* 输入框 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
            placeholder="基于2026年最新公众号文章，问我任何关于 DNF 手游的问题..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '思考中...' : '提问'}
          </button>
        </div>
      </div>

      {/* 快捷问题 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">💡 热门提问：</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestion(q)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* AI 回答区域 */}
      {answer && (
        <div className="mb-4">
          <div className={`p-4 rounded-lg border ${
            needsHelp 
              ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">{needsHelp ? '🤔' : '🤖'}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {needsHelp ? '需要更多信息：' : 'AI 回答：'}
                </p>
                <div className="text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none">
                  {answer.split('\n').map((line, i) => {
                    if (line.startsWith('###')) {
                      return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
                    }
                    if (line.startsWith('**')) {
                      return <p key={i} className="font-semibold mt-2">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('•')) {
                      return <li key={i} className="ml-4">{line.replace('•', '').trim()}</li>;
                    }
                    if (line === '---') {
                      return <hr key={i} className="my-4 border-gray-300" />;
                    }
                    return line ? <p key={i} className="mb-2">{line}</p> : null;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 智能推荐（无匹配时显示） */}
          {needsHelp && suggestions.length > 0 && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-3">🎯 试试这些问题：</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(suggestion)}
                    className="px-4 py-2 bg-white text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition text-left border border-blue-200"
                  >
                    💬 {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 数据来源（有匹配时显示） */}
          {!needsHelp && sources.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">📚 参考来源：</p>
              <div className="space-y-1">
                {sources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate flex-1"
                    >
                      {i + 1}. {source.title}
                    </a>
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      {(source.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">AI 正在分析公众号文章...</span>
        </div>
      )}

      {/* 历史记录 */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📜 最近提问</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((item, i) => (
              <div 
                key={i} 
                className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition"
                onClick={() => setQuestion(item.q)}
              >
                <p className="text-sm font-medium text-gray-700">Q: {item.q}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
