const inquirer = require("inquirer")
const axios = require("axios")


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
console.log(correctArtist)
})
    })
  
 
