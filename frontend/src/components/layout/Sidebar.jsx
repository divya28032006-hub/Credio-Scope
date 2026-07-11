import { NavLink } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import {
  RiDashboardLine,
  RiExchangeLine,
  RiPieChartLine,
  RiBarChartBoxLine,
  RiUser3Line,
  RiSettings4Line
} from 'react-icons/ri';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { to: '/transactions', label: 'Transactions', icon: RiExchangeLine },
  { to: '/budgets', label: 'Budgets', icon: RiPieChartLine },
  { to: '/analytics', label: 'Analytics', icon: RiBarChartBoxLine },
  { to: '/profile', label: 'Profile', icon: RiUser3Line },
  { to: '/settings', label: 'Settings', icon: RiSettings4Line }
];

const SidebarLinks = ({ onNavigate }) => (
  <nav className="d-flex flex-column gap-1 p-3">
    {navItems.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-semibold ${
            isActive ? 'gradient-pill text-white' : 'text-body'
          }`
        }
      >
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

const Sidebar = ({ show, onHide }) => {
  return (
    <>
      <aside
        className="glass-nav d-none d-lg-flex flex-column"
        style={{ width: '240px', minHeight: '100vh', position: 'sticky', top: 0 }}
      >
        <div className="px-4 py-4">
          <span className="font-display fw-bold fs-4 gradient-text">CrediScope</span>
        </div>
        <SidebarLinks />
      </aside>

      <Offcanvas show={show} onHide={onHide} className="glass-nav d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="font-display fw-bold gradient-text">
            CrediScope
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <SidebarLinks onNavigate={onHide} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;