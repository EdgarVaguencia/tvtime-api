const user = require('./user.js')
const shows = require('./shows')
const episode = require('./episode')

module.exports = {
  login: user.login,
  logout: user.signOut,
  shows: shows.getShows,
  show: shows.getShow,
  followShow: shows.followShow,
  unFollowShow: shows.unfollowShow,
  episode: episode.getEpisode,
  episodeWatch: episode.episodeMark
}
