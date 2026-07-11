import { motion } from 'framer-motion';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      style={{ minHeight: '100vh' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-card p-4 p-md-5 w-100"
        style={{ maxWidth: '440px' }}
      >
        <div className="text-center mb-4">
          <span className="font-display fw-bold fs-3 gradient-text d-block mb-1">
            CrediScope
          </span>
          <h1 className="fs-5 fw-semibold mb-1">{title}</h1>
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;