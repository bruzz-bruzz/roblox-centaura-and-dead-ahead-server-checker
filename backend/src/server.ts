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
    game:"centaura"|'dead_ahead'
}
app.get('/getStatus/:game',async(req:express.Request<requestType>,res:express.Response<responseType>)=>{
    try{
        let d = process.env.CENTAURA
        if(req.params.game === 'dead_ahead'){
            d = process.env.DEADAHEAD
        }
        const response = await axios.get(`https://games.roblox.com/v1/games/${d}/servers/Public`)
        const data = response.data
        const ret = []
        for(var x of data.data){
            ret.push(x)
        }
        return res.status(200).json({data:ret,ok:true,msg:'Data fetched successfully.'})
    }catch(e){
        return res.status(500).json({data:[],ok:false,msg:'An error occured.'})
    }
})
app.listen(3000)