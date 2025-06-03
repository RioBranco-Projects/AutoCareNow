import React, { useState, useEffect } from 'react';
import styles from './OrderModal.module.css';

export default function CreateOrderModal({ isOpen, status, onClose, onCreate }) {
  const [customerName, setCustomerName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [servicesInput, setServicesInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setVehicle('');
      setServicesInput('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const orderData = {
      customerName,
      vehicle,
      services: servicesInput.split(',').map(s => s.trim()).filter(s => s),
      status,
    };
    onCreate(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Nova Ordem ({status.replace('_', ' ')})</h2>
        <label>
          Cliente:
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />
        </label>
        <label>
          Veículo:
          <input
            type="text"
            value={vehicle}
            onChange={e => setVehicle(e.target.value)}
          />
        </label>
        <label>
          Serviços (vírgula):
          <input
            type="text"
            value={servicesInput}
            onChange={e => setServicesInput(e.target.value)}
          />
        </label>
        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.createBtn}>Criar</button>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

