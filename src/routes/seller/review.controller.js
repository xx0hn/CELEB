'use strict';

const Review = require('../../models/seller/Review/Review');
const ReviewStorage = require('../../models/seller/Review/ReviewStorage');

const output = {
  review: async (req, res) => {
    if (req.session.host) {
      const id = req.session.host.id;
      const { page } = req.query;
      const pageSize = 10;
      const review = new Review(req.body);
      const response = await review.getReview(id, page, pageSize);
      return res.json(response);
    } else {
      return res.json({ success: false, message: '스토어 로그인이 되어있지 않습니다. ' });
    }
  },
  reviewReply: async (req, res) => {
    if (req.session.host) {
      const { reviewId } = req.query;
      const review = new Review(req.body);
      const response = await review.getReviewReply(reviewId);
      return res.json(response);
    } else {
      return res.json({ success: false, message: '스토어 로그인이 되어있지 않습니다. ' });
    }
  },
};
const process = {};

module.exports = {
  output,
  process,
};