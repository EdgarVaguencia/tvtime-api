const needle = require('needle')
const cheerio = require('cheerio')
const utils = require('./utils')

/**
 * Login tvtime.com
 * @param {string} user
 * @param {string} passw
 * @param {boolean} force
 */
async function login (user, passw, force = false) {
  let cookies

  await utils.getCookies()
    .then(d => { cookies = d })

  if (force || cookies.tvstRemember.length === 0) {
    await needle.post('https://www.tvtime.com/signin', {
      'username': user,
      'password': passw
    }, (err, resp) => {
      if (err) throw err

      let cookies = resp.cookies

      if (resp.statusCode === 200 && cookies.tvstRemember) {
        utils.setCookie({ tvstRemember: cookies.tvstRemember, symfony: cookies.symfony })
          .then(_ => {
            getUser()
              .then(_ => {
                console.info('Login Completo')
              })
          })
      } else {
        console.info(resp.body)
      }
    })
  } else {
    console.info('Session iniciada previamente')
  }
}

/**
 * Get Id User Profile
 */
async function getUser () {
  let cookies
  utils.getCookies()
    .then(d => { cookies = d })
  await needle.get('https://www.tvtime.com/es', {
    cookies: cookies
  }, (err, resp) => {
    if (err) throw err

    let bodyP = cheerio.load(resp.body)

    let linkProfile = bodyP('li.profile a').attr('href').split('/')
    utils.setUser(linkProfile[3])
  })
}

module.exports = { login }
