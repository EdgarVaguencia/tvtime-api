import cheerio from 'cheerio'
import * as util from './utils'
import { MoreEpisode } from './types'

/**
 * Return info about episode
 */
export function episode(serieId: string, episodeId: string) {
    let infoEpisode: MoreEpisode

    return new Promise<MoreEpisode>((resolve, reject) => {
        util.get(`/en/show/${serieId}/episode/${episodeId}`)
            .then((resp: any) => {
                if (resp.statusCode === 200) {
                    const page = cheerio.load(resp.body)

                    const watched = page('a.watched-btn')
                    const episodeWatched = watched.hasClass('watched')

                    const info = page('div.episode-infos')
                    const name = info.children().find('span[itemprop="name"]').text()
                    const overview = info.children().find('div.overview span.long').text().trim()
                    const published = info.children().find('time[itemprop="datePublished"]').text()

                    infoEpisode = {
                        showId: serieId,
                        episodeId: episodeId,
                        name: name,
                        overview: overview,
                        published: published,
                        watched: episodeWatched
                    }
                    resolve(infoEpisode)
                    return
                }
                reject(new Error('Page not found'))
            })
            .catch(reject)
    })
}

/**
 * Mark episode watch
= */
export function episodeWatch(episodeId: string) {
    return new Promise((resolve, reject) => {
        if (!util.isLogin) {
            resolve('User not login')
            return
        }
        util.put('/watched_episodes', { episode_id: episodeId })
            .then((resp: any) => {
                if (typeof resp === 'string') {
                    resolve(resp)
                } else {
                    if (resp.statusCode === 200) {
                        resolve('Ok')
                    } else {
                        reject(resp.statusMessage)
                    }
                }
            })
            .catch(reject)
    })
}

/**
 *😀 Good = 1  |
 *😄 Fun = 2  |
 *😲 Wow = 3  |
 *😢 Sad = 4  |
 *🙄 So-so = 6  |
 *😶 Bad = 7
 */
export function episodeEmotions(episodeId: string, emotionId = 1) {
    return new Promise<string>((resolve, reject) => {
        if (!util.isLogin) {
            resolve('User not login')
            return
        }
        util.post('/emotions', { episode_id: episodeId, emotion_id: emotionId })
            .then((resp: any) => {
                console.info(resp)
                if (typeof resp === 'string') {
                    resolve(resp)
                } else {
                    if (resp.statusCode === 200) {
                        resolve('Ok')
                    } else {
                        reject(resp.statusMessage)
                    }
                }
            })
            .catch(reject)
    })
}
