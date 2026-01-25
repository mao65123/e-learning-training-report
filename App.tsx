
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UnifiedGenerator } from './components/Generator/UnifiedGenerator';
import { HistoryList } from './components/History/HistoryList';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Role, FormData, HistoryEntry, TrainingType } from './types';

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
  const [view, setView] = useState<'dashboard' | 'generator' | 'admin'>('dashboard');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    const saved = localStorage.getItem('training_report_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (newEntry: HistoryEntry) => {
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('training_report_history', JSON.stringify(updated));
  };

  const handleStartNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setView('generator');
  };

  const handleViewDetail = (item: HistoryEntry) => {
    setFormData(item.data);
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
          />
        )}
        
        {view === 'generator' && (
          <UnifiedGenerator 
            initialData={formData} 
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
      </div>
    </Layout>
  );
};

export default App;
