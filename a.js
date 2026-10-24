async function a(){
    //centaura = 8735521924
    // dead ahead = 5730562129
    const url = "https://games.roblox.com/v1/games/5730562129/servers/Public?limit=100" 
    let res = await fetch(url)
    let data = await res.json()
    let next = data.nextPageCursor
    let ret = []
    for(var x of data.data){
        ret.push(x)
    }
    while(next !== null){
        res = await fetch(`${url}&cursor=${next}`)
        data = await res.json()
        for(var x of data){
            ret.append(x)
        }
        next = data.nextPageCursor
    }
    return ret
}
let ret = await a()
for(var x of ret){
    console.log(`ID:: ${x.id.split('-')[0].slice(0,5)}`)
    console.log(x)
}