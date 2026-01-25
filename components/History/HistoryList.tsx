
import React from 'react';
import { HistoryEntry } from '../../types';

interface HistoryListProps {
  history: HistoryEntry[];
  onNew: () => void;
  onViewDetail: (item: HistoryEntry) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onNew, onViewDetail }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-1">作成履歴</h2>
          <p className="text-slate-500">過去に作成した研修報告文の履歴とステータスを確認できます。</p>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          新しく作成する
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">まだ履歴がありません</h3>
          <p className="text-slate-500 max-w-sm">「新しく作成する」ボタンから最初の報告文を作成しましょう。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => onViewDetail(item)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'submitted' ? 'bg-blue-50 text-blue-600' :
                    item.status === 'reviewed' ? 'bg-green-50 text-green-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.userName || "無題の報告書"}
                </h4>
                <p className="text-xs text-slate-400 mb-3">{item.data.trainingType}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                    {item.data.mainTool}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-3 mb-4 italic">
                  "{item.outputs.find(o => o.text)?.text || "プレビュー不可"}"
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${item.outputs[0]?.score || 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{item.outputs[0]?.score || 0} pts</span>
                </div>
                <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  編集・詳細
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
