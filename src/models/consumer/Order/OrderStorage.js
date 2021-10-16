'order strict';

const db = require('../../../config/database');

class OrderStorage {
  static postCart(id, productId, option, totalPrice) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO Cart(userId, productId, `option`, totalPrice) VALUES(?,?,?,?);';
      db.query(query, [id, productId, option, totalPrice], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true });
      });
    });
  }
  static getCartListByUser(id) {
    return new Promise((resolve, reject) => {
      const query =
        'select a.id as CartId, c.id as StoreId, c.storeName as StoreName, c.imageUrl as StoreImage, b.id as ProductId, b.name as ProductName, b.imageUrl as ProductImage, a.`option` as Options, a.totalPrice as TotalPrice, date_format(a.createdAt, "%Y-%m-%d %H:%i") as CreatedAt from Cart a left join ( select id, name, storeId, imageUrl from Product ) as b on a.productId = b.id left join ( select id, storeName, imageUrl from Store ) as c on b.storeId = c.id where a.userId = ? and a.status = "ACTIVE" order by a.createdAt desc;';
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getCartInfo(cartId) {
    return new Promise((resolve, reject) => {
      const query =
        'select id as cartId, productId as productId, `option` as options, totalPrice as totalPrice from Cart where id = ? and status = "ACTIVE";';
      db.query(query, [cartId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static postOrder(id, productId, option, location, totalPrice) {
    return new Promise((resolve, reject) => {
      const query = 'insert into Orders(userId, productId, `option`, location, totalPrice) values(?,?,?,?,?);';
      db.query(query, [id, productId, option, location, totalPrice], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true });
      });
    });
  }
  static getOrderDetail(id, orderId) {
    return new Promise((resolve, reject) => {
      const query =
        'select a.id as orderId, a.userId as userId, b.storeId as storeId, c.storeName as storeName, a.productId as productId, b.name as productName, a.`option` as options, a.location as location, concat(format(a.totalPrice, 0), "원") as totalPrice, d.name as orderStatus, date_format(a.selectedDate, "%Y-%m-%d") as selectedDate, date_format(a.createdAt, "%Y-%m-%d %H:%i") as createdAt from Orders a left join ( select id, storeId, name, imageUrl from Product ) as b on a.productId = b.id left join( select id, storeName, imageUrl from Store) as c on b.storeId = c.id join OrderStatus d on a.orderStatusId=d.id where a.userId = ? and a.id= ? and a.status = "ACTIVE" ';
      db.query(query, [id, orderId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getMyOrder(id) {
    return new Promise((resolve, reject) => {
      const query =
        'select a.id as orderId, a.userId as userId, b.storeId as storeId, c.storeName as storeName, a.productId as productId, b.name as productName, b.imageUrl as productImage, a.`option` as options, a.location as location, concat(format(a.totalPrice, 0), "원") as totalPrice, d.name as orderStatus, date_format(a.selectedDate, "%Y-%m-%d") as selectedDate, date_format(a.createdAt, "%Y-%m-%d %H:%i") as createdAt from Orders a left join ( select id, storeId, name, imageUrl from Product ) as b on a.productId = b.id left join( select id, storeName, imageUrl from Store) as c on b.storeId = c.id join OrderStatus d on a.orderStatusId=d.id where a.userId = ? and a.status = "ACTIVE" order by a.createdAt desc;';
      db.query(query, [id], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
}
module.exports = OrderStorage;
