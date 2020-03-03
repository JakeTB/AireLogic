const inquirer = require("inquirer")
const mb = require("musicbrainz")
inquirer
.prompt([
    {type:"input",
    message:"Which artist would you like to choose?",
    name: "artist",
}
]).then(answers => {
    const {artist} = answers
    console.log(artist)
})