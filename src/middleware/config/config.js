const { getConfig } = require("../../service/config/index")

const { ERRORCODE, throwError } = require("../../result/index")
const errorCode = ERRORCODE.CONFIG

const verifyConfig = async (ctx, next) => {
  let res = await getConfig()
  if (!res) {
    console.error("请完善博客网站信息(博客后台/博客网站信息管理)")
    return ctx.app.emit("error", throwError(errorCode, "请完善博客网站信息(博客后台/博客网站信息管理)"), ctx)
  }

  await next()
}

module.exports = {
  verifyConfig
}
