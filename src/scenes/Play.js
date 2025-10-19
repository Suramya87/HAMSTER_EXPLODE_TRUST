class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        let w = this.cameras.main.width;
        let h = this.cameras.main.height;

        this.panel1 = this.add.rectangle((w / 4) - 40, (h * .75), 155, 75, 0x808080);
        this.panel2 = this.add.rectangle((w * .75) + 40, (h * .75), 155, 75, 0x808080);

        this.share1 = this.add.rectangle((w / 4) - 75, h * .75, 50, 50, 0xff2c2c);
        this.steal1 = this.add.rectangle(w / 4, h * .75, 50, 50, 0xff2c2c);

        this.share2 = this.add.rectangle(w * .75, h * .75, 50, 50, 0xff2c2c);
        this.steal2 = this.add.rectangle((w * .75) + 75, h * .75, 50, 50, 0xff2c2c);

        this.p1Choice = false;
        this.p2Choice = false;
        this.reseting = false;

        keyShare1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keySteal1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keyShare2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        keySteal2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyShare1) && !this.p1Choice) { //would def be better to use listners preformance wise but it's just a color swap so...
            this.share1.fillColor = 0x008000;
            this.p1Choice = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keySteal1) && !this.p1Choice) {
            this.steal1.fillColor = 0x008000;
            this.p1Choice = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyShare2) && !this.p2Choice) {
            this.share2.fillColor = 0x008000;
            this.p2Choice = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keySteal2) && !this.p2Choice) {
            this.steal2.fillColor = 0x008000;
            this.p2Choice = true;
        }
        if (this.p1Choice && this.p2Choice && !this.reseting) { //Reseting variable stops the creation of a bunch of timed callbacks
            this.reseting = true;
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.reset();
                },
                callbackScope: this
            });

        }
    }


    reset() {
        this.share1.fillColor = 0xff2c2c;
        this.steal1.fillColor = 0xff2c2c;
        this.share2.fillColor = 0xff2c2c;
        this.steal2.fillColor = 0xff2c2c;
        this.p1Choice = false;
        this.p2Choice = false;
        this.reseting = false;
    }
}