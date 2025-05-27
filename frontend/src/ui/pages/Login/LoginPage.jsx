import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './LoginPage.module.css';

export default function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [msg, setMsg]     = useState({ text: '', type: '' }); // ← texto + tipo
  const navigate = useNavigate();

  const enviarLogin = async () => {
    try {
      const resp = await fetch('http://localhost:3000/users/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form),
      });

      if (!resp.ok) throw new Error('Email ou senha inválidos');

      await resp.json(); // se precisar guardar token, faça aqui

      setMsg({ text: 'Login realizado com sucesso!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setMsg({ text: err.message || 'Falha inesperada', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
    }
  };

  const handleKeyDown = (e) => e.key === 'Enter' && enviarLogin();

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

        {msg.text && (
        <p className={`${styles.message} ${styles[msg.type]}`}>
          {msg.text}
        </p>
      )}
      </div>
    </section>
  );
}

