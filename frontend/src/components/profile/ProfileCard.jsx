import { Card } from 'react-bootstrap';

const ProfileCard = ({ user }) => (
  <Card className="glass-card border-0 p-4">
    <div className="d-flex align-items-center gap-3 mb-4">
      <div
        className="rounded-circle gradient-pill fw-bold d-flex align-items-center justify-content-center"
        style={{ width: 64, height: 64, fontSize: '1.5rem' }}
      >
        {user?.name?.charAt(0)?.toUpperCase()}
      </div>
      <div>
        <div className="fs-5 fw-semibold">{user?.name}</div>
        <div className="text-muted small">{user?.email}</div>
      </div>
    </div>

    <div className="d-flex justify-content-between border-top pt-3 mb-2">
      <span className="text-muted small">Current streak</span>
      <span className="fw-semibold font-tabular">{user?.streak?.current || 0} days</span>
    </div>
    <div className="d-flex justify-content-between mb-2">
      <span className="text-muted small">Longest streak</span>
      <span className="fw-semibold font-tabular">{user?.streak?.longest || 0} days</span>
    </div>
    <div className="d-flex justify-content-between">
      <span className="text-muted small">Reminder time</span>
      <span className="fw-semibold">{user?.reminderTime || '—'}</span>
    </div>
  </Card>
);

export default ProfileCard;