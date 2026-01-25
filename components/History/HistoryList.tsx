
import React, { useState } from 'react';
import { HistoryEntry } from '../../types';

interface HistoryListProps {
  history: HistoryEntry[];
  onNew: () => void;
  onViewDetail: (item: HistoryEntry) => void;
  onDelete: (ids: string[]) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onNew, onViewDetail, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === history.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(history.map(h => h.id));
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`${selectedIds.length}件の履歴を削除しますか？`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
  };

  const handleExport = () => {
    const itemsToExport = selectedIds.length > 0
      ? history.filter(h => selectedIds.includes(h.id))
      : history;

    if (itemsToExport.length === 0) {
      alert('エクスポートする履歴がありません');
      return;
    }

    const exportData = itemsToExport.map(item => ({
      タイトル: item.userName || '無題',
      作成日: new Date(item.createdAt).toLocaleDateString('ja-JP'),
      研修: item.data.trainingType,
      メインツール: item.data.mainTool,
      職種: item.data.jobRole,
      本文: item.outputs.find(o => o.text)?.text || '',
    }));

    // CSV形式で出力
    const headers = ['タイトル', '作成日', '研修', 'メインツール', '職種', '本文'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(row =>
        headers.map(h => `"${(row[h as keyof typeof row] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `研修報告履歴_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const itemsToExport = selectedIds.length > 0
      ? history.filter(h => selectedIds.includes(h.id))
      : history;

    if (itemsToExport.length === 0) {
      alert('エクスポートする履歴がありません');
      return;
    }

    const textContent = itemsToExport.map(item => {
      const text = item.outputs.find(o => o.text)?.text || '';
      return `【${item.userName || '無題'}】\n作成日: ${new Date(item.createdAt).toLocaleDateString('ja-JP')}\n研修: ${item.data.trainingType}\nツール: ${item.data.mainTool}\n\n${text}\n\n${'─'.repeat(40)}\n`;
    }).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `研修報告履歴_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

      {history.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-xl">
          <button
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedIds([]);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelectMode ? 'bg-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'}`}
          >
            {isSelectMode ? '選択を解除' : '選択モード'}
          </button>

          {isSelectMode && (
            <>
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                {selectedIds.length === history.length ? 'すべて解除' : 'すべて選択'}
              </button>
              <span className="text-sm text-slate-500">
                {selectedIds.length}件選択中
              </span>
            </>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {selectedIds.length > 0 ? `TXT (${selectedIds.length}件)` : 'TXT'}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {selectedIds.length > 0 ? `CSV (${selectedIds.length}件)` : 'CSV'}
            </button>
            {isSelectMode && selectedIds.length > 0 && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                削除 ({selectedIds.length}件)
              </button>
            )}
          </div>
        </div>
      )}

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
              className={`bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between ${
                selectedIds.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
              }`}
              onClick={(e) => isSelectMode ? toggleSelect(item.id, e) : onViewDetail(item)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {isSelectMode && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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
                {!isSelectMode && (
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    編集・詳細
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
