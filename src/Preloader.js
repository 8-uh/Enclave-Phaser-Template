EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		this.load.setPreloadSprite(preloadProgress);

		this._preloadResources();
	},
	_preloadResources() {
		var pack = EPT.Preloader.resources;
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.state.start('MainMenu', true, false, true);
	}
};
EPT.Preloader.resources = {
	'image': [
		['1-dollar', 'img/1-dollar.png'],
		['2-dollar', 'img/2-dollar.png'],
		['5-dollar', 'img/5-dollar.png'],
		['10-cent', 'img/10-cent.png'],
		['20-cent', 'img/20-cent.png'],
		['50-cent', 'img/50-cent.png'],
		['grass-back', 'img/grass-back.png'],
		['grass-front', 'img/grass-front.png'],
		['grass-mid', 'img/grass-mid.png'],
		['sky', 'img/sky.png'],
		['sign', 'img/sign.png'],
		['mountain', 'img/mountain.png'],
		['logo', 'img/game-logo.png'],
		['mathsweek-logo', 'img/mathsweek-logo.png'],
		['bowl', 'img/bowl.png'],
		['helmet', 'img/helmet.png'],
		['leg', 'img/leg.png'],
		['arm', 'img/arm.png'],
		['eye', 'img/eye.png'],
		['gertie', 'img/gertie.png'],
		['body', 'img/body.png'],


		['title', 'img/title.png'],
		['logo-enclave', 'img/logo-enclave.png'],
		['clickme', 'img/clickme.png'],
		['overlay', 'img/overlay.png'],
		['button-beer', 'img/button-beer.png'],
		['particle', 'img/particle.png']
	],
	'spritesheet': [
		['button-start', 'img/button-start.png', 180, 180],
		['button-continue', 'img/button-continue.png', 180, 180],
		['button-mainmenu', 'img/button-mainmenu.png', 180, 180],
		['button-restart', 'img/button-tryagain.png', 180, 180],
		['button-achievements', 'img/button-achievements.png', 110, 110],
		['button-pause', 'img/button-pause.png', 80, 80],
		['button-audio', 'img/button-sound.png', 80, 80],
		['button-back', 'img/button-back.png', 70, 70]
	],
	'audio': [
		['audio-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']]
	]
};
