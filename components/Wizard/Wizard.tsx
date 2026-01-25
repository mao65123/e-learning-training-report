
import React, { useState, useEffect } from 'react';
import { FormData, TrainingType, TrainingMaster } from '../../types';
import { TRAINING_MASTERS, ROLE_OPTIONS, CATEGORY_LEARNING_POINTS, PERSONALITY_OPTIONS } from '../../constants';
import { calculateQualityScore } from '../../services/textGenerator';

interface WizardProps {
  initialData: FormData;
  onComplete: (data: FormData) => void;
  onCancel: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ initialData, onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [currentMaster, setCurrentMaster] = useState<TrainingMaster | undefined>(
    TRAINING_MASTERS.find(m => m.name === initialData.trainingType)
  );

  useEffect(() => {
    setCurrentMaster(TRAINING_MASTERS.find(m => m.name === data.trainingType));
  }, [data.trainingType]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const updateData = (updates: Partial<FormData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const { score, warnings } = calculateQualityScore(data);

  // Derived options
  const roleInfo = ROLE_OPTIONS[data.jobRole] || { tasks: [], issues: [], applyTasks: [], applyMethods: [] };
  const mainToolCategory = currentMaster?.tools.find(t => t.name === data.mainTool)?.category || '';
  const learningPoints = CATEGORY_LEARNING_POINTS[mainToolCategory] || [];

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
      {/* Progress Bar */}
      <div className="bg-slate-50 p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">報告文作成ウィザード</h2>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Step {step + 1} of 6
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((step + 1) / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8 min-h-[520px]">
        {step === 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">0</span>
              研修・ツールの選択
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">受講した研修 <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.trainingType}
                  onChange={(e) => updateData({ trainingType: e.target.value as TrainingType, additionalTools: [] })}
                >
                  {TRAINING_MASTERS.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">メインで使用するツール <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.mainTool}
                  onChange={(e) => updateData({ mainTool: e.target.value })}
                >
                  <option value="">選択してください</option>
                  {currentMaster?.tools.map(tool => (
                    <option key={tool.id} value={tool.name}>{tool.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">他に活用するツール（複数選択可）</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentMaster?.tools.filter(t => t.name !== data.mainTool).map(tool => (
                  <label key={tool.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${data.additionalTools.includes(tool.name) ? 'bg-blue-50 border-blue-400' : 'hover:bg-slate-50 border-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={data.additionalTools.includes(tool.name)}
                      onChange={(e) => {
                        const next = e.target.checked 
                          ? [...data.additionalTools, tool.name]
                          : data.additionalTools.filter(t => t !== tool.name);
                        updateData({ additionalTools: next });
                      }}
                    />
                    <span className="text-sm">{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">1</span>
              現在の仕事内容
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">職種・役割 <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.jobRole}
                  onChange={(e) => updateData({ jobRole: e.target.value, jobTasks: [], issues: [], applyTasks: [], applyMethods: [] })}
                >
                  <option value="">選択してください</option>
                  {Object.keys(ROLE_OPTIONS).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="その他">その他（自由入力）</option>
                </select>
                {data.jobRole === 'その他' && (
                  <input 
                    className="w-full p-2 mt-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                    placeholder="職種・役割を自由に入力"
                    value={data.jobRoleOther}
                    onChange={(e) => updateData({ jobRoleOther: e.target.value })}
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">従事している業務</label>
                {data.jobRole && data.jobRole !== 'その他' && roleInfo.tasks.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {roleInfo.tasks.map(task => (
                        <button
                          key={task}
                          onClick={() => {
                            const next = data.jobTasks.includes(task)
                              ? data.jobTasks.filter(t => t !== task)
                              : [...data.jobTasks, task];
                            updateData({ jobTasks: next });
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${data.jobTasks.includes(task) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'}`}
                        >
                          {task}
                        </button>
                      ))}
                    </div>
                    <input
                      className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                      placeholder="その他業務を自由に入力"
                      value={data.jobTasksOther}
                      onChange={(e) => updateData({ jobTasksOther: e.target.value })}
                    />
                  </>
                ) : data.jobRole === 'その他' ? (
                  <input
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                    placeholder="担当している業務を自由に入力"
                    value={data.jobTasksOther}
                    onChange={(e) => updateData({ jobTasksOther: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-slate-400 italic py-2">職種を選択すると、業務の選択肢が表示されます</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">具体的な仕事の流れ・詳細</label>
              <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-28"
                placeholder="例：営業が取得した案件の現場へ訪問し、既存照明の現地調査を行い、その結果を基に適切なLED照明を選定し、数量表を作成することです。"
                value={data.jobFlow}
                onChange={(e) => updateData({ jobFlow: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">2</span>
              現在の課題
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">直面している課題</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                {roleInfo.issues.map(issue => (
                  <label key={issue} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${data.issues.includes(issue) ? 'bg-amber-50 border-amber-400' : 'hover:bg-slate-50 border-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={data.issues.includes(issue)}
                      onChange={(e) => {
                        const next = e.target.checked 
                          ? [...data.issues, issue]
                          : data.issues.filter(t => t !== issue);
                        updateData({ issues: next });
                      }}
                    />
                    <span className="text-sm">{issue}</span>
                  </label>
                ))}
              </div>
              <input 
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                placeholder="その他の課題を自由に入力"
                value={data.issuesOther}
                onChange={(e) => updateData({ issuesOther: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">発生頻度・失われている工数</label>
                <input 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="例：毎日2時間、案件ごとに半日など"
                  value={data.frequency}
                  onChange={(e) => updateData({ frequency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">具体的な弊害・品質への影響</label>
                <input 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="例：担当者により選定精度が異なり品質にムラがある"
                  value={data.impact}
                  onChange={(e) => updateData({ impact: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">3</span>
              研修で学んだ内容
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">習得した技術（{data.mainTool || 'ツール別候補'}）</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {learningPoints.map(point => (
                  <label key={point} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${data.learningPoints.includes(point) ? 'bg-green-50 border-green-400' : 'hover:bg-slate-50 border-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={data.learningPoints.includes(point)}
                      onChange={(e) => {
                        const next = e.target.checked 
                          ? [...data.learningPoints, point]
                          : data.learningPoints.filter(t => t !== point);
                        updateData({ learningPoints: next });
                      }}
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
              <textarea 
                className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 h-20"
                placeholder="その他の学びや、特に印象に残ったことを自由に入力"
                value={data.learningPointsOther}
                onChange={(e) => updateData({ learningPointsOther: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">実務での留意事項・制限（任意）</label>
              <input 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例：機密情報の入力禁止、著作権保護への配慮"
                value={data.cautions}
                onChange={(e) => updateData({ cautions: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">4</span>
              今後の活かし方と目標
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">活かす業務</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {roleInfo.applyTasks.map(task => (
                    <button
                      key={task}
                      onClick={() => {
                        const next = data.applyTasks.includes(task)
                          ? data.applyTasks.filter(t => t !== task)
                          : [...data.applyTasks, task];
                        updateData({ applyTasks: next });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${data.applyTasks.includes(task) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}
                    >
                      {task}
                    </button>
                  ))}
                </div>
                <input 
                  className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  placeholder="その他業務を自由に入力"
                  value={data.applyTasksOther}
                  onChange={(e) => updateData({ applyTasksOther: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">具体的な活用手法</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {roleInfo.applyMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => {
                        const next = data.applyMethods.includes(method)
                          ? data.applyMethods.filter(t => t !== method)
                          : [...data.applyMethods, method];
                        updateData({ applyMethods: next });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${data.applyMethods.includes(method) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <input 
                  className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  placeholder="その他の手法を自由に入力"
                  value={data.applyMethodsOther}
                  onChange={(e) => updateData({ applyMethodsOther: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">改善を狙うKPI</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.kpiType}
                  onChange={(e) => updateData({ kpiType: e.target.value })}
                >
                  <option value="">選択してください</option>
                  <option value="作業時間">作業時間</option>
                  <option value="資料作成工数">資料作成工数</option>
                  <option value="修正・手戻り回数">修正・手戻り回数</option>
                  <option value="顧客満足度">顧客満足度</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">目標値</label>
                <input 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="例：30, 50, 10"
                  value={data.kpiValue}
                  onChange={(e) => updateData({ kpiValue: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600">単位</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={data.kpiUnit}
                  onChange={(e) => updateData({ kpiUnit: e.target.value })}
                >
                  <option value="">選択してください</option>
                  <option value="%削減">%削減</option>
                  <option value="時間短縮">時間短縮/月</option>
                  <option value="ポイント向上">pt向上</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">5</span>
              文章の雰囲気（あなたらしさ）
            </h3>
            <p className="text-sm text-slate-500">
              選択したスタイルに基づいて、AIが文章の言い回しやニュアンスを調整します。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONALITY_OPTIONS.map(personality => (
                <button
                  key={personality.id}
                  onClick={() => updateData({ personality: personality.id })}
                  className={`flex flex-col p-4 border rounded-xl text-left transition-all ${data.personality === personality.id ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-100' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                >
                  <span className={`text-sm font-bold mb-1 ${data.personality === personality.id ? 'text-blue-700' : 'text-slate-800'}`}>
                    {personality.name}
                  </span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    {personality.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">報告文 具体性スコア:</span>
            <div className="w-32 bg-slate-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all ${score >= 60 ? 'bg-green-500' : 'bg-amber-500'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${score >= 60 ? 'text-green-600' : 'text-amber-600'}`}>{score}点</span>
          </div>
          {warnings.length > 0 && (
            <p className="text-[10px] text-amber-600 italic truncate max-w-xs">※ {warnings[0]}</p>
          )}
        </div>

        <div className="flex gap-4">
          {step === 0 ? (
            <button 
              onClick={onCancel}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              キャンセル
            </button>
          ) : (
            <button 
              onClick={prevStep}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              戻る
            </button>
          )}
          
          {step < 5 ? (
            <button 
              onClick={nextStep}
              disabled={step === 0 && (!data.mainTool || !data.trainingType)}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          ) : (
            <button 
              onClick={() => onComplete(data)}
              disabled={!data.personality}
              className={`px-10 py-2 rounded-lg font-bold text-white transition-all shadow-lg ${score >= 60 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
            >
              文章を生成する
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
