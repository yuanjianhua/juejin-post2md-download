'use strict'

const debug = require('debug')('post')
const {getUserPosts} = require('../bin/api')

/**
 * 获取用户文章集合
 */
function userPosts(uid, cursor = 0) {
  // 用户的所有文章
  let posts = {
    statusCode: 1,
    posts: []
  }

  async function getUserPostsNext() {
    let isLastPage = false
    const res = await getUserPosts(uid, cursor)
    // debug('posts', res)

    if (res.err_no === 0 && res.err_msg === 'success') {
      if (res.data?.length) {
        // 判断是否还有更多的post
        if(!res.has_more){
          isLastPage = true
        }
        // 追加到posts集合中
        for (let i = 0; i < res.data.length; i++) {
          const {
            article_id,
            article_info: {
              title,
              brief_content,
              view_count,
              digg_count,
              comment_count,
              mtime
            },
            author_user_info: {user_id, user_name}
          } = res.data[i]
          const item = {
            article_id,
            title,
            brief_content,
            view_count,
            digg_count,
            comment_count,
            user_id,
            user_name,
            mtime
          }
          posts['posts'].push(item)
        }

        cursor += res.data.length
      } else {
        // 结尾
        isLastPage = true
      }
    } else {
      // 请求失败
      posts.statusCode = 0
    }
    debug('final posts', posts)
    if (!isLastPage) {
      return await getUserPostsNext()
    } else {
      return posts
    }
  }

  return getUserPostsNext()
}

module.exports = userPosts
