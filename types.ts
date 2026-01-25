
export enum Role {
  USER = 'user',
  HR = 'hr',
  ADMIN = 'admin'
}

export enum TrainingType {
  AI_PRACTICE = 'AI活用実践編',
  VIDEO_PRODUCTION = '映像制作編',
  OPERATIONAL_EFFICIENCY = '業務効率化編',
  AI_CULTURE = '生成AI社内浸透編'
}

export enum LengthType {
  STANDARD = 'standard',
  LONG = 'long'
}

export interface AITool {
  id: string;
  name: string;
  category: string;
}

export interface TrainingMaster {
  id: string;
  name: TrainingType;
  tools: AITool[];
}

export interface FormData {
  userName: string; // Added for identification
  trainingType: TrainingType;
  mainTool: string;
  additionalTools: string[];
  jobRole: string;
  jobRoleOther: string;
  jobTasks: string[];
  jobTasksOther: string;
  jobFlow: string;
  issues: string[];
  issuesOther: string;
  issueFlow: string;
  frequency: string;
  impact: string;
  learningContents: string[];
  learningPoints: string[];
  learningPointsOther: string;
  cautions: string;
  applyTasks: string[];
  applyTasksOther: string;
  applyMethods: string[];
  applyMethodsOther: string;
  kpiType: string;
  kpiTypeOther: string;
  kpiValue: string;
  kpiUnit: string;
  personality: string;
}

export interface GeneratedOutput {
  id: string;
  text: string;
  lengthType: LengthType;
  variantId: number;
  score: number;
  warnings: string[];
}

export interface HistoryEntry {
  id: string;
  userId: string;
  userName: string; // Track who created it
  data: FormData;
  outputs: GeneratedOutput[];
  createdAt: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'returned';
}
