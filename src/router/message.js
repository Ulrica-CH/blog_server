/**
 * 留言的路由
 * @author: M
 */
const Router = require("koa-router");
const router = new Router({ prefix: "/message" });

const { addMessage, updateMessage, deleteMessage, likeMessage, cancelLikeMessage, getMessageList, getMessageTag } = require("../controller/message/index");

// 新增留言
router.post("/add", addMessage);
// 修改留言
router.post("/update", updateMessage);

// 删除留言
router.put("/delete", deleteMessage);

// 点赞留言
router.put("/like/:id", likeMessage);

// 取消点赞留言
router.put("/cancelLike/:id", cancelLikeMessage);

// 分页获取留言
router.post("/getMessageList", getMessageList);

// 获取热门标签
router.get("/getHotTagList", getMessageTag);


module.exports = router;
