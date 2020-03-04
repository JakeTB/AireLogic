const inquirer = require("inquirer")
const axios = require("axios")
const {createLyricsLookupObj, songLookup,calculateAverageForAllAlbums} =require("./utils")




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
            calculateAverageForAllAlbums(albums)
        }else {
            return axios.get(`http://musicbrainz.org/ws/2/release-group/${albums[selectedAverage]}?inc=releases&fmt=json`).then((response)=>{
                const {id} = response.data.releases[0]
                songLookup(id)
                console.log(id)
            })  
        }
       
    })}
    
)
}

