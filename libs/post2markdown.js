'use strict'

const {getPostData} = require('../bin/api')
const TurndownService = require('turndown')
const chalk = require('chalk')
const fs = require('fs')
const os = require('os')
const path = require('path')
const debug = require('debug')('markdown')

// 实例化 turndown
const turndownService = new TurndownService()

// 获取桌面路径
const desktopDir = path.join(os.homedir(), 'Desktop')
// 保存路径 桌面路径/掘金
const saveDir = `${desktopDir}/掘金`

module.exports = async (posts) => {
  debug('markdown posts:::', posts)
  let downSuccessCount = 0
  for (const post of posts) {
    // 查询文章内容
    const postData = await getPostData(post.article_id)
    debug('postData', postData)
    if (postData) {
      let mark_content = turndownService.turndown(
        postData.article_info.mark_content
      )

      // 由于mark_content中可能含有html标签，需要进行一次转换
      // 处理图片
      mark_content = mark_content.replace(/\\\[/g, '[')
      mark_content = mark_content.replace(/\\\]/g, ']')

      if (!mark_content) {
        console.log(
          `${chalk.yellow(' [Warn] ')} [${chalk.bgYellow.black(
            post.title
          )}]不是markdown格式，转换成markdown`
        )
        mark_content = turndownService.turndown(postData.article_info.content)
      }

      // 下载到本地

      // 判断本地是否已经有该用户的目录
      if (!fs.existsSync(`${saveDir}`)) {
        fs.mkdirSync(`${saveDir}`)
      }

      let downSaveType = 'user_name'

      try {
        if (!fs.existsSync(`${saveDir}/${post.user_name}`)) {
          downSaveType = 'user_name'
          fs.mkdirSync(`${saveDir}/${post.user_name}`)
        }
      } catch (error) {
        if (!fs.existsSync(`${saveDir}/${post.user_id}`)) {
          downSaveType = 'user_id'
          fs.mkdirSync(`${saveDir}/${post.user_id}`)
        }
      }

      try {
        // 写入文件
        fs.writeFileSync(
          `${saveDir}/${
            downSaveType === 'user_name' ? post.user_name : post.user_id
          }/${postData.article_info.title}.md`,
          mark_content
        )

        downSuccessCount++
      } catch (error) {
        fs.writeFileSync(
          `${saveDir}/${
            downSaveType === 'user_name' ? post.user_name : post.user_id
          }/${postData.article_info.article_id}.md`,
          mark_content
        )

        downSuccessCount++
      }

      console.log(
        `${chalk.green(' [SUCCESS] ')} [${
          postData.article_info.title
        }]文章下载成功`
      )
    }
  }

  return downSuccessCount
}
