import React, { useEffect, useState } from 'react';
import { Table, Typography, Col, Row } from 'antd';
import './style.css';

const { Title } = Typography;

export const ComandaTable = () => {
  const [allComandas, setAllComandas] = useState([]);

  const fetchComandas = async () => {
    try {
      const data = await window.electronFront.getComandas();
      if (!data || data.length === 0) {
        console.log("Nenhuma comanda encontrada.");
        setAllComandas([]);
      } else {
        const comandas = data
          .map(comanda => (comanda.dataValues ? comanda.dataValues : comanda))
          .sort((a, b) => b.id - a.id);
        setAllComandas(comandas);
      }
    } catch (error) {
      console.error("Erro ao carregar comandas:", error);
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
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'Comanda',
      dataIndex: 'comanda',
      key: 'comanda',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (value) => formatCurrency(value),
    },
  ];

  return (
    <div>
      <div className="title-container2">
        <Col span={24} style={{ textAlign: 'center', padding: '8px 0' }}>
          <Title level={4} style={{ margin: 10, color: 'white' }}>Lançamentos</Title>
        </Col>
      </div>
      <Row align="middle" justify="center">
        <Col span={18}>
          <Table columns={columns} dataSource={allComandas} rowKey="id" />
        </Col>
      </Row>
    </div>
  );
};

export default ComandaTable;
