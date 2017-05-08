EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	init: function(firstrun) {
		 console.log('init:', firstrun)
		this.firstrun = firstrun
	},
	create: function() {
		// this.add.sprite(0, 0, 'background');
		const {width, height} = this.world
		// initialize storage
		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		EPT.Storage.initUnset('EPT-highscore', 0);
		const highscore = EPT.Storage.get('EPT-highscore') || 0;

		// create menu spri
		this.logo = this.make.sprite(0, 0, 'logo');
		this.logo.anchor.setTo(0.5)

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
		this.grassFront.anchor.setTo(1,1)

		this.mathsLogo = this.make.sprite(0, 0, 'mathsweek-logo')
		this.mathsLogo.anchor.setTo(1,1)

		// this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		// this.buttonAudio.anchor.set(1,0);
		//
		// var buttonAchievements = this.add.button(20, this.world.height-20, 'button-achievements', this.clickAchievements, this, 1, 0, 2);
		// buttonAchievements.anchor.set(0,1);

		const highscoreStyle = { font: "32px Arial", fill: "#000" };
		const textHighscore = this.add.text(0, 0, 'Highscore: '+highscore, highscoreStyle);
		textHighscore.anchor.set(0.5,1);

		EPT._manageAudio('init',this);
		// Turn the music off at the start:
		EPT._manageAudio('off',this);

		//this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.//easing.Exponential.Out, true);

		//this.add.tween(buttonAchievements).to({y: this.world.height-20}, 500, Phaser.//easing.Exponential.Out, true);

		//this.camera.flash(0x000000, 500, false);
		this.setStartingLocations()
		if(this.firstrun) {
			console.log('should start introanimation')
			this.introAnimation()
		} else {
			console.log('should set final object locations')
			//this.setObjectLocations()
		}
	},


	setStartingLocations: function() {
		console.log('starting locations')
		const {width, height} = this.world
		this.sky.x = width * 0.5
		this.sky.y = height

		this.mountain.x = width * 0.5
		this.mountain.y = -this.mountain.height

		this.grassBack.x = width * 0.5
		this.grassBack.y = height

		this.grassMid.x = -this.grassMid.width
		this.grassMid.y = height

		this.grassFront.y = height
		this.grassFront.x = width + this.grassFront.width

		this.sign.x = width * 0.8
		this.sign.y = height + this.sign.height

		this.logo.x = width * 0.15
		this.logo.y = height * 0.15
		this.logo.scale.setTo(0)

		this.mathsLogo.x = width * 0.98
		this.mathsLogo.y = height * 0.98
		this.mathsLogo.scale.setTo(0.5)
		this.mathsLogo.alpha = 0

		this.add.existing(this.sky)
		this.add.existing(this.logo)
		this.add.existing(this.mountain)
		this.add.existing(this.sign)
		this.add.existing(this.grassBack)
		this.add.existing(this.grassMid)
		this.add.existing(this.grassFront)
		this.add.existing(this.mathsLogo)
		console.log('starting positons set')
	},
	introAnimation: function() {
		console.log('introAnimation')
		const {
			sky,
			logo,
			mountain,
			sign,
			grassBack,
			grassMid,
			grassFront,
			mathsLogo,
		} = this

		const {width, height} = this.world

		timeline = anime.timeline()
		timeline
		.add({
			targets: sky,
			y: 0,
			easing: `easeOutExpo`,
			duration: 1250
		})
		.add({
			targets: mountain,
			y: height * 0.48,
			easing: 'easeOutElastic',
			duration: 1750,
			offset: 5000
		})
		.add({
			targets: grassBack,
			y: height * 0.5 + this.grassBack.height * 0.3,
			easing: 'easeOutBack',
			offset: 1750,
		})
		.add({
			targets: grassMid,
			x: 0,
			easing: 'easeOutExpo',
			offset: 1000,
			duration: 750,
		})
		.add({
			targets: grassFront,
			x: width,
			easing: `easeOutExpo`,
			duration: 750,
			offset: 1000
		})
		.add({
			targets: sign,
			y: height * 0.5,
			easing: 'easeOutCirc'
		})
		.add({
			targets: logo.scale,
			x: 0.5,
			y: 0.5,
			easing: 'easeOutElastic'
		})
		.add({
			targets: mathsLogo,
			alpha: 100,
			//easing: 'linear'
		})

	},
	setObjectLocations: function() {
		console.log('setObjectLocations')
		const {width, height} = this.world
		this.sky.y = 0

		this.mountain.y = height * 0.48

		this.grassBack.y = height * 0.5 + this.grassBack.height * 0.3

		this.grassMid.x = 0

		this.grassFront.x = width

		this.sign.y = height * 0.5

		this.logo.scale.setTo(0.5)


		this.mathsLogo.alpha = 100



	},


	clickEnclave: function() {
		EPT._playAudio('click');
		window.top.location.href = 'http://enclavegames.com/';
	},

	clickStart: function() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		EPT._playAudio('click');
		this.game.state.start('Achievements');
	}


};
