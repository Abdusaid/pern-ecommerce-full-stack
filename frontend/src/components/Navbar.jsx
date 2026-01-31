import { Link } from 'react-router-dom'
import { GraduationCap, MenuIcon } from 'lucide-react'

function Navbar() {
  return (
    <div className='bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='navbar px-4 min-h-[4rem] justify-between'>
          {/*LOGO */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  Alumni Students
                </span>
              </div>
            </Link>
          </div>

          {/*RIGHT SECTION */}
          <div className="flex items-center gap-4">
            {/* Drawer Toggle Button */}
            <label htmlFor="settings-drawer" className="btn btn-ghost btn-circle drawer-button">
              <MenuIcon className="size-5" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar