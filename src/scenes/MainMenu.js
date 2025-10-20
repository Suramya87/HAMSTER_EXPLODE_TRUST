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


    }

    update() {

    }
}