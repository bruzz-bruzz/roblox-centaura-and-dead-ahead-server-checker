import './App.css'
import {useState,useEffect} from 'react'
import axios from 'axios'
import daIcon from './assets/DA.webp'
import Github from './Github'
import cenIcon from './assets/CA.jpg'
export default function App(){
  const [daData,setDAData] = useState<null|any>(null)
  const [cenData,setCenData] = useState<null|any>(null)
  async function getDAData(){
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getStatus/deadahead`)
      setDAData(res.data)
    } catch (error) {}
  }
  async function getCenData(){
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getStatus/centaura`)
      setCenData(res.data)
    } catch (error) {}
  }
  useEffect(()=>{
    getDAData()
    getCenData()
  },[])
  return(
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">  
    <h1 className='text-center italic'>Updates every 1 minute or so</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Dead Ahead */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <img src={daIcon} className="w-12 h-12 rounded-full" alt="Dead Ahead Icon" />
            <h2 className="text-2xl font-semibold">Dead Ahead</h2>
            <a target='_blank' className='text-xl font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors' href='https://www.roblox.com/games/5730562129/DEAD-AHEAD'>Play</a>
          </div>
          
          {daData === null && <p className="text-gray-400">Loading...</p>}
          {daData !== null && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">{daData.data.length} servers active</p>
              {daData.data.map((val:any,idx:any)=>(
                <div key={idx} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                  <h3 className="font-bold text-lg mb-2">Server ID: {val.id.split("-")[0].slice(0,5)}</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <p>Players: <span className="font-medium">{val.playing} / {val.maxPlayers}</span></p>
                    <p>Ping: <span className="font-medium">{val.ping}ms</span></p>
                    <p>FPS: <span className="font-medium">{val.fps}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Centaura */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <img src={cenIcon} className="w-12 h-12 rounded-full" alt="Centaura Icon" />
            <h2 className="text-2xl font-semibold">Centaura</h2>
            <a target='_blank' className='text-xl font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors' href='https://www.roblox.com/games/8735521924/CENTAURA'>Play</a>
          </div>
          
          {cenData === null && <p className="text-gray-400">Loading...</p>}
          {cenData !== null && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">{cenData.data.length} servers active</p>
              {cenData.data.map((val:any,idx:any)=>(
                <div key={idx} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                  <h3 className="font-bold text-lg mb-2">Server ID: {val.id.split("-")[0].slice(0,5)}</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <p>Players: <span className="font-medium">{val.playing} / {val.maxPlayers}</span></p>
                    <p>Ping: <span className="font-medium">{val.ping}ms</span></p>
                    <p>FPS: <span className="font-medium">{val.fps}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Github profileURL={"https://github.com/bruzz-bruzz"} repoURL={"https://github.com/bruzz-bruzz/roblox-centaura-and-dead-ahead-server-checker"} />
    </div>
  )
}