import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './LoginPage.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const enviarLogin = async () => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log(data);

  }
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Entrar</h1>

        <form className={styles.form}>
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
            className={styles.input}
          />

          <button type="submit" onClick={enviarLogin} className={styles.button}>
            Acessar
          </button>
        </form>

        <p className={styles.smallText}>
          Não tem cadastro?{' '}
          <Link to="/register" className={styles.link}>
            Criar conta
          </Link>
        </p>
      </div>
    </section>
  );
}

