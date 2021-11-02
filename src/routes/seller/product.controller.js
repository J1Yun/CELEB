'use strict';

const { array } = require('../../config/multer');
const Product = require('../../models/seller/Product/Product');
const ProductStorage = require('../../models/seller/Product/ProductStorage');

const output = {
  productList: async (req, res) => {
    if (req.session.user) {
      try {
        const storeId = req.session.user.id;
        const productList = await ProductStorage.getProductListByStoreId(storeId);
        res.render('seller/productList', { productList });
      } catch (err) {
        res.render('common/500error', { err });
      }
    } else {
      res.render('seller/login');
    }
  },
  productDetail: async (req, res) => {
    if (req.session.user) {
      try {
        const storeId = req.session.user.id;
        const productId = req.params.productId;
        const productDetail = await ProductStorage.getProductDetailByProductId(storeId, productId);
        res.render('seller/editProduct', { productDetail });
      } catch (err) {
        res.render('common/500error', { err });
      }
    } else {
      res.render('seller/login');
    }
  },
};
const process = {
  createProduct: async (req, res) => {
    // 성준
    const storeId = req.session.user.id;
    const mainImage = req.files['productMain'][0].location;
    let detailImage = req.files['productDetail'];
    detailImage = detailImage.map((img) => img.location);
    detailImage = JSON.stringify(detailImage);
    detailImage = detailImage.replace(/[\"\[\]]/g, '');
    const product = new Product(req.body);
    const response = await product.createProduct(storeId, mainImage, detailImage);
    return res.json(response);
  },
  updateProduct: async (req, res) => {
    try {
      if (req.session.user) {
        const storeId = req.session.user.id;
        const productId = req.body.productId;
        const productDetail = await ProductStorage.getProductDetailByProductId(storeId, productId);
        console.log(req.files);
        const main = productDetail[0].image;
        let detailImage = productDetail[0].detailImageUrl;
        const mainImage = req.files ? (req.files['productMain'] ? req.files['productMain'][0].location : main) : main;
        if (req.files) {
          detailImage = req.files['productDetail'] ? req.files['productDetail'] : detailImage;
          if (detailImage != productDetail[0].detailImageUrl) {
            detailImage = detailImage.map((img) => img.location);
            detailImage = JSON.stringify(detailImage);
            detailImage = detailImage.replace(/[\"\[\]]/g, '');
          }
        }
        const detailUrl = req.files
          ? req.files['productDetail']
            ? detailImage
            : productDetail[0].detailImageUrl
          : productDetail[0].detailImageUrl;
        const product = new Product(req.body);
        const response = await product.updateProduct(storeId, mainImage, detailUrl, productDetail);
        return res.json(response);
      } else {
        return res.json({ success: false, message: '로그인이 되어있지 않습니다.' });
      }
    } catch (err) {
      console.log(err);
      return { success: false, message: 'DB Error ' };
    }
  },
  deleteProduct: async (req, res) => {
    const storeId = req.session.user.id;
    const productId = req.params.productId;
    const product = new Product();
    const response = await product.deleteProduct(storeId, productId);
    return res.json(response);
  },
};

module.exports = {
  output,
  process,
};
