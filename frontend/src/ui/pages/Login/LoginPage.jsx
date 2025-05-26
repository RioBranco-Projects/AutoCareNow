import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './LoginPage.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigatee = useNavigate();
  const enviarLogin = async () => {
    try {
      const resp = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!resp.ok) throw new Error('Erro ao fazer login');

      const data = await resp.json();     // --> dados do backend
      console.log(data);

      setMessage('Login realizado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      navigatee('/home');
    } catch (err) {
      setMessage(err.message || 'Falha inesperada');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') enviarLogin();
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>

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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />

          <button type="button" onClick={enviarLogin} className={styles.button}>
            Acessar
          </button>
        </div>

        <p className={styles.smallText}>
          Não tem cadastro?{' '}
          <Link to="/register" className={styles.link}>
            Criar conta
          </Link>
        </p>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </section>
  );
}

