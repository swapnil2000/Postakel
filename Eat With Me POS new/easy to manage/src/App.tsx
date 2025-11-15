import { useState, useEffect } from 'react';
import { EasyToManageWebsite } from './components/EasyToManageWebsite';
import { POSDetailsPage } from './components/POSDetailsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactPage } from './components/ContactPage';
import {
  clearAdminAuth,
  getAdminSessionTokens,
  getStoredAdminProfile,
  persistAdminSession,
  type AdminLoginResponse,
} from './lib/adminApi';

export default function App() {
  const [currentView, setCurrentView] = useState('website');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [adminProfile, setAdminProfile] = useState<AdminLoginResponse['admin'] | null>(null);

  // Check for admin access in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam === 'true') {
      setCurrentView('admin-login');
    }
  }, []);

  // Hydrate admin session on first load
  useEffect(() => {
    const { accessToken } = getAdminSessionTokens();
    const profile = getStoredAdminProfile();

    if (accessToken && profile) {
      setAdminProfile(profile);
    }
  }, []);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigateToIndustry = (industry: string) => {
    setSelectedIndustry(industry);
    setCurrentView('industry-details');
  };

  const handleBackToWebsite = () => {
    setCurrentView('website');
    setSelectedIndustry('');
    // Clear admin parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url);
  };

  const handleAdminLogin = (session: AdminLoginResponse) => {
    persistAdminSession(session);
    setAdminProfile(session.admin);
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    clearAdminAuth();
    setAdminProfile(null);
    setCurrentView('website');
    // Clear admin parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url);
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin-login');
    // Add admin parameter to URL
    const url = new URL(window.location.href);
    url.searchParams.set('admin', 'true');
    window.history.pushState({}, '', url);
  };

  const handleNavigateToContact = () => {
    setCurrentView('contact');
  };

  // Admin Login View
  if (currentView === 'admin-login') {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onBack={handleBackToWebsite}
      />
    );
  }

  // Admin Dashboard View
  if (currentView === 'admin-dashboard' && adminProfile) {
    return (
      <AdminDashboard 
        admin={adminProfile}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Contact Page View
  if (currentView === 'contact') {
    return (
      <ContactPage 
        onBack={handleBackToWebsite}
      />
    );
  }

  // Website Home View
  if (currentView === 'website') {
    return (
      <div className="relative">
        <EasyToManageWebsite 
          onNavigateToIndustry={handleNavigateToIndustry}
          onNavigateToAdmin={handleNavigateToAdmin}
          onNavigateToContact={handleNavigateToContact}
        />
        
        {/* Hidden Admin Access - Click bottom-right corner 5 times */}
        <AdminAccessTrigger onTriggerAdmin={handleNavigateToAdmin} />
      </div>
    );
  }

  // Industry Details View
  if (currentView === 'industry-details') {
    return (
      <POSDetailsPage 
        industry={selectedIndustry}
        onBack={handleBackToWebsite}
      />
    );
  }

  return <EasyToManageWebsite onNavigateToIndustry={handleNavigateToIndustry} />;
}

// Hidden component to trigger admin access
function AdminAccessTrigger({ onTriggerAdmin }: { onTriggerAdmin: () => void }) {
  const [clickCount, setClickCount] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setShowIndicator(true);

    if (newCount >= 5) {
      onTriggerAdmin();
      setClickCount(0);
    }

    // Reset click count after 3 seconds
    setTimeout(() => {
      setClickCount(0);
      setShowIndicator(false);
    }, 3000);
  };

  return (
    <>
      {/* Invisible clickable area */}
      <div 
        className="fixed bottom-4 right-4 w-12 h-12 cursor-pointer z-50"
        onClick={handleClick}
        title="Admin Access"
      />
      
      {/* Visual indicator */}
      {showIndicator && (
        <div className="fixed bottom-20 right-4 bg-black text-white px-3 py-2 rounded-lg text-sm z-50 animate-fade-in">
          Admin Access: {clickCount}/5
        </div>
      )}
    </>
  );
}