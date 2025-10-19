class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('idleItem', 'assets/hammy.png');      // base object texture
        this.load.image('movingItem', 'assets/ham.png');      // moving/animated version
        this.load.spritesheet('Blast', 'assets/Fire_Blast.png', {
        frameWidth: 400,
        frameHeight: 400
});

        
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.panel1 = this.add.rectangle((w / 4) - 40, h * 0.75, 155, 75, 0x808080);
        this.panel2 = this.add.rectangle((w * 0.75) + 40, h * 0.75, 155, 75, 0x808080);

        this.share1 = this.add.rectangle((w / 4) - 75, h * 0.75, 50, 50, 0xff2c2c);
        this.steal1 = this.add.rectangle(w / 4, h * 0.75, 50, 50, 0xff2c2c);
        this.share2 = this.add.rectangle(w * 0.75, h * 0.75, 50, 50, 0xff2c2c);
        this.steal2 = this.add.rectangle((w * 0.75) + 75, h * 0.75, 50, 50, 0xff2c2c);


        this.prize = this.add.sprite(w / 2, h / 2, 'idleItem')
            .setOrigin(0.5)
            .setDepth(10);

        this.p1Choice = null;  
        this.p2Choice = null;
        this.reseting = false;
        this.anims.create({
            key: 'Boom',
            frames: this.anims.generateFrameNumbers('Blast', { 
                start: 7, 
                end: 9 
            }),
            frameRate: 15,
            repeat: 0
        });


        this.keyShare1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keySteal1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyShare2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keySteal2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        // Add labels to buttons
        this.add.text(this.share1.x, this.share1.y, 'Share', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.steal1.x, this.steal1.y, 'Steal', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.share2.x, this.share2.y, 'Share', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.steal2.x, this.steal2.y, 'Steal', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyShare1) && !this.p1Choice) {//would def be better to use listners preformance wise but it's just a color swap so...
            this.share1.fillColor = 0x008000;
            this.p1Choice = "share";
        }
        if (Phaser.Input.Keyboard.JustDown(this.keySteal1) && !this.p1Choice) {
            this.steal1.fillColor = 0x008000;
            this.p1Choice = "steal";
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyShare2) && !this.p2Choice) {
            this.share2.fillColor = 0x008000;
            this.p2Choice = "share";
        }
        if (Phaser.Input.Keyboard.JustDown(this.keySteal2) && !this.p2Choice) {
            this.steal2.fillColor = 0x008000;
            this.p2Choice = "steal";
        }

        if (this.p1Choice && this.p2Choice && !this.reseting) {//Reseting variable stops the creation of a bunch of timed callbacks
            this.reseting = true;

            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.evaluateChoices();
                },
                callbackScope: this
            });
        }
    }

    evaluateChoices() {
        console.log(`P1: ${this.p1Choice}, P2: ${this.p2Choice}`);

        if (this.p1Choice === "share" && this.p2Choice === "share") {
            console.log("Both shared. Play blast animation, then prize drops in.");

            this.prize.setAlpha(0); 

            const explosion = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Blast')
                .setScale(1)
                .setDepth(20);

            explosion.play('Boom');

            // When the animation is done
            explosion.on('animationcomplete', () => {
                explosion.destroy();

                this.time.delayedCall(500, () => {
                    // Drop prize from top
                    this.prize.setTexture('movingItem');
                    this.prize.setPosition(this.cameras.main.width / 2, -100);
                    this.prize.setAlpha(1);
                    this.prize.setScale(0.3);
                    this.prize.setRotation(Phaser.Math.DegToRad(180));

                    this.tweens.add({
                        targets: this.prize,
                        y: this.cameras.main.height / 2,
                        scale: 1,
                        rotation: 0,
                        ease: 'Bounce',
                        duration: 800,
                        onComplete: () => {
                            this.prize.setTexture('idleItem');
                        }
                    });
                });
            });


        } else if (this.p1Choice === "steal" && this.p2Choice === "share") {
            console.log("Player 1 stole and wins the object!");
            this.movePrizeTo("p1");
        } else if (this.p1Choice === "share" && this.p2Choice === "steal") {
            console.log("Player 2 stole and wins the object!");
            this.movePrizeTo("p2");
        } else if (this.p1Choice === "steal" && this.p2Choice === "steal") {
            console.log("Both stole. Game over.");
            this.tweens.add({
                targets: this.prize,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.prize.destroy();
                }
            });
        }

        this.time.addEvent({
            delay: 1500,
            callback: () => this.reset(),
            callbackScope: this
        });
    }

movePrizeTo(player) {
    const targetY = this.cameras.main.height * 0.75;
    const targetX = (player === "p1") ? this.share1.x : this.share2.x;

    if (player === "p1") {
        this.prize.flipY = true;
    }

    this.prize.setTexture('movingItem');

    const originalRotation = 0; 
    const angle = Phaser.Math.Angle.Between(this.prize.x, this.prize.y, targetX, targetY);
    this.prize.setRotation(angle);
    this.prize.setScale(0.5);

    this.tweens.add({
        targets: this.prize,
        x: targetX,
        y: targetY,
        duration: 500,
        ease: "Power5",
        scale: 0.2,
        onComplete: () => {
            this.prize.flipY = false;
            this.prize.setTexture('staticItem');

        }
    });
}


    reset() {
        this.share1.fillColor = 0xff2c2c;
        this.steal1.fillColor = 0xff2c2c;
        this.share2.fillColor = 0xff2c2c;
        this.steal2.fillColor = 0xff2c2c;

        this.p1Choice = null;
        this.p2Choice = null;
        this.reseting = false;

        if (this.prize && this.prize.active) {
            this.prize.setTexture('idleItem');
            this.prize.setRotation(0);
            this.prize.setAlpha(1);
            this.prize.setScale(1);
            this.prize.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
        }
    }
}
