/**
 * 友链的路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/links" });

const { auth, needAdminAuthNotNeedSuper } = require("../middleware/auth/index");
const { addOrUpdateLinks, deleteLinks, approveLinks, getLinksList } = require("../controller/links/index");

// 新增友链
router.post("/addOrUpdate", addOrUpdateLinks);

// 删除友链
router.put("/delete", auth, needAdminAuthNotNeedSuper, deleteLinks);

// 批量审核友链
router.put("/approve", auth, needAdminAuthNotNeedSuper, approveLinks);

// 分页获取友链
router.post("/getLinksList", getLinksList);

module.exports = router;
