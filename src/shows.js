const cheerio = require('cheerio')
const util = require('./utils')

/**
 * Return yours list of series
 * @returns {Array} [ {id: {serieId}, name: {serieName}, img: {urlImage} } ]
 */
function getShows () {
  const listShows = []

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
            const li = cheerio.load(item)
            const linkSerie = li('div.poster-details a')
            const imgSerie = li('div.image-crop img')

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
          const page = cheerio.load(resp.body)

          const header = page('div.container-fluid div.heading-info')
          const info = page('div.show-nav')
          const temporadas = []

          page('div.seasons div.season-content').each((index, item) => {
            const divSeason = cheerio.load(item)

            const name = divSeason('span[itemprop="name"]').text()

            const episodios = []

            divSeason('ul.episode-list li').each((index, li) => {
              const episode = cheerio.load(li)

              const linkEpisode = episode('div.infos div.row a:first')
              const idEpisode = linkEpisode.attr('href').split('/')
              const nameEpisode = episode('div.infos div.row a span.episode-name').text().trim()
              const airEpisode = episode('div.infos div.row a span.episode-air-date').text().trim()
              const watchedBtn = episode('a.watched-btn')
              const episodeWatched = watchedBtn.hasClass('active')

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
