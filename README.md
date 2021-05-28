TvTime-api
==========

Unofficial TvTime Api for node

Install
--------
```
npm install tvtime-api
```

Use
---
```
let tvtime = require('tvtime-api')

tvtime.login({username}, {password})

tvtime.show().then(data => {
  console.info(data)
})
```

Example of a response
---------------------
```json
[
  {
  "id": 260449,
  "name": "Vikings",
  "overview": "Ambitious Viking legend Ragnar Lothbrok, ascends from a young warrior to the King of the Viking tribes with the help of his shieldmaiden Lagertha, jealous brother Rollo, fearless
sons, and motley band of pillaging conquerors.",
  "seasons": [
    { "id": "4383243", "name": "Rites of Passage", "airDate": "2013-03-03" },
    { "id": "4383244", "name": "Wrath of the Northmen", "airDate": "2013-03-10" },
    { "id": "4383245", "name": "Dispossessed", "airDate": "2013-03-17" },
    { "id": "4383246", "name": "Trial", "airDate": "2013-03-24" },
    { "id": "4383248", "name": "Raid", "airDate": "2013-03-31" },
    { "id": "4383252", "name": "Burial of the Dead", "airDate": "2013-04-07" },
    { "id": "4383257", "name": "A King's Ransom", "airDate": "2013-04-14" },
    { "id": "4383260", "name": "Sacrifice", "airDate": "2013-04-21" },
    { "id": "4383261", "name": "All Change", "airDate": "2013-04-28" }
  ] },
    { "name": "Temporada 2", "episodes": [Array] },
    { "name": "Temporada 3", "episodes": [Array] },
    { "name": "Temporada 4", "episodes": [Array] },
    { "name": "Temporada 5", "episodes": [Array] },
    { "name": "Temporada 6", "episodes": [Array] }
  ]
}
]
```

Methods
-------
| Method | Parameter | login |Response |
| --- | --- | --- | --- |
| login | username, password | | Session |
| shows | | ✔ | List series you track |
| show | idShow | | Info serie and list episodes |
| episodeWatch | idEpisode | ✔ | Mark episode as watched |
| episode | idShow, idEpisode | ✔ | Info episode |
