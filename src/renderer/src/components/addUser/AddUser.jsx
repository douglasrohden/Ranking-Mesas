import { AddUserForm } from './components/AddUserForm' 
import { Button, Col, Row, Image, Typography } from 'antd';
 
const { Title } = Typography;


export const AddUser = () => {
  return (
    <main>
      <div className="title-container">
        <Col span={24} style={{ textAlign: 'center', padding: '8px 0' }}>
          <Title level={4} style={{ margin: 0, color: 'white' }}>Adicionar</Title>
        </Col>
      </div>
      <Row justify={'center'}>
        <Col span={20}>
          <AddUserForm />
        </Col>
      </Row>
    </main>
  )
}
