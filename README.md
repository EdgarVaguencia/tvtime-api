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
      {
        "name": "Temporada 1",
        "episodes": [
          { "id": "4383243", "name": "Rites of Passage", "airDate": "2013-03-03", "watched": true },
          { "id": "4383244", "name": "Wrath of the Northmen", "airDate": "2013-03-10", "watched": true },
          { "id": "4383245", "name": "Dispossessed", "airDate": "2013-03-17", "watched": true },
          { "id": "4383246", "name": "Trial", "airDate": "2013-03-24", "watched": true },
          { "id": "4383248", "name": "Raid", "airDate": "2013-03-31", "watched": true },
          { "id": "4383252", "name": "Burial of the Dead", "airDate": "2013-04-07", "watched": true },
          { "id": "4383257", "name": "A King's Ransom", "airDate": "2013-04-14", "watched": false },
          { "id": "4383260", "name": "Sacrifice", "airDate": "2013-04-21", "watched": false },
          { "id": "4383261", "name": "All Change", "airDate": "2013-04-28", "watched": false }
        ]
      },
      { "name": "Temporada 2", "episodes": [Array...] },
      { "name": "Temporada 3", "episodes": [Array...] },
      { "name": "Temporada 4", "episodes": [Array...] },
      { "name": "Temporada 5", "episodes": [Array...] },
      { "name": "Temporada 6", "episodes": [Array...] }
    ]
  }
]
```

Methods
-------
| Method | Description | Parameter | Login required | Response |
| --- | --- | --- | --- | --- |
| login | Login to TvTime | username, password | | |
| logout | Logout (remove data) | | | |
| shows | Get list series you track | | ✔ | Array |
| show | Info serie and list episodes | idShow | | Array |
| followShow | Follow Show | idShow | ✔ | |
| unFollowShow | UnFollow Show | idShow | ✔ | |
| episodeWatch | Mark episode as watched | idEpisode | ✔ | |
| episode | Get info about | idShow, idEpisode | | Array |
