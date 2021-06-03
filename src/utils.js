const fs = require('fs')
const setting = require(`${__dirname}/access.json`)

function getCookies () {
  let cookies = {}
  if (setting.tvstRemember.length > 0) {
    cookies = {
      tvstRemember: setting.tvstRemember,
      symfony: setting.symfony
    }
  }
  return cookies
}

function getUser () {
  let userId = 0
  if (setting.user > 0) {
    userId = setting.user
  }
  return userId
}

async function setCookie (obj, remove = false) {
  let current = setting
  current.tvstRemember = obj.tvstRemember
  current.symfony = obj.symfony

  await fs.writeFile(`${__dirname}/access.json`, JSON.stringify(current), err => {
    if (err) throw err

    remove ? console.info('Credenciales eliminadas') : console.info('Credenciales almacenadas')
  })
}

async function setUser (userId = 0) {
  let current = setting
  current.user = userId

  await fs.writeFile(`${__dirname}/access.json`, JSON.stringify(current), err => {
    if (err) throw err

    userId === 0 ? console.info('Usuario eliminado') : console.info('Usuario almacenado')
  })
}

function removeCookie () {
  setCookie({ tvstRemember: '', symfony: '' }, true)
}

function removeUser () {
  setUser()
}

module.exports = { getCookies, getUser, setCookie, setUser, removeCookie, removeUser }
