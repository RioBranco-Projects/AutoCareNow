
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const enviarRegistro = async () => {
    try {
      const resp = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        const erroBody = await resp.json().catch(() => null);
        const errorMessage =
          erroBody?.message || `Erro ${resp.status} no registro.`;
        throw new Error(errorMessage);
      }

      setMsg({ text: 'Registro realizado com sucesso!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMsg({ text: err.message || 'Falha inesperada', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      enviarRegistro();
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar Conta</h1>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={styles.input}
          />
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
            onClick={enviarRegistro}
            className={styles.button}
          >
            Registrar
          </button>
        </div>

        <p className={styles.smallText}>
          Já tem conta?{' '}
          <Link to="/" className={styles.link}>
            Fazer Login
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

