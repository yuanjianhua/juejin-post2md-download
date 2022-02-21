const chalk = require('chalk')
const debug = require('debug')('prompts')
const cache = require('../libs/cache')
const {findUserById} = require('./api')

const inquirerList = [
  {
    type: 'input',
    name: 'juejin_user_id',
    message: '请输入要下载的掘金用户ID号',
    required: true,
    validate: async (value) => {
      if (!value) {
        return chalk.red('请输入掘金用户ID号')
      }

      // 验证该用户是否存在
      const res = await cache.wrap(value, function(){
        return findUserById(value)
      })
      debug('根据掘金ID获取用户信息：')
      debug(res)
      if (res.err_no === 0 && res.err_msg === 'success') {
        debug('res.data', JSON.stringify(res.data))
        await cache.set('user', res)
        return true
      } else {
        return chalk.red(`${chalk.white.bgRedBright.bold(res.err_msg)} 未查询到ID为 ${chalk.underline(value)} 的掘金用户`)
      }
    }
  }
]

exports.inquirerList = inquirerList
exports.confirmInquirerFun = async () => {
  const user = await cache.get('user')
  /**
   * 是否确定备份
   */
  const confirmInquirerList = [{
    type: 'confirm',
    name: 'confirm',
    message: `是否确定备份掘金用户 ${chalk.bgRed(user.data.user_name)} 的文章？`,
    default: true
  }]

  return confirmInquirerList
}
