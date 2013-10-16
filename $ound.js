function $ound(path, artist, song, album) {
	
	
	var about = {
		
		Sound: 'A simple JavaScript library intended to make audio in Mobile Safari, and Chrome easier to use.',
		Version: '0.1',
		Author: 'Phil Merrell',
		Created: 'May 6, 2012',
		Updated: ''
		
	};
	
	if(path) {
		
		if (window === this) {
			return new $ound(path);
		}

		// We're in the correct object scope	:
		// Init our element object and return the object
		
		this.audio = new Audio(path);
		this.audio.artist = artist;
		this.audio.song = song;
		this.audio.album = album;
		return this;
		
		// set up audio instance...
		
	} else {
		
		return about;
	}

return console.log('Created');
}





// Sound Protos ------>

$ound.prototype = {
	
	play: function() {
		
		this.audio.play();
	},
	
	pause: function() {
		
		this.audio.pause();
	},

	stop: function () {
		this.audio.pause();
		this.audio.currentTime = 0;
	},
	
	toggle: function () {
		
		if(this.audio.paused) {
			
			this.audio.play();
		} else {
			this.audio.pause();
		}
		
	},
	
	seek: function (time) {
		var n = parseInt(time, 10);
		this.audio.currentTime = n;
	},
	
	artist: function () {
		return this.audio.artist;
	},
	
	song: function () {
		return this.audio.song;
	},
	
	album: function () {
		
		return this.audio.album;
	},
	
	secs: function() {
		var sec = this.audio.currentTime,
			seconds = Math.floor(sec % 60),
			displaySec = seconds < 10 ? "0"+seconds : seconds;

        return seconds;
		
	},
	
	mins: function() {
		var min = this.audio.currentTime,
			minutes = Math.floor((minutes / 60) % 60),
			displayMin = minutes < 10 ? "0"+minutes : minutes;

		return displayMin;
	},
	
	hrs: function () {
		var hr = this.audio.currentTime,
			hours = Math.floor(((hr / 60) / 60) % 60);

		return hours;
	},
	
	percent: function () {
		var percent = (Math.floor((100 / this.audio.duration) * this.audio.currentTime)) || 0;
		return percent;
	},
	
	elapsed: function (id) {
		var e = document.getElementById(id);
		var t = this.audio;
		
		function elapsedTime() {
			
			var seconds = Math.floor(t.currentTime % 60),
				elapsedSeconds = seconds < 10 ? "0"+seconds : seconds,
				minutes = Math.floor((t.currentTime / 60) % 60),
				elapsedMinutes = minutes < 10 ? "0"+minutes : minutes,
				elapsedHours = Math.floor(((t.currentTime / 60) / 60) % 60);

			if (elapsedHours === 0) {
				return elapsedMinutes+":"+elapsedSeconds;
			} else {
				return elapsedHours+":"+elapsedMinutes+":"+elapsedSeconds;
			}
		}
		
		t.addEventListener('timeupdate', function() {
			e.innerHTML = elapsedTime();
		}, false);
		
	},
	
	remaining: function (id) {
		var e = document.getElementById(id),
			t = this.audio;
		
		function remainingTime() {
			var timeLeft = t.duration - t.currentTime,
				seconds = Math.floor(timeLeft % 60) || 0,
				remainingSeconds = seconds < 10 ? "0"+seconds : seconds,
				minutes = Math.floor((timeLeft / 60) % 60) || 0,
				remainingMinutes = minutes < 10 ? "0"+minutes : minutes,
				hours = Math.floor(((timeLeft / 60) / 60) %60) || 0;

			if (hours === 0) {
				return "-"+remainingMinutes+":"+remainingSeconds;
			} else {
				return "-"+hours+":"+remainingMinutes+":"+remainingSeconds;
			}
		}
		function update() {

			e.innerHTML = remainingTime();
		}

		t.addEventListener('timeupdate', update, false);
	},
	slider: function(id) {
		var e = document.getElementById(id);
		var t = this.audio;

		var slider = document.createElement('input');
		slider.type = 'range';
		slider.id = 'scrubber';
		slider.value = '0';
		e.appendChild(slider);

		function sliderValue(event) {
			var val = (100 / t.duration) * t.currentTime || 0;
			slider.value = val;

			// prevents thumb drag from jumping back to elapsed value when value is changed
			event.stopPropagation();
		}
		
		t.addEventListener('timeupdate', sliderValue, false);
		function progressValue() {
			
			var p = document.getElementById('progress'),
				progVal = 0,
				progBuf = t.buffered.end(0),
				dsoFar = parseInt(((progBuf / t.duration) * 100), 10);
			
			p.style.width = dsoFar + "%";
		}
		
		t.addEventListener('progress', progressValue, false);
		slider.addEventListener('change', function() {
			
			//console.log(slider.value);
			t.removeEventListener('timeupdate', sliderValue, false);
			var newVal = slider.value / (100 / t.duration);
			
			t.currentTime = newVal;
			// seems to prevent jumpy slider 
			setTimeout(function() {
				t.addEventListener('timeupdate', sliderValue, false);

			}, 1000);
			
		}, false);
	}

};