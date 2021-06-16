const cheerio = require('cheerio')
const util = require('./utils')

/**
 * Return yours list of series
 * @returns {Array} [ {id: {serieId}, name: {serieName}, img: {urlImage} } ]
 */
function getShows () {
  let listShows = []

  return new Promise((resolve, reject) => {
    if (!util.isLogin()) {
      resolve('User no login')
      return
    }
    const userId = util.getUser()

    util.get(`/en/user/${userId}/profile`)
      .then(resp => {
        const bodyParse = cheerio.load(resp.body)

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

        resolve(listShows)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * Return info about single serie
 * @param {int} serieId
 */
function getShow (serieId = 0) {
  let infoShows = {}
  return new Promise((resolve, reject) => {
    util.get(`/en/show/${serieId}`)
      .then(resp => {
        if (resp.statusCode === 200) {
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

          resolve(infoShows)
          return
        }
        reject(new Error('Page not found'))
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { getShows, getShow }
