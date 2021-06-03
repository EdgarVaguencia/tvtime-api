const needle = require('needle')
const cheerio = require('cheerio')
const util = require('./utils')

/**
 * Return info about episode
 * @param {int} serieId
 * @param {int} episodeId
 */
async function getEpisode (serieId = 0, episodeId = 0) {
  let infoEpisode = {}
  let cookies = util.getCookies() ? { cookies: util.getCookies() } : {}

  return needle('get', `https://www.tvtime.com/es/show/${serieId}/episode/${episodeId}`, cookies)
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
      }
      return infoEpisode
    })
    .catch(err => {
      throw err
    })
}

/**
 * Mark episode watch
 * @param {int} episodeId
 */
async function episodeMark (episodeId = 0) {
  let cookies

  if (util.getCookies().length !== undefined) {
    cookies = { cookies: util.getCookies() }
  } else {
    return 'User not login'
  }

  return needle('put', 'https://www.tvtime.com/watched_episodes',
    {
      episode_id: episodeId
    }, cookies)
    .then(resp => {
      if (resp.statusCode === 200) {
        return 'Completado'
      }
      return resp.statusMessage
    })
    .catch(err => {
      throw err
    })
}

module.exports = { getEpisode, episodeMark }
