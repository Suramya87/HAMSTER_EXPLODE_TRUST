class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('idleItem', 'assets/hammy.png');
        this.load.image('movingItem', 'assets/ham.png');
        this.load.spritesheet('Blast', 'assets/Fire_Blast.png', {
            frameWidth: 400,
            frameHeight: 400
        });
        this.load.image('checkmark', 'assets/checkmark.png');
        this.load.audio('ding', 'assets/Point.mp3');
        this.load.audio('hamsterboom', 'assets/hamsterboom.mp3');
        this.load.audio('explosion', 'assets/BOOM.mp3');
        this.load.audio('song', 'assets/song1.mp3');
        this.load.audio('dramaboom', 'assets/dramatic_boom.mp3');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.RED = 0xff2c2c;
        this.GREEN = 0x008000;
        this.PANNEL = 0x808080;

        this.panel1 = this.add.rectangle((w / 4) - 40, h * 0.75, 155, 75, this.PANNEL);
        this.panel2 = this.add.rectangle((w * 0.75) + 40, h * 0.75, 155, 75, this.PANNEL);
        this.share1 = this.add.rectangle((w / 4) - 75, h * 0.75, 50, 50, this.RED);
        this.steal1 = this.add.rectangle(w / 4, h * 0.75, 50, 50, this.RED);
        this.share2 = this.add.rectangle(w * 0.75, h * 0.75, 50, 50, this.RED);
        this.steal2 = this.add.rectangle((w * 0.75) + 75, h * 0.75, 50, 50, this.RED);

        this.keyShare1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keySteal1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyShare2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySteal2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);


        this.add.text(this.share1.x, this.share1.y, 'Share', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.share1.x, this.share1.y - 50, 'A', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.steal1.x, this.steal1.y, 'Steal', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.steal1.x, this.steal1.y - 50, 'S', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.share2.x, this.share2.y, 'Share', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.share2.x, this.share2.y - 50, 'K', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.steal2.x, this.steal2.y, 'Steal', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.steal2.x, this.steal2.y - 50, 'L', { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);

        this.p1Checkmark = this.add.image(this.panel1.x, this.panel1.y + 70, 'checkmark').setOrigin(0.5).setScale(2.5).setVisible(false);
        this.p2Checkmark = this.add.image(this.panel2.x, this.panel2.y + 70, 'checkmark').setOrigin(0.5).setScale(2.5).setVisible(false);

        this.choicesMadeSound = this.sound.add('dramaboom', { volume: 1.25 });

        this.p1Choice = null;
        this.p2Choice = null;
        this.reseting = false;
        this.timerWasPaused = false;
        this.anims.create({
            key: 'Boom',
            frames: this.anims.generateFrameNumbers('Blast', { start: 7, end: 9 }),
            frameRate: 15,
            repeat: 0
        });

        this.hamsterPool = Phaser.Math.Between(5, 25);
        this.p1Steals = 0;
        this.p2Steals = 0;
        this.minHamsters = 1;
        this.maxHamsters = 3;

        this.lives = 3;
        this.livesText = this.add.text(w / 2, h * 0.05, `Lives: ${this.lives}`, { fontSize: '24px', color: '#ff6666' }).setOrigin(0.5);

        this.scoreText = this.add.text(w / 2, h * 0.15, `P1 Steals: 0 | P2 Steals: 0`, { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

        this.TEN_SECONDS = 10001;
        this.countdownTimer = this.time.addEvent({
            delay: this.TEN_SECONDS,
            callback: () => { console.log("Time's up! Both players failed to choose in time."); },
            callbackScope: this
        });
        this.displayTimer = this.add.text(w / 2, h * 0.1, `${this.getTimeInSeconds()}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.music = this.sound.add('song', { loop: true, volume: 0.5 });
        this.music.play();

        this.hamsters = [];
        this.spawnHamsters();
    }

    update() {
        if (this.countdownTimer.paused && !this.timerWasPaused) {
            if (this.music.isPlaying) this.music.stop();
            this.timerWasPaused = true;
        } else if (!this.countdownTimer.paused && this.timerWasPaused) {
            if (!this.music.isPlaying) this.music.play({ loop: true });
            this.timerWasPaused = false;
        }

        if (this.p1Choice) this.p1Checkmark.setVisible(true);
        if (this.p2Choice) this.p2Checkmark.setVisible(true);

        if (this.p1Choice && this.p2Choice) this.countdownTimer.paused = true;

        if (!this.countdownTimer.paused) {
            this.displayTimer.setText(`${this.getTimeInSeconds()}`);
        }

        if (this.countdownTimer.getRemaining() <= 0 && !this.countdownTimer.paused) {
            this.countdownTimer.paused = true;
            endCondition = "timer";
            this.scene.start("endScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyShare1) && !this.p1Choice) this.p1Choice = "share";
        if (Phaser.Input.Keyboard.JustDown(this.keySteal1) && !this.p1Choice) this.p1Choice = "steal";
        if (Phaser.Input.Keyboard.JustDown(this.keyShare2) && !this.p2Choice) this.p2Choice = "share";
        if (Phaser.Input.Keyboard.JustDown(this.keySteal2) && !this.p2Choice) this.p2Choice = "steal";

        if (this.p1Choice && this.p2Choice && !this.reseting) {
            this.reseting = true;
            this.choicesMadeSound.play();
            this.time.addEvent({
                delay: 2500,
                callback: () => { this.revealChoices(); },
                callbackScope: this
            });
        }
    }

    spawnHamsters() {
        this.hamsters.forEach(h => h.destroy());
        this.hamsters = [];

        const numHamsters = Phaser.Math.Between(this.minHamsters, this.maxHamsters);
        const spacing = this.cameras.main.width / (numHamsters + 1);
        const y = this.cameras.main.height / 2;

        for (let i = 0; i < numHamsters; i++) {
            const x = spacing * (i + 1) + Phaser.Math.Between(-20, 20);
            const ham = this.add.sprite(x, y - 50, 'idleItem').setOrigin(0.5).setDepth(10).setScale(1);
            this.hamsters.push(ham);
        }

        this.currentHamsterCount = numHamsters;
    }

    revealChoices() {
        this.choicesMadeSound.stop();
        if (this.p1Choice === "share") this.share1.fillColor = this.GREEN;
        else if (this.p1Choice === "steal") this.steal1.fillColor = this.GREEN;

        if (this.p2Choice === "share") this.share2.fillColor = this.GREEN;
        else if (this.p2Choice === "steal") this.steal2.fillColor = this.GREEN;

        this.sound.play('hamsterboom');
        this.time.addEvent({
            delay: 1250,
            callback: () => { this.evaluateChoices(); },
            callbackScope: this
        });
    }

    evaluateChoices() {
        this.hamsterPool -= this.currentHamsterCount;

        // If pool is empty, end game
        if (this.hamsterPool <= 0) {
            this.saveScores();
            endCondition = "outofhamsters";
            this.scene.start("endScene");
            return;
        }

        if (this.p1Choice === "share" && this.p2Choice === "share") {
            // Both share: hamsters fall down
            this.hamsters.forEach(h => {
                this.tweens.add({
                    targets: h,
                    y: this.cameras.main.height + 50,
                    alpha: 0,
                    duration: 1000,
                    ease: "Cubic.easeIn",
                    onComplete: () => h.destroy()
                });
            });

        } else if (this.p1Choice === "steal" && this.p2Choice === "share") {
            this.p1Steals += this.currentHamsterCount;
            this.scoreText.setText(`P1 Steals: ${this.p1Steals} | P2 Steals: ${this.p2Steals}`);
            this.moveHamstersTo("p1");

        } else if (this.p1Choice === "share" && this.p2Choice === "steal") {
            this.p2Steals += this.currentHamsterCount;
            this.scoreText.setText(`P1 Steals: ${this.p1Steals} | P2 Steals: ${this.p2Steals}`);
            this.moveHamstersTo("p2");

        } else if (this.p1Choice === "steal" && this.p2Choice === "steal") {
            // Both steal: explosion and lose lives
            this.sound.play('explosion');
            this.hamsters.forEach(h => {
                const explosion = this.add.sprite(h.x, h.y, 'Blast').setScale(0.8).setDepth(20);
                explosion.play('Boom');
                h.destroy();
                explosion.on('animationcomplete', () => explosion.destroy());
            });

            // Damage based on hamster count
            this.lives -= this.currentHamsterCount;
            if (this.lives < 0) this.lives = 0;
            this.livesText.setText(`Lives: ${this.lives}`);

            // Game over if out of lives
            if (this.lives <= 0) {
                this.saveScores();
                endCondition = "nolives";
                this.scene.start("endScene");
                return;
            }
        }

        this.saveScores();

        this.time.addEvent({
            delay: 1500,
            callback: () => this.reset(),
            callbackScope: this
        });
    }


    moveHamstersTo(player) {
        const targetY = this.cameras.main.height * 0.75;
        const targetX = (player === "p1") ? this.share1.x : this.share2.x;
        const flip = (player === "p1");

        this.sound.play('ding');

        this.hamsters.forEach(h => {
            h.setTexture('movingItem');
            const angle = Phaser.Math.Angle.Between(h.x, h.y, targetX, targetY);
            h.setRotation(angle);
            h.flipY = flip;

            this.tweens.add({
                targets: h,
                x: targetX,
                y: targetY,
                duration: 500,
                ease: "Power5",
                scale: 0.2,
                onComplete: () => {
                    h.flipY = false;
                    h.setTexture('idleItem');
                    h.setRotation(0);
                    h.setScale(1);
                }
            });
        });
    }
    saveScores() {
        this.registry.set('p1Steals', this.p1Steals);
        this.registry.set('p2Steals', this.p2Steals);
        this.registry.set('lives', this.lives);
    }


    getTimeInSeconds() {
        return Math.ceil(this.countdownTimer.getRemaining() / 1000);
    }

    reset() {
        this.share1.fillColor = this.RED;
        this.steal1.fillColor = this.RED;
        this.share2.fillColor = this.RED;
        this.steal2.fillColor = this.RED;

        this.p1Checkmark.setVisible(false);
        this.p2Checkmark.setVisible(false);

        this.p1Choice = null;
        this.p2Choice = null;
        this.reseting = false;

        this.spawnHamsters();

        this.countdownTimer.reset({
            delay: this.TEN_SECONDS,
            callback: () => { console.log("Time's up! Both players failed to choose in time."); },
            callbackScope: this,
        });
    }
}
