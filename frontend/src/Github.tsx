import './App.css'
type Data = {
    profileURL:string,
    repoURL:string
}
export default function Github({profileURL,repoURL}:Data){
    return (
        <div className='p-4 text-center'>
            <h1>Made by bruzz-bruzz</h1>
            <h3><a className='underline text-blue-400 hover:text-blue-300 transition-colors' target='_blank' href={profileURL}>GitHub Profile</a></h3>
            <h4><a className='underline text-blue-400 hover:text-blue-300 transition-colors' target='_blank' href={repoURL}>Github Repository</a></h4>
        </div>
    )
}