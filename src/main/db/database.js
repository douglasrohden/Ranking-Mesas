const { Sequelize } = require('sequelize');

// Configurar Sequelize com MySQL
const sequelize = new Sequelize('admin_lux', 'admin_lux', 'lux@@123', {
  host: '93.188.165.214',
  dialect: 'mysql',
  logging: false, // para não logar queries no console
});
const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Banco Criado");
  } catch (error) {
    console.error("Erro ao criar Banco", error);
  }
};

export { sequelize, initDb };
