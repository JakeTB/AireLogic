const inquirer = require("inquirer")
const axios = require("axios")
const mb = require('musicbrainz');



const createLyricsLookupObj = (albumInfo) => {

        const {"track-count":trackcount, tracks} = albumInfo[0]
        const {"artist-credit":artistcredit} = tracks[0]
        const {artist:{name}} = artistcredit[0]
        const trackNames = [] 
        tracks.forEach(trackInfo=>{
            trackNames.push(trackInfo.title)
        })
        changedTracks = trackNames.map(track=>{

            
            return track.replace(/[^a-zA-Z ]+/ig, '')
        })
        
        const AlbumLookupObj = {
            trackcount,
            name,
            changedTracks
        }
getAlbumAverage(AlbumLookupObj)
        


    
}
const getAlbumAverage = (album) => {
    const {trackcount, name, changedTracks} = album
    
    changedTracks.forEach(track=>{
        lyricsPerSong = []
        console.log(`https://api.lyrics.ovh/v1/${name}/${track}`)
        return axios.get(`https://api.lyrics.ovh/v1/${name}/${track}`).then((response)=>{
            console.log("RESPONSE STATUS-------->", response.status )
            
         
            lyricsPerSong.push(response.data.lyrics.length)
            
       
             if(lyricsPerSong.length === trackcount) {
                 return lyricsPerSong
             }
        }).catch((err,response)=>{
            console.log(`No lyrics found for ${track}`)
            lyricsPerSong.push(0)
            if(lyricsPerSong.length === trackcount) {
                return lyricsPerSong
            }
        }).then((response)=>{
            if(response !== undefined) {
                console.log("PRINT ME")
                const averageLyrics = response.reduce((a, b) => a + b, 0) / trackcount
                console.log(`The average amount of lyrics per song is ${averageLyrics}`)
            }
            
        })
        
    } )
    
}
inquirer
.prompt([
    {type:"input",
    message:"Which artist would you like to choose?",
    name: "artist",
}
]).then(answers => {
    const {artist} = answers
return axios.get(`http://musicbrainz.org/ws/2/artist/?query=${artist}&fmt=json`).then((response)=>{
    const {artists} = response.data

const correctArtist = artists.filter(artistInfo=>{
    if(artistInfo.name.toLowerCase()===artist.toLowerCase()) {
        return artistInfo
    }
    
})

const {id} = correctArtist[0]
albumLookup(id)
})
    })
const albumLookup = (id) =>{
return axios.get(`http://musicbrainz.org/ws/2/artist/${id}?inc=release-groups&fmt=json`).then((response)=>{
    const {"release-groups":releasegroups} = response.data
    const averageOptions = ["Songs from all the albums"]
    const albumId = {}
releasegroups.forEach(album=>{
    const{title,id} = album
    averageOptions.push(title)
    albumId[`${title}`] = id

})
    return [averageOptions,albumId]
}).then((response) =>{
 const [choices, albums] =response
    inquirer
    .prompt([
        {type:"list",
        message:"Which average would you like to see?",
        choices,
        name:"selectedAverage"
    }
    ]).then((response)=>{
        const{selectedAverage} = response
        if(selectedAverage==="Songs from all the albums"){
        }
        return axios.get(`http://musicbrainz.org/ws/2/release-group/${albums[selectedAverage]}?inc=releases&fmt=json`).then((response)=>{
            const {id} = response.data.releases[0]
            songLookup(id)
            console.log(id)
        })
    })}
    
)
}
const songLookup = (id) => {
    return axios.get(`http://musicbrainz.org/ws/2/release/${id}?inc=artist-credits+recordings&fmt=json`).then((response)=>{
        const {media} = response.data

        createLyricsLookupObj(media)
    })

}
