'use strict';

const Inquiry = require('../../models/Inquiry/Inquiry');
const { getLastInquiry } = require('../../models/Inquiry/InquiryStorage');

const output = {
  inquiry: async (req, res) => {
    if (req.session.user) {
      const id = req.session.user.id;
      const storeId = req.params.storeId;
      if (!storeId) return res.json({ success: false, message: '스토어 id를 입력해주세요. ' });
      const inquiry = new Inquiry(req.body);
      const response = await inquiry.getInquiry(id, storeId);
      return res.json(response);
    } else {
      return res.json({ success: false, message: '로그인이 되어있지 않습니다.' });
    }
  },
  myInquiry: async (req, res) => {
    if (req.session.user) {
      const id = req.session.user.id;
      const inquiry = new Inquiry(req.body);
      const response = await inquiry.getMyInquiry(id);
      const result = [];
      for (let i = 0; i < response.length; i++) {
        const lastInquiry = await inquiry.getLastInquiry(id, response[i].StoreId);
        console.log(response[i].StoreId);
        console.log(response);
        result.push({ Store: response[i], Inquiry: lastInquiry });
      }
      return res.json(result);
    } else {
      return res.json({ success: false, message: '로그인이 되어있지 않습니다. ' });
    }
  },
};

const process = {
  inquiry: async (req, res) => {
    if (req.session.user) {
      const id = req.session.user.id;
      const storeId = req.params.storeId;
      const productId = req.params.productId;
      const { type, contents } = req.body;
      if (!storeId) return res.json({ success: false, message: '스토어 id를 입력해주세요. ' });
      if (!type) return res.json({ success: false, message: '문의 유형을 입력해주세요. ' });
      if (!contents) return res.json({ success: false, message: '문의 내용을 입력해주세요. ' });
      const inquiry = new Inquiry(req.body);
      const response = await inquiry.inquiry(id, storeId, productId, type, contents);
      return res.json(response);
    } else {
      return res.json({ success: false, message: '로그인이 되어있지 않습니다.' });
    }
  },
};

module.exports = {
  output,
  process,
};