import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  UserCheck,
  Megaphone,
  User,
  ClipboardCheck,
  Bell,
  LogOut,
  GraduationCap,
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'results', label: 'Results', icon: FileText },
    { id: 'approvals', label: 'Approvals', icon: UserCheck },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register', label: 'Register Courses', icon: ClipboardCheck },
    { id: 'results', label: 'My Results', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <div className="w-64 bg-card border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg">Student Portal</h2>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'Admin Panel' : 'Student Panel'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="mb-3 p-3 bg-muted rounded-lg">
          <div className="text-sm">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
