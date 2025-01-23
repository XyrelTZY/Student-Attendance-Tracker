import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('attendance_management_tracker', 'root', 'xyrel', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

export default sequelize;
