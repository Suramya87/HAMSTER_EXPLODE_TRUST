class GameEnd extends Phaser.Scene {
    constructor() {
        super("endScene")
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.fadeDuration = 0;
        this.sceneText = this.add.text(w / 2, h / 4, '', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);
        if (endCondition == "greed") {
            this.greedEnding();
        }
        else if (endCondition = "timer") {
            this.sceneText.setText("Time\'s up!").setAlpha(1);
            endCondition = ""
        }
        else {
            this.add.text(w / 2, h / 3, 'Hullo?', {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);

        }




    }

    update() {

    }

    phaseText() {
        this.tweens.add({
            targets: this.sceneText,
            alpha: 1,
            duration: this.fadeDuration,
            onComplete: () => {
                this.tweens.add({
                    targets: this.sceneText,
                    alpha: 0,
                    duration: this.fadeDuration,
                });
            }
        });
    }

    greedEnding() {
        this.fadeDuration = 4000;
        this.sceneText.setText('Your greed has doomed us all...')
        this.phaseText()
        setTimeout(() => {
            this.sceneText.setText("Fires rampage through every major city in the world...")
            this.phaseText()
        }, this.fadeDuration * 2);
        setTimeout(() => {
            this.sceneText.setText("Natural ecosystems crumble, taking with them, countless lives...")
            this.phaseText()
        }, this.fadeDuration * 4);
        this.phaseText()
        setTimeout(() => {
            this.sceneText.setText("Was it worth it?")
            this.phaseText()
        }, this.fadeDuration * 6);
        endCondition = ""
        //Cue world exploding
    }
}