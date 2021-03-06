'use strict';

const db = require('../../../config/database');
class ProductStorage {
  static getProductListByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id as productId, name, imageUrl as image,info,format(price,0) as price,detailImageUrl,date_format(createdAt,'%Y-%m-%d') as createdAt
          FROM Product
          WHERE storeId=? and status='ACTIVE' ORDER BY name;`;
      db.query(query, [storeId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getProductDetailByProductId(storeId, productId) {
    // 쿼리 합치기 완료
    return new Promise((resolve, reject) => {
      const query = `SELECT pd.id as productId,pd.name,pd.imageUrl as image,pd.info,pd.notice,format(pd.price,0) as price,pd.detailImageUrl,date_format(pd.createdAt,'%Y-%m-%d') as createdAt,pdoc.name as categoryName,pdo.name as optionName,pdo.price as plusPrice,pdo.type
        FROM Product pd left join ProductOption pdo on pd.id=pdo.productId left join ProductOptionCategory pdoc on pdo.optionCategoryId=pdoc.id
        WHERE pd.storeId=? and pd.id=? and pd.status='ACTIVE' and pdo.status='ACTIVE';`;
      db.query(query, [storeId, productId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static createProductByStoreId(params) {
    return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO Product(storeId,name,ImageUrl,info,notice,price,detailImageUrl) VALUES (?,?,?,?,?,?,?);`;
      db.query(query, params, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static updateProductByProductId(params) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE Product SET Product.name=?,imageUrl=?,info=?,price=?,detailImageUrl=? WHERE storeId=? and id=?;`;
      db.query(query, params, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static createProductOption(params) {
    return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO ProductOption(productId,optionCategoryId,name,price,type) VALUES (?,?,?,?,?);`;
      db.query(query, params, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static createCategory(categoryName) {
    return new Promise((resolve, reject) => {
      const query = `
      INSERT INTO ProductOptionCategory(name) VALUES (?);`;
      db.query(query, categoryName, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getCategoryName(categoryName) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT id FROM ProductOptionCategory WHERE name=?;`;
      db.query(query, categoryName, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static deleteProductByProductId(storeId, productId) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE Product as p, ProductOption as po SET p.status="DELETE", po.status="DELETE" WHERE p.storeId=? and p.id=? and po.productId=?;`;
      db.query(query, [storeId, productId, productId], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true, message: '상품이 삭제되었습니다. ' });
      });
    });
  }
  static setDefaulProductOptionByProductId(productId) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE ProductOption SET status='DELETE' WHERE productId=?;`;
      db.query(query, productId, (err, data) => {
        if (err) reject(`${err}`);
        resolve();
      });
    });
  }
  static getProductRankByStoreId(storeId) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT pd.id as productId, pd.imageUrl as productImage, pd.name as productName, count(pd.id) as orderCnt
      FROM Product pd join Orders od on od.productId = pd.id
      WHERE pd.storeId = ?
      GROUP BY pd.id
      ORDER BY orderCnt DESC
      limit 3;
      `;
      db.query(query, storeId, (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
}
module.exports = ProductStorage;
