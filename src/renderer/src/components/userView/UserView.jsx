import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Image, Typography } from 'antd';
import './style.css';

const { Title } = Typography;

export const UserView = () => {
  const [allComandas, setAllComandas] = useState([]);

  const fetchComandas = async () => {
    try {
      const data = await window.electronFront.getComandas();
      if (!data || data.length === 0) {
        console.log("Nenhuma comanda encontrada.");
        setAllComandas([]);
      } else {
        const comandas = data.map(comanda => comanda.dataValues ? comanda.dataValues : comanda);
        const groupedComandas = comandas.reduce((acc, comanda) => {
          const comandaNumber = comanda.comanda;
          const valor = parseFloat(comanda.valor.replace(',', '.'));
          if (!acc[comandaNumber]) {
            acc[comandaNumber] = { comanda: comandaNumber, descricao: comanda.descricao, valor: 0 };
          }
          acc[comandaNumber].valor += valor;
          return acc;
        }, {});

        // Formatar os valores
        const formattedComandas = Object.values(groupedComandas).map(comanda => ({
          ...comanda,
          valor: comanda.valor
        }));

        formattedComandas.sort((a, b) => b.valor - a.valor);
        setAllComandas(formattedComandas);
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

  return (
    <div  >

      <div className="title-container">
        <Col span={24} style={{ textAlign: 'center', marginBottom: '5px', padding: '2px 0' }}>
          <Title level={6} style={{ color: '#FFF', margin: 0 }}>Ranking</Title>
        </Col>
      </div>
      <Row align="middle" justify="center">
        <Col span={18}>
          {allComandas.map((comanda, index) => {
            let className = 'comanda-row';
            if (index === 0) {
              className += ' top';
            } else if (index === 1 || index === 2) {
              className += ' topM';
            } else {
              className += ' topF';
            }

            return (
              <div>
                <Row key={index} className={className}>
                  <Col span={3} className="comanda-index">{index + 1}</Col>
                  <Col span={12} className="comanda-medium">Comanda - {comanda.comanda} </Col>
                  <Col span={8} className="comanda-end" style={{ maxWidth: '100%', maxHeight: '100%' }}> {formatCurrency(comanda.valor)}</Col>
                </Row>
              </div>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};
