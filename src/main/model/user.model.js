import { Sequelize } from "sequelize";
import { sequelize } from "../db/database";

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