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
		this.grassFront.anchor.setTo(1)

		this.mathsLogo = this.make.sprite(0, 0, 'mathsweek-logo')
		this.mathsLogo.anchor.setTo(1)

		this.startbtn = this.make.button(0,0,'button-start', this.clickStart, this, 1, 0, 2)
		this.startbtn.anchor.setTo(0.5)

		this.setStartingLocations()
		if(this.firstrun) {
			console.log('should start introanimation')
			const intro = this.introAnimation()
			intro.then(() => {
				console.log('intro finished')
				this.setObjectLocations()
			})
		} else {
			console.log('should set final object locations')
			this.setObjectLocations()
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

		this.startbtn.x = -width * 0.5
		this.startbtn.y = height * 0.9
		this.startbtn.scale.setTo(0.5)
		this.startbtn.visible = false

		this.add.existing(this.sky)
		this.add.existing(this.logo)
		this.add.existing(this.mountain)
		this.add.existing(this.sign)
		this.add.existing(this.grassBack)
		this.add.existing(this.grassMid)
		this.add.existing(this.grassFront)
		this.add.existing(this.mathsLogo)
		this.add.existing(this.startbtn)
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
			startbtn
		} = this

		const {width, height} = this.world

		timeline = anime.timeline()
		timeline
		.add({
			targets: sky,
			y: 0,
			easing: `easeOutExpo`,
			duration: 500
		})
		.add({
			targets: mountain,
			y: height * 0.48,
			easing: 'easeOutElastic',
			duration: 500,
			offset: 1000
		})
		.add({
			targets: grassBack,
			y: height * 0.5 + this.grassBack.height * 0.3,
			easing: 'easeOutBack',
			offset: 500,
			duration: 500
		})
		.add({
			targets: grassMid,
			x: 0,
			easing: 'easeOutExpo',
			offset: 250,
			duration: 500
		})
		.add({
			targets: grassFront,
			x: width,
			easing: `easeOutExpo`,
			duration: 250,
			offset: 250
		})
		.add({
			targets: sign,
			y: height * 0.5,
			duration: 500,
			easing: 'easeOutCirc',
			offset: 1000
		})
		.add({
			targets: logo.scale,
			x: 0.5,
			y: 0.5,
			duration: 500,
			offset: 1500,
			easing: 'easeOutElastic'
		})
		.add({
			targets: mathsLogo,
			alpha: 0.75,
			duration: 500
		})
		console.log('timeline:', timeline)
		return Promise.all(timeline.children.map(a => a.finished))
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


		this.mathsLogo.alpha = 0.75

		this.startbtn.x = width * 0.5
		this.startbtn.y = height * 0.9
		this.startbtn.visible = true



	},
	clickStart: function() {
		EPT._playAudio('click');
		console.log('clickStart:', this.firstrun)
		if(this.firstrun) {
			this.game.state.start('Story')
		} else {
			this.game.state.start('Game')
		}
	},
	clickAchievements: function() {
		EPT._playAudio('click');
		this.game.state.start('Achievements');
	}


};
