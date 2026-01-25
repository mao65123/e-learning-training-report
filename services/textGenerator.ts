
import { FormData, LengthType } from "../types";
import { ROLE_OPTIONS, SYNONYM_MAP, BANNED_PHRASES } from "../constants";

export const calculateQualityScore = (data: FormData) => {
  let score = 0;
  const warnings: string[] = [];

  const jobFlowLen = data.jobFlow.length;
  if (jobFlowLen > 30) score += 20;
  else if (jobFlowLen > 0) score += 10;
  else warnings.push("仕事内容をもっと詳しく書くと文章に具体性が出ます");

  const hasLearning = data.learningPoints.length > 0 || data.learningPointsOther.length > 5;
  if (hasLearning) score += 15;
  else warnings.push("研修で学んだ具体的な技術を選択、または入力してください");

  const hasMethod = data.applyMethods.length > 0 || data.applyMethodsOther.length > 5;
  if (hasMethod) score += 15;
  else warnings.push("具体的な活用手法を選択、または入力してください");

  if (data.kpiType && data.kpiValue && data.kpiUnit) score += 30;
  else if (data.kpiType) score += 15;
  else warnings.push("数値目標を設定すると説得力が増します");

  if (data.frequency || data.impact || data.issuesOther.length > 10) score += 20;
  else warnings.push("課題が発生する頻度や弊害を記述してください");

  return { score: Math.min(100, score), warnings };
};

const getRandomSynonym = (word: string): string => {
  const synonyms = SYNONYM_MAP[word];
  if (!synonyms) return word;
  return synonyms[Math.floor(Math.random() * synonyms.length)];
};

const sanitize = (text: string): string => {
  let result = text;
  Object.entries(BANNED_PHRASES).forEach(([banned, replacement]) => {
    result = result.replace(new RegExp(banned, 'g'), replacement);
  });
  return result;
};

export const createBaseDraft = (data: FormData, variantId: number): string => {
  const mainTool = data.mainTool;
  const allTools = [data.mainTool, ...data.additionalTools].filter(Boolean).join("や");
  const finalRole = data.jobRole === 'その他' ? data.jobRoleOther : data.jobRole;
  
  const tasks = [...data.jobTasks, ...(data.jobTasksOther ? [data.jobTasksOther] : [])].join("、");
  const issues = [...data.issues, ...(data.issuesOther ? [data.issuesOther] : [])].join("や");
  const learnings = [...data.learningPoints, ...(data.learningPointsOther ? [data.learningPointsOther] : [])].join("、");
  const applyMethods = [...data.applyMethods, ...(data.applyMethodsOther ? [data.applyMethodsOther] : [])].join("、");
  const applyTasks = [...data.applyTasks, ...(data.applyTasksOther ? [data.applyTasksOther] : [])].join("、");

  const segments = {
    job: `私は${finalRole}として、日頃から${tasks}といった業務に取り組んでいます。具体的には、${data.jobFlow}といったプロセスで進めています。`,
    issue: `しかし${issues}といった点が課題となっており、${data.frequency ? `${data.frequency}発生する中で` : ""}${data.impact ? `${data.impact}という問題` : "多大な工数"}を抱えています。`,
    learning: `今回の研修では${allTools}を学び、特に${learnings}といった点に大きな気づきがありました。`,
    apply: `今後は${applyTasks}において、${applyMethods}を${getRandomSynonym('活用する')}ことで、業務の${getRandomSynonym('効率化')}を実現したいと考えています。`,
    effect: `この取り組みにより、${data.kpiType || "工数"}の${data.kpiValue}${data.kpiUnit}改善を目指し、${getRandomSynonym('迅速に')}質の高いアウトプットを出せるよう注力します。`
  };

  const skeletons = [
    `${segments.job} ${segments.issue} 研修にて習得した${learnings}を活かし、${segments.apply} 結果として${segments.effect}`,
    `${segments.learning} この学びを${segments.job}に繋げたいと思います。現状の${issues}という課題に対し、${segments.apply} 最終的には${segments.effect}`,
    `これまで${segments.job}の中で、${data.issues[0] || "業務効率"}の改善が急務でした。${segments.learning} 今後は${segments.apply} これにより${segments.effect}`,
    `${finalRole}の業務を${getRandomSynonym('効率化')}すべく、研修で${allTools}を学びました。${segments.issue} ${segments.apply} 目標として${segments.effect}`
  ];

  return sanitize(skeletons[variantId % skeletons.length]);
};
