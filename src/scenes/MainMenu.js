class MainMenu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    create() {



        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * .75, 'Play', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#333',
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('playScene');
        });

        keyShare1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keySteal1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keyShare2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        keySteal2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {

    }
}