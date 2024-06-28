import { Sequelize } from "sequelize";
import { sequelize } from "../db/database"; // Adjust the path as necessary

export const License = sequelize.define('License', {
  isValid: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});
 
