
import React, { useState, useEffect, useRef } from 'react';
import { FormData, TrainingType, TrainingMaster, LengthType, GeneratedOutput, HistoryEntry } from '../../types';
import { TRAINING_MASTERS, ROLE_OPTIONS, CATEGORY_LEARNING_POINTS, PERSONALITY_OPTIONS, REFINE_SUGGESTIONS } from '../../constants';
import { calculateQualityScore, createBaseDraft } from '../../services/textGenerator';
import { polishText, refineTextWithInstruction } from '../../services/geminiService';

interface UnifiedGeneratorProps {
  initialData: FormData;
  initialOutputs?: GeneratedOutput[];
  editingEntryId?: string | null;
  onSave: (entry: HistoryEntry) => void;
  onOverwrite: (entry: HistoryEntry) => void;
  onCancel: () => void;
}

export const UnifiedGenerator: React.FC<UnifiedGeneratorProps> = ({ initialData, initialOutputs, editingEntryId, onSave, onOverwrite, onCancel }) => {
  const [data, setData] = useState<FormData>(initialData);
  const [activeTab, setActiveTab] = useState<LengthType>(LengthType.STANDARD);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize outputs from history if available
  const getInitialOutputs = (): Record<LengthType, GeneratedOutput | null> => {
    const result: Record<LengthType, GeneratedOutput | null> = {
      [LengthType.STANDARD]: null,
      [LengthType.LONG]: null,
    };
    if (initialOutputs) {
      initialOutputs.forEach(output => {
        result[output.lengthType] = output;
      });
    }
    return result;
  };

  const [outputs, setOutputs] = useState<Record<LengthType, GeneratedOutput | null>>(getInitialOutputs());
  const initialText = initialOutputs?.find(o => o.lengthType === LengthType.STANDARD)?.text ||
                      initialOutputs?.[0]?.text || "";
  const [editedText, setEditedText] = useState(initialText);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineStatus, setRefineStatus] = useState<'idle' | 'refining' | 'done'>('idle');
  const [textHistory, setTextHistory] = useState<string[]>([]);
  const [variantId, setVariantId] = useState(1);

  const updateData = (updates: Partial<FormData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const currentMaster = TRAINING_MASTERS.find(m => m.name === data.trainingType);
  const { score, warnings } = calculateQualityScore(data);
  const roleInfo = ROLE_OPTIONS[data.jobRole] || { tasks: [], issues: [], applyTasks: [], applyMethods: [], jobFlowExample: '具体的な仕事の流れを記入してください...', issuesExample: '例：マニュアルが整備されておらず、新人の教育コストが高い...' };

  // Aggregate learning points from ALL selected tools (Main + Sub)
  const selectedToolNames = [data.mainTool, ...data.additionalTools].filter(Boolean);
  const selectedCategories = Array.from(new Set(
    selectedToolNames.map(tName => currentMaster?.tools.find(t => t.name === tName)?.category).filter(Boolean)
  ));
  const learningPoints = Array.from(new Set(
    selectedCategories.flatMap(cat => CATEGORY_LEARNING_POINTS[cat as string] || [])
  ));

  const generateSingle = async (length: LengthType, variant: number): Promise<GeneratedOutput> => {
    const baseDraft = createBaseDraft(data, variant);
    const quality = calculateQualityScore(data);
    const finalResult = await polishText(baseDraft, data, length, variant);
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: finalResult,
      lengthType: length,
      variantId: variant,
      score: quality.score,
      warnings: quality.warnings
    };
  };

  const handleGenerate = async (_length?: LengthType, forceNewVariant = false) => {
    if (!data.mainTool || !data.userName) {
      alert("名前とメインツールを入力してください。");
      return;
    }

    setIsGenerating(true);
    const newVariant = forceNewVariant ? Math.floor(Math.random() * 10) + 1 : variantId;
    if (forceNewVariant) setVariantId(newVariant);

    const [standardOutput, longOutput] = await Promise.all([
      generateSingle(LengthType.STANDARD, newVariant),
      generateSingle(LengthType.LONG, newVariant),
    ]);

    setOutputs({
      [LengthType.STANDARD]: standardOutput,
      [LengthType.LONG]: longOutput,
    });
    setEditedText(activeTab === LengthType.STANDARD ? standardOutput.text : longOutput.text);
    setIsGenerating(false);

    if (window.innerWidth < 1024) {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefine = async (instruction?: string) => {
    const text = instruction || refineInstruction;
    if (!text.trim()) return;
    setIsRefining(true);
    setRefineStatus('refining');
    setTextHistory(prev => [...prev, editedText]);
    const refined = await refineTextWithInstruction(editedText, text, data);
    setEditedText(refined);
    setRefineInstruction("");
    setIsRefining(false);
    setRefineStatus('done');
    setTimeout(() => setRefineStatus('idle'), 3000);
  };

  const handleUndo = () => {
    if (textHistory.length === 0) return;
    const prev = textHistory[textHistory.length - 1];
    setTextHistory(h => h.slice(0, -1));
    setEditedText(prev);
  };

  const buildEntry = (id?: string): HistoryEntry => ({
    id: id || Date.now().toString(),
    userId: 'user-1',
    userName: data.userName,
    data: data,
    outputs: (Object.values(outputs).filter((o): o is GeneratedOutput => !!o)).map(o =>
      o.lengthType === activeTab ? { ...o, text: editedText } : o
    ),
    createdAt: id && editingEntryId ? new Date().toISOString() : new Date().toISOString(),
    status: 'submitted'
  });

  const handleFinalSave = () => {
    onSave(buildEntry());
  };

  const handleOverwrite = () => {
    if (editingEntryId) {
      onOverwrite(buildEntry(editingEntryId));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Input Form */}
      <div className="w-full lg:w-3/5 space-y-6">
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              報告書データ入力
            </h2>
          </div>

          <div className="p-8 space-y-10">
            {/* 0. Identity */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">0</span>
                <h3 className="font-bold text-slate-700">基本情報</h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">報告者名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="例：山田 太郎"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={data.userName}
                  onChange={(e) => updateData({ userName: e.target.value })}
                />
              </div>
            </section>

            {/* 1. Training & Tools */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="font-bold text-slate-700">研修・ツールの選択</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">受講した研修</label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={data.trainingType}
                    onChange={(e) => updateData({ trainingType: e.target.value as TrainingType, mainTool: '', additionalTools: [] })}
                  >
                    {TRAINING_MASTERS.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">メインツール <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={data.mainTool}
                    onChange={(e) => updateData({ 
                      mainTool: e.target.value, 
                      additionalTools: data.additionalTools.filter(t => t !== e.target.value) 
                    })}
                  >
                    <option value="">選択してください</option>
                    {currentMaster?.tools.map(tool => <option key={tool.id} value={tool.name}>{tool.name}</option>)}
                  </select>
                </div>
              </div>
              {data.mainTool && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">併用・サブツール（複数選択可）</label>
                  <div className="flex flex-wrap gap-2">
                    {currentMaster?.tools.filter(t => t.name !== data.mainTool).map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          const next = data.additionalTools.includes(tool.name) 
                            ? data.additionalTools.filter(t => t !== tool.name) 
                            : [...data.additionalTools, tool.name];
                          updateData({ additionalTools: next });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${data.additionalTools.includes(tool.name) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 2. Job Content */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <h3 className="font-bold text-slate-700">現在の仕事内容</h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">職種・役割</label>
                <select
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  value={data.jobRole}
                  onChange={(e) => updateData({ jobRole: e.target.value, jobTasks: [], jobTasksOther: '', issues: [], applyTasks: [], applyMethods: [] })}
                >
                  <option value="">選択してください</option>
                  {Object.keys(ROLE_OPTIONS).map(role => <option key={role} value={role}>{role}</option>)}
                  <option value="その他">その他</option>
                </select>
                {data.jobRole === 'その他' && (
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm mt-2"
                    placeholder="職種・役割を入力してください"
                    value={data.jobRoleOther}
                    onChange={(e) => updateData({ jobRoleOther: e.target.value })}
                  />
                )}
              </div>
              {data.jobRole && data.jobRole !== 'その他' && roleInfo.tasks.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">従事している業務（複数選択可）</label>
                  <div className="flex flex-wrap gap-2">
                    {roleInfo.tasks.map(task => (
                      <button
                        key={task}
                        onClick={() => {
                          const next = data.jobTasks.includes(task)
                            ? data.jobTasks.filter(t => t !== task)
                            : [...data.jobTasks, task];
                          updateData({ jobTasks: next });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${data.jobTasks.includes(task) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
                      >
                        {task}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                    placeholder="その他の業務を自由に入力"
                    value={data.jobTasksOther}
                    onChange={(e) => updateData({ jobTasksOther: e.target.value })}
                  />
                </div>
              )}
              {data.jobRole === 'その他' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">従事している業務</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                    placeholder="担当している業務を入力してください"
                    value={data.jobTasksOther}
                    onChange={(e) => updateData({ jobTasksOther: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">具体的な仕事の流れ</label>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-lg h-24 text-sm"
                  placeholder={roleInfo.jobFlowExample}
                  value={data.jobFlow}
                  onChange={(e) => updateData({ jobFlow: e.target.value })}
                />
              </div>
            </section>

            {/* 3. Issues */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h3 className="font-bold text-slate-700">解決したい課題</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roleInfo.issues.map(issue => (
                  <button
                    key={issue}
                    onClick={() => {
                      const next = data.issues.includes(issue) ? data.issues.filter(i => i !== issue) : [...data.issues, issue];
                      updateData({ issues: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${data.issues.includes(issue) ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400'}`}
                  >
                    {issue}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">その他の課題 (自由記入)</label>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm"
                  placeholder={roleInfo.issuesExample}
                  value={data.issuesOther}
                  onChange={(e) => updateData({ issuesOther: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                  placeholder="発生頻度 (例：毎日2時間)"
                  value={data.frequency}
                  onChange={(e) => updateData({ frequency: e.target.value })}
                />
                <input 
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                  placeholder="品質への影響 (例：属人化している)"
                  value={data.impact}
                  onChange={(e) => updateData({ impact: e.target.value })}
                />
              </div>
            </section>

            {/* 4. Learnings */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <h3 className="font-bold text-slate-700">研修で学んだ内容</h3>
              </div>
              <p className="text-[10px] text-slate-400 italic">※選択した全てのツールに関連する学習項目が表示されています</p>
              <div className="flex flex-wrap gap-2">
                {learningPoints.map(point => (
                  <button
                    key={point}
                    onClick={() => {
                      const next = data.learningPoints.includes(point) ? data.learningPoints.filter(p => p !== point) : [...data.learningPoints, point];
                      updateData({ learningPoints: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${data.learningPoints.includes(point) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-300 hover:border-green-400'}`}
                  >
                    {point}
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm"
                placeholder="その他の学びや留意点..."
                value={data.learningPointsOther}
                onChange={(e) => updateData({ learningPointsOther: e.target.value })}
              />
            </section>

            {/* 5. Target KPI */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <h3 className="font-bold text-slate-700">今後の目標・KPI</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select 
                  className="p-3 border border-slate-300 rounded-lg text-sm"
                  value={data.kpiType}
                  onChange={(e) => updateData({ kpiType: e.target.value })}
                >
                  <option value="">指標を選択</option>
                  <option value="作業時間">作業時間</option>
                  <option value="工数削減">工数削減</option>
                  <option value="品質向上">品質向上</option>
                </select>
                <input 
                  className="p-3 border border-slate-300 rounded-lg text-sm"
                  placeholder="目標値 (例：30)"
                  value={data.kpiValue}
                  onChange={(e) => updateData({ kpiValue: e.target.value })}
                />
                <select 
                  className="p-3 border border-slate-300 rounded-lg text-sm"
                  value={data.kpiUnit}
                  onChange={(e) => updateData({ kpiUnit: e.target.value })}
                >
                  <option value="">単位を選択</option>
                  <option value="%削減">%削減</option>
                  <option value="時間短縮">時間短縮</option>
                  <option value="ポイント向上">pt向上</option>
                </select>
              </div>
            </section>

            {/* 6. Personality */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">6</span>
                <h3 className="font-bold text-slate-700">文章のトーン</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PERSONALITY_OPTIONS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateData({ personality: p.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${data.personality === p.id ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                  >
                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{p.desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button 
              onClick={onCancel}
              className="px-6 py-2 text-slate-500 font-medium hover:text-slate-800"
            >
              キャンセル
            </button>
            <button 
              onClick={() => handleGenerate(activeTab)}
              disabled={isGenerating || !data.userName || !data.mainTool}
              className={`px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2`}
            >
              {isGenerating ? '生成中...' : '報告文を生成する'}
              {!isGenerating && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Result Preview */}
      <div id="result-section" className="w-full lg:w-2/5 lg:sticky lg:top-24 space-y-6">
        <div className="bg-white shadow-xl border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full min-h-[600px]">
          <div className="flex border-b border-slate-200 bg-slate-50">
            {(Object.keys(LengthType) as Array<keyof typeof LengthType>).map((key) => {
              const l = LengthType[key];
              return (
                <button 
                  key={l}
                  onClick={() => {
                    setActiveTab(l);
                    if (outputs[l]) setEditedText(outputs[l]!.text);
                  }}
                  className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === l ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {l === LengthType.STANDARD ? '標準' : '長文'}
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-6 relative overflow-y-auto">
            {isGenerating ? (
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600 font-bold">文章を生成中...</p>
                <p className="text-xs text-slate-400 mt-2">入力内容に基づき実務的な表現に調整しています</p>
              </div>
            ) : !outputs[activeTab] ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-bold">生成結果がここに表示されます</p>
                <p className="text-xs mt-2">左のフォームを入力して「報告文を生成する」を押してください</p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea 
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-[320px] p-4 text-slate-700 leading-relaxed border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none outline-none text-sm"
                  spellCheck={false}
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>文字数: {editedText.length} 字</span>
                  <span>分析スコア: {outputs[activeTab]?.score} pts</span>
                </div>
              </div>
            )}
          </div>

          {outputs[activeTab] && !isGenerating && (
            <div className="p-4 bg-indigo-50 border-t border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AIへの追加指示
                </div>
                <div className="flex items-center gap-2">
                  {refineStatus === 'refining' && (
                    <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                      <span className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                      反映中...
                    </span>
                  )}
                  {refineStatus === 'done' && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      反映しました
                    </span>
                  )}
                  {textHistory.length > 0 && (
                    <button
                      onClick={handleUndo}
                      disabled={isRefining}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 014 4v0a4 4 0 01-4 4H3m0-8l4-4m-4 4l4 4" />
                      </svg>
                      元に戻す
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {REFINE_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => handleRefine(suggestion)}
                    disabled={isRefining}
                    className="px-2.5 py-1 text-[11px] font-medium border border-indigo-200 bg-white text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && refineInstruction.trim() && !isRefining) handleRefine(); }}
                  placeholder="自由に指示を入力..."
                  className="flex-1 px-3 py-2 text-xs border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isRefining}
                />
                <button
                  onClick={() => handleRefine()}
                  disabled={isRefining || !refineInstruction.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  反映
                </button>
              </div>
            </div>
          )}

          <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
            {editingEntryId && (
              <button
                onClick={handleOverwrite}
                disabled={!editedText || isGenerating}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                上書き保存する
              </button>
            )}
            <button
              onClick={handleFinalSave}
              disabled={!editedText || isGenerating}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {editingEntryId ? '新規として保存する' : 'この内容で履歴に保存する'}
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(editedText);
                alert("クリップボードにコピーしました！");
              }}
              disabled={!editedText}
              className="w-full py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              テキストをコピー
            </button>
          </div>
        </div>

        {/* Scoring / Warnings (Visible when result exists) */}
        {outputs[activeTab] && (
          <div className="bg-slate-800 text-white p-5 rounded-2xl space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">具体性チェック</h4>
              <span className={`text-sm font-black ${(outputs[activeTab]?.score || 0) >= 60 ? 'text-green-400' : 'text-amber-400'}`}>
                {outputs[activeTab]?.score} 点
              </span>
            </div>
            <div className="space-y-2">
              {outputs[activeTab]?.warnings.map((w, idx) => (
                <div key={idx} className="flex gap-2 text-[10px] text-amber-300">
                  <span className="shrink-0">•</span>
                  <span>{w}</span>
                </div>
              ))}
              {outputs[activeTab]?.warnings.length === 0 && (
                <div className="text-[10px] text-green-400 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  具体性は十分です
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
