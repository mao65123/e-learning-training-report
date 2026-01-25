
import { polishText, refineTextWithInstruction } from '../../services/geminiService';
import { createBaseDraft, calculateQualityScore } from '../../services/textGenerator';
import { FormData, GeneratedOutput, LengthType } from '../../types';
import React, { useEffect, useState } from 'react';

interface ResultViewProps {
  formData: FormData;
  onSave: (entry: any) => void;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ formData, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<LengthType>(LengthType.STANDARD);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<Record<LengthType, GeneratedOutput | null>>({
    [LengthType.STANDARD]: null,
    [LengthType.LONG]: null,
  });
  const [variantId, setVariantId] = useState(1);
  const [editedText, setEditedText] = useState("");
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const generate = async (length: LengthType, forceNewVariant = false) => {
    setIsGenerating(true);
    const newVariant = forceNewVariant ? Math.floor(Math.random() * 10) + 1 : variantId;
    if (forceNewVariant) setVariantId(newVariant);

    const baseDraft = createBaseDraft(formData, newVariant);
    const { score, warnings } = calculateQualityScore(formData);
    
    // Polish with Gemini
    const finalResult = await polishText(baseDraft, formData, length, newVariant);
    
    const output: GeneratedOutput = {
      id: Math.random().toString(36).substr(2, 9),
      text: finalResult,
      lengthType: length,
      variantId: newVariant,
      score,
      warnings
    };

    setOutputs(prev => ({ ...prev, [length]: output }));
    setEditedText(finalResult);
    setIsGenerating(false);
  };

  useEffect(() => {
    generate(activeTab);
  }, []);

  useEffect(() => {
    if (outputs[activeTab]) {
      setEditedText(outputs[activeTab]?.text || "");
    } else {
      generate(activeTab);
    }
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    alert("コピーしました！");
  };

  const handleRefine = async () => {
    if (!refineInstruction.trim()) return;
    
    setIsRefining(true);
    const refined = await refineTextWithInstruction(editedText, refineInstruction, formData);
    setEditedText(refined);
    setRefineInstruction("");
    setIsRefining(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          入力を修正する
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => generate(activeTab, true)}
            disabled={isGenerating || isRefining}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            別案を生成 (Variant ID: {variantId})
          </button>
          <button 
            onClick={() => onSave({
              id: Date.now().toString(),
              data: formData,
              outputs: (Object.values(outputs).filter((o): o is GeneratedOutput => !!o)).map(o => o.lengthType === activeTab ? { ...o, text: editedText } : o),
              createdAt: new Date().toISOString(),
              status: 'submitted'
            })}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            完了・履歴へ保存
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab(LengthType.STANDARD)}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === LengthType.STANDARD ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                標準 (280-420字)
              </button>
              <button 
                onClick={() => setActiveTab(LengthType.LONG)}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === LengthType.LONG ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                長文 (450-650字)
              </button>
            </div>

            <div className="p-6 relative min-h-[400px]">
              {(isGenerating || isRefining) ? (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-slate-600 font-medium">
                    {isRefining ? 'AIが文章を修正しています...' : 'AIが文章を整えています...'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">（※自然な実務表現に調整中）</p>
                </div>
              ) : (
                <textarea 
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-full min-h-[350px] p-4 text-slate-700 leading-relaxed border border-slate-100 rounded-lg focus:ring-0 focus:border-blue-400 resize-none"
                  spellCheck={false}
                />
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                文字数: {editedText.length} 文字
              </span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                クリップボードにコピー
              </button>
            </div>
          </div>

          {/* Iterative Refinement Input */}
          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="text-sm font-bold uppercase tracking-wide">AIへの追加指示（修正リクエスト）</h4>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                placeholder="例：もっと謙虚な表現にして、具体的な活用例として〇〇を追加して..."
                className="flex-1 px-4 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                onClick={handleRefine}
                disabled={isRefining || !refineInstruction.trim()}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                指示を反映する
              </button>
            </div>
            <p className="text-[10px] text-indigo-400 italic">
              ※AIが現在の文章をベースに、指示内容を取り入れてリライトします。
            </p>
          </div>
        </div>

        {/* Info / Scoring Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">具体性分析スコア</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (outputs[activeTab]?.score || 0)) / 100}
                    className={`transition-all duration-1000 ${
                      (outputs[activeTab]?.score || 0) >= 60 ? 'text-green-500' : 'text-amber-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-black text-slate-800">{outputs[activeTab]?.score || 0}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">points</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  {(outputs[activeTab]?.score || 0) >= 60 ? '実務的な報告書として十分な具体性です。' : '少し具体性が不足しています。'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  数値目標や具体的な活用手順を含めることで評価が高まります。
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase">改善案・チェック項目</h5>
              {outputs[activeTab]?.warnings.map((w, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {w}
                </div>
              ))}
              {outputs[activeTab]?.warnings.length === 0 && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100 flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  すべての推奨項目が網羅されています
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 text-white rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">“AIっぽさ”抑制設定</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>誇張表現の置換</span>
                <span className="text-green-400 font-bold">有効</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>断定の抑制（〜を見込む等）</span>
                <span className="text-green-400 font-bold">有効</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>接続詞の連続使用制限</span>
                <span className="text-green-400 font-bold">有効</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-[10px] text-slate-500 italic">
                  ※Gemini APIにより、ビジネス文書として最適な自然な日本語表現に自動調整されています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
