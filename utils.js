const axios = require("axios")
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
getSongAverage(AlbumLookupObj)
}
const getSongAverage = (album) => {
    const {trackcount, name, changedTracks} = album
    
    changedTracks.forEach(track=>{
        lyricsPerSong = {}
        return axios.get(`https://api.lyrics.ovh/v1/${name}/${track}`).then((response)=>{
            lyricsPerSong[track]= response.data.lyrics.length       
             if(Object.keys(lyricsPerSong).length === trackcount) {
                 return lyricsPerSong
             }
        }).catch((err)=>{
            lyricsPerSong[track] = 0
            if(Object.keys(lyricsPerSong).length === trackcount) {
                return lyricsPerSong
            }
        }).then((lyricsPerSong)=>{
            if(Object.keys(lyricsPerSong).length === trackcount) {
                calculateAlbumAverage({lyricsPerSong, track, name, trackcount})
            }
            
            
            
        }).catch((err)=>{

        })
        
    } )
    
}
const calculateAlbumAverage = (songInfo) =>{
    const {lyricsPerSong, track, name, trackcount} = songInfo
    const averages = Object.entries(lyricsPerSong)
    let albumLength = trackcount
    songsWithLyrics=[]
    songsWithOutLyrics=[]
    averages.forEach(song=>{
        const [title, lyrics] =song
        if(lyrics === 0) {
            songsWithOutLyrics.push(title)
            albumLength -= 1
        } else {
            songsWithLyrics.push(lyrics)
        }
    })
    console.log(trackcount,"trackcount")
    console.log(albumLength, "albumLength")
 console.log(`We couldn't find the lyrics for ${songsWithOutLyrics.length} songs. This album contains ${trackcount} tracks and the average lyrics per song for this album is ${songsWithLyrics.length? songsWithLyrics.reduce((a, b) => a + b, 0) / albumLength : 0}`)

}
const songLookup = (id) => {
    return axios.get(`http://musicbrainz.org/ws/2/release/${id}?inc=artist-credits+recordings&fmt=json`).then((response)=>{
        const {media} = response.data

        createLyricsLookupObj(media)
    })

}
const calculateAverageForAllAlbums = (albums) =>{

    console.log("calculateAverageForAllAlbums")
    const albumArray = Object.entries(albums)
    albumArray.forEach(album=>{
        [title, mbid] = album
        return axios.get(`http://musicbrainz.org/ws/2/release-group/${mbid}?inc=releases&fmt=json`).then((response)=>{
const {id} = response.data.release[0]
console.log(title, mbid,id)
        }).catch((error)=>{
            console.log(error)
        })
    })
    
    // return axios.get(`http://musicbrainz.org/ws/2/release-group/${albums[selectedAverage]}?inc=releases&fmt=json`).then((response)=>{
    //     const {id} = response.data.releases[0]
    //     songLookup(id)
    //     console.log(id)
    // })

}
module.exports = {getSongAverage, createLyricsLookupObj, songLookup, calculateAverageForAllAlbums}