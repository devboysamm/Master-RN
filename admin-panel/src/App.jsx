import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleEdit from './pages/ModuleEdit';
import Lessons from './pages/Lessons';
import LessonEditor from './pages/LessonEditor';
import Media from './pages/Media';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Legal from './pages/Legal';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import { getAdminToken, setAdminToken, clearAdminToken } from './api/client';
import { MRN } from './theme/tokens';

export default function App() {
  const [token, setToken] = useState(() => getAdminToken());

  // No valid admin token → show ONLY the login gate (no sidebar, no pages).
  if (!token) {
    return <Login onSuccess={(t) => { setAdminToken(t); setToken(t); }} />;
  }

  const logout = () => { clearAdminToken(); setToken(null); };

  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: MRN.cream,
        color: MRN.ink,
        fontFamily: MRN.font,
      }}>
        <Sidebar onLogout={logout} />
        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          <Routes>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/modules"        element={<Modules />} />
            <Route path="/modules/new"    element={<ModuleEdit />} />
            <Route path="/modules/:id"    element={<ModuleEdit />} />
            <Route path="/lessons"        element={<Lessons />} />
            <Route path="/lessons/new"    element={<LessonEditor />} />
            <Route path="/lessons/:id"    element={<LessonEditor />} />
            <Route path="/media"          element={<Media />} />
            <Route path="/categories"     element={<Categories />} />
            <Route path="/users"          element={<Users />} />
            <Route path="/reports"        element={<Reports />} />
            <Route path="/notifications"  element={<Notifications />} />
            <Route path="/settings"       element={<Settings />} />
            <Route path="/legal"          element={<Legal />} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
