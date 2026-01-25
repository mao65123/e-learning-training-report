
import React from 'react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
  setRole: (r: Role) => void;
  currentView: string;
  setView: (v: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, setRole, currentView, setView }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setView('dashboard')}
              >
                <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  報告文生成アシスタント
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setView('dashboard')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                ダッシュボード
              </button>
              <button
                onClick={() => setView('help')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'help' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                使い方
              </button>
              {role === Role.ADMIN && (
                <button
                  onClick={() => setView('admin')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${currentView === 'admin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  管理パネル
                </button>
              )}
              
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Role:</span>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="bg-slate-100 text-slate-700 text-xs rounded-full px-3 py-1 border-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={Role.USER}>受講者</option>
                  <option value={Role.HR}>人事</option>
                  <option value={Role.ADMIN}>管理者</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
};
