class Menu extends Phaser.Scene {

music;

    constructor () {
        super("Menu");
    }

    preload () {
        this.load.audio('dafunk', [
                'assets/music.mp3'
        ]);
    }

    create () {
        const background = this.add.rectangle(400, 300, 800, 600, 0x6666ff);
        const menuText = this.add.text(400, 200, 'Peaches and Cream\nWellness Bag Game', { fontSize: '60px', fill: 'white', fontFamily: 'Arial', align: "center" }).setOrigin(0.5);
        const button = this.add.text(400, 400, 'Play Game', {
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
            this.events.once('destroy', () => {
                        this.game.scene.add('Menu', Menu);
                    });
            this.scene.start("Game");
            this.scene.remove();;
        });

        // Play music
        this.music = this.sound.add('dafunk');
        this.music.play();
    }
}
