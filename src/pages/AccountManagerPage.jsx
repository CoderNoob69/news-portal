import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountManagerPage.css';

const MOCK_USERS = [
  { username: 'FULL_ADMIN_1', deptShort: 'ADMIN', deptLong: 'Admin', access: 'full' },
  { username: 'user1', deptShort: 'CSE', deptLong: 'Computer Science', access: 'limited' },
  { username: 'user2', deptShort: 'IT', deptLong: 'Information Technology', access: 'limited' },
];

export default function AccountManagerPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [createForm, setCreateForm] = useState({ username: '', password: '', deptShort: '', deptLong: '', access: 'limited' });
  const [createMsg, setCreateMsg] = useState('');
  const [changeForm, setChangeForm] = useState({ username: '', newPassword: '' });
  const [changeMsg, setChangeMsg] = useState('');

  // Simulate fetching current user info (replace with real API call)
  useEffect(() => {
    // In real app, fetch from /api/data/user
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    // Simulate admin user
    setMe({ username: 'FULL_ADMIN_1', access: 'full' });
  }, [navigate]);

  // Only allow FULL_ADMIN_1 with full access
  if (!me) return null;
  if (!(me.username === 'FULL_ADMIN_1' && me.access === 'full')) {
    return <div className="account-manager-access-denied">Access denied. Only FULL_ADMIN_1 can manage accounts.</div>;
  }

  // Handlers for create account
  const handleCreateChange = e => {
    setCreateForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setCreateMsg('');
  };
  const handleCreate = e => {
    e.preventDefault();
    setCreateMsg('');
    if (!createForm.username || !createForm.password || !createForm.deptShort || !createForm.deptLong) {
      setCreateMsg('All fields are required.');
      return;
    }
    if (users.some(u => u.username === createForm.username)) {
      setCreateMsg('Username already exists.');
      return;
    }
    setUsers(us => [...us, { ...createForm }]);
    setCreateMsg('Account created successfully!');
    setCreateForm({ username: '', password: '', deptShort: '', deptLong: '', access: 'limited' });
  };

  // Handlers for change password
  const handleChangePwdChange = e => {
    setChangeForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setChangeMsg('');
  };
  const handleChangePwd = e => {
    e.preventDefault();
    setChangeMsg('');
    if (!changeForm.username || !changeForm.newPassword) {
      setChangeMsg('Select user and enter new password.');
      return;
    }
    if (!users.some(u => u.username === changeForm.username)) {
      setChangeMsg('User not found.');
      return;
    }
    setChangeMsg('Password changed successfully!');
    setChangeForm({ username: '', newPassword: '' });
  };

  return (
    <div className="account-manager-container">
      <h2 className="account-manager-title">Account Management</h2>
      <div className="account-manager-cards">
        {/* Create Account */}
        <form onSubmit={handleCreate} className="account-manager-form">
          <h3 className="account-manager-form-title">Create New Account</h3>
          <div className="account-manager-form-fields">
            <input name="username" placeholder="Username" value={createForm.username} onChange={handleCreateChange} className="account-manager-input" />
            <input name="password" type="password" placeholder="Password" value={createForm.password} onChange={handleCreateChange} className="account-manager-input" />
            <input name="deptShort" placeholder="Department Short (e.g. CSE)" value={createForm.deptShort} onChange={handleCreateChange} className="account-manager-input" />
            <input name="deptLong" placeholder="Department Long (e.g. Computer Science)" value={createForm.deptLong} onChange={handleCreateChange} className="account-manager-input" />
            <select name="access" value={createForm.access} onChange={handleCreateChange} className="account-manager-input">
              <option value="limited">Limited</option>
              <option value="full">Full (Admin)</option>
            </select>
            <button type="submit" className="account-manager-btn">Create Account</button>
            {createMsg && <div className={createMsg.includes('success') ? 'account-manager-msg-success' : 'account-manager-msg-error'}>{createMsg}</div>}
          </div>
        </form>
        {/* Change Password */}
        <form onSubmit={handleChangePwd} className="account-manager-form">
          <h3 className="account-manager-form-title">Change User Password</h3>
          <div className="account-manager-form-fields">
            <select name="username" value={changeForm.username} onChange={handleChangePwdChange} className="account-manager-input">
              <option value="">Select User</option>
              {users.map(u => <option key={u.username} value={u.username}>{u.username}</option>)}
            </select>
            <input name="newPassword" type="password" placeholder="New Password" value={changeForm.newPassword} onChange={handleChangePwdChange} className="account-manager-input" />
            <button type="submit" className="account-manager-btn">Change Password</button>
            {changeMsg && <div className={changeMsg.includes('success') ? 'account-manager-msg-success' : 'account-manager-msg-error'}>{changeMsg}</div>}
          </div>
        </form>
      </div>
      {/* User List Table */}
      <div className="account-manager-userlist-section">
        <h3 className="account-manager-form-title">Current Users</h3>
        <div className="account-manager-userlist-wrapper">
          <table className="account-manager-userlist">
            <thead>
              <tr>
                <th>Username</th>
                <th>Department</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.username}>
                  <td>{u.username}</td>
                  <td>{u.deptLong} ({u.deptShort})</td>
                  <td>{u.access === 'full' ? 'Admin' : 'Limited'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 