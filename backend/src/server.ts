import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import axios from 'axios'
dotenv.config()
const app = express()
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 60
})
app.use(cors({
    origin:process.env.ORIGIN
}))
app.use(helmet())
app.use(rateLimiter)
app.set('trust proxy',1)
type responseType = {
    data:any;
    ok:boolean;
    msg:string
}
type requestType = {
    game:"centaura"|'deadahead'
}
type serverType = {
    id:string,
    maxPlayers:number,
    playing:number,
    playerTokens:never[],
    players:never[],
    fps:number,
    ping:number
}
let centaura:serverType[] = []
let deadahead:serverType[] = []
async function updateStatus(game:'centaura'|'deadahead'){
    let d = process.env.CENTAURA
    if(game === 'deadahead'){
        d = process.env.DEADAHEAD
    }
    try{
        const url = `https://games.roblox.com/v1/games/${d}/servers/Public?limit=100`
        let response = await axios.get(url)
        console.log(`Headers for ${game}:`, response.headers)
        let data = response.data
        let ret = []
        for(var x of data.data){
            ret.push(x)
        }
        let next = data.nextPageCursor
        while(next !== null){
            response = await axios.get(`${url}&cursor=${next}`)
            data = response.data
            for(var x of data.data){
                ret.push(x)
            }
            next = data.nextPageCursor
        }
        if(game === 'deadahead'){
            deadahead = ret
        } else{
            centaura = ret
        }
        const reset = response.headers['x-ratelimit-reset']
        console.log(`Reset header for ${game}:`, reset)
        return {limit: reset}
    }catch(e){
        console.error(`Error updating ${game}:`, e)
        return {limit:'60'}
    }
}
async function recur(){
    console.log("DA",deadahead.length)
    console.log("CEN",centaura.length)
    try {
        let res1 = await updateStatus("centaura")
        let res2 = await updateStatus("deadahead")
        let limit1 = parseInt(res1.limit)
        if (isNaN(limit1) || limit1 > 3600) limit1 = 60
        let limit2 = parseInt(res2.limit)
        if (isNaN(limit2) || limit2 > 3600) limit2 = 60
        let delay2 = Math.max(limit1, limit2)
        console.log("Next update in (s):", delay2)
        console.log("UPDATED")
        setTimeout(()=>{
            recur()
        },delay2 * 1000)
    }catch(e){
        console.log("WAIT", e)
        setTimeout(()=>{
            recur()
        },60 * 1000)
    }
}
recur()
app.get('/getStatus/:game',async(req:express.Request<requestType>,res:express.Response<responseType>)=>{
    let game = req.params.game
    if(game === 'centaura'){
        return res.json({data:centaura,ok:true,msg:'success'})
    }else if(game === 'deadahead'){
        return res.json({data:deadahead,ok:true,msg:'success'})
    }
})
app.listen(3000)