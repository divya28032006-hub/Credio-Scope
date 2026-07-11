import { useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Container, Dropdown, Button } from 'react-bootstrap';
import { RiMoonLine, RiSunLine, RiMenuLine, RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <BsNavbar className="glass-nav sticky-top px-3 py-2" style={{ zIndex: 1030 }}>
      <Container fluid className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="link"
            className="d-lg-none text-body p-1"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <RiMenuLine size={22} />
          </Button>
          <span className="font-display fw-bold fs-5 gradient-text d-lg-none">CrediScope</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Button variant="link" className="text-body p-1" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"
              role="button"
              className="d-flex align-items-center justify-content-center rounded-circle gradient-pill fw-bold"
              style={{ width: 38, height: 38, cursor: 'pointer' }}
            >
              {initial}
            </Dropdown.Toggle>
            <Dropdown.Menu className="glass-card border-0 mt-2">
              <div className="px-3 py-2">
                <div className="fw-semibold">{user?.name}</div>
                <div className="small text-muted">{user?.email}</div>
              </div>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <RiUser3Line className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <RiSettings4Line className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <RiLogoutBoxRLine className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;