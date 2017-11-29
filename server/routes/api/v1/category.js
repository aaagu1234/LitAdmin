/***
 * books相关路由
 * 采用 restful api 风格
 */
var express = require('express');
var router = express.Router();
var indexRouter = {};
var userController = require('../../../controllers/user');
var controller = require('../../../controllers/category');

//先检查登录
router.use(userController.checkLogin);

//返回分类的集合
router.get('/', controller.find);
 
//创建book
router.post('/', controller.create);

//更新book全部信息
router.put('/:id', controller.update); 

indexRouter.router = router;

module.exports = indexRouter;
