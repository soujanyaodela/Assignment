import { useData } from '../context/DataContext';
import '../styles/UserSelector.css';

export const UserSelector = () => {
  const { users, selectedUser, setSelectedUser } = useData();

  console.log('UserSelector Rendered');
  console.log('Users:', users);
  console.log('Selected User:', selectedUser);

  return (
    <div className="user-selector">
      <select 
        value={selectedUser} 
        onChange={(e) => {
          console.log('User selected:', e.target.value);
          setSelectedUser(e.target.value);
        }}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.userId} value={user.userName}>
            {user.userName}
          </option>
        ))}
      </select>
    </div>
  );
};
