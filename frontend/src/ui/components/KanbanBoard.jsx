import React from 'react';
import styles from './styles/KanbanBoard.module.css';

export default function KanbanBoard({ columns }) {
  return (
    <div className={styles.board}>
      {columns.map(col => (
        <div
          key={col.id}
          className={styles.column}
          style={{ '--accent': col.color }}
        >
          <header className={styles.header}>
            <h2>{col.title}</h2>
            <span className={styles.count}>
              {col.cards.length} {col.cards.length === 1 ? 'registro' : 'registros'}
            </span>
          </header>

          <div className={styles.cards}>
            {col.cards.map(card => (
              <div key={card.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                <p className={styles.cardDetails}>{card.details}</p>
                <div className={styles.cardInfo}>
                  <small>Criado: {card.createdAt}</small>
                  <small>Atualizado: {card.updatedAt}</small>
                </div>
              </div>
            ))}
          </div>

          {col.footer && (
            <footer className={styles.footer}>
              <button onClick={col.footer.onClick}>{col.footer.label}</button>
            </footer>
          )}
        </div>
      ))}
    </div>
  );
}
