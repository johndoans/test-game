class Game extends Phaser.Scene {

player;
cursors;
keyObjects;
clock = 60;
gameOver = false;
scoreText;
attempting_gesture = false;
instructionText;

left_moves = 0;
right_moves = 0;
march_moves = 0;
hug_moves = 0;
jump_moves = 0;
stretch_moves = 0;

stage = 0;
music;
scene_manager = this.scene;

stageText = [
    "P \n Jump up high like a Peach Pop!  \n Swipe UP to jump!",
    "E \n Stretch your arms out wide with energy! \n Swipe DOWN to stretch!",
    "A \n March in place, nice and strong! \n Press M to march!",
    "C \n Open your arms wide like a big hug! \n Swipe into the middle to hug!",
    "H \n Hop side to side with a smile! \n Use the LEFT and RIGHT arrow keys to move!",
];

    constructor () {
        super("Game");
    }

    preload () {
        this.load.image('sky', 'assets/outdoor.png');
        this.load.spritesheet('idle', 'assets/0 Idle Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jump', 'assets/1 Jump Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('stretch', 'assets/2 Stretch Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('march', 'assets/3 March Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('hug', 'assets/4 Hug Peach.png', { frameWidth: 64, frameHeight: 64 });
        this.load.audio('dafunk', [
                'assets/music.mp3'
            ]);
    }

    create () {
        // Get deltatime for precise timings
        this.timestep = new Phaser.Core.TimeStep(this.game, { forceSetTimeOut: true,
            target: 60, limit: 60 });

        // Switching assets to be more pixelated
        this.textures.get("idle").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("jump").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("stretch").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("march").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("hug").setFilter(Phaser.Textures.FilterMode.NEAREST);
        //  A simple background for our game
        this.add.image(400, 300, 'sky');

        // The player and its settings
        this.player = this.physics.add.sprite(400, 450, 'idle').setScale(2);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //  Add some drag
        this.player.setDamping(true);
        this.player.setDragX(0.001);

        // Play music
        this.music = this.sound.add('dafunk');
        this.music.play();

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 8 }),
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
            frameRate:8,
            repeat: 0
        });

        this.anims.create({
            key: 'stretch',
            frames: this.anims.generateFrameNumbers('stretch', { start: 0, end: 6 }),
            frameRate:8,
            repeat: 0
        });

        this.anims.create({
            key: 'march',
            frames: this.anims.generateFrameNumbers('march', { start: 0, end: 5 }),
            frameRate:8,
            repeat: -1
        });

        this.anims.create({
            key: 'hug',
            frames: this.anims.generateFrameNumbers('hug', { start: 0, end: 5 }),
            frameRate:8,
            repeat: 0
        });

        this.player.anims.play('idle', true);
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyObjects = this.input.keyboard.addKeys("M, S, H");

        //  The score
        this.scoreText = this.add.text(16, 16, 'Time: 0', { fontSize: '39px', fill: 'black', fontFamily: 'Arial' });
        this.instructionText = this.add.text(400, 200, '', { fontFamily: 'Arial', fontSize: 48, color: '#c51b7d', align: "center", wordWrap: { width: 700 } }).setOrigin(0.5);
        this.instructionText.setStroke('#de77ae', 5);

        // touch input
        let attempting_gesture = false;
        const graphics = this.add.graphics();

        this.input.on('pointerdown', pointer => {
            attempting_gesture = true;
        });

        this.input.on('pointerup', () => {
            attempting_gesture = false;
        });

        this.input.on('pointermove', pointer => {
            if (attempting_gesture) {
                const angle = pointer.getAngle();
                const downX = pointer.downX;
                const downY = pointer.downY;
                const distX = pointer.getDistanceX();
                const distY = pointer.getDistanceY();

                // console.log(pointer.downTime);
                // console.log("Angle: "+angle);
                // console.log("DistX: "+distX);
                // console.log("DistY: "+distY);
                // console.log("DownX: "+downX);
                // console.log("DownY: "+downY);

                // jump!
                if(distY >= 65 && (angle < -0.81 && angle > -2.35)) {
                    if (this.player.body.onFloor()) {
                        this.player.setVelocityY(-130);
                        this.player.anims.play('jump', true); 
                        this.player.anims.playAfterRepeat('idle'); 
                        this.jump_moves += 10;

                        attempting_gesture = false;
                    }
                }
                // stretch!
                else if(distY >= 41 && (angle > 0.81 && angle < 2.35)) {
                    this.player.anims.play('stretch', true);
                    this.player.anims.playAfterRepeat('idle'); 
                    attempting_gesture = false;
                    this.stretch_moves += 30;
                }
                // hug!
                else if(
                        (distX >= 80 && (angle > 2.55 || angle < -2.55) && downX >= 395) // first check (swiping left inward)
                        ||
                        (distX >= 80 && (angle < 0.59 && angle > -0.59) && downX <= 405) // first check (swiping left inward)
                    ){
                    this.player.anims.play('hug', true);
                    this.player.anims.playAfterRepeat('idle'); 
                    attempting_gesture = false;
                    this.hug_moves += 40;
                }
                /* //Debug
                graphics.clear();
                graphics.lineStyle(2, 0xffff00, 1);
                var line = new Phaser.Geom.Line(pointer.downX, pointer.downY, pointer.x, pointer.y);
                graphics.strokeLineShape(line);
                // console.log(pointer.downY + " " + pointer.y); // 65 units~ for jump
                console.log(pointer.getAngle());
                */
            }
        });
    }

    update (times, delta) {
        var pointer = this.input.pointer1; // touch
        const downX = pointer.downX;
        const downY = pointer.downY;
        const distX = pointer.getDistanceX();
        const distY = pointer.getDistanceY();

        if (this.clock <= 0 && this.stage != 5) {
            this.stage = 6;
            this.gameOver = true;
            this.scoreText.setText("");
        }

        if (this.gameOver) {

        } else if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-60);

            if (this.player.anims.isPlaying && this.player.anims.getName() != "jump") {
                this.player.anims.play('march', true);
                this.player.anims.playAfterRepeat('idle'); 
            }

            this.left_moves += 10;
        }
        else if(
                (this.cursors.right.isDown) ||
                ( distX <= 10 && distY <= 10 && downX >= 500  && pointer.getDuration() >= 750 && pointer.isDown  )
            )
        {
            this.player.setVelocityX(60);

            if (this.player.anims.isPlaying && this.player.anims.getName() != "jump") {
                this.player.anims.play('march', true);
                this.player.anims.playAfterRepeat('idle'); 
            }

            this.right_moves += 10;
        }
        else if (this.keyObjects.M.isDown)
        {
            this.player.anims.play('march', true);
            console.log(pointer);

            this.march_moves += 10;
        }
        else if (this.keyObjects.H.isDown)
        {
            this.player.anims.play('hug', true);
            this.player.anims.playAfterRepeat('idle'); 

            this.hug_moves += 10;
        }
        else if (this.keyObjects.S.isDown)
        {
            this.player.anims.play('stretch', true);
            this.player.anims.playAfterRepeat('idle'); 

            this.stretch_moves += 10;
        }
        else if (this.cursors.up.isDown && this.player.body.onFloor()) 
        {
            this.player.setVelocityY(-130);
            this.player.anims.play('jump', true); 
            this.player.anims.playAfterRepeat('idle'); 
            this.jump_moves += 10;
        }
        else {
            if (this.player.anims.isPlaying && this.player.anims.getName() != "jump"
                    && this.player.anims.getName() != "hug"
                    && this.player.anims.getName() != "stretch") {
                this.player.anims.play('idle', true);
            }
        }


        if (this.stage != 5 && this.stage != 6 && !this.gameOver) {
            this.clock -= 0.001*delta;
            this.scoreText.setText('Time: ' + Math.floor(this.clock));
        }

        this.instructionText.setText(this.stageText[this.stage]);

        // Shown instruction depends on number of movements
            if (this.stage == 0) {
                if (this.jump_moves >= 1) {
                    this.stage = 1;
                    this.resetMoves();
                }
            } else if (this.stage == 1) {
                if (this.stretch_moves >= 300) {
                    this.stage = 2;
                    this.resetMoves();
                }
            } else if (this.stage == 2) {
                if (this.march_moves >= 300) {
                    this.stage = 3;
                    this.resetMoves();
                }
            } else if (this.stage == 3) {
                if (this.hug_moves >= 300) {
                    this.stage = 4;
                    this.resetMoves();
                }
            } else if (this.stage == 4) {
                if (this.left_moves >= 100 && this.right_moves >= 100) {
                    this.stage = 5;
                    this.gameOver = true;
                    this.resetMoves();
                }
            } else if (this.stage == 5) {
                this.instructionText.setText( 'Congratulations, you did the P-E-A-C-H dance! \n You finished in ' + Math.floor(60 - this.clock) + " seconds!" );

                const button = this.add.text(400, 400, 'Main Menu', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#ffffff',
                    align: 'center',
                    fixedWidth: 260,
                    backgroundColor: '#2d2d2d'
                }).setPadding(32).setOrigin(0.5);

                button.setInteractive({ useHandCursor: true });

                button.on('pointerover', () => {
                    button.setBackgroundColor('#8d8d8d');
                });

                button.on('pointerout', () => {
                    button.setBackgroundColor('#2d2d2d');
                });

                button.on('pointerdown', () => {
                    this.scene.start("Menu");
                    this.scene.remove();
                });
            } else if (this.stage == 6) {
                this.instructionText.setText( "Unfortunately, you did not do the entire dance in time. But you can always try again!" );

                const button = this.add.text(400, 400, 'Main Menu', {
                    fontFamily: 'Arial',
                    fontSize: '32px',
                    color: '#ffffff',
                    align: 'center',
                    fixedWidth: 260,
                    backgroundColor: '#2d2d2d'
                }).setPadding(32).setOrigin(0.5);

                button.setInteractive({ useHandCursor: true });

                button.on('pointerover', () => {
                    button.setBackgroundColor('#8d8d8d');
                });

                button.on('pointerout', () => {
                    button.setBackgroundColor('#2d2d2d');
                });

                button.on('pointerdown', () => {
                    this.scene.start("Menu");
                    this.scene.remove();
                });
            }
    }

    resetMoves ( ) {
            // Reset moving for next stage
            this.left_moves = 0;
            this.jump_moves = 0;
            this.right_moves = 0;
            this.hug_moves = 0;
            this.stretch_moves = 0;
            this.march_moves = 0;
    }
}
