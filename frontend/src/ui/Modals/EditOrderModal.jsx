import React, { useState, useEffect } from 'react';
import styles from './OrderModal.module.css';

const statusOptions = [
  { value: 'pending',     label: 'Pendente' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed',   label: 'Concluído' },
  { value: 'delivered',   label: 'Entregue' },
  { value: 'cancelled',   label: 'Cancelado' },
];

export default function EditOrderModal({ isOpen, initialData, onClose, onSave }) {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (isOpen && initialData) {
      setStatus(initialData.status || 'pending');
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    onSave({ _id: initialData._id, status });
  };

  if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Editar Status da Ordem</h2>
        <label>
          Status:
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.createBtn}>
            Salvar
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

