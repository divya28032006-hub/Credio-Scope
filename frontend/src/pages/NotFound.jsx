import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
    <h1 className="font-display fw-bold gradient-text display-4 mb-2">404</h1>
    <p className="text-muted mb-4">This page doesn't exist.</p>
    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
  </div>
);

export default NotFound;