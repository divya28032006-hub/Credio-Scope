import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;