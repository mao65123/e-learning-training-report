
import React from 'react';
import { TRAINING_MASTERS, BANNED_PHRASES, SYNONYM_MAP } from '../../constants';

export const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-1">管理パネル</h2>
        <p className="text-slate-500">マスタデータ、テンプレート、辞書の管理を行います。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training Masters */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">研修マスタ・対応ツール</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {TRAINING_MASTERS.map(m => (
              <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors">
                <p className="text-sm font-bold text-slate-800 mb-2">{m.name}</p>
                <div className="flex flex-wrap gap-1">
                  {m.tools.map(t => (
                    <span key={t.id} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dictionary & Bans */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-700">言い換え辞書（多様化ロジック）</h3>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(SYNONYM_MAP).map(([key, vals]) => (
                <div key={key}>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">{key}</p>
                  <div className="flex flex-wrap gap-1">
                    {vals.map(v => (
                      <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">禁止表現・自動置換ルール</h3>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">“AIっぽさ”抑制</span>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-[10px] uppercase font-bold">
                    <th className="pb-2">対象表現</th>
                    <th className="pb-2">置換後の表現</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(BANNED_PHRASES).map(([banned, replacement]) => (
                    <tr key={banned}>
                      <td className="py-2 font-medium text-slate-700">{banned}</td>
                      <td className="py-2 text-blue-600 font-bold">→ {replacement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">監査ログ</h3>
          <p className="text-blue-100 mb-6 max-w-lg">
            誰が、いつ、どの研修報告書を、どのvariant_idで生成したかをすべて記録しています。
            個人情報の入力に対する注意喚起アラートの実行履歴も確認可能です。
          </p>
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
            ログをダウンロード (CSV)
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
