'use strict';

const Store = require('../../models/consumer/Store/Store');
const StoreStorage = require('../../models/consumer/Store/StoreStorage');
const ProductStorage = require('../../models/consumer/Product/ProductStorage');

const output = {
  popularStore: async (req, res) => {
    try {
      const popularStore = await StoreStorage.getPopularStore();
      res.render('consumer/main', { popularStore });
    } catch (err) {
      res.render('common/500error', { err, layout: false });
    }
  },
  storeDetail: async (req, res) => {
    try {
      const storeId = req.params.storeId;
      const storeDetail = await StoreStorage.getStoreDetailByStoreId(storeId); //TODO: 하나로 묶기 //스토어 상세정보
      const product = await ProductStorage.getProductByStoreId(storeId); //상품정보
      res.render('consumer/storeDetail', { storeDetail, product });
    } catch (err) {
      res.render('common/500error', { err, layout: false });
    }
  },
  storeList: async (req, res) => {
    // 리팩토링 필요
    try {
      const { provinceId, cityId } = req.query;
      const page = req.query.page ? req.query.page : 1;
      const pageSize = 10;
      let start = 0;
      if (page <= 0) {
        page = 1;
      } else {
        start = (page - 1) * pageSize;
      }
      const categoryId = req.params.categoryId;
      const category = await StoreStorage.getCategoryDetailByCateoryId(categoryId);
      const province = await StoreStorage.getProvinceList();
      const city = provinceId ? await StoreStorage.getCityByProvinceId(provinceId) : [];
      if (!cityId && !provinceId) {
        const storeList = await StoreStorage.getStoreByCategoryId(categoryId, start, pageSize);
        res.render('consumer/storeList', { category, storeList, province, city });
      } else if (provinceId && !cityId) {
        const storeList = await StoreStorage.getStoreByCategoryIdWithProvinceId(categoryId, provinceId, start, pageSize);
        res.render('consumer/storeList', { category, storeList, province, city });
      } else {
        const storeList = await StoreStorage.getStoreByCategoryIdWithCityId(categoryId, provinceId, cityId, start, pageSize);
        res.render('consumer/storeList', { category, storeList, province, city });
      }
    } catch (err) {
      res.render('common/500error', { err, layout: false });
    }
  },

  storeReservationDate: async (req, res) => {
    try {
      if (!req.params.storeId) return res.render('common/500error', { storeId: false });
      const productReservationDateInfo = await StoreStorage.getProductReservationDateByProductId(req.params.storeId);
      res.render('consumer/reservationDate', { productReservationDateInfo });
    } catch (err) {
      res.render('common/500error', { err, layout: false });
    }
  },
  searchStore: async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.json({ success: false, message: '검색어를 입력해주세요. ' });
    const categoryName = '%' + keyword + '%';
    const storeName = '%' + keyword + '%';
    const productName = '%' + keyword + '%';
    const provinceName = '%' + keyword + '%';
    const cityName = '%' + keyword + '%';
    const params = [categoryName, storeName, productName, provinceName, cityName];
    try {
      const result = await StoreStorage.searchStore(params);
      res.render('consumer/search', { result, keyword });
    } catch (err) {
      res.render('common/500error', { err, layout: false });
    }
  },
};

const process = {};

module.exports = {
  output,
  process,
};
