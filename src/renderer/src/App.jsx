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

  // Define the starting date as 27/05/2024

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



  return (
    <div className="container">
      <div className="content">
        {renderComponent()}
      </div>
      <div className="footer">
        <TitleForm onUserView={onUserView} onAddUserView={onAddUserView} showComandaTable={showComandaTable} />
      </div>
    </div>
  );
}

export default App;
