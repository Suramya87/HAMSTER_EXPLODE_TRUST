class MainMenu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const title = this.add.text(w / 2, h * 0.18, "HAMSTER TRUST — How to Play", {
            fontSize: '36px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const rulesText =
            "• This is a game of trust.\n\n" +
            "• Each round there is one hamster.\n" +
            "• Your goal is to finish with more hamsters than the other player.\n\n" +
            "Choices each round:\n" +
            "  - SHARE: You offer to share the hamster.\n" +
            "  - STEAL: You try to take the hamster.\n\n" +
            "Outcomes:\n" +
            "  - Both STEAL → The game ends immediately. Nobody wins.\n" +
            "  - Both SHARE → No one gets the hamster this round.\n" +
            "  - One STEAL + One SHARE → The STEALER gets the hamster.\n\n" +
            "Strategy tip: You want to STEAL when the other player SHAREs.";

        this.add.text(w * 0.1, h * 0.28, rulesText, {
            fontSize: '20px',
            color: '#dddddd',
            fontFamily: 'Arial',
            wordWrap: { width: w * 0.8 },
            align: 'left',
            lineSpacing: 8
        });

        const playButton = this.add.text(w / 2, h * 0.85, 'play', {
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