import React, { useState, useEffect } from 'react';
import './style.css';
import TitleForm from './components/TitleForm';
import { useVisibility } from './components/hooks/useVisibility';
import { AddUser } from './components/addUser/AddUser';
import { UserView } from './components/userView/UserView';
import ComandaTable from './components/userView/ComandaTable';
import Modal from 'react-modal';

// Set the app element for accessibility purposes
Modal.setAppElement('#root');

function App() {
  const { onUserView, onAddUserView, showComandaTable, view } = useVisibility();
  const [isBlocked, setIsBlocked] = useState(false);

  // Define the starting date as 27/05/2024
  const startDate = new Date('2024-05-27');
  const expirationDate = new Date(startDate);
  expirationDate.setDate(startDate.getDate() + 30);

  useEffect(() => {
    const currentDate = new Date();
    if (currentDate > expirationDate) {
      setIsBlocked(true);
    }
  }, [expirationDate]);

  const renderComponent = () => {
    switch (view) {
      case 'userView':
        return <UserView />;
      case 'addUser':
        return <AddUser />;
      case 'comandaTable':
        return <ComandaTable />;
      default:
        return <AddUser />;
    }
  };

  if (isBlocked) {
    return (
      <Modal
        isOpen={true}
        contentLabel="Access Blocked"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Entre em contato</h2>
        <p>66 99634-0586</p>
      </Modal>
    );
  }

  return (
    <>
      <TitleForm onUserView={onUserView} onAddUserView={onAddUserView} showComandaTable={showComandaTable} />
      {renderComponent()}
    </>
  );
}

export default App;
