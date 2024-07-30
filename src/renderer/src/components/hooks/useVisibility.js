import { useState } from 'react';
import { useValidedInitialData } from './useValidatedInitialData';

const config = {
  title: 'Erro',
  content: 'Erro',
};

export const useVisibility = () => {
  const [view, setView] = useState('addUser'); // 'addUser', 'userView', 'comandaTable'

  const onUserView = async (modal) => {
    const isDataExist = await useValidedInitialData(); 
    if (isDataExist) {
      setView('userView');
    } else {
      modal.error(config);
    }
  };

  const onAddUserView = () => {
    setView('addUser');
  };

  const showComandaTable = () => {
    setView('comandaTable');
  };

  return {
    onUserView,
    onAddUserView,
    showComandaTable,
    view,
  };
};
