import cheerio from 'cheerio'
import * as utils from './utils'

export function login(user: string, passw: string, force = false) {
    return new Promise((resolve, reject) => {
        if (utils.isLogin() && !force) {
            resolve('User is login')
            return
        }

        utils
            .post('/signin', {
                username: user,
                password: passw
            })
            .then((_) => {
                getUser().then(resolve).catch(reject)
            })
            .catch(reject)
    })
}

/**
 * Get Id User Profile
 */
export function getUser(url = '/en') {
    return new Promise((resolve, reject) => {
        if (!utils.isLogin()) {
            resolve('User no login')
            return
        }

        utils
            .get(url)
            .then((resp: any) => {
                const body = cheerio.load(resp.body)

                if (body('meta').attr('http-equiv') === 'refresh') {
                    resolve(getUser('/en/add-shows'))
                } else {
                    const linkProfile = body('li.profile a').attr('href')?.split('/')
                    utils.setUser(resolve, linkProfile ? linkProfile[3] : 0)
                }
            })
            .catch(reject)
    })
}

/**
 * Exit
 */
export function logout() {
    return new Promise((resolve, reject) => {
        if (!utils.isLogin()) {
            resolve('User no login')
            return
        }

        resolve(utils.get('/signout'))
    })
}
