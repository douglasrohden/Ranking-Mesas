import React from 'react';
import { Button, Col, Row, Modal } from 'antd';
import Title from 'antd/es/typography/Title';

import luxLogo from '../assets/lux.png';
export const TitleForm = ({ onAddUserView, onUserView, showComandaTable }) => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <header >
      <Row align="middle">
        <Col span={11} style={{ textAlign: 'center' }}>
          <img src={luxLogo} alt="LUX Logo" className="lux-logo" />
        </Col>
        <Col span={12} >
          <Row gutter={16} justify="end">

            <Col>
              <Button type="primary" onClick={() => onUserView(modal)}>Ranking</Button>
              {contextHolder}
            </Col>

            <Col>
              <Button type="primary" onClick={showComandaTable}>Lançamentos</Button>
              {contextHolder}
            </Col>
            <Col>
              <Button type="primary" onClick={onAddUserView}>Adicionar</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </header>
  );
};

export default TitleForm;
