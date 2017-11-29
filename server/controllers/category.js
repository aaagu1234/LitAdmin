/**
 * category 控制器
 * Created by jerry on 2017/11/2.
 */
const Mock = require('mockjs');
const Category = require('../data/category');
let categoryController = {};
let _Category = Category;

/**
 * 通过名称查询，获取图书列表
 * @param req
 * @param res
 */
categoryController.find = function (req, res) {
  let page = parseInt(req.query.page || 1); //页码（默认第1页）
  let limit = parseInt(req.query.limit || 10); //每页显示条数（默认10条）
  let name = req.query.name || ''; //分类名称
  let total = 0;
  let rltCategory = [];
  if (name.length > 0) {
    let mockCategory = _Category.filter(category => {
      return category.name.indexOf(name) > -1;
    });
    total = mockCategory.length; //总条数
    rltCategory = mockCategory.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  } else {
    total = _Category.length; //总条数
    rltCategory = _Category.filter((u, index) => index < limit * page && index >= limit * (page - 1))
  }
  res.json({
    total: total,
    limit: limit,
    data: rltCategory
  })
};
 
/**
 * 添加一条图书信息
 * @param req
 * @param res
 */
categoryController.create = function (req, res) {
  let name = req.body.name;
  let description = req.body.description;
  _Category.push({
    id: Mock.Random.guid(),
    name: name,
    description: description
  });
  res.json({"errcode": 0, "errmsg": "新增成功"})
};


/***
 * 更新一条图书记录
 * @param req
 * @param res
 */
categoryController.update = function (req, res) {
  let id = _.trim(req.params.id || '');
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let name = req.body.name;
  let description = req.body.description;

  let i = _.findIndex(_Category, function (u) {
    return u.id === id
  })
  if (i > -1) {
    _Category[i].name = name;
    _Category[i].description = description;
    res.json({"errcode": 0, "errmsg": "修改成功"});
  } else {
    res.json({"errcode": 40009, "errmsg": "处理失败"});
  }
};
module.exports = categoryController;
