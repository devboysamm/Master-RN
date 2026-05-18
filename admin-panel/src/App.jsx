import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleEdit from './pages/ModuleEdit';
import Lessons from './pages/Lessons';
import LessonEditor from './pages/LessonEditor';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import { MRN } from './theme/tokens';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: MRN.cream,
        color: MRN.ink,
        fontFamily: MRN.font,
      }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          <Routes>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/modules"        element={<Modules />} />
            <Route path="/modules/new"    element={<ModuleEdit />} />
            <Route path="/modules/:id"    element={<ModuleEdit />} />
            <Route path="/lessons"        element={<Lessons />} />
            <Route path="/lessons/new"    element={<LessonEditor />} />
            <Route path="/lessons/:id"    element={<LessonEditor />} />
            <Route path="/categories"     element={<Categories />} />
            <Route path="/settings"       element={<Settings />} />
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
