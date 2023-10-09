import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { pushUserDataToDataLayer } from '@/utils/analytics';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ nickname, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();

        // Store the user object in local storage
        localStorage.setItem('userData', JSON.stringify(user));

        // Push user data to dataLayer
        pushUserDataToDataLayer(user.username, user.id)

        // Redirect the user to the dashboard page
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError('Login failed: Invalid credentials');
        console.error('Login failed:', errorData.error);
      }
    } catch (error: any) {
      setError('Login failed: An error occurred');
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>} {}
    </div>
  );
};

export default Login;
