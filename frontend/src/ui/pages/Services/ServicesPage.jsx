import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../../utils/apiFetch.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './ServicesPage.module.css';
import Header from '../../components/Header.jsx';
import Kanban from '../../components/KanbanBoard.jsx';
import CreateOrderModal from '../../Modals/CreateOrderModal.jsx';
import EditOrderModal from '../../Modals/EditOrderModal.jsx';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('pending');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }

    (async () => {
      const res = await apiFetch('https://autocarenow.onrender.com/orders', {}, () => {
        logout();
        navigate('/', { replace: true });
      });

      if (res.status === 401) {
        return;
      }

      if (!res.ok) {
        console.error('Erro ao buscar ordens:', await res.text());
        return;
      }

      // Tudo OK: preenche o estado com as ordens
      const data = await res.json();
      setServices(data);
    })();
  }, [token, logout, navigate]);

  const handleEditCard = (cardId) => {
    const svc = services.find((s) => s._id === cardId);
    if (!svc) return;
    setCardToEdit(svc);
    setEditModalOpen(true);
  };

  const handleUpdateCard = async ({ _id, status }) => {
    const res = await apiFetch(
      `https://autocarenow.onrender.com/orders/${_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      },
      () => {
        logout();
        navigate('/', { replace: true });
      }
    );

    if (res.status === 401) return;
    if (!res.ok) {
      console.error('Falha ao atualizar status:', await res.text());
      return;
    }
    const updatedOrder = await res.json();
    setEditModalOpen(false);
    setServices((prev) =>
      prev.map((c) => (c._id === _id ? updatedOrder : c))
    );
  };

  const handleDeleteCard = async (cardId) => {
    const res = await apiFetch(
      `https://autocarenow.onrender.com/orders/${cardId}`,
      { method: 'DELETE' },
      () => {
        logout();
        navigate('/', { replace: true });
      }
    );

    if (res.status === 401) return;
    if (!res.ok) {
      console.error('Falha ao deletar:', await res.text());
      return;
    }
    setServices((prevServices) =>
      prevServices.filter((card) => card._id !== cardId)
    );
  };

  const handleCreate = async (orderData) => {
    const res = await apiFetch(
      'https://autocarenow.onrender.com/orders',
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      },
      () => {
        logout();
        navigate('/', { replace: true });
      }
    );

    if (res.status === 401) return;
    if (!res.ok) {
      console.error('Falha ao criar ordem:', await res.text());
      return;
    }
    const data = await res.json();
    setShowModal(false);
    setServices((prev) => [...prev, data]);
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/services', label: 'Serviços' },
    { to: '/profile', label: 'Clientes' },
  ];

  const statusKeys = [
    'pending',
    'in_progress',
    'completed',
    'delivered',
    'cancelled',
  ];
  const titles = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    completed: 'Concluído',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  const colors = {
    pending: '#80cbc4',
    in_progress: '#b2dfdb',
    completed: '#c8e6c9',
    delivered: '#b3e5fc',
    cancelled: '#ddd',
  };

  const columns = statusKeys.map((key) => ({
    id: key,
    title: titles[key],
    color: colors[key],
    footer: key === 'pending'
    ? { label: '+ Nova', onClick: () => { setModalStatus(key); setShowModal(true); } }
    : null,
    cards: services
      .filter((s) => s.status === key)
      .map((s) => {
        const created = s.createdAt ? new Date(s.createdAt) : null;
        const updated = s.updatedAt ? new Date(s.updatedAt) : null;
        return {
          id: s._id,
          _id: s._id,
          title: s.services,
          subtitle: `Cliente: ${s.customerName}`,
          details: `Veículo: ${s.vehicle}`,
          status: s.status,
          createdAt:
            created && !isNaN(created)
              ? new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(created)
              : 'Data inválida',
          updatedAt:
            updated && !isNaN(updated)
              ? new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(updated)
              : 'Data inválida',
        };
      }),
  }));

  return (
    <div className={styles.container}>
      <Header
        logoSrc="/public/image/logobranca.jpeg"
        navLinks={navLinks}
        onLogout={() => {
          logout();
          navigate('/', { replace: true });
        }}
        onAdmin={() => navigate('/admin')}
        onSettings={() => navigate('/settings')}
      />
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Procure por uma ordem"
          className={styles.search}
        />
        <a href="#" className={styles.showAll}>
          Remover filtro
        </a>
      </div>
      <div className={styles.boardWrapper}>
        <Kanban
          columns={columns}
          onDeleteCard={handleDeleteCard}
          onEditCard={handleEditCard}
        />
        <CreateOrderModal
          isOpen={showModal}
          status={modalStatus}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
        <EditOrderModal
          isOpen={editModalOpen}
          initialData={cardToEdit}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateCard}
        />
      </div>
    </div>
  );
}

