// Code Practice: Making a Scene
// Name: Suramya Shakya
// Date: 01/13/2025

"use strict"

let config = { //Feel free the change any config stuff, this is just a placeholder
    type: Phaser.AUTO,
    width: 1600,
    height: 800,
    backgroundColor: '#000000',
    scene: [MainMenu, Play, GameEnd],
}

let game = new Phaser.Game(config)
let endCondition
let keyShare1, keySteal1, keyShare2, keySteal2, keyEnter 