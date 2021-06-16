const cheerio = require('cheerio')
const util = require('./utils')

/**
 * Return info about episode
 * @param {int} serieId
 * @param {int} episodeId
 */
function getEpisode (serieId = 0, episodeId = 0) {
  let infoEpisode = {}

  return new Promise((resolve, reject) => {
    util.get(`/en/show/${serieId}/episode/${episodeId}`)
      .then(resp => {
        if (resp.statusCode === 200) {
          let page = cheerio.load(resp.body)

          let watched = page('a.watched-btn')
          let episodeWatched = watched.hasClass('watched')

          let info = page('div.episode-infos')
          let name = info.children().find('span[itemprop="name"]').text()
          let overview = info.children().find('div.overview span.long').text().trim()
          let published = info.children().find('time[itemprop="datePublished"]').text()

          infoEpisode = {
            showId: serieId,
            episodeId: episodeId,
            name: name,
            overview: overview,
            published: published,
            watched: episodeWatched
          }
          resolve(infoEpisode)
          return
        }
        reject('Page not found')
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * Mark episode watch
 * @param {int} episodeId
 */
function episodeMark (episodeId = 0) {
  return new Promise((resolve, reject) => {
    if (!util.isLogin) {
      resolve('User not login')
      return
    }
    util.put('/watched_episodes', { episode_id: episodeId})
      .then(resp => {
        if (typeof resp === 'string') {
          resolve(resp)
          return
        } else {
          if (resp.statusCode === 200) {
            resolve('Ok')
            return
          } else {
            reject(resp.statusMessage)
          }
        }
      })
      .catch(err => {
        reject(err)
      })
  })

  // let cookies

  // if (util.getCookies().tvstRemember !== undefined) {
  //   cookies = { cookies: util.getCookies() }
  // } else {
  //   return 'User not login'
  // }

  // return needle('put', 'https://www.tvtime.com/watched_episodes',
  //   {
  //     episode_id: episodeId
  //   }, cookies)
  //   .then(resp => {
  //     if (resp.statusCode === 200) {
  //       return 'Ok'
  //     }

  //     if (resp.cookies.tvstRemember === 'deleted') {
  //       util.removeAccess()
  //       return 'Login expired'
  //     }
  //     return resp.statusMessage
  //   })
  //   .catch(err => {
  //     throw err
  //   })
}

module.exports = { getEpisode, episodeMark }
