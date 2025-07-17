import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const MOCK_USERS = [
  { username: 'FULL_ADMIN_1', deptShort: 'ADMIN', deptLong: 'Admin', access: 'full' },
  { username: 'user1', deptShort: 'CSE', deptLong: 'Computer Science', access: 'limited' },
  { username: 'user2', deptShort: 'IT', deptLong: 'Information Technology', access: 'limited' },
];

export function CreateAccountForm({ users, setUsers }) {
  const [createForm, setCreateForm] = useState({ username: '', password: '', deptShort: '', deptLong: '', access: 'limited' });
  const [createMsg, setCreateMsg] = useState('');
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
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>Create New Account</Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" name="username" value={createForm.username} onChange={handleCreateChange} fullWidth size="small" />
          <TextField label="Password" name="password" type="password" value={createForm.password} onChange={handleCreateChange} fullWidth size="small" />
          <TextField label="Department Short (e.g. CSE)" name="deptShort" value={createForm.deptShort} onChange={handleCreateChange} fullWidth size="small" />
          <TextField label="Department Long (e.g. Computer Science)" name="deptLong" value={createForm.deptLong} onChange={handleCreateChange} fullWidth size="small" />
          <Select name="access" value={createForm.access} onChange={handleCreateChange} size="small" fullWidth>
            <MenuItem value="limited">Limited</MenuItem>
            <MenuItem value="full">Full (Admin)</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, mt: 1 }}>Create Account</Button>
          {createMsg && <Alert severity={createMsg.includes('success') ? 'success' : 'error'} sx={{ mt: 1 }}>{createMsg}</Alert>}
        </Box>
      </CardContent>
    </Card>
  );
}

export function CurrentUsersTable({ users }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>Current Users</Typography>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Access</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.username}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.deptLong} ({u.deptShort})</TableCell>
                <TableCell>{u.access === 'full' ? 'Admin' : 'Limited'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ChangePasswordForm({ users, setUsers }) {
  const [changeForm, setChangeForm] = useState({ username: '', newPassword: '' });
  const [changeMsg, setChangeMsg] = useState('');
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
    // Optionally update user password in setUsers here if needed
    setChangeMsg('Password changed successfully!');
    setChangeForm({ username: '', newPassword: '' });
  };
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>Change User Password</Typography>
        <Box component="form" onSubmit={handleChangePwd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Select name="username" value={changeForm.username} onChange={handleChangePwdChange} size="small" fullWidth displayEmpty>
            <MenuItem value="">Select User</MenuItem>
            {users.map(u => <MenuItem key={u.username} value={u.username}>{u.username}</MenuItem>)}
          </Select>
          <TextField label="New Password" name="newPassword" type="password" value={changeForm.newPassword} onChange={handleChangePwdChange} fullWidth size="small" />
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, mt: 1 }}>Change Password</Button>
          {changeMsg && <Alert severity={changeMsg.includes('success') ? 'success' : 'error'} sx={{ mt: 1 }}>{changeMsg}</Alert>}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AccountManagerPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [createForm, setCreateForm] = useState({ username: '', password: '', deptShort: '', deptLong: '', access: 'limited' });
  const [createMsg, setCreateMsg] = useState('');
  const [changeForm, setChangeForm] = useState({ username: '', newPassword: '' });
  const [changeMsg, setChangeMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    setMe({ username: 'FULL_ADMIN_1', access: 'full' });
  }, [navigate]);

  if (!me) return null;
  if (!(me.username === 'FULL_ADMIN_1' && me.access === 'full')) {
    return <Alert severity="error" sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>Access denied. Only FULL_ADMIN_1 can manage accounts.</Alert>;
  }

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
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      <Typography variant="h2" color="primary" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '1.3rem', md: '2rem' } }}>
        Account Management
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <CreateAccountForm users={users} setUsers={setUsers} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChangePasswordForm users={users} setUsers={setUsers} />
        </Grid>
      </Grid>
      <CurrentUsersTable users={users} />
    </Box>
  );
} 