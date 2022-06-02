import * as tv from './index'
require('dotenv').config()

tv.login(process.env.TVuser!, process.env.TVpass!).then((s: any) => {
    tv.shows().then((data: any) => {
        console.info(JSON.stringify(data, undefined, 2))

        tv.show(data[2].id).then((data: any) => {
            console.info(JSON.stringify(data, undefined, 2))

            console.log(typeof data.id)
        })
    })

    //tvtime.logout()
})
