import { useAuth } from '../hooks/useAuth';
import ProfileCard from '../components/profile/ProfileCard';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="font-display fw-semibold mb-4">Profile</h2>
      <div style={{ maxWidth: '480px' }}>
        <ProfileCard user={user} />
      </div>
    </div>
  );
};

export default Profile;