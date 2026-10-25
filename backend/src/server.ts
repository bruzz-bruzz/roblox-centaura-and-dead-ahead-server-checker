import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import axios from 'axios'
dotenv.config()
const app = express()
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})
app.use(cors({
    origin:process.env.ORIGIN
}))
app.use(helmet())
app.use(rateLimiter)
type responseType = {
    data:any;
    ok:boolean;
    msg:string
}
type requestType = {
    game:"centaura"|'deadahead'
}
let centaura = {}
let deadahead = {}
async function updateStatus(game:'centaura'|'deadahead'){
    let d = process.env.CENTAURA
    if(game === 'deadahead'){
        d = process.env.DEADAHEAD
    }
    const url = `https://games.roblox.com/v1/games/${d}/servers/Public?limit=100`
    let response = await axios.get(url)
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
    } else{centaura = ret}
    return {limit:response.headers['x-ratelimit-reset']}
}
async function recur(){
    try {
        let limit = await updateStatus("centaura")
    let limit2 = await updateStatus("deadahead")
    let delay2 = Math.max(parseInt(limit.limit),parseInt(limit2.limit))
    console.log(delay2 * 1000)
    console.log("UPDATED")
    setTimeout(()=>{
        recur()
    },delay2 * 1000)
    }catch(e){
        console.log("WAIT")
        setTimeout(()=>{
            recur()
        },60 * 1000)
    }
}
recur()
app.get('/getStatus/:game',async(req:express.Request<requestType>,res:express.Response<responseType>)=>{
    let game = req.params.game
    if(game === 'centaura'){
        res.json({data:centaura,ok:true,msg:'success'})
    }else if(game === 'deadahead'){
        res.json({data:deadahead,ok:true,msg:'success'})
    }
})
app.listen(3000)