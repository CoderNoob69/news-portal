// src/pages/AccountManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

/* ------------------------------------------------------------------
 * API endpoints
 * ------------------------------------------------------------------ */
const API_ACCOUNT = 'http://localhost:4000/api/account';    // GET(list) + POST(create)
const API_ME      = 'http://localhost:4000/api/data/user';  // current logged-in user

/* ==================================================================
 * CreateAccountForm
 * ================================================================== */
export function CreateAccountForm({ users, setUsers }) {
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    deptShort: '',
    deptLong: '',
    access: 'limited', // UI only; server forces limited
  });
  const [createMsg, setCreateMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateChange = e => {
    setCreateForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setCreateMsg('');
  };

  const handleCreate = async e => {
    e.preventDefault();
    setCreateMsg('');

    const { username, password, deptShort, deptLong } = createForm;
    if (!username || !password || !deptShort || !deptLong) {
      setCreateMsg('All fields are required.');
      return;
    }
    if (users.some(u => u.username === username)) {
      setCreateMsg('Username already exists.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        API_ACCOUNT,
        { username, password, deptShort, deptLong },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Instead of optimistic add (which caused stale / malformed state),
      // simply reload so we re-fetch the fresh list from backend.
      setCreateMsg('success: Account created successfully!');
      window.location.reload(); // reload entire app shell & refetch data
      return;
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error creating account.';
      setCreateMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* NOTE: Form labels trimmed (no extra suggestion text) per request. */
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>
          Create New Account
        </Typography>
        <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            name="username"
            value={createForm.username}
            onChange={handleCreateChange}
            fullWidth
            size="small"
            autoComplete="off"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={createForm.password}
            onChange={handleCreateChange}
            fullWidth
            size="small"
            autoComplete="new-password"
          />
          <TextField
            label="Department Short"
            name="deptShort"
            value={createForm.deptShort}
            onChange={handleCreateChange}
            fullWidth
            size="small"
            autoComplete="off"
          />
          <TextField
            label="Department Long"
            name="deptLong"
            value={createForm.deptLong}
            onChange={handleCreateChange}
            fullWidth
            size="small"
            autoComplete="off"
          />
          {/* Access select kept for UI parity. Backend always forces limited. */}
          <Select
            name="access"
            value={createForm.access}
            onChange={handleCreateChange}
            size="small"
            fullWidth
          >
            <MenuItem value="limited">Limited</MenuItem>
            <MenuItem value="full">Full (Admin)</MenuItem>
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, borderRadius: 2, mt: 1 }}
            disabled={submitting}
          >
            Create Account
          </Button>
          {createMsg && (
            <Alert
              severity={createMsg.startsWith('success') ? 'success' : 'error'}
              sx={{ mt: 1 }}
            >
              {createMsg.replace(/^success:\s*/, '')}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

/* ==================================================================
 * CurrentUsersTable (includes delete action for limited accounts)
 * ================================================================== */
export function CurrentUsersTable({ users, onDelete }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>
          Current Users
        </Typography>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Access</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id || u._id || u.username}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.deptLong} ({u.deptShort})</TableCell>
                <TableCell>{u.access === 'full' ? 'Admin' : 'Limited'}</TableCell>
                <TableCell align="center">
                  {u.access !== 'full' && (
                    <IconButton
                      aria-label={`Delete ${u.username}`}
                      size="small"
                      color="error"
                      onClick={() => onDelete?.(u)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ==================================================================
 * ChangePasswordForm
 * ================================================================== */
export function ChangePasswordForm({ users, onChangePassword }) {
  const [changeForm, setChangeForm] = useState({ username: '', newPassword: '' });
  const [changeMsg, setChangeMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChangePwdChange = e => {
    setChangeForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setChangeMsg('');
  };

  const handleChangePwd = async e => {
    e.preventDefault();
    setChangeMsg('');

    if (!changeForm.username || !changeForm.newPassword) {
      setChangeMsg('Select user and enter new password.');
      return;
    }
    const user = users.find(u => u.username === changeForm.username);
    if (!user) {
      setChangeMsg('User not found.');
      return;
    }

    setSubmitting(true);
    try {
      await onChangePassword?.(user, changeForm.newPassword);
      setChangeMsg('success: Password changed successfully!');
      setChangeForm({ username: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error changing password.';
      setChangeMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary.dark" sx={{ mb: 2, fontWeight: 700 }}>
          Change User Password
        </Typography>
        <Box component="form" onSubmit={handleChangePwd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Select
            name="username"
            value={changeForm.username}
            onChange={handleChangePwdChange}
            size="small"
            fullWidth
            displayEmpty
          >
            <MenuItem value="">Select User</MenuItem>
            {users.map(u => (
              <MenuItem key={u.id || u._id || u.username} value={u.username}>
                {u.username}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={changeForm.newPassword}
            onChange={handleChangePwdChange}
            fullWidth
            size="small"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700, borderRadius: 2, mt: 1 }}
            disabled={submitting}
          >
            Change Password
          </Button>
          {changeMsg && (
            <Alert
              severity={changeMsg.startsWith('success') ? 'success' : 'error'}
              sx={{ mt: 1 }}
            >
              {changeMsg.replace(/^success:\s*/, '')}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

/* ==================================================================
 * Main AccountManagerPage container
 * ================================================================== */
export default function AccountManagerPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);        // real data
  const [loadErr, setLoadErr] = useState('');

  /* fetch current user + all users ------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(API_ME,      { headers }),
      axios.get(API_ACCOUNT, { headers }),
    ])
      .then(([meRes, usersRes]) => {
        setMe(meRes.data);
        // normalize ids
        const arr = Array.isArray(usersRes.data)
          ? usersRes.data.map(u => ({
              id: u.id || u._id,
              username: u.username,
              deptShort: u.deptShort,
              deptLong: u.deptLong,
              access: u.access,
            }))
          : [];
        setUsers(arr);
      })
      .catch(err => {
        console.error(err);
        setLoadErr(err?.response?.data?.message || 'Error loading users.');
      });
  }, [navigate]);

  const isAdmin = me?.access === 'full';

  /* delete user ------------------------------------------------------ */
  const handleDelete = async user => {
    if (!window.confirm(`Delete user "${user.username}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_ACCOUNT}/${user.id || user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(us => us.filter(u => (u.id || u._id) !== (user.id || user._id)));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  /* change password -------------------------------------------------- */
  const handleChangePassword = async (user, newPassword) => {
    const token = localStorage.getItem('token');
    await axios.patch(
      `${API_ACCOUNT}/${user.id || user._id}/password`,
      { password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // nothing to update locally
  };

  /* ------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------ */
  if (!me) return null;  // still loading
  if (!isAdmin) {
    return (
      <Alert severity="error" sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
        Access denied. Only admins can manage accounts.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 1, md: 3 } }}>
      <Typography
        variant="h2"
        color="primary"
        sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '1.3rem', md: '2rem' } }}
      >
        Account Management
      </Typography>

      {loadErr && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadErr}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <CreateAccountForm users={users} setUsers={setUsers} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChangePasswordForm users={users} onChangePassword={handleChangePassword} />
        </Grid>
      </Grid>

      <CurrentUsersTable users={users} onDelete={handleDelete} />
    </Box>
  );
}
