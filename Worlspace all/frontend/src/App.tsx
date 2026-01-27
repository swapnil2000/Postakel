import { useState, useEffect, useMemo, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { TimeTracker } from './components/TimeTracker';
import { LeaveManagement } from './components/LeaveManagement';
import { TasksPlanning } from './components/TasksPlanning';
import { TeamDirectory } from './components/TeamDirectory';
import { Profile } from './components/Profile';
import { Announcements } from './components/Announcements';
import { Reports } from './components/Reports';

import { SalaryManagement } from './components/SalaryManagement';
import { AssetTracker } from './components/AssetTracker';
import { AIInsights } from './components/AIInsights';

import { Settings } from './components/Settings';
import { AddEmployee } from './components/AddEmployee';
import { EmployeeDetails } from './components/EmployeeDetails';
import { PerformanceManagement } from './components/PerformanceManagement';
import { UsersPermissions } from './components/UsersPermissions';
import { PermissionProvider, usePermissions } from './components/PermissionContext';
import { TenantProvider, useTenant, useTenantAuth } from './components/TenantContext';
import { BottomNavigation } from './components/BottomNavigation';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { 
  LogOut, 
  Bell, 
  Building2,
  Settings as SettingsIcon,
  Search,
  Menu,
  X,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Briefcase,
  HardDrive,
  User,
  Shield,
  DollarSign,
  IndianRupee,

  Timer,
  Target,
  Brain
} from 'lucide-react';

// Main App Component with Tenant Context
function AppContent() {
  const { 
    tenant, 
    users, 
    appData, 
    organizationData, 
    currentUser, 
    updateAppData, 
    updateOrganizationData, 
    updateTenantSettings,
    addUser,
    updateUser,
    deleteUsers,
    logout 
  } = useTenant();
  
  const { isAuthenticated, isAdmin, canAccessModule } = useTenantAuth();
  const { initializePermissions, hasModuleAccess } = usePermissions();
  
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount] = useState(5);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  
  // Initialize permissions when user changes
  useEffect(() => {
    if (currentUser) {
      initializePermissions(currentUser.id, currentUser.role);
    }
  }, [currentUser, initializePermissions]);

  const handleLogin = () => {
    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    logout();
    setActiveScreen('dashboard');
  };

  const handleNavigate = useCallback((screen: string) => {
    console.log('Navigation request:', screen, 'Current screen:', activeScreen);
    setActiveScreen(screen);
    setShowMobileMenu(false);
  }, [activeScreen]);

  const handleAddEmployee = async (employee: any) => {
    try {
      await addUser(employee);
      setActiveScreen('team');
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleUpdateEmployee = async (employee: any) => {
    try {
      await updateUser(employee.id, employee);
      setActiveScreen(`employee-${employee.id}`);
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleDeleteEmployees = async (employeeIds: number[]) => {
    try {
      await deleteUsers(employeeIds);
      setActiveScreen('team');
    } catch (error) {
      console.error('Failed to delete employees:', error);
    }
  };

  // Memoize available screens to prevent unnecessary re-calculations
  const getAvailableScreens = useMemo(() => {
    if (!tenant || !currentUser) return [];

    const allScreens = [
      { id: 'dashboard', moduleId: 'dashboard', label: 'Dashboard', icon: Building2 },
      { id: 'timetracker', moduleId: 'timetracker', label: 'Time Tracker', icon: Timer },
      { id: 'leave', moduleId: 'leave', label: 'Leave Management', icon: Calendar },
      { id: 'tasks', moduleId: 'tasks', label: 'Task Management', icon: ClipboardList },
      { id: 'team', moduleId: 'team', label: 'Employee Management', icon: Users },
      { id: 'performance', moduleId: 'performance', label: 'Performance Management', icon: Target },
      { id: 'salary', moduleId: 'salary', label: 'Salary Management', icon: IndianRupee },
      { id: 'announcements', moduleId: 'announcements', label: 'Announcements', icon: MessageSquare },
      { id: 'reports', moduleId: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'assets', moduleId: 'assets', label: 'Asset Management', icon: HardDrive },
      { id: 'ai-insights', moduleId: 'ai-insights', label: 'AI Insights', icon: Brain, requiresFeature: 'ai-insights' },
      { id: 'users-permissions', moduleId: 'settings', label: 'Users & Permissions', icon: Shield, adminOnly: true },
      { id: 'settings', moduleId: 'settings', label: 'System Settings', icon: SettingsIcon, adminOnly: true },
    ];

    // Profile is always available
    const profileScreen = { id: 'profile', label: 'My Profile', icon: User };

    // Filter screens based on permissions and tenant features
    const accessibleScreens = allScreens.filter(screen => {
      if (screen.adminOnly && !isAdmin) return false;
      if (screen.requiresFeature && !tenant.features?.includes(screen.requiresFeature)) return false;
      if (screen.moduleId && !hasModuleAccess(screen.moduleId)) return false;
      return true;
    });

    // Add profile for non-admin users
    if (!isAdmin) {
      accessibleScreens.push(profileScreen);
    }

    return accessibleScreens;
  }, [tenant, currentUser, isAdmin, hasModuleAccess]);

  // Check for unauthorized access and redirect (moved after getAvailableScreens definition)
  useEffect(() => {
    if (tenant && currentUser && getAvailableScreens.length > 0) {
      const currentScreenAccess = getAvailableScreens.find(s => s.id === activeScreen);
      
      console.log('🔒 Access check for screen:', activeScreen);
      console.log('Available screens:', getAvailableScreens.map(s => s.id));
      console.log('Current screen access:', !!currentScreenAccess);
      
      // Define allowed child screens for modules
      const allowedChildScreens = {
        'add-employee': 'team',  // add-employee is a child of team module
      };
      
      // Check if current screen is a child screen that should be allowed
      const isChildScreen = allowedChildScreens[activeScreen];
      const hasChildScreenAccess = isChildScreen && hasModuleAccess(isChildScreen);
      
      // Check if current screen is an employee details page
      const isEmployeeDetailsScreen = activeScreen.startsWith('employee-');
      const hasEmployeeDetailsAccess = isEmployeeDetailsScreen && (hasModuleAccess('team') || isAdmin);

      // Check if current screen is edit employee page
      const isEditEmployeeScreen = activeScreen.startsWith('edit-employee-');
      const hasEditEmployeeAccess = isEditEmployeeScreen && (hasModuleAccess('team') || isAdmin);
      
      // If user doesn't have access to current screen, redirect to dashboard
      if (!currentScreenAccess && !hasChildScreenAccess && !hasEmployeeDetailsAccess && !hasEditEmployeeAccess && activeScreen !== 'notifications' && activeScreen !== 'more' && activeScreen !== 'dashboard') {
        console.log('❌ Redirecting to dashboard due to no access');
        setActiveScreen('dashboard');
      } else {
        console.log('✅ Access granted to screen:', activeScreen);
      }
    }
  }, [activeScreen, tenant, currentUser, getAvailableScreens]);

  // Memoize company settings to prevent recreation on every render
  const companySettings = useMemo(() => {
    if (!tenant) return null;
    
    return {
      name: tenant.name,
      email: tenant.settings?.email,
      phone: tenant.settings?.phone,
      address: tenant.settings?.address,
      website: tenant.settings?.website,
      timezone: tenant.settings?.timezone,
      currency: tenant.settings?.currency,
      currencySymbol: tenant.settings?.currencySymbol,
      dateFormat: tenant.settings?.dateFormat,
      timeFormat: tenant.settings?.timeFormat,
      weekStartsOn: tenant.settings?.weekStartsOn,
      fiscalYearStart: tenant.settings?.fiscalYearStart,
      taxId: tenant.settings?.taxId,
      industry: tenant.settings?.industry,
      companySize: tenant.settings?.companySize,
      language: tenant.settings?.language,
      country: tenant.settings?.country,
      logo: tenant.logo,
      theme: tenant.theme
    };
  }, [tenant]);

  // Memoize role info to prevent recreation
  const roleInfo = useMemo(() => {
    if (!currentUser) return { name: 'User', emoji: '👤', color: 'bg-gray-100 text-gray-700' };
    
    const role = currentUser.role;
    switch (role) {
      case 'admin':
        return { name: 'Admin', emoji: '👨‍💼', color: 'bg-red-100 text-red-700' };
      case 'employee':
        return { name: 'Employee', emoji: '👨‍💻', color: 'bg-green-100 text-green-700' };
      default:
        return { name: 'User', emoji: '👤', color: 'bg-gray-100 text-gray-700' };
    }
  }, [currentUser]);

  // Access Denied Component
  const AccessDenied = () => (
    <div className="container-mobile py-6 pb-24">
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-4">You don't have permission to access this module.</p>
        <p className="text-sm text-gray-500">Contact your administrator to request access.</p>
        <Button 
          onClick={() => handleNavigate('dashboard')} 
          className="mt-6"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );

  const renderScreen = () => {
    console.log('Rendering screen:', activeScreen, 'User role:', currentUser?.role);
    
    if (!tenant || !currentUser || !companySettings) {
      console.log('Missing required data:', { tenant: !!tenant, currentUser: !!currentUser, companySettings: !!companySettings });
      return null;
    }
    
    const userRole = currentUser.role;

    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard userRole={userRole} onNavigate={handleNavigate} currentUser={currentUser} employees={users} companySettings={companySettings} appData={appData} />;
      case 'timetracker':
        return hasModuleAccess('timetracker') ? <TimeTracker userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'leave':
        return hasModuleAccess('leave') ? <LeaveManagement userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'tasks':
        return hasModuleAccess('tasks') ? <TasksPlanning userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'team':
        return hasModuleAccess('team') ? (
          <TeamDirectory 
            userRole={userRole} 
            onNavigate={handleNavigate} 
            employees={users} 
            onDeleteEmployees={handleDeleteEmployees}
          />
        ) : <AccessDenied />;
      case 'add-employee':
        console.log('Attempting to render AddEmployee, hasModuleAccess:', hasModuleAccess('team'));
        console.log('organizationData:', organizationData);
        return hasModuleAccess('team') ? <AddEmployee onBack={() => handleNavigate('team')} onSave={handleAddEmployee} organizationData={organizationData} /> : <AccessDenied />;
      case 'performance':
        return hasModuleAccess('performance') ? <PerformanceManagement userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'salary':
        return hasModuleAccess('salary') ? <SalaryManagement userRole={userRole} employees={users} companySettings={companySettings} currentUser={currentUser} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'profile':
        return <Profile userRole={userRole} currentUser={currentUser} employees={users} companySettings={companySettings} />;
      case 'announcements':
        return hasModuleAccess('announcements') ? <Announcements userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'reports':
        return hasModuleAccess('reports') ? <Reports userRole={userRole} currentUser={currentUser} employees={users} appData={appData} companySettings={companySettings} /> : <AccessDenied />;
      case 'assets':
        return hasModuleAccess('assets') ? <AssetTracker userRole={userRole} currentUser={currentUser} employees={users} appData={appData} onUpdateAppData={updateAppData} /> : <AccessDenied />;
      case 'ai-insights':
        return canAccessModule('ai-insights') ? <AIInsights userRole={userRole} currentUser={currentUser} employees={users} companySettings={companySettings} appData={appData} /> : <AccessDenied />;
      case 'users-permissions':
        return isAdmin ? <UsersPermissions userRole={userRole} organizationData={organizationData} employees={users} /> : <AccessDenied />;
      case 'settings':
        return isAdmin ? <Settings 
          userRole={userRole} 
          organizationData={organizationData} 
          onUpdateOrganizationData={updateOrganizationData}
          companySettings={companySettings}
          onUpdateCompanySettings={updateTenantSettings}
        /> : <AccessDenied />;
      case 'notifications':
        return (
          <div className="container-mobile py-6 pb-24 space-y-6">
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
              <p className="text-gray-600 mb-6">All your notifications in one place</p>
              <p className="text-sm text-gray-500">Stay updated with company messages, upcoming events,<br />deadlines, and important announcements.</p>
            </div>
          </div>
        );
      case 'more':
        return (
          <div className="container-mobile py-6 pb-24 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">More Options</h1>
            <div className="grid gap-4">
              {getAvailableScreens.slice(5).map((screen) => (
                <button
                  key={screen.id}
                  onClick={() => handleNavigate(screen.id)}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <screen.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{screen.label}</h3>
                    <p className="text-sm text-gray-600">Access {screen.label.toLowerCase()} features</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        // Handle edit employee pages
        if (activeScreen.startsWith('edit-employee-')) {
          const employeeId = parseInt(activeScreen.split('-')[2]);
          const employee = users.find(u => u.id === employeeId);

          if (hasModuleAccess('team') || isAdmin) {
            return (
              <AddEmployee 
                mode="edit"
                employee={employee}
                onBack={() => handleNavigate(`employee-${employeeId}`)}
                onSave={handleUpdateEmployee}
                organizationData={organizationData}
              />
            );
          }
          return <AccessDenied />;
        }

        // Handle employee details pages
        if (activeScreen.startsWith('employee-')) {
          const employeeId = parseInt(activeScreen.split('-')[1]);
          const employee = users.find(u => u.id === employeeId);
          
          if (hasModuleAccess('team') || isAdmin) {
            return (
              <EmployeeDetails 
                employee={employee}
                userRole={userRole}
                onBack={() => handleNavigate('team')}
                onEdit={() => handleNavigate(`edit-employee-${employeeId}`)}
                onDelete={(id) => {
                  handleDeleteEmployees([id]);
                }}
              />
            );
          } else {
            return <AccessDenied />;
          }
        }
        
        return <Dashboard userRole={userRole} onNavigate={handleNavigate} currentUser={currentUser} employees={users} companySettings={companySettings} appData={appData} />;
    }
  };

  // CONDITIONAL RETURN - MUST BE AFTER ALL HOOKS
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Top Header - Desktop & Mobile */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 safe-area-top">
        <div className="container-mobile">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">{tenant?.name || 'WorkSpace'}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs px-2 py-1 ${roleInfo.color}`}>
                    {roleInfo.emoji} {roleInfo.name}
                  </Badge>
                  {tenant?.subscription.status === 'trial' && (
                    <Badge className="text-xs px-2 py-1 bg-orange-100 text-orange-700">
                      Trial
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
              
              {/* Tenant Info */}
              <div className="px-3 py-1 text-xs bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
                {tenant?.subdomain}.workspace.ai
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="avatar-small bg-blue-100 text-blue-700 border-2 border-blue-200">
                  <AvatarFallback>
                    {roleInfo.emoji}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || 'User'}
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('notifications')}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
              <Avatar className="avatar-small bg-blue-100 text-blue-700 border-2 border-blue-200">
                <AvatarFallback>{roleInfo.emoji}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {/* Tenant Info for Mobile */}
                <div className="px-3 mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Workspace</div>
                  <div className="text-sm font-semibold text-gray-900">{tenant?.name}</div>
                  <div className="text-xs text-gray-500">{tenant?.subdomain}.workspace.ai</div>
                </div>
                
                {getAvailableScreens.map((screen) => (
                  <Button
                    key={screen.id}
                    variant={activeScreen === screen.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleNavigate(screen.id)}
                  >
                    <screen.icon className="w-4 h-4 mr-3" />
                    {screen.label}
                  </Button>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-20 w-64 h-[calc(100vh-80px)] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-2">
          {getAvailableScreens.map((screen) => (
            <Button
              key={screen.id}
              variant={activeScreen === screen.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigate(screen.id)}
            >
              <screen.icon className="w-4 h-4 mr-3" />
              {screen.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64">
        {renderScreen()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation 
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          userRole={currentUser?.role || 'employee'}
          notificationCount={notificationCount}
          appData={appData}
        />
      </div>
    </div>
  );
}

// Main App Component wrapped with Tenant and Permission Providers
export default function App() {
  return (
    <TenantProvider>
      <PermissionProvider>
        <AppContent />
      </PermissionProvider>
    </TenantProvider>
  );
}