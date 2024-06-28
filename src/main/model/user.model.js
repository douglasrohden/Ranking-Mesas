import { Sequelize } from "sequelize";
import { sequelize } from "../db/database"; // ajuste o caminho conforme necessário

export const Comanda = sequelize.define('Comanda', {
    comanda: {
      type: Sequelize.STRING,
      allowNull: false
    },
    descricao: {
      type: Sequelize.STRING,
      allowNull: false
    },
    valor: {
      type: Sequelize.STRING,
      allowNull: false
    }
});
