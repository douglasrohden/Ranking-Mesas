import React, { useEffect, useState } from 'react';
import { Table, Typography, Col, Row, message } from 'antd';
import './style.css';

const { Title } = Typography;

export const ComandaTable = () => {
  const [allComandas, setAllComandas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComandas = async () => {
    try {
      setLoading(true);
      const data = await window.electronFront.getComandas();
      if (!data || data.length === 0) {
        console.log("Nenhuma comanda encontrada.");
        message.warning('Nenhuma comanda encontrada.');
        setAllComandas([]);
      } else {
        const comandas = data
          .map(comanda => (comanda.dataValues ? comanda.dataValues : comanda))
          .sort((a, b) => b.id - a.id);
        setAllComandas(comandas);
      }
    } catch (error) {
      console.error("Erro ao carregar comandas:", error);
      message.error('Erro ao carregar comandas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComandas();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const columns = [
    {
      title: 'Nº da Comanda',
      dataIndex: 'comanda',
      key: 'comanda',
      sorter: (a, b) => a.comanda.localeCompare(b.comanda),
    },
    {
      title: 'Camarote',
      dataIndex: 'descricao',
      key: 'descricao',
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (value) => formatCurrency(value),
      sorter: (a, b) => parseFloat(a.valor) - parseFloat(b.valor),
    },
  ];

  return (
    <div>
      <div className="title-container2">
        <Col span={24} style={{ textAlign: 'center', padding: '8px 0' }}>
          <Title level={4} style={{color: 'white' }}>Lançamentos</Title>
        </Col>
      </div>
      <Row align="middle" justify="center">
        <Col span={20} style={{  padding: '20px 0' }}>
          <Table 
            columns={columns} 
            dataSource={allComandas} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'Nenhuma comanda encontrada' }}
            bordered
          />
        </Col>
      </Row>
    </div>
  );
};

export default ComandaTable;
