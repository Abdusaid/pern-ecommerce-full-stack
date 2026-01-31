import { useResolvedPath } from 'react-router-dom'
import { ChartNoAxesCombined, XIcon, UserIcon, PaletteIcon, GraduationCap } from 'lucide-react'
import ThemeSelector from './ThemeSelector';
import { useStudentStore } from '../store/useStudentStore';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';

function DrawerSidebar() {
  const {pathname} = useResolvedPath();
  const isHomePage = pathname === "/";
  const {students} = useStudentStore();
  const { user } = useUser();
  const themeSelectorRef = useRef(null);
  const drawerCheckboxRef = useRef(null);

  // Collapse theme selector when drawer closes or opens
  useEffect(() => {
    const checkbox = document.getElementById('settings-drawer');
    if (!checkbox) return;

    const handleDrawerChange = () => {
      // Collapse theme selector whenever drawer state changes (opens or closes)
      if (themeSelectorRef.current?.collapseThemeSelector) {
        themeSelectorRef.current.collapseThemeSelector();
      }
    };

    checkbox.addEventListener('change', handleDrawerChange);
    return () => checkbox.removeEventListener('change', handleDrawerChange);
  }, []);

  return (
    <div className="drawer-side z-50">
      <label htmlFor="settings-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

      <div className="h-full w-80 bg-base-100 text-base-content flex flex-col">
        {/* Fixed Drawer Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-content">Menu</h2>
            <label htmlFor="settings-drawer" className="btn btn-sm btn-circle btn-ghost text-primary-content">
              <XIcon className="size-5" />
            </label>
          </div>
        </div>

        {/* Scrollable Content (only this section scrolls) */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* User Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                <UserIcon className="size-4" />
                Account
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <SignedOut>
                  <div className="text-center space-y-3">
                    <p className="text-sm text-base-content/70">Sign in to manage students</p>
                    <SignInButton mode="modal">
                      <button className="btn btn-primary btn-block gap-2">
                        <UserIcon className="size-4" />
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-xl">{user?.firstName?.[0] || user?.username?.[0] || 'U'}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user?.fullName || user?.username || 'User'}</p>
                        <p className="text-sm text-base-content/70 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <div className="flex justify-center pt-2">
                      <UserButton afterSignOutUrl="/" appearance={{
                        elements: {
                          userButtonBox: "scale-110"
                        }
                      }} />
                    </div>
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Theme Section - Only show for authenticated users */}
            <SignedIn>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                  <PaletteIcon className="size-4" />
                  Appearance
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <ThemeSelector ref={themeSelectorRef} />
                </div>
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Fixed Statistics Section at Bottom */}
        {isHomePage && (
          <div className="flex-shrink-0 border-t border-base-300 p-6 bg-base-200/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                <ChartNoAxesCombined className="size-4" />
                Statistics
              </div>

              <div className="stats shadow w-full bg-base-100">
                <div className="stat p-4">
                  <div className="stat-figure text-primary">
                    <GraduationCap className="size-8" />
                  </div>
                  <div className="stat-title text-xs">Total Students</div>
                  <div className="stat-value text-2xl text-primary">{students?.length || 0}</div>
                  <div className="stat-desc text-xs">Alumni database</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer */}
        <div className="p-6 border-t border-base-300 flex-shrink-0">
          <div className="text-center text-sm text-base-content/50">
            <p>Alumni Students Manager</p>
            <p className="text-xs mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawerSidebar
