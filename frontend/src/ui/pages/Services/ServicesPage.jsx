import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServicesPage.module.css';
import Header from '../../components/Header';
import KanbanBoard from '../../components/KanbanBoard';
import CreateOrderModal from '../../Modals/CreateOrderModal';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('pending');
  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    (async () => {
      const res = await fetch('http://localhost:3000/orders', { headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      setServices(data);
    })();
  }, []);

  // Create order handler
  const handleCreate = async (orderData) => {
    await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    setShowModal(false);
    const res = await fetch('http://localhost:3000/orders', { headers: { 'Content-Type': 'application/json' } });
    setServices(await res.json());
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };
  const handleSettings = () => { navigate('/settings'); };
  const navLinks = [
    { to: '/services', label: 'Serviços' },
    { to: '/profile',  label: 'Clientes' },
  ];

  // Define columns and open modal with correct status
  const statusKeys = ['pending', 'in_progress', 'completed', 'delivered'];
  const titles = { pending: 'Pendente', in_progress: 'Em Progresso', completed: 'Concluído', delivered: 'Entregue' };
  const colors = { pending: '#80cbc4', in_progress: '#b2dfdb', completed: '#c8e6c9', delivered: '#b3e5fc' };

  const columns = statusKeys.map(key => ({
    id: key,
    title: titles[key],
    color: colors[key],
    footer: { label: '+ Nova', onClick: () => { setModalStatus(key); setShowModal(true); } },
    cards: services
      .filter(s => s.status === key)
      .map(s => ({
        id:        s._id,
        title:     s.services,
        subtitle:  `Cliente: ${s.customerName}`,
        details:   `Veículo: ${s.vehicle}`,
        createdAt: new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).format(new Date(s.createdAt)),
        updatedAt: new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }).format(new Date(s.updatedAt)),
      })),
  }));

  return (
    <div className={styles.container}>
      <Header
        logoSrc="/public/image/logobranca.jpeg"
        navLinks={navLinks}
        onLogout={handleLogout}
        onSettings={handleSettings}
      />
      <div className={styles.toolbar}>
        <input type="text" placeholder="Procure por uma ordem" className={styles.search} />
        <a href="#" className={styles.showAll}>Remover filtro</a>
      </div>
      <div className={styles.boardWrapper}>
        <KanbanBoard columns={columns} />
      </div>
      <CreateOrderModal
        isOpen={showModal}
        status={modalStatus}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
