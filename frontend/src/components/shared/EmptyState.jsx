const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="text-center py-5 text-muted">
    {Icon && <Icon size={36} className="mb-3 opacity-50" />}
    <div className="fw-semibold">{title}</div>
    {message && <div className="small">{message}</div>}
  </div>
);

export default EmptyState;