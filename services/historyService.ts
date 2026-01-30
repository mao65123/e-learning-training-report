import { supabase } from './supabaseClient';
import { HistoryEntry, FormData, GeneratedOutput, LengthType } from '../types';

// HistoryEntry -> DB row conversion
function toDbEntry(entry: HistoryEntry) {
  const d = entry.data;
  return {
    id: entry.id,
    user_id: entry.userId,
    user_name: entry.userName,
    status: entry.status,
    created_at: entry.createdAt,
    training_type: d.trainingType,
    main_tool: d.mainTool,
    additional_tools: d.additionalTools,
    job_role: d.jobRole,
    job_role_other: d.jobRoleOther,
    job_tasks: d.jobTasks,
    job_tasks_other: d.jobTasksOther,
    job_flow: d.jobFlow,
    issues: d.issues,
    issues_other: d.issuesOther,
    issue_flow: d.issueFlow,
    frequency: d.frequency,
    impact: d.impact,
    learning_contents: d.learningContents,
    learning_points: d.learningPoints,
    learning_points_other: d.learningPointsOther,
    cautions: d.cautions,
    apply_tasks: d.applyTasks,
    apply_tasks_other: d.applyTasksOther,
    apply_methods: d.applyMethods,
    apply_methods_other: d.applyMethodsOther,
    kpi_type: d.kpiType,
    kpi_type_other: d.kpiTypeOther,
    kpi_value: d.kpiValue,
    kpi_unit: d.kpiUnit,
    personality: d.personality,
  };
}

function toDbOutputs(entryId: string, outputs: GeneratedOutput[]) {
  return outputs.map(o => ({
    id: o.id,
    history_entry_id: entryId,
    text: o.text,
    length_type: o.lengthType,
    variant_id: o.variantId,
    score: o.score,
    warnings: o.warnings,
  }));
}

// DB row -> HistoryEntry conversion
function fromDbRow(row: any, outputs: any[]): HistoryEntry {
  const data: FormData = {
    userName: row.user_name,
    trainingType: row.training_type,
    mainTool: row.main_tool,
    additionalTools: row.additional_tools || [],
    jobRole: row.job_role || '',
    jobRoleOther: row.job_role_other || '',
    jobTasks: row.job_tasks || [],
    jobTasksOther: row.job_tasks_other || '',
    jobFlow: row.job_flow || '',
    issues: row.issues || [],
    issuesOther: row.issues_other || '',
    issueFlow: row.issue_flow || '',
    frequency: row.frequency || '',
    impact: row.impact || '',
    learningContents: row.learning_contents || [],
    learningPoints: row.learning_points || [],
    learningPointsOther: row.learning_points_other || '',
    cautions: row.cautions || '',
    applyTasks: row.apply_tasks || [],
    applyTasksOther: row.apply_tasks_other || '',
    applyMethods: row.apply_methods || [],
    applyMethodsOther: row.apply_methods_other || '',
    kpiType: row.kpi_type || '',
    kpiTypeOther: row.kpi_type_other || '',
    kpiValue: row.kpi_value || '',
    kpiUnit: row.kpi_unit || '',
    personality: row.personality || '',
  };

  const parsedOutputs: GeneratedOutput[] = outputs.map(o => ({
    id: o.id,
    text: o.text,
    lengthType: o.length_type as LengthType,
    variantId: o.variant_id,
    score: o.score,
    warnings: o.warnings || [],
  }));

  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    data,
    outputs: parsedOutputs,
    createdAt: row.created_at,
    status: row.status,
  };
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const { data: entries, error: entriesErr } = await supabase
    .from('history_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (entriesErr) {
    console.error('Failed to fetch history:', entriesErr);
    return [];
  }
  if (!entries || entries.length === 0) return [];

  const { data: outputs, error: outputsErr } = await supabase
    .from('generated_outputs')
    .select('*')
    .in('history_entry_id', entries.map(e => e.id));

  if (outputsErr) {
    console.error('Failed to fetch outputs:', outputsErr);
  }

  const outputsByEntry = new Map<string, any[]>();
  (outputs || []).forEach(o => {
    const list = outputsByEntry.get(o.history_entry_id) || [];
    list.push(o);
    outputsByEntry.set(o.history_entry_id, list);
  });

  return entries.map(row => fromDbRow(row, outputsByEntry.get(row.id) || []));
}

export async function saveHistoryEntry(entry: HistoryEntry): Promise<boolean> {
  const { error: entryErr } = await supabase
    .from('history_entries')
    .insert(toDbEntry(entry));

  if (entryErr) {
    console.error('Failed to save history entry:', entryErr);
    return false;
  }

  if (entry.outputs.length > 0) {
    const { error: outputsErr } = await supabase
      .from('generated_outputs')
      .insert(toDbOutputs(entry.id, entry.outputs));

    if (outputsErr) {
      console.error('Failed to save outputs:', outputsErr);
      return false;
    }
  }

  return true;
}

export async function deleteHistoryEntries(ids: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('history_entries')
    .delete()
    .in('id', ids);

  if (error) {
    console.error('Failed to delete history:', error);
    return false;
  }
  return true;
}
