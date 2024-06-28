import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import './style.css';

// Import all necessary images
import img01 from '../../assets/01.png';
import img02 from '../../assets/02.png';
import img03 from '../../assets/03.png';
import img04 from '../../assets/04.png';
import img05 from '../../assets/05.png';
import img06 from '../../assets/06.png';

const images = [img01, img02, img03, img04, img05, img06];

export const UserView = () => {
  const [allComandas, setAllComandas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComandas = async () => {
    setLoading(true);
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

        // Format values
        const formattedComandas = Object.values(groupedComandas).map(comanda => ({
          ...comanda,
          valor: comanda.valor
        }));

        formattedComandas.sort((a, b) => b.valor - a.valor);
        setAllComandas(formattedComandas);
      }
    } catch (error) {
      console.error("Erro ao carregar comandas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComandas();
    const interval = setInterval(fetchComandas, 2 * 60 * 1000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="comanda-container">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <Row className="row">
            {allComandas.slice(0, 1).map((comanda, index) => (
              <div key={index} className="comanda-row top" style={{ backgroundImage: `url(${images[0]})` }}>
                <div className="comanda-index comanda-medium">
                  CAMAROTE: <span className="comanda-number">{comanda.comanda}</span>
                </div>
                <div className="comanda-index comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </Row>
          <div className="second-row-container">
            {allComandas.slice(1, 3).map((comanda, index) => (
              <div key={index} className="comanda-row second-row" style={{ backgroundImage: `url(${images[index + 1]})` }}>
                <div className="comanda-medium">
                  CAMAROTE: <span className="comanda-number">{comanda.comanda}</span>
                </div>
                <div className="comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </div>
          <div className="third-row-container">
            {allComandas.slice(3, 6).map((comanda, index) => (
              <div key={index} className="comanda-row third-row" style={{ backgroundImage: `url(${images[index + 3]})` }}>
                <div className="comanda-medium">
                  CAMAROTE: <span className="comanda-number">{comanda.comanda}</span>
                </div>
                <div className="comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
