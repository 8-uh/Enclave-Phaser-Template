const INSTRUCTIONS = `Welcome!
In this game, money rains from the sky!

Try catching it.

Use the left and right arrow keys
or tap the left and right sides of the screen
to move Gerty and collect money in the basket.

You have 90 seconds to collect as much money as you can.
`

EPT.Story = function(game) {};
EPT.Story.prototype = {
	create: function(){
		const {width, height} = this.world
		// initialize storage
		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		EPT.Storage.initUnset('EPT-highscore', 0);
		const highscore = EPT.Storage.get('EPT-highscore') || 0;

		// create menu spri
		this.logo = this.make.sprite(0, 0, 'logo');
		this.logo.anchor.setTo(0.5)
		this.logo.scale.setTo(0.5)

		this.sky = this.make.sprite(0, 0, 'sky')
		this.sky.anchor.setTo(0.5, 0)

		this.mountain = this.make.sprite(0, 0, 'mountain')
		this.mountain.anchor.setTo(0.5)

		this.sign = this.make.sprite(0, 0, 'sign')
		this.sign.anchor.setTo(0.5, 0)

		this.grassBack = this.make.sprite(0, 0, 'grass-back')
		this.grassBack.anchor.setTo(0.5, 0)

		this.grassMid = this.make.sprite(0, 0, 'grass-mid')
		this.grassMid.anchor.setTo(0,1)

		this.grassFront = this.make.sprite(0, 0, 'grass-front')
		this.grassFront.anchor.setTo(1)

		this.overlay = this.make.sprite(0, 0, 'overlay');
		this.title = this.make.text(0, 0, 'FPO Instructions Title', { font: "32px Arial", fill: "#fff" });
		this.instructions = this.make.text(0, 0, INSTRUCTIONS, {font: "16px Arial", fill:"#fff"})

		this.continuebtn = this.make.button(0, 0, 'button-continue', this.clickContinue, this, 1, 0, 2);
		this.continuebtn.anchor.setTo(1);
		this.continuebtn.scale.setTo(0.5)

		this.setObjectLocations()


	},

	setObjectLocations: function() {
		console.log('setObjectLocations')
		const {width, height} = this.world

		this.logo.x = width * 0.15
		this.logo.y = height * 0.15

		this.sky.x = width * 0.5
		this.sky.y = 0

		this.mountain.x = width * 0.5
		this.mountain.y = height * 0.48

		this.grassBack.x = width * 0.5
		this.grassBack.y = height * 0.5 + this.grassBack.height * 0.3

		this.grassMid.x = 0
		this.grassMid.y = height

		this.grassFront.x = width
		this.grassFront.y = height

		this.sign.x = width * 0.8
		this.sign.y = height * 0.5

		this.continuebtn.x = width - 20
		this.continuebtn.y = height - 20

		this.overlay.width = width
		this.overlay.height = height
		this.overlay.alpha = 0.75

		this.title.x = width * 0.4
		this.title.y = height * 0.1

		this.instructions.x = width * 0.1
		this.instructions.y = height * 0.4


		this.add.existing(this.sky)
		this.add.existing(this.mountain)
		this.add.existing(this.sign)
		this.add.existing(this.grassBack)
		this.add.existing(this.grassMid)
		this.add.existing(this.grassFront)
		this.add.existing(this.overlay)
		this.add.existing(this.logo)
		this.add.existing(this.title)
		this.add.existing(this.instructions)
		this.add.existing(this.continuebtn)


	},
	clickContinue: function() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('Game');
		}, this);
	}
};
