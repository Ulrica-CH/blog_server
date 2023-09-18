const path = require("path")

const { result, ERRORCODE, throwError } = require("../../result/index")
const errorCodeUpload = ERRORCODE.UPLOAD
const errorCodeConfig = ERRORCODE.CONFIG

const { updateConfig, getConfig, addView } = require("../../service/config/index")
const fs = require("fs")
const { upToQiniu, deleteImgs } = require("../../utils/qiniuUpload")

const { UPLOADTYPE, BASEURL } = require("../../config/config.default")
const { isValidUrl } = require("../../utils/tool")
class UtilsController {
  // 图片上传
  async upload(ctx) {
    const { file } = ctx.request.files

    // 使用七牛云上传
    if (file) {
      if (UPLOADTYPE == "qiniu") {
        // 创建文件可读流
        const reader = fs.createReadStream(file.filepath)
        // 命名文件
        const fileUrl = file.name
        // 调用方法
        const res = await upToQiniu(reader, fileUrl)
        let completeUrl = isValidUrl(BASEURL) ? BASEURL : 'http://' + BASEURL
        if (res) {
          ctx.body = result("图片上传成功", {
            url: completeUrl + res.hash,
          })
        }
      } else if (UPLOADTYPE == "online") {
        let completeUrl = isValidUrl(BASEURL) ? BASEURL : 'http://' + BASEURL

        ctx.body = result("图片上传成功", {
          url: completeUrl + 'online/' + path.basename(file.filepath),
        })
      } else {
        ctx.body = result("图片上传成功", {
          url: "http://127.0.0.1:8888/local/" + path.basename(file.filepath),
        })
      }
    } else {
      return ctx.app.emit("error", throwError(errorCodeUpload, "文件上传失败"))
    }
  }

  // 删除服务器下的照片
  async deleteOnlineImgs(imgList) {
    Array.isArray(imgList) && imgList.length && imgList.forEach(v => {
      if (v) {
        let filePath = path.join(__dirname, "./upload/online/" + v).replace('/controller/utils', '')
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    })
  }

  // 修改网站设置
  async updateConfig(ctx) {
    try {
      let config = await getConfig()
      // 如果背景图不一致，删除原来的
      const { avatar_bg, blog_avatar, qq_link, we_chat_link } = ctx.request.body

      if (UPLOADTYPE == "qiniu") {
        if (avatar_bg && config.avatar_bg && avatar_bg != config.avatar_bg) {
          await deleteImgs([config.avatar_bg.split("/").pop()])
        }
        if (blog_avatar && config.blog_avatar && blog_avatar != config.blog_avatar) {
          await deleteImgs([config.blog_avatar.split("/").pop()])
        }
        if (qq_link && config.qq_link && qq_link != config.qq_link) {
          await deleteImgs([config.qq_link.split("/").pop()])
        }
        if (we_chat_link && config.we_chat_link && we_chat_link != config.we_chat_link) {
          await deleteImgs([config.we_chat_link.split("/").pop()])
        }
      }

      const Utils = new UtilsController()
      if (UPLOADTYPE == 'online') {
        if (avatar_bg && config.avatar_bg && avatar_bg != config.avatar_bg) {
          await Utils.deleteOnlineImgs([config.avatar_bg.split("/").pop()])
        }
        if (blog_avatar && config.blog_avatar && blog_avatar != config.blog_avatar) {
          await Utils.deleteOnlineImgs([config.blog_avatar.split("/").pop()])
        }
        if (qq_link && config.qq_link && qq_link != config.qq_link) {
          await Utils.deleteOnlineImgs([config.qq_link.split("/").pop()])
        }
        if (we_chat_link && config.we_chat_link && we_chat_link != config.we_chat_link) {
          await Utils.deleteOnlineImgs([config.we_chat_link.split("/").pop()])
        }
      }

      let res = await updateConfig(ctx.request.body)

      ctx.body = result("修改网站设置成功", res)
    } catch (err) {
      console.error(err)
      return ctx.app.emit("error", throwError(errorCodeConfig, "修改网站设置失败"))
    }
  }
  // 获取网站设置
  async getConfig(ctx) {
    try {
      let res = await getConfig()
      ctx.body = result("获取网站设置成功", res)
    } catch (err) {
      console.error(err)
      return ctx.app.emit("error", throwError(errorCodeConfig, "获取网站设置失败"))
    }
  }
  // 增加网站访问次数
  async addView(ctx) {
    try {
      let res = await addView()
      ctx.body = result("增加访问量成功", res)
    } catch (err) {
      console.error(err)
      return ctx.app.emit("error", throwError(errorCodeConfig, "增加网站访问量失败"))
    }
  }
}

module.exports = new UtilsController()
