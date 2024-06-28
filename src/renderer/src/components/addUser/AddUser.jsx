import { AddUserForm } from './AddUserForm';
import { Col, Row, Typography } from 'antd';
import './style.css';

const { Title } = Typography;

export const AddUser = () => {
  return (
    <main >
      <div className="title-container2">
        <Col span={24} style={{ textAlign: 'center', padding: '8px 0' }}>
          <Title level={4} style={{ margin: 0, color: 'white' }}>Adicionar</Title>
        </Col>
     
      <Row justify={'center'}>
        <Col span={20}>
          <AddUserForm />
        </Col>
      </Row>
      </div>
    </main>
  );
};
