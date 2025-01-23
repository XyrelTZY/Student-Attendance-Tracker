"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('attendance_management_tracker', 'root', 'xyrel', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});
exports.default = sequelize;
