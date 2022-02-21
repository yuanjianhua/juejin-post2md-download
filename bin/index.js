#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const cache = require('../libs/cache')
const {inquirerList, confirmInquirerFun} = require('./prompts')
const userPosts = require('../libs/posts')
const inquirer = require('inquirer')
const post2markdown = require('../libs/post2markdown')
const debug = require('debug')('cli')

let user = {}

/**
 * 版本号
 */
program
  .version(
    `v${require('../package.json').version}`,
    '-v, --version',
    '当前版本'
  )
  .usage('<command> [options]')

program.parse(process.argv)

async function startDownLoad() {
  await inquirer.prompt(inquirerList)
  const confirmInquirerList = await confirmInquirerFun()
  const answer = await inquirer.prompt(confirmInquirerList)
  debug('answer', answer)
  if (answer.confirm) {
    // 开始处理备份逻辑
    // 读取所有文章->读取单篇文章内容->转换成md文件，存储在本地
    const {data: user} = await cache.get('user')
    const postsRes = await userPosts(user.user_id, 0)
    debug('post', postsRes)

    if (postsRes.statusCode) {
      const downSuccessCount = await post2markdown(postsRes.posts)

      console.log(
        `${chalk.blue(' [TIP] ')} 总计 ${chalk.bold.green(
          downSuccessCount + '篇'
        )} 下载成功，${chalk.bold.red(
          postsRes.posts.length - downSuccessCount + '篇'
        )}下载失败`
      )
    } else {
      console.error(
        `${chalk.bgRed.white(' [ERROR] ')}${chalk.red(
          '❌ 备份失败'
        )} ${chalk.gray('【错误信息：获取文章失败】')}`
      )
    }
  } else {
    console.warn(
      `${chalk.bgYellow.black(' [WARN] ')}${chalk.yellow('⚠️ 取消备份')}`
    )
  }
}

startDownLoad()
