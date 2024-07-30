import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import './style.css';
import loadingGif from '../../assets/coroa.gif';
// Import all necessary images
import img01 from '../../assets/01.png';
import img02 from '../../assets/02.png';
import img03 from '../../assets/03.png';
import img04 from '../../assets/04.png';
import img05 from '../../assets/05.png';
import img06 from '../../assets/06.png';
import img07 from '../../assets/07.png';
import img08 from '../../assets/08.png';

const images = [img01, img02, img03, img04, img05, img06, img07, img08];

export const UserView = () => {
  const [allComandas, setAllComandas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComandas = async () => {
    setLoading(true);
    try {
      const data = await window.electronFront.getComandas();
      if (!data || data.length === 0) {
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
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  };

  useEffect(() => {
    fetchComandas();
    const interval = setInterval(fetchComandas,   60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrencyR = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'code', // Exibe a moeda como código (BRL)
    }).format(value).replace('BRL', '').trim(); // Remove o código da moeda e espaços extras
  };
  
  
  return (
    <div className="comanda-container">
      {loading ? (
        <div className="loading-container">
          <img src={loadingGif}   className="loading-gif" />
          {allComandas.slice(0, 1).map((comanda, index) => (
            <div key={index} className="loading-value">
              <div className="comanda-index">
                {comanda.descricao.toUpperCase()}  
              </div>
              {formatCurrencyR(comanda.valor)}
            </div>
          ))}
        </div>
      ) : (
        <>
          <Row className="row">
            {allComandas.slice(0, 1).map((comanda, index) => (
              <div key={index} className="comanda-row top" style={{ backgroundImage: `url(${images[0]})` }}>
                <div className="comanda-index comanda-medium">
                  {comanda.descricao.toUpperCase()} 
                </div>
                <div className="comanda-index comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </Row>
          <div className="second-row-container">
            {allComandas.slice(1, 3).map((comanda, index) => (
              <div key={index} className="comanda-row second-row" style={{ backgroundImage: `url(${images[index + 1]})` }}>
                <div className="comanda-medium">
                 {comanda.descricao.toUpperCase()} {"  "}
                </div>
                <div className="comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </div>
          <div className="third-row-container">
            {allComandas.slice(3, 6).map((comanda, index) => (
              <div key={index} className="comanda-row third-row" style={{ backgroundImage: `url(${images[index + 3]})` }}>
                <div className="comanda-medium">
                  {comanda.descricao.toUpperCase()}  {"  "}  
                </div>
                <div className="comanda-end">{formatCurrency(comanda.valor)}</div>
              </div>
            ))}
          </div>
          <div className="second-row-container">
            {allComandas.slice(6, 8).map((comanda, index) => (
              <div key={index} className="comanda-row second-row" style={{ backgroundImage: `url(${images[index + 6]})` }}>
                <div className="comanda-medium">
                  {comanda.descricao.toUpperCase()} {" "} 
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
