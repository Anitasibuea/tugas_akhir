import { Logo } from './Logo';
import { Bell, User, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  userRole?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function Navbar({ userName = 'Admin User', userRole = 'Administrator', onBack, showBackButton = false }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <Logo size="md" />
          <div className="hidden md:block">
            <h2 className="text-gray-900 text-sm">Sistem Informasi Berita Acara</h2>
            <p className="text-xs text-gray-500">Pemanfaatan Tiang Bersama</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#6ABEC7] rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">{userRole}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#6ABEC7] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
