import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './RegisterPage.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const enviarCadastro = async () => {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      throw new Error('Erro ao cadastrar usuário');
    }
    const data = await response.json();
    console.log("Cadastro realizado com sucesso:", data);
    navigate('/');
  };
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar conta</h1>

        <form className={styles.form}>
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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.input}
          />

          <button onClick={enviarCadastro} className={styles.button}>
            Cadastrar
          </button>
        </form>

        <p className={styles.smallText}>
          Já possui conta?{' '}
          <Link to="/" className={styles.link}>
            Fazer login
          </Link>
        </p>
      </div>
    </section>
  );
}

