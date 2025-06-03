import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const enviarLogin = async () => {
    try {
      const resp = await fetch('https://autocarenow.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        const erroBody = await resp.json().catch(() => null);
        const errorMessage =
          erroBody?.message || `Erro ${resp.status} no login.`;
        throw new Error(errorMessage);
      }

      const { token, user } = await resp.json();
      login(token);

      setMsg({ text: 'Login realizado com sucesso!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setMsg({ text: err.message || 'Falha inesperada', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      enviarLogin();
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Fazer Login</h1>

        <div className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            onKeyDown={handleKeyDown}
            className={styles.input}
          />
          <button
            type="button"
            onClick={enviarLogin}
            className={styles.button}
          >
            Acessar
          </button>
        </div>

        <p className={styles.smallText}>
          Não tem cadastro?{' '}
          <Link to="/register" className={styles.link}>
            Criar conta
          </Link>
        </p>

        {msg.text && (
          <p className={`${styles.message} ${styles[msg.type]}`}>
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
}

