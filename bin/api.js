const axios = require('axios')

/**
 * 获取用户信息
 * @param {int} id
 */
exports.findUserById = async (id) => {
  const res = await axios.request(
    `https://api.juejin.cn/user_api/v1/user/get?user_id=${id}`,
    {
      dataType: 'json'
    }
  )

  return res?.data
}

/**
 * 获取用户所有的帖子
 *
 * @param {*} uid
 * @param {*} cursor 每页开始编号
 * @returns JSON
 */
exports.getUserPosts = async (uid, cursor = 0) => {
  const res = await axios.request(
    `https://api.juejin.cn/content_api/v1/article/query_list?uuid=${uid}`,
    {
      data: {
        cursor: `${cursor}`,
        sort_type: 2,
        user_id: uid
      },
      headers: {
        'content-type': 'application/json'
      },
      method: 'post',
      dataType: 'json'
    }
  )

  return res?.data
}

/**
 * 获取帖子详情
 * @param {*} id
 * @returns JSON
 */
exports.getPostData = async (id) => {
  const res = await axios.request(
    `https://api.juejin.cn/content_api/v1/article/detail`,
    {
      data: {
        article_id: id
      },
      headers: {
        type: 'application/json'
      },
      method: 'post',
      dataType: 'json'
    }
  )

  return res?.data?.data
}
