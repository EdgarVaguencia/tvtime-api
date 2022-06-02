import fs from 'fs'
import path from 'path'
import needle from 'needle'
const urlBase = 'https://www.tvtime.com'
let credFile = path.join(__dirname, 'access.json')
let exist = fs.existsSync(credFile)
    ? null
    : fs.writeFileSync(
          credFile,
          JSON.stringify({
              symfony: '',
              tvstRemember: '',
              user: 0
          }),
          'utf8'
      )

export function getCookies() {
    const setting = require(credFile)
    let cookies
    if (setting.tvstRemember.length > 0) {
        cookies = {
            tvstRemember: setting.tvstRemember,
            symfony: setting.symfony
        }
    } else cookies = {}
    return cookies
}

export function getUser() {
    const setting = require(credFile)
    let userId: string | number
    if (setting.user > 0) {
        userId = setting.user
    } else userId = 0

    return userId
}

export async function setCookie(callback: any, obj: any, remove = false) {
    let setting = require(credFile)
    setting = Object.assign(setting, obj)

    await fs.open(credFile, 'w', (err, d) => {
        if (err) console.error(err)

        fs.write(d, JSON.stringify(setting, null, '\t'), 0, 'utf-8', (err) => {
            if (err) return err

            const txt = remove ? 'Deleting credentials' : 'Storing credentials'

            callback(txt)
        })
    })
}

export function setUser(callback: any, userId: any = 0) {
    setCookie(callback, { user: userId })
}

function removeAccess() {
    return new Promise((resolve, reject) => {
        setCookie(
            (r: any) => {
                resolve(r)
            },
            { tvstRemember: '', symfony: '', user: 0 },
            true
        )
    })
}

export function isLogin() {
    if (getCookies().tvstRemember !== undefined) {
        return true
    }
    return false
}

export function get(urlPath: string, data?: any) {
    const url = urlBase + urlPath
    const cookies = { cookies: getCookies() }

    return new Promise((resolve, reject) => {
        needle('get', url, data, cookies)
            .then((resp) => {
                if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                    return removeAccess().then(resolve)
                }

                resolve(resp)
            })
            .catch(reject)
    })
}

export function post(urlPath: string, data?: any) {
    const url = urlBase + urlPath
    const cookies = { cookies: getCookies() }

    return new Promise((resolve, reject) => {
        needle('post', url, data, cookies)
            .then((resp) => {
                const cookies = resp.cookies

                if (cookies?.tvstRemember) {
                    setCookie(
                        (d: any) => {
                            resolve(d)
                        },
                        { tvstRemember: cookies.tvstRemember, symfony: cookies.symfony }
                    )
                } else {
                    resolve('')
                }
            })
            .catch(reject)
    })
}

export function put(urlPath: string, data?: any) {
    const url = urlBase + urlPath
    const cookies = { cookies: getCookies() }

    return new Promise((resolve, reject) => {
        needle('put', url, data, cookies)
            .then((resp) => {
                if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                    return removeAccess().then(resolve).catch(reject)
                }
                resolve(resp)
            })
            .catch(reject)
    })
}

export function deleted(urlPath: string, data: any) {
    const url = urlBase + urlPath
    const cookies = { cookies: getCookies() }

    return new Promise((resolve, reject) => {
        needle('delete', url, data, cookies)
            .then((resp) => {
                if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                    return removeAccess().then(resolve).catch(reject)
                }
                resolve(resp)
            })
            .catch(reject)
    })
}
