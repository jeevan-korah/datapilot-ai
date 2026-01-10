import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  title: string;
  userName: string;
  onLogout: () => void;
}

export function Header({ title, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl">{title}</h1>
            <p className="text-sm text-gray-500">Welcome, {userName}</p>
          </div>
          <Button variant="ghost" onClick={onLogout} className="text-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
