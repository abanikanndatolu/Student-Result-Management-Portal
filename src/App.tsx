import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/sonner';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourseManagement } from './components/admin/CourseManagement';
import { ResultManagement } from './components/admin/ResultManagement';
import { RegistrationApproval } from './components/admin/RegistrationApproval';
import { AnnouncementManagement } from './components/admin/AnnouncementManagement';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { CourseRegistration } from './components/student/CourseRegistration';
import { ViewResults } from './components/student/ViewResults';
import { StudentProfile } from './components/student/StudentProfile';
import { Announcements } from './components/student/Announcements';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'courses':
          return <CourseManagement />;
        case 'results':
          return <ResultManagement />;
        case 'approvals':
          return <RegistrationApproval />;
        case 'announcements':
          return <AnnouncementManagement />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentView) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'register':
          return <CourseRegistration />;
        case 'results':
          return <ViewResults />;
        case 'profile':
          return <StudentProfile />;
        case 'announcements':
          return <Announcements />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
