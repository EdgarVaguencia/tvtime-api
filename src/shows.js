const needle = require('needle')
const cheerio = require('cheerio')
const util = require('./utils')

/**
 * Return yours list of series
 * @returns {Array} [ {id: {serieId}, name: {serieName}, img: {urlImage} } ]
 */
async function getShows () {
  let cookies, userId
  let listShows = []

  cookies = util.getCookies()
  userId = util.getUser()

  return needle('get', `https://www.tvtime.com/en/user/${userId}/profile`, {
    cookies: cookies
  })
    .then((resp) => {
      let cook = resp.cookies

      if (resp.statusCode === 200 && cook.tvstRemember) {
        let bodyParse = cheerio.load(resp.body)

        bodyParse('ul.shows-list li.first-loaded')
          .each((index, item) => {
            let li = cheerio.load(item)
            let linkSerie = li('div.poster-details a')
            let imgSerie = li('div.image-crop img')

            listShows.push({
              id: linkSerie.attr('href').split('/')[3],
              name: linkSerie.text().trim(),
              img: imgSerie.attr('src')
            })
          })
      }
      return listShows
    })
    .catch(err => {
      throw err
    })
}

/**
 * Return info about single serie
 * @param {int} serieId
 */
async function getShow (serieId = 0) {
  let cookies
  let infoShows = {}

  cookies = util.getCookies()

  return needle('get', `https://www.tvtime.com/en/show/${serieId}`, {
    cookies: cookies
  })
    .then(resp => {
      if (resp.statusCode === 200 && resp.cookies.tvstRemember) {
        let page = cheerio.load(resp.body)

        let header = page('div.container-fluid div.heading-info')
        let info = page('div.show-nav')
        let temporadas = []

        page('div.seasons div.season-content').each((index, item) => {
          let divSeason = cheerio.load(item)

          let name = divSeason('span[itemprop="name"]').text()

          let episodios = []

          divSeason('ul.episode-list li').each((index, li) => {
            let episode = cheerio.load(li)

            let linkEpisode = episode('div.infos div.row a:first')
            let idEpisode = linkEpisode.attr('href').split('/')
            let nameEpisode = episode('div.infos div.row a span.episode-name').text().trim()
            let airEpisode = episode('div.infos div.row a span.episode-air-date').text().trim()
            let watchedBtn = episode('a.watched-btn')
            let episodeWatched = watchedBtn.hasClass('active')

            episodios.push({
              id: idEpisode[5],
              name: nameEpisode,
              airDate: airEpisode,
              watched: episodeWatched
            })
          })

          temporadas.push({
            name: name,
            episodes: episodios
          })
        })

        infoShows = {
          id: serieId,
          name: header.children('h1').text().trim(),
          overview: info.children().find('div.overview').text().trim(),
          seasons: temporadas
        }
      }
      return infoShows
    })
    .catch(err => {
      throw err
    })
}

module.exports = { getShows, getShow }
