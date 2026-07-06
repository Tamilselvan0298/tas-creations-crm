import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/components/AuthProvider';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { Layout } from './shared/components/Layout';
import { Dashboard } from './dashboard';
import { Login, Signup, ForgotPassword } from './users';
import { ProfileSettings } from './settings';
import { LeadsTable, LeadDetailView } from './leads';
import { KanbanBoard } from './crm/components/KanbanBoard';
import { AuditDashboard } from './website-audit';
import { OutreachCenter } from './outreach';
import { SalesHub } from './sales';
import { AiIntelligenceCenter } from './ai';
import { ExtensionHub } from './extension-hub';
import { CompaniesList } from './companies';
import { TasksList } from './tasks';
import { MeetingsCalendar } from './meetings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Secure Layout Portal */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard View */}
            <Route index element={<Dashboard />} />

            {/* Leads Database Routes */}
            <Route path="leads" element={<LeadsTable />} />
            <Route path="leads/:id" element={<LeadDetailView />} />
            
            {/* CRM Kanban Opportunity Board */}
            <Route path="crm" element={<KanbanBoard />} />

            {/* Website Intel & SEO Reports */}
            <Route path="website-audit" element={<AuditDashboard />} />
            <Route path="seo-reports" element={<AuditDashboard />} />

            {/* Outreach Campaign Hub */}
            <Route path="email" element={<OutreachCenter />} />
            <Route path="whatsapp" element={<OutreachCenter />} />

            {/* Sales Command Hub: Proposals, Quotes, Invoices */}
            <Route path="proposals" element={<SalesHub />} />
            <Route path="quotations" element={<SalesHub />} />
            <Route path="invoices" element={<SalesHub />} />

            {/* AI Sales Intelligence Command Center */}
            <Route path="analytics" element={<AiIntelligenceCenter />} />

            {/* Browser Extension Setup Hub */}
            <Route path="extension-hub" element={<ExtensionHub />} />

            {/* Live Company Directory Ledger */}
            <Route path="companies" element={<CompaniesList />} />

            {/* Placeholder routes for next module phases */}
            <Route path="tasks" element={<TasksList />} />
            <Route path="meetings" element={<MeetingsCalendar />} />
            
            {/* Live Profile Settings Screen */}
            <Route path="settings" element={<ProfileSettings />} />

            {/* Catch all redirect to index */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
