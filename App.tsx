
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UnifiedGenerator } from './components/Generator/UnifiedGenerator';
import { HistoryList } from './components/History/HistoryList';
import { AdminPanel } from './components/Admin/AdminPanel';
import { HelpPage } from './components/Help/HelpPage';
import { Role, FormData, HistoryEntry, TrainingType, GeneratedOutput } from './types';
import { fetchHistory, saveHistoryEntry, deleteHistoryEntries } from './services/historyService';

const INITIAL_FORM_DATA: FormData = {
  userName: '',
  trainingType: TrainingType.AI_PRACTICE,
  mainTool: '',
  additionalTools: [],
  jobRole: '',
  jobRoleOther: '',
  jobTasks: [],
  jobTasksOther: '',
  jobFlow: '',
  issues: [],
  issuesOther: '',
  issueFlow: '',
  frequency: '',
  impact: '',
  learningContents: [],
  learningPoints: [],
  learningPointsOther: '',
  cautions: '',
  applyTasks: [],
  applyTasksOther: '',
  applyMethods: [],
  applyMethodsOther: '',
  kpiType: '',
  kpiTypeOther: '',
  kpiValue: '',
  kpiUnit: '',
  personality: 'logical',
};

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.USER);
  const [view, setView] = useState<'dashboard' | 'generator' | 'admin' | 'help'>('dashboard');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentOutputs, setCurrentOutputs] = useState<GeneratedOutput[] | undefined>(undefined);

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  const saveHistory = async (newEntry: HistoryEntry) => {
    const success = await saveHistoryEntry(newEntry);
    if (success) {
      setHistory(prev => [newEntry, ...prev]);
    }
  };

  const deleteHistory = async (ids: string[]) => {
    const success = await deleteHistoryEntries(ids);
    if (success) {
      setHistory(prev => prev.filter(h => !ids.includes(h.id)));
    }
  };

  const handleStartNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentOutputs(undefined);
    setView('generator');
  };

  const handleViewDetail = (item: HistoryEntry) => {
    setFormData(item.data);
    setCurrentOutputs(item.outputs);
    setView('generator');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  return (
    <Layout 
      role={role} 
      setRole={setRole} 
      currentView={view} 
      setView={setView}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <HistoryList
            history={history}
            onNew={handleStartNew}
            onViewDetail={handleViewDetail}
            onDelete={deleteHistory}
          />
        )}
        
        {view === 'generator' && (
          <UnifiedGenerator
            initialData={formData}
            initialOutputs={currentOutputs}
            onSave={(entry) => {
              saveHistory(entry);
              setView('dashboard');
            }}
            onCancel={handleBackToDashboard}
          />
        )}

        {view === 'admin' && (
          <AdminPanel />
        )}

        {view === 'help' && (
          <HelpPage />
        )}
      </div>
    </Layout>
  );
};

export default App;
