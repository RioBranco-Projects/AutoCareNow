import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ServicesPage.module.css';
import KanbanBoard from '../../components/KanbanBoard';
import Header from '../../components/Header';
// brevemente vou usar react-beautiful-dnd para fazer o drag and drop do kanban
export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('http://localhost:3000/orders', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Erro ao carregar serviços');
        const data = await response.json();
        setServices(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      }
    }
    fetchServices();
  }, []);
  const columns = [
    { id: 'pending',   title: 'Pendente',     color: '#80cbc4', footer: { label: '+ Nova',   onClick: () => navigate('/services/new') } },
    { id: 'in_progress',  title: 'Em Progresso', color: '#b2dfdb' },
    { id: 'completed',      title: 'Concluído',     color: '#c8e6c9' },
    { id: 'delivered', title: 'Entregue',      color: '#b3e5fc' },
  ].map(col => ({
    ...col,
    cards: services
      .filter(s => s.status === col.id)
      .map(s => ({
        id: s._id,
        title: s.services,
        subtitle: `Cliente: ${s.customerName}`,
        details: `Veículo: ${s.vehicle}`,
        createdAt: new Date(s.createdAt).toLocaleString(),
        updatedAt: new Date(s.updatedAt).toLocaleString(),
      })),
  }));

  const handleLogout = () => {
    navigate('/', { replace: true });
  };
  const handleSettings = () => {
    navigate('/settings');
  };

  const navLinks = [
    { to: '/services', label: 'Serviços' },
    { to: '/profile',  label: 'Clientes' },
    { to: '/finance',  label: 'Financeiro' },
    { to: '/products',  label: 'Produtos' },
    { to: '/reports',  label: 'Relatórios' },
    { to: '/feedback',  label: 'Feedbacks' },
    { to: '/settings',  label: 'Configurações' },
  ];

  return (
    <div className={styles.container}>
      <Header
        logoSrc="/public/image/logobranca.jpeg"
        navLinks={navLinks}
        onLogout={handleLogout}
        onSettings={handleSettings}
      />
      {activeTab === 'orders' && (
        <>
          <div className={styles.toolbar}>
            <input
              type="text"
              placeholder="Procure por uma ordem"
              className={styles.search}
            />
            <a href="#" className={styles.showAll}>Remover filtro</a>
          </div>
          <div className={styles.boardWrapper}>
            <KanbanBoard columns={columns} />
          </div>
        </>
      )}
    </div>
  );
}
