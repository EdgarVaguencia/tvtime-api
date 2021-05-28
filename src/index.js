const user = require('./user.js')
const shows = require('./shows')

module.exports = {
  login: user.login,
  shows: shows.getShows,
  show: shows.getShow
}
