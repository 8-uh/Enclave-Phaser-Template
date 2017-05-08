const COLLECTIBLES = [
	{ texture: '10-cent', value: 10 },
	{ texture: '20-cent', value: 20 },
	{ texture: '50-cent', value: 50 },
	{ texture: '1-dollar', value: 100 },
	{ texture: '2-dollar', value: 200 },
	{ texture: '5-dollar', value: 500 }
]

const LEVELS = [100, 200, 300, 400, 500]
const GAME_TIME = 30
const COIN_SPEED = 100
const PLAYER_SPEED = 500

const {getRandomItem} = Phaser.ArrayUtils
const {ceil} = Math

EPT.Game = function(game) {};
EPT.Game.prototype = {
	init(level = 1) {
		this.numDrops = LEVELS[level - 1]
	},
	create: function() {
		this._score = 0;
		this._time = 90;
		this.gamePaused = false;
		this.runOnce = false;
		this.frameDrops = this.createFrameDrops()
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;
		// var fontGameplay = { font: "32px Arial", fill: "#000" };
		// var textGameplay = this.add.text(100, 75, 'Gameplay screen', fontGameplay);

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

		this.player = this.make.sprite(0, 0, 'gertie')



		this.setObjectLocations()

		this.currentFrame = 0

		this.cursors = game.input.keyboard.createCursorKeys();


		//
		// this.currentTimer = game.time.create();
		// this.currentTimer.loop(Phaser.Timer.SECOND, function() {
		// 	this._time--;
		// 	if(this._time) {
		// 		this.textTime.setText('Time left: '+this._time);
		// 	}
		// 	else {
		// 		this.stateStatus = 'gameover';
		// 	}
		// }, this);
		// this.currentTimer.start();

		// this.initUI();

		// this.camera.resetFX();
		// this.camera.flash(0x000000, 500, false);

	},
	setObjectLocations: function() {
		const {width, height} = this.world

		this.sky.x = width * 0.5
		this.sky.y = 0

		this.mountain.x = width * 0.5
		this.mountain.y = height * 0.48

		this.grassBack.x = width * 0.5
		this.grassBack.y = height * 0.5 + this.grassBack.height * 0.3

		this.player.scale.setTo(0.4)
		this.player.anchor.setTo(0.5)
		this.game.physics.arcade.enable(this.player)

		this.player.x = width * 0.5
		this.player.y = height * 0.7
		this.player.body.setSize(this.player.width*1.2, this.player.height * 0.15, this.player.width * 1.1, 0 )
		this.player.body.collideWorldBounds = true



		this.grassMid.x = 0
		this.grassMid.y = height

		this.grassFront.x = width
		this.grassFront.y = height

		this.sign.x = width * 0.8
		this.sign.y = height * 0.5

		this.add.existing(this.sky)
		this.add.existing(this.mountain)
		this.add.existing(this.sign)
		this.add.existing(this.grassBack)

		this.coins = this.game.add.group()
		this.add.existing(this.grassMid)
		this.add.existing(this.grassFront)
this.add.existing(this.player)


	},
	createFrameDrops: function() {
		const droptween = this.add.tween({drops: 0, choices:0}).to({drops: this.numDrops, choices: 6}, (GAME_TIME - 10) * 1000)
		let currentDrop = 0
		const dropdata = droptween.generateData().reduce(
			(arr, item, idx) => {
				const drops = ~~item.drops
				if(drops > currentDrop) {
					const diff = drops - currentDrop
					arr.push({frame: idx, drops: diff, choices: ceil(item.choices) - 1})
					currentDrop += diff
				}
				return arr
			}
		, [])
		return dropdata
	},
	initUI: function() {
		this.buttonPause = this.add.button(this.world.width-20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
		this.buttonPause.anchor.set(1,0);

		var fontScore = { font: "32px Arial", fill: "#000" };
		var fontScoreWhite =  { font: "32px Arial", fill: "#FFF" };
		this.textScore = this.add.text(30, this.world.height-20, 'Score: '+this._score, fontScore);
		this.textScore.anchor.set(0,1);

		this.textTime = this.add.text(this.world.width-30, this.world.height-20, 'Time left: '+this._time, fontScore);
		this.textTime.anchor.set(1,1);

		this.buttonPause.y = -this.buttonPause.height-20;
		this.add.tween(this.buttonPause).to({y: 20}, 1000, Phaser.Easing.Exponential.Out, true);

		var fontTitle = { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 };

		this.screenPausedGroup = this.add.group();
		this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
		this.screenPausedText = this.add.text(this.world.width*0.5, 100, 'Paused', fontTitle);
		this.screenPausedText.anchor.set(0.5,0);
		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.screenPausedBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenPausedBack.anchor.set(0,1);
		this.screenPausedContinue = this.add.button(this.world.width-150, this.world.height-100, 'button-continue', this.managePause, this, 1, 0, 2);
		this.screenPausedContinue.anchor.set(1,1);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.buttonAudio);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
		this.screenPausedGroup.visible = false;

		this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

		this.screenGameoverGroup = this.add.group();
		this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
		this.screenGameoverText = this.add.text(this.world.width*0.5, 100, 'Game over', fontTitle);
		this.screenGameoverText.anchor.set(0.5,0);
		this.screenGameoverBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenGameoverBack.anchor.set(0,1);
		this.screenGameoverRestart = this.add.button(this.world.width-150, this.world.height-100, 'button-restart', this.stateRestart, this, 1, 0, 2);
		this.screenGameoverRestart.anchor.set(1,1);
		this.screenGameoverScore = this.add.text(this.world.width*0.5, 300, 'Score: '+this._score, fontScoreWhite);
		this.screenGameoverScore.anchor.set(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.visible = false;
	},
	update: function() {
		// switch(this.stateStatus) {
		// 	case 'paused': {
		// 		if(!this.runOnce) {
		// 			this.statePaused();
		// 			this.runOnce = true;
		// 		}
		// 		break;
		// 	}
		// 	case 'gameover': {
		// 		if(!this.runOnce) {
		// 			this.stateGameover();
		// 			this.runOnce = true;
		// 		}
		// 		break;
		// 	}
		// 	case 'playing': {
		// 		this.statePlaying();
		// 	}
		// 	default: {
		// 	}
		// }

		this.currentFrame++
		this.checkFrameData()
		this.checkInput()
		this.checkCollisions()


	},
	checkFrameData: function() {
		if(this.frameDrops.length) {
			const df = this.frameDrops[0]
			if(df.frame <= this.currentFrame) {
				for(let i = 0; i < df.drops; i++) {
					this.dropCoin(df.choices)
				}
				this.frameDrops.shift()
			}
		}
	},
	checkInput: function() {
		if(this.cursors.right.isDown) {
			this.player.body.velocity.x = PLAYER_SPEED
			this.player.scale.x = 0.4
		} else if(this.cursors.left.isDown) {
			this.player.body.velocity.x = -PLAYER_SPEED
			this.player.scale.x = -0.4
		} else {
			this.player.body.velocity.x = 0
		}
	},
	checkCollisions: function() {
		this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin,null, this)
	},
	collectCoin: function(player, coin) {
		coin.kill()
		console.log('collected coin:', coin.collectibleValue)
	},
	dropCoin: function(choices) {
		console.log('drop coin!')
		const temp = COLLECTIBLES.slice(0, choices+1)
		let props = getRandomItem(temp)
		let coin = this.coins.getFirstExists(false)
		if(!coin) {
		 coin = this.coins.create(0,0, props.texture)
		 coin.anchor.setTo(0.5)
		 coin.scale.setTo(0.25)

	 } else {
		 coin.loadTexture(props.texture)

	 }


		coin.collectibleValue = props.value
		const x = this.rnd.integerInRange(coin.width, this.world.width - coin.width)
		const y = -coin.height * 0.5
		coin.reset(x, y)
		coin.touched = false
		this.game.physics.arcade.enable(coin)
		coin.body.height = 5
		coin.body.offset = new Phaser.Point(0, coin.height * 4  -5)
		coin.body.velocity.set(0, COIN_SPEED);
		coin.checkWorldBounds = true
		coin.outOfBoundsKill = true
		console.log('alive coin count:', this.coins.countLiving())
		coin.events.onKilled.add(() => {
			if(coin.body) {
				coin.body.destroy()
			}

		})
	},


	managePause: function() {
		this.gamePaused =! this.gamePaused;
		EPT._playAudio('click');
		if(this.gamePaused) {
			this.stateStatus = 'paused';
		}
		else {
			this.stateStatus = 'playing';
			this.runOnce = false;
		}
	},
	statePlaying: function() {
		this.screenPausedGroup.visible = false;
		this.currentTimer.resume();
	},
	statePaused: function() {
		this.screenPausedGroup.visible = true;
		this.currentTimer.pause();
	},
	stateGameover: function() {
		this.screenGameoverGroup.visible = true;
		this.currentTimer.stop();
		// this.screenGameoverScore.setText('Score: '+this._score);
		this.gameoverScoreTween();
		EPT.Storage.setHighscore('EPT-highscore',this._score);
	},
	addPoints: function() {
		this._score += 10;
		this.textScore.setText('Score: '+this._score);
		var randX = this.rnd.integerInRange(200,this.world.width-200);
		var randY = this.rnd.integerInRange(200,this.world.height-200);
		var pointsAdded = this.add.text(randX, randY, '+10',
			{ font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
		pointsAdded.anchor.set(0.5, 0.5);
		this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);

		this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
	},
	gameoverScoreTween: function() {
		this.screenGameoverScore.setText('Score: 0');
		if(this._score) {
			this.tweenedPoints = 0;
			var pointsTween = this.add.tween(this);
			pointsTween.to({ tweenedPoints: this._score }, 1000, Phaser.Easing.Linear.None, true, 500);
			pointsTween.onUpdateCallback(function(){
				this.screenGameoverScore.setText('Score: '+Math.floor(this.tweenedPoints));
			}, this);
			pointsTween.onComplete.addOnce(function(){
				this.screenGameoverScore.setText('Score: '+this._score);
				this.spawnEmitter(this.screenGameoverScore, 'particle', 20, 300);
			}, this);
			pointsTween.start();
		}
	},
	spawnEmitter: function(item, particle, number, lifespan, frequency, offsetX, offsetY, gravity) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		lifespan = lifespan || 2000;
		frequency = frequency || 0;
		var emitter = this.game.add.emitter(item.x+offsetX, item.y+offsetY, number);
		emitter.maxParticles = number;
		emitter.makeParticles(particle);
		emitter.setXSpeed(-500, 500);
		emitter.setYSpeed(-700, 300);
		emitter.setScale(4, 1, 4, 1, 500, Phaser.Easing.Linear.None);
		emitter.gravity = gravity || 250;
		emitter.start(false, lifespan, frequency, number);
	},
	clickAudio: function() {
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},
	stateRestart: function() {
		EPT._playAudio('click');
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		this.currentTimer.start();
		this.stateStatus = 'playing';
		this.state.restart(true);
	},
	stateBack: function() {
		EPT._playAudio('click');
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		this.currentTimer.start();
		this.stateStatus = 'playing';
		// this.state.restart(true);
		this.state.start('MainMenu');
	},
	render: function() {
		this.game.debug.body(this.player)
		this.coins.forEachAlive(c => {
			this.game.debug.body(c)
		})
	}
};
