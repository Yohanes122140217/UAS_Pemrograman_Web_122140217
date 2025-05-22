import React, { useState } from 'react';

export default function SignUp() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:6543/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch {
      setMessage('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label><br />
        <input name="username" value={form.username} onChange={handleChange} required /><br />
        <label>Email</label><br />
        <input name="email" type="email" value={form.email} onChange={handleChange} required /><br />
        <label>Password</label><br />
        <input name="password" type="password" value={form.password} onChange={handleChange} required /><br /><br />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
