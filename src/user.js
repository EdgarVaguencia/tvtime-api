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
          .then(r => {
            resolve(r)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * Get Id User Profile
 */
function getUser () {
  return new Promise((resolve, reject) => {
    if (!utils.isLogin) {
      resolve('User no login')
      return
    }

    utils.get('/en')
      .then(resp => {
        const body = cheerio.load(resp.body)

        const linkProfile = body('li.profile a').attr('href').split('/')
        utils.setUser(r => {
          resolve(r)
        }, linkProfile[3])
      })
  })
}

/**
 * Exit
 */
function signOut () {
  if (!utils.isLogin()) {
    return 'User no login'
  }

  return utils.get('/signout')
}

module.exports = { login, signOut }
