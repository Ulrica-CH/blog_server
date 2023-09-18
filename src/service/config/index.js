const Config = require("../../model/config/config");
/**
 * 网站设置服务层
 */
class ConfigService {
  async updateConfig(config) {
    const { id } = config;
    let one = await Config.findByPk(id);

    let res;
    if (one) {
      res = await Config.update(config, {
        where: {
          id,
        },
      });
    } else {
      res = await Config.create(config);
    }

    return res ? true : false;
  }

  async getConfig() {
    let res = await Config.findAll();
    // 这里不能反悔 res[0].dataValues 因为dataValues不能格式化时间
    return res.length ? res[0] : false;
  }

  async addView() {
    let res = await Config.findAll();
    let config
    if (res.length) {
      config = await Config.findByPk(res[0].dataValues.id);
      config.increment(["view_time"], { by: 1 });
    }

    return config ? true : false;
  }
}

module.exports = new ConfigService();
