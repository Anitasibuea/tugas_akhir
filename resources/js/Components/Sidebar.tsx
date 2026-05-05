

import { LayoutDashboard, FilePlus, FileText, Users, MapPin, Activity, CheckSquare } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole: 'petugas' | 'manajer' | 'admin';
}

export function Sidebar({ activePage, onNavigate, userRole }: SidebarProps) {
  const petugasMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-report', label: 'Input Laporan', icon: FilePlus },
    { id: 'cable-status', label: 'Status Kabel', icon: Activity },
    { id: 'map', label: 'Peta Lokasi', icon: MapPin },
  ];

  const manajerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'partners', label: 'Data Mitra', icon: Users },
    { id: 'cable-status', label: 'Status Kabel', icon: Activity },
    { id: 'map', label: 'Peta Lokasi', icon: MapPin },
    { id: 'reports', label: 'Semua Laporan', icon: FileText },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-report', label: 'Input Laporan', icon: FilePlus },
    { id: 'reports', label: 'Daftar Laporan', icon: FileText },
    { id: 'partners', label: 'Data Mitra', icon: Users },
    { id: 'cable-status', label: 'Status Kabel', icon: Activity },
    { id: 'validation', label: 'Validasi Status', icon: CheckSquare },
    { id: 'map', label: 'Peta Lokasi', icon: MapPin },
  ];

  const menuItems = userRole === 'petugas' ? petugasMenuItems : userRole === 'manajer' ? manajerMenuItems : adminMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col" style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.03)' }}>
      <div className="p-6">
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Menu Utama</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#6ABEC7] text-white shadow-md shadow-teal-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}