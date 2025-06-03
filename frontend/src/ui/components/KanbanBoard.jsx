
import React from 'react';
import styles from './styles/KanbanBoard.module.css';

export default function KanbanBoard({ columns, onDeleteCard, onEditCard }) {
  return (
    <div className={styles.board}>
      {columns.map((col) => (
        <div key={col.id} className={styles.column}>
          <header
            className={styles.header}
            style={{ backgroundColor: col.color || 'transparent' }}
          >
            <h2 className={styles.columnTitle}>{col.title}</h2>
            <span className={styles.count}>
              {col.cards.length}{' '}
              {col.cards.length === 1 ? 'registro' : 'registros'}
            </span>
          </header>

          <div className={styles.cards}>
            {col.cards.map((card) => (
              <div key={card.id} className={styles.card}>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDetails}>{card.details}</p>
                <div className={styles.cardInfo}>
                  <small>Criado: {card.createdAt}</small>
                  <small>Atualizado: {card.updatedAt}</small>
                </div>
                <p className={styles.cardStatus}>
                  Status: <span className={styles.statusLabel}>{card.status}</span>
                </p>


                {/* Exibição do status atual */}
                <div className={styles.cardActions}>
                  {onEditCard && (
                    <button
                      className={styles.editButton}
                      onClick={() => onEditCard(card.id)}
                    >
                      Editar
                    </button>
                  )}
                  {onDeleteCard && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDeleteCard(card.id)}
                    >
                      Deletar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {col.footer && (
            <footer className={styles.footer}>
              <button className={styles.addButton} onClick={col.footer.onClick}>
                {col.footer.label}
              </button>
            </footer>
          )}
        </div>
      ))}
    </div>
  );
}
