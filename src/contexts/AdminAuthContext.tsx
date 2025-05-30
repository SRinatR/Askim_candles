"use client";

import type { AdminUser, AdminRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { logAdminAction } from '@/admin/lib/admin-logger';
import type { AdminLocale } from '@/admin/lib/i18n-config-admin';
import { i18nAdmin } from '@/admin/lib/i18n-config-admin';
import { getAdminDictionary } from '@/admin/lib/getAdminDictionary';
import type enAdminMessages from '@/admin/dictionaries/en.json';

type AdminLoginStrings = typeof enAdminMessages.adminLoginPage;
type AdminContextToastStrings = typeof enAdminMessages.adminContextToasts;
type AdminUsersPageStrings = typeof enAdminMessages.adminUsersPage;

interface AuthStrings {
  login: AdminLoginStrings | null;
  contextToasts: AdminContextToastStrings | null;
  usersPage: AdminUsersPageStrings | null;
}

const defaultAuthStrings: AuthStrings = {
  login: { title: "Admin Panel", description: "Please sign in to manage Askim candles.", emailLabel: "Email Address", emailPlaceholder: "admin@example.com", passwordLabel: "Password", passwordPlaceholder: "••••••••", signInButton: "Sign In", signingInButton: "Signing In...", restrictedAccess: "Access to this panel is restricted to authorized personnel only.", loading: "Loading admin panel...", loginSuccessTitle: "Admin Login Successful", loginWelcomeMessage: "Welcome, {name}!", loginErrorTitle: "Admin Login Failed", loginErrorDescRequired: "Email and password are required.", loginErrorDescInvalid: "Invalid email or password.", loginErrorDescBlockedStatus: "Blocked", loginSuccessDescActiveStatus: "Active" },
  contextToasts: { logoutSuccessTitle: "Logged Out", logoutSuccessDesc: "You have been successfully logged out from the admin panel.", addManagerSuccessTitle: "Manager Added (Simulated)", addManagerSuccessDesc: "{name} ({email}) has been 'added' as a manager. This change is client-side (localStorage).", addManagerErrorEmailExistsTitle: "Failed to Add Manager", addManagerErrorEmailExistsDesc: "An account with this email address already exists. Please use a different email.", managerBlockedToastTitle: "Manager Blocked", managerUnblockedToastTitle: "Manager Unblocked", managerStatusUpdatedToastDesc: "{name} status updated to {status}.", accountBlockedErrorDesc: "This account is blocked. Please contact an administrator.", managerDetailsUpdatedTitle: "Manager Updated (Simulated)", managerDetailsUpdatedDesc: "Details for {name} have been updated locally.", managerDeletedTitle: "Manager Deleted (Simulated)", managerDeletedDesc: "{name} has been deleted locally." },
  usersPage: { title: "Manage Users & Managers", description: "View users, assign roles, and manage manager accounts. (ADMIN Only)", addNewManagerButton: "Add New Manager", managerListTitle: "Manager List", managerListDesc: "Displaying {count} managers. Manager data is simulated.", nameHeader: "Name", emailHeader: "Email", roleHeader: "Role", statusHeader: "Status", actionsHeader: "Actions", statusActive: "Active", statusBlocked: "Blocked", blockUserAction: "Block", unblockUserAction: "Unblock", changeRoleButton: "Change Role", changeRoleModalTitle: "Change Role for {name}", changeRoleModalDesc: "Select a new role for this user. This is a simulated action.", currentRoleLabel: "Current Role:", newRoleLabel: "New Role:", selectRolePlaceholder: "Select a role", roleAdmin: "Administrator", roleManager: "Manager", roleUser: "User (Main Site)", saveRoleButton: "Save Role (Simulated)", cancelButton: "Cancel", closeButton: "Close", permissionsButton: "Permissions", permissionsButtonTitle: "Manage Permissions (Coming Soon)", permissionsModalTitle: "Permissions for {name}", permissionsModalDesc: "Granular permission management is a future feature.", permissionsFeatureComingSoon: "Full permission management requires backend integration and will be available in a future update.", manageProductsPermission: "Manage Products", manageOrdersPermission: "Manage Orders", manageDiscountsPermission: "Manage Discounts", predefinedUserBadge: "Predefined", currentUserAdminBadge: "Current Admin", noManagersFound: "No managers found.", mainSiteUserManagementNote: "Main site user management will require database integration.", simulationNote: "Note: Manager additions and status changes are simulated via localStorage.", loadingPage: "Loading User Management...", accessDeniedTitle: "Access Denied", accessDeniedDesc: "You do not have permission to view this page.", roleChangeSimulatedTitle: "Role Change (Simulated)", roleChangeSimulatedDesc: "Role for {name} 'changed' to {role}.", viewProfileAction: "View Profile", editManagerAction: "Edit Manager", deleteManagerAction: "Delete Manager", viewProfileModalTitle: "User Profile: {name}", nameLabel: "Name:", emailLabel: "Email:", statusLabel: "Status:", editManagerModalTitle: "Edit Manager: {name}", editManagerModalDesc: "Modify the manager's information below.", saveChangesButton: "Save Changes", editManagerSuccessTitle: "Manager Updated (Simulated)", editManagerSuccessDesc: "Details for {name} have been updated.", deleteManagerConfirmTitle: "Confirm Manager Deletion", deleteManagerConfirmDesc: "Are you sure you want to delete manager {name}? This action is simulated and cannot be undone for this session.", deleteConfirmButton: "Delete", deleteManagerSuccessTitle: "Manager Deleted (Simulated)", deleteManagerSuccessDesc: "Manager {name} has been 'deleted'." }
};

interface AdminAuthContextType {
  currentAdminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  role: AdminRole | null;
  predefinedUsers: Record<string, AdminUser>;
  dynamicallyAddedManagers: AdminUser[];
  addManager: (name: string, email: string, pass: string) => Promise<boolean>;
  toggleBlockManagerStatus: (emailToToggle: string) => Promise<void>;
  updateManagerDetails: (originalEmail: string, newName: string, newEmail: string) => Promise<boolean>;
  deleteManager: (emailToDelete: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'askimAdminUser';
const DYNAMIC_MANAGERS_STORAGE_KEY = 'askimDynamicManagers';

const initialPredefinedUsers: Record<string, AdminUser> = {
  'admin@askimcandles.com': {
    id: 'admin001',
    email: 'admin@askimcandles.com',
    name: 'Store Administrator',
    role: 'ADMIN',
    password: 'adminpass',
    isPredefined: true,
    isBlocked: false,
  },
  'manager@askimcandles.com': {
    id: 'manager001',
    email: 'manager@askimcandles.com',
    name: 'Store Manager',
    role: 'MANAGER',
    password: 'managerpass',
    isPredefined: true,
    isBlocked: false,
  },
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [predefinedUsers] = useState<Record<string, AdminUser>>(initialPredefinedUsers);
  const [dynamicallyAddedManagers, setDynamicallyAddedManagers] = useState<AdminUser[]>([]);
  const [currentAdminLocale, setCurrentAdminLocale] = useState<AdminLocale>(i18nAdmin.defaultLocale);
  const [authStrings, setAuthStrings] = useState<AuthStrings>(defaultAuthStrings);

  useEffect(() => {
    const storedLocale = localStorage.getItem('admin-lang') as AdminLocale | null;
    const localeToLoad = storedLocale && i18nAdmin.locales.includes(storedLocale) ? storedLocale : i18nAdmin.defaultLocale;
    setCurrentAdminLocale(localeToLoad);

    async function loadTranslations() {
      try {
        const dict = await getAdminDictionary(localeToLoad);
        setAuthStrings({ 
          login: dict.adminLoginPage || defaultAuthStrings.login, 
          contextToasts: dict.adminContextToasts || defaultAuthStrings.contextToasts,
          usersPage: dict.adminUsersPage || defaultAuthStrings.usersPage
        });
      } catch (error) {
        console.error("Failed to load admin translations for context:", error);
        setAuthStrings(defaultAuthStrings); // Fallback to default English strings
      }
    }
    loadTranslations();

    const storedUser = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser: AdminUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email && parsedUser.role) {
           setCurrentAdminUser(parsedUser);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to parse admin user from localStorage", error);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    const storedDynamicManagersRaw = localStorage.getItem(DYNAMIC_MANAGERS_STORAGE_KEY);
    if (storedDynamicManagersRaw) {
        try {
            const parsedManagers: AdminUser[] = JSON.parse(storedDynamicManagersRaw);
            if (Array.isArray(parsedManagers)) {
                setDynamicallyAddedManagers(parsedManagers);
            }
        } catch (error) {
            console.error("Failed to parse dynamic managers from localStorage", error);
            localStorage.removeItem(DYNAMIC_MANAGERS_STORAGE_KEY);
        }
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial load effect

  useEffect(() => { // Effect for locale changes
    async function loadTranslationsOnLocaleChange() {
      try {
        const dict = await getAdminDictionary(currentAdminLocale);
         setAuthStrings({ 
          login: dict.adminLoginPage || defaultAuthStrings.login, 
          contextToasts: dict.adminContextToasts || defaultAuthStrings.contextToasts,
          usersPage: dict.adminUsersPage || defaultAuthStrings.usersPage
        });
      } catch (error) {
         console.error("Failed to load admin translations on locale change:", error);
         setAuthStrings(defaultAuthStrings);
      }
    }
    if (!isLoading) { 
      loadTranslationsOnLocaleChange();
    }
  }, [currentAdminLocale, isLoading]);


  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    
    if (!email || !pass) {
        toast({
            title: authStrings.login?.loginErrorTitle || "Admin Login Failed",
            description: authStrings.login?.loginErrorDescRequired || "Email and password are required.",
            variant: "destructive",
        });
        setIsLoading(false);
        return false;
    }

    await new Promise(resolve => setTimeout(resolve, 300)); 

    const lowerEmail = email.toLowerCase();
    let userToLogin = predefinedUsers[lowerEmail];

    if (!userToLogin) {
        const storedDynamicManagersRaw = localStorage.getItem(DYNAMIC_MANAGERS_STORAGE_KEY);
        let dynamicManagersForLogin: AdminUser[] = [];
        if (storedDynamicManagersRaw) {
            try {
                const parsed = JSON.parse(storedDynamicManagersRaw);
                if (Array.isArray(parsed)) {
                    dynamicManagersForLogin = parsed;
                }
            } catch (e) {
                console.error("Failed to parse dynamic managers during login:", e);
                // Potentially toast an error here if critical
            }
        }
        userToLogin = dynamicManagersForLogin.find(manager => manager.email.toLowerCase() === lowerEmail);
    }

    if (userToLogin && userToLogin.password === pass) {
      if (userToLogin.isBlocked) {
        logAdminAction(email, authStrings.login?.loginErrorDescBlockedStatus || "Admin Login Failed - Account blocked", { reason: "Account blocked" });
        toast({
          title: authStrings.login?.loginErrorTitle || "Admin Login Failed",
          description: authStrings.contextToasts?.accountBlockedErrorDesc || "This account is blocked. Please contact an administrator.",
          variant: "destructive",
          duration: 5000
        });
        setIsLoading(false);
        return false;
      }
      setCurrentAdminUser(userToLogin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userToLogin));
      logAdminAction(userToLogin.email, authStrings.login?.loginSuccessTitle || "Admin Login Success");
      toast({
        title: authStrings.login?.loginSuccessTitle || "Admin Login Successful",
        description: (authStrings.login?.loginWelcomeMessage || "Welcome, {name}!").replace('{name}', userToLogin.name || 'Admin')
      });
      setIsLoading(false);
      router.push('/admin/dashboard');
      return true;
    } else {
      logAdminAction(email, authStrings.login?.loginErrorDescInvalid || "Admin Login Failed - Invalid credentials", { reason: "Invalid credentials" });
      toast({
        title: authStrings.login?.loginErrorTitle || "Admin Login Failed",
        description: authStrings.login?.loginErrorDescInvalid || "Invalid email or password. Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000
      });
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    const userEmailForLog = currentAdminUser?.email || "Unknown user";
    logAdminAction(userEmailForLog, authStrings.contextToasts?.logoutSuccessTitle || "Admin Logout");
    
    setCurrentAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    toast({
        title: authStrings.contextToasts?.logoutSuccessTitle || "Logged Out",
        description: authStrings.contextToasts?.logoutSuccessDesc || "You have been successfully logged out from the admin panel."
    });
    router.push('/admin/login');
  };

  const addManager = async (name: string, email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase();
    // Check against both predefined and dynamically added managers
    const allCurrentEmails = [
        ...Object.keys(predefinedUsers).map(e => e.toLowerCase()),
        ...dynamicallyAddedManagers.map(m => m.email.toLowerCase())
    ];

    if (allCurrentEmails.includes(lowerEmail)) {
        toast({
          title: authStrings.contextToasts?.addManagerErrorEmailExistsTitle || "Failed to Add Manager",
          description: authStrings.contextToasts?.addManagerErrorEmailExistsDesc || "An account with this email address already exists. Please use a different email.",
          variant: "destructive",
          duration: 5000
        });
        if (currentAdminUser?.email) {
          logAdminAction(currentAdminUser.email, "Add Manager Failed", { managerEmail: email, reason: "Email exists" });
        }
        return false;
    }
    const newManager: AdminUser = {
        id: `manager-${Date.now()}`,
        name,
        email,
        password: pass, // In a real app, this would be hashed
        role: 'MANAGER',
        isBlocked: false,
        isPredefined: false,
    };
    const updatedManagers = [...dynamicallyAddedManagers, newManager];
    setDynamicallyAddedManagers(updatedManagers);
    localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));
    toast({
        title: authStrings.contextToasts?.addManagerSuccessTitle || "Manager Added (Simulated)",
        description: (authStrings.contextToasts?.addManagerSuccessDesc || "{name} ({email}) has been 'added' as a manager. This change is client-side (localStorage).")
                        .replace('{name}', name)
                        .replace('{email}', email),
    });
    if (currentAdminUser?.email) {
      logAdminAction(currentAdminUser.email, "Manager Added (Simulated)", { managerEmail: email, managerName: name });
    }
    return true;
  };

  const toggleBlockManagerStatus = async (emailToToggle: string): Promise<void> => {
    let toggledManager: AdminUser | undefined;
    const updatedManagers = dynamicallyAddedManagers.map(manager => {
        if (manager.email.toLowerCase() === emailToToggle.toLowerCase()) {
            toggledManager = { ...manager, isBlocked: !manager.isBlocked };
            return toggledManager;
        }
        return manager;
    }).filter(m => m !== undefined) as AdminUser[]; 

    setDynamicallyAddedManagers(updatedManagers);
    localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));

    if (toggledManager && currentAdminUser) {
        const actionMessage = toggledManager.isBlocked 
                                ? (authStrings.contextToasts?.managerBlockedToastTitle || "Manager Blocked") 
                                : (authStrings.contextToasts?.managerUnblockedToastTitle || "Manager Unblocked");
        logAdminAction(currentAdminUser.email, actionMessage + " (Simulated)", { managerEmail: toggledManager.email, managerName: toggledManager.name });
        toast({
            title: actionMessage,
            description: (authStrings.contextToasts?.managerStatusUpdatedToastDesc || "{name} status updated to {status}.")
                            .replace('{name}', toggledManager.name)
                            .replace('{status}', toggledManager.isBlocked 
                                                ? (authStrings.login?.loginErrorDescBlockedStatus || 'Blocked') 
                                                : (authStrings.login?.loginSuccessDescActiveStatus || 'Active')),
        });
    }
  };

  const updateManagerDetails = async (originalEmail: string, newName: string, newEmail: string): Promise<boolean> => {
    const lowerOriginalEmail = originalEmail.toLowerCase();
    const lowerNewEmail = newEmail.toLowerCase();
    
    if (lowerNewEmail !== lowerOriginalEmail && 
        (predefinedUsers[lowerNewEmail] || dynamicallyAddedManagers.some(m => m.email.toLowerCase() === lowerNewEmail && m.email.toLowerCase() !== lowerOriginalEmail))) {
      toast({
        title: authStrings.contextToasts?.addManagerErrorEmailExistsTitle || "Failed to Update Manager",
        description: authStrings.contextToasts?.addManagerErrorEmailExistsDesc || "An account with the new email address already exists.",
        variant: "destructive",
      });
      return false;
    }

    let managerUpdated = false;
    const updatedManagers = dynamicallyAddedManagers.map(manager => {
      if (manager.email.toLowerCase() === lowerOriginalEmail) {
        managerUpdated = true;
        return { ...manager, name: newName, email: newEmail };
      }
      return manager;
    });

    if (managerUpdated) {
      setDynamicallyAddedManagers(updatedManagers);
      localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));
      toast({
        title: authStrings.contextToasts?.managerDetailsUpdatedTitle || "Manager Updated (Simulated)",
        description: (authStrings.contextToasts?.managerDetailsUpdatedDesc || "Details for {name} have been updated locally.").replace('{name}', newName),
      });
       if (currentAdminUser?.email) {
        logAdminAction(currentAdminUser.email, "Manager Details Updated (Simulated)", { oldEmail: originalEmail, newEmail, newName });
      }
      return true;
    }
    return false; 
  };

  const deleteManager = async (emailToDelete: string): Promise<boolean> => {
    const lowerEmailToDelete = emailToDelete.toLowerCase();
    let managerFoundAndDeleted = false;
    let managerName = "Unknown";

    const updatedManagers = dynamicallyAddedManagers.filter(manager => {
      if (manager.email.toLowerCase() === lowerEmailToDelete) {
        managerName = manager.name;
        managerFoundAndDeleted = true;
        return false; // Exclude this manager
      }
      return true;
    });

    if (managerFoundAndDeleted) {
      setDynamicallyAddedManagers(updatedManagers);
      localStorage.setItem(DYNAMIC_MANAGERS_STORAGE_KEY, JSON.stringify(updatedManagers));
      toast({
        title: authStrings.contextToasts?.managerDeletedTitle || "Manager Deleted (Simulated)",
        description: (authStrings.contextToasts?.managerDeletedDesc || "{name} has been deleted locally.").replace('{name}', managerName),
      });
       if (currentAdminUser?.email) {
        logAdminAction(currentAdminUser.email, "Manager Deleted (Simulated)", { deletedManagerEmail: emailToDelete, deletedManagerName: managerName });
      }
      return true;
    }
    return false;
  };

  const role = currentAdminUser?.role || null;
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER' || role === 'ADMIN';

  return (
    <AdminAuthContext.Provider value={{
        currentAdminUser,
        login,
        logout,
        isLoading,
        isAdmin,
        isManager,
        role,
        predefinedUsers,
        dynamicallyAddedManagers,
        addManager,
        toggleBlockManagerStatus,
        updateManagerDetails,
        deleteManager
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

    