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

        if (endCondition === "greed") {
            this.greedEnding();
        } 
        else if (endCondition === "timer") {
            this.sceneText.setText("Time's up!").setAlpha(1);
            endCondition = "";
        }
        else if (endCondition === "outofhamsters") {
            this.hamsterPoolEnding();
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

        hamsterPoolEnding() {
            const w = this.cameras.main.width;
            const h = this.cameras.main.height;
            this.fadeDuration = 2000;

            let winnerMessage = "";
            if (this.registry.get('p1Steals') > this.registry.get('p2Steals')) {
                winnerMessage = "Player 1 Wins!";
            } else if (this.registry.get('p2Steals') > this.registry.get('p1Steals')) {
                winnerMessage = "Player 2 Wins!";
            } else {
                winnerMessage = "It's a Tie!";
            }

            // Show winner first
            this.sceneText.setText(winnerMessage);
            this.phaseText();

            // After fadeDuration, show a recap of both players' totals
            setTimeout(() => {
                let noOfP1Hamsters = this.registry.get('p1Steals');
                let noOfP2Hamsters = this.registry.get('p2Steals');

                if (noOfP1Hamsters === undefined) noOfP1Hamsters = 0;
                if (noOfP2Hamsters === undefined) noOfP2Hamsters = 0;
                
                const recapText = `Final Scores:\nP1: ${noOfP1Hamsters} hamsters\nP2: ${noOfP2Hamsters} hamsters`;
                this.sceneText.setText(recapText);
                this.phaseText();
            }, this.fadeDuration * 2);
            

            setTimeout(() => {
                this.sceneText.setText("All the hamsters are gone...");
                this.phaseText();
            }, this.fadeDuration * 4);

            setTimeout(() => {
                this.sceneText.setText("The world mourns their loss...");
                this.phaseText();
            }, this.fadeDuration * 8);

            setTimeout(() => {
                this.sceneText.setText("Will anyone remember them?");
                this.phaseText();
            }, this.fadeDuration * 10);

            endCondition = "";
        }


}