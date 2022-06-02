export interface ShowInfo {
    id: string
    name: string
    overview: string
    seasons: Season[]
}

export interface Season {
    name: string
    episodes: Episode[]
}

export interface BasicShowInfo {
    id: string
    name: string
    img: string
}

export interface Episode {
    id: string
    name: string
    airDate: string
    watched: boolean
}

export interface MoreEpisode {
    showId: string
    episodeId: string
    name: string
    overview: string
    published: string
    watched: boolean
}
