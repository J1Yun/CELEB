'use strict';

const db = require('../../config/database');

class StoreStorage {
  static getStoreInfoByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT st.id,st.storeName as 'name',st.ImageUrl as Image,concat(st.openTime,'-',st.closeTime) as 'Operating Hour', rtt.avgstar as 'star rating', st.info as info, st.phoneNum as phoneNum,concat(pv.name,' ',ct.name,' ',st.roadAddress,' ',st.detailAddress) as location
          FROM Store st join (Select rv.storeId as sid, round(AVG(rv.score),1) as avgstar From Review rv Where rv.status='ACTIVE' Group by rv.storeId) rtt on rtt.sid=st.id
                        join Province pv on pv.id=st.provinceId join City ct on ct.id=st.cityId
          WHERE st.status='ACTIVE' and st.id=?;`;
      db.query(query, [storeId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }
  static getProductInfoByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id,name,imageUrl,info,price,detailImageUrl FROM Product WHERE storeId=? and status='ACTIVE';`;
      db.query(query, [storeId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getStoreByCategoryId(categoryId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT s.id as storeId, s.storeName, s.imageURL, s.info, concat(p.name,' ',c.name) as location, type  
      FROM Store s JOIN Province p ON s.provinceId=p.id JOIN City c ON s.cityId=c.id JOIN (Select s.id as sid,count(*) as cnt From Orders od join Product pd on pd.id=od.productId join Store s on s.id=pd.storeId WHERE od.status='COMPLETE' Group by s.id) tt ON s.id=tt.sid
      WHERE s.categoryId = ? and s.status='ACTIVE'
      ORDER BY tt.cnt DESC;`;
      db.query(query, [categoryId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getStoreByCategoryIdWithProvinceId(categoryId, provinceId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT s.id as storeId, s.storeName, s.imageURL, s.info, concat(p.name,' ',c.name) as location, type  
      FROM Store s JOIN Province p ON s.provinceId=p.id JOIN City c ON s.cityId=c.id JOIN (Select s.id as sid,count(*) as cnt From Orders od join Product pd on pd.id=od.productId join Store s on s.id=pd.storeId WHERE od.status='COMPLETE' Group by s.id) tt ON s.id=tt.sid
      WHERE s.categoryId = ? and s.provinceId = ? and s.status='ACTIVE'
      ORDER BY tt.cnt DESC;`;
      db.query(query, [categoryId, provinceId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getStoreByCategoryIdWithCityId(categoryId, provinceId, cityId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT s.id as storeId, s.storeName, s.imageURL, s.info, concat(p.name,' ',c.name) as location, type  
      FROM Store s JOIN Province p ON s.provinceId=p.id JOIN City c ON s.cityId=c.id 
      WHERE s.categoryId = ? and s.provinceId = ? and s.cityId = ? and s.status='ACTIVE'
      ORDER BY s.createdAt DESC;`;
      db.query(query, [categoryId, provinceId, cityId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
}
module.exports = StoreStorage;
