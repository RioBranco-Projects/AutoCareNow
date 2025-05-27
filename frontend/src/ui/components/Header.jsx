import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';
import styles from './styles/Header.module.css';
import {Links} from 'react-router-dom'
export default function Header({
  logoSrc,
  navLinks = [],
  onLogout,
  onSettings,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src={logoSrc} alt="Logo" />
        </div>
      </div>
      <nav className={styles.nav}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} className={styles.navLink}>
            {label}
          </Link>
        ))}
      </nav>
      <div className={styles.profile} ref={dropdownRef}>
        <img src={logoSrc} alt="Profile" className={styles.avatar} />
        <IoMdArrowDropdown
          size={20}
          className={styles.dropdownIcon}
          onClick={() => setOpen(o => !o)}
        />
        {open && (
          <div className={styles.dropdown}>
            <button onClick={onSettings} className={styles.dropdownItem}>
              Configurações
            </button>
            <Link to="/">
              <button onClick={onLogout} className={styles.dropdownItem}>
                Sair 
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
