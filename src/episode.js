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
          const page = cheerio.load(resp.body)

          const watched = page('a.watched-btn')
          const episodeWatched = watched.hasClass('watched')

          const info = page('div.episode-infos')
          const name = info.children().find('span[itemprop="name"]').text()
          const overview = info.children().find('div.overview span.long').text().trim()
          const published = info.children().find('time[itemprop="datePublished"]').text()

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
        reject(new Error('Page not found'))
      })
      .catch(reject)
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
    util.put('/watched_episodes', { episode_id: episodeId })
      .then(resp => {
        if (typeof resp === 'string') {
          resolve(resp)
        } else {
          if (resp.statusCode === 200) {
            resolve('Ok')
          } else {
            reject(resp.statusMessage)
          }
        }
      })
      .catch(reject)
  })
}

module.exports = { getEpisode, episodeMark }
