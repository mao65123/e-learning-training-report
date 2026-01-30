
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UnifiedGenerator } from './components/Generator/UnifiedGenerator';
import { HistoryList } from './components/History/HistoryList';
import { AdminPanel } from './components/Admin/AdminPanel';
import { HelpPage } from './components/Help/HelpPage';
import { Role, FormData, HistoryEntry, TrainingType, GeneratedOutput } from './types';
import { fetchHistory, saveHistoryEntry, updateHistoryEntry, deleteHistoryEntries } from './services/historyService';

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

const AUTH_ID = 'aoiumi';
const AUTH_PW = 'aoiumi';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('authenticated') === 'true');
  const [authId, setAuthId] = useState('');
  const [authPw, setAuthPw] = useState('');
  const [authError, setAuthError] = useState(false);

  const [role, setRole] = useState<Role>(Role.USER);
  const [view, setView] = useState<'dashboard' | 'generator' | 'admin' | 'help'>('dashboard');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentOutputs, setCurrentOutputs] = useState<GeneratedOutput[] | undefined>(undefined);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchHistory().then(setHistory);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authId === AUTH_ID && authPw === AUTH_PW) {
      setIsAuthenticated(true);
      sessionStorage.setItem('authenticated', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-700 text-center">ログイン</h2>
          {authError && <p className="text-red-500 text-sm text-center">IDまたはパスワードが違います</p>}
          <input
            type="text"
            placeholder="ID"
            value={authId}
            onChange={e => setAuthId(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm"
            autoFocus
          />
          <input
            type="password"
            placeholder="パスワード"
            value={authPw}
            onChange={e => setAuthPw(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            ログイン
          </button>
        </form>
      </div>
    );
  }

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

  const overwriteHistory = async (entry: HistoryEntry) => {
    const success = await updateHistoryEntry(entry);
    if (success) {
      setHistory(prev => prev.map(h => h.id === entry.id ? entry : h));
    }
  };

  const handleStartNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentOutputs(undefined);
    setEditingEntryId(null);
    setView('generator');
  };

  const handleViewDetail = (item: HistoryEntry) => {
    setFormData(item.data);
    setCurrentOutputs(item.outputs);
    setEditingEntryId(item.id);
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
            editingEntryId={editingEntryId}
            onSave={(entry) => {
              saveHistory(entry);
              setView('dashboard');
            }}
            onOverwrite={(entry) => {
              overwriteHistory(entry);
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
