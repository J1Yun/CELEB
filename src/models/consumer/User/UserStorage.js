'user strict';

const db = require('../../../config/database');

class UserStorage {
  static getUserInfo(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM User WHERE email = ?;';
      db.query(query, [email], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }
  static register(params) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO User(email,password,name,phoneNum,address) VALUES (?,?,?,?,?);';
      db.query(query, params, (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true });
      });
    });
  }
  static getMyPageInfo(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT email,name,phoneNum,address FROM User WHERE id=?;';
      db.query(query, [userId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }
  static checkUserById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT email FROM User WHERE id=?;';
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }
}

module.exports = UserStorage;
