import React from 'react';
import { Button, Modal } from 'antd';

export const TitleForm = ({ onAddUserView, onUserView, showComandaTable }) => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {contextHolder}
      <Button type="primary" onClick={() => onUserView(modal)}>Ranking</Button>
      <Button type="primary" onClick={showComandaTable}>Lançamentos</Button>
      <Button type="primary" onClick={onAddUserView}>Adicionar</Button>
    </div>
  );
};

export default TitleForm;
