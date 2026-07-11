import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        <main className="flex-grow-1 p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;