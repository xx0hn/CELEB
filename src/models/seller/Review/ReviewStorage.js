'review strict';

const db = require('../../../config/database');

class ReviewStorage {
  static getReviewByStoreId(storeId, start, pageSize) {
    // 승환: reply랑 칼럼으로 합치기
    return new Promise((resolve, reject) => {
      const query = `select a.id as reviewId
      , b.id as userId
      , b.name as userName
      , d.id as productId
      , d.name as productName
      , a.imageUrl as reviewImage
      , a.score as reviewScore
      , a.contents as reviewContents
      , date_format(a.createdAt, "%Y-%m-%d %H:%i") as createdAt
from Review a
left join ( select id, name
          from User) as b
          on a.userId = b.id
left join ( select id, productId
          from Orders) as c
          on a.orderId = c.id
left join ( select id, name
          from Product) as d
          on c.productId = d.id
where a.storeId = ? and a.status = 'ACTIVE'
order by a.createdAt desc limit ?, ?;`;
      db.query(query, [storeId, start, pageSize], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static getReviewReply(reviewId) {
    // 승환: 삭제
    return new Promise((resolve, reject) => {
      const query = `select a.id as replyId
      , a.storeId as storeId
      , b.storeName as storeName
      , b.imageUrl as storeImage
      , a.contents as replyContents
      , date_format(a.createdAt, "%Y-%m-%d %H:%i") as createdAt
from ReviewReply a
left join ( select id, storeName, imageUrl
          from Store ) as b
          on a.storeId = b.id
where a.reviewId = ? and a.status = 'ACTIVE'
order by a.createdAt asc;`;
      db.query(query, [reviewId], (err, data) => {
        if (err) reject(`${err}`);
        resolve(data);
      });
    });
  }
  static createReviewReply(storeId, reviewId, contents) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO ReviewReply(storeId, reviewId, contents) VALUES(?,?,?);';
      db.query(query, [storeId, reviewId, contents], (err, data) => {
        if (err) reject(`${err}`);
        resolve({ success: true });
      });
    });
  }
}

module.exports = ReviewStorage;
