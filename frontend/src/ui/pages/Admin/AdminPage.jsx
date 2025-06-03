import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../../utils/apiFetch.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './AdminPage.module.css'; 

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      const res = await apiFetch(
        'http://localhost:3000/users',
        {},
        () => {
          logout();
          navigate('/', { replace: true });
        }
      );

      if (res.status === 401) {
        return;
      }

      if (res.status === 403) {
        setError('Acesso negado. Somente funcionários podem ver esta página.');
        return;
      }

      if (!res.ok) {
        setError('Erro ao buscar usuários.');
        console.error(await res.text());
        return;
      }

      const data = await res.json();
      setUsers(data);
    })();
  }, [token, logout, navigate]);

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Administração de Usuários</h2>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Administração de Usuários</h2>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

