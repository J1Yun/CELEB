'use strict';

const db = require('../../../config/database');

class StoreStorage {
  static getStoreDetailByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT st.id,st.storeName as 'name',st.ImageUrl as Image, st.openTime as 'OperatingHour', case when rtt.avgstar is null then '-' else rtt.avgstar end as star, st.info, st.phoneNum,concat(pv.name,' ',ct.name,' ',st.roadAddress,' ',st.detailAddress) as location,st.provinceId,st.cityId,st.roadAddress,st.detailAddress,st.limit,type
          FROM Store st left join (Select rv.storeId as sid, round(AVG(rv.score),1) as avgstar From Review rv Where rv.status='ACTIVE' Group by rv.storeId) rtt on rtt.sid=st.id
                        left join Province pv on pv.id=st.provinceId join City ct on ct.id=st.cityId
          WHERE st.status='ACTIVE' and st.id=?;`;
      db.query(query, [storeId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data[0]);
      });
    });
  }
  static updateStorePageDetail(params) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE Store SET storeName=?,phoneNum=?,info=?,openTime=?,provinceId=?,cityId=?,roadAddress=?,detailAddress=?,Store.limit=?,type=?,imageUrl=?,notice=? WHERE id=?;`;
      db.query(query, params, (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, message: '스토어 수정이 완료되었습니다. ' });
      });
    });
  }
  static getMonthStatisticsByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT oc.orderCnt,case when oc.totalSum is null then 0 else oc.totalSum end as totalSum,iq.InquiryCnt
      FROM (SELECT count(*) as orderCnt,sum(od.totalPrice) as totalSum
	          FROM Orders od JOIN Product pd ON od.productId=pd.id
            WHERE od.createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH) AND NOW() AND pd.storeId=?) oc,
	         (SELECT count(*) as inquiryCnt
            FROM Inquiry
            WHERE createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH) AND NOW() AND storeId=?) iq
      `;
      db.query(query, [storeId, storeId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
}
module.exports = StoreStorage;
