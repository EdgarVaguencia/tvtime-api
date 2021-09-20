const cheerio = require('cheerio')
const utils = require('./utils')

/**
 * Login tvtime.com
 * @param {string} user
 * @param {string} passw
 * @param {boolean} force
 */
function login (user, passw, force = false) {
  return new Promise((resolve, reject) => {
    if (utils.isLogin() && !force) {
      resolve('User is login')
      return
    }

    utils.post('/signin', {
      username: user,
      password: passw
    })
      .then(_ => {
        getUser()
          .then(resolve)
          .catch(reject)
      })
      .catch(reject)
  })
}

/**
 * Get Id User Profile
 */
function getUser (url = '/en') {
  return new Promise((resolve, reject) => {
    if (!utils.isLogin()) {
      resolve('User no login')
      return
    }

    utils.get(url)
      .then(resp => {
        const body = cheerio.load(resp.body)

        if (body('meta').attr('http-equiv') === 'refresh') {
          resolve(getUser('/en/add-shows'))
        } else {
          const linkProfile = body('li.profile a').attr('href').split('/')
          utils.setUser(resolve, linkProfile[3])
        }
      })
      .catch(reject)
  })
}

/**
 * Exit
 */
function signOut () {
  return new Promise((resolve, reject) => {
    if (!utils.isLogin()) {
      resolve('User no login')
      return
    }

    resolve(utils.get('/signout'))
  })
}

module.exports = { login, signOut }
