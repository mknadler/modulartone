define(function() {
    var Sound = function (interval, scales, pause, play) {
        this.STATE_STOPPED = 1;
        this.STATE_PLAYING = 2;
        this.STATE_CHANGING = 3;

        this.scales = scales;
        this.state = this.STATE_STOPPED;

        this.base_frequency = 440;
        this._setInterval(interval);
        this._setupOscillators();
    };


    Sound.prototype = {
        togglePlaying: function() {
            if (this.state === this.STATE_STOPPED) {
                this.playSound();
                play.css('display', 'none');
                pause.css('display', 'block');
            } else if (this.state === this.STATE_PLAYING) {
                this.stopSound();
                play.css('display', 'block');
                pause.css('display', 'none');
            }
        },
        playSound: function() {
            var fade_seconds = 0.1;

            if (this.state === this.STATE_STOPPED) {
                this._changeState(this.STATE_CHANGING);
                this._fadeIn(fade_seconds);
            }
        },
        stopSound: function() {
            var fadeout_seconds = 2;

            if (this.state === this.STATE_PLAYING) {
                this._changeState(this.STATE_CHANGING);
                this._fadeOut(fadeout_seconds);
            }
        },
        transitionTo: function(interval) {
            var fade_seconds = 0.5;

            if (this.state === this.STATE_PLAYING) {
                this._fadeOut(fade_seconds);

                setTimeout(
                    $.proxy(function () {
                        this._setInterval(interval);
                        this._changeOscillatorFrequency();
                        this._fadeIn(fade_seconds);
                    }, this),
                    (fade_seconds * 1000) + 10
                );
            } else if (this.state === this.STATE_STOPPED) {
                this._setInterval(interval);
                this._changeOscillatorFrequency(interval);
            }
        },
        _setupOscillators: function() {
            this.audio_context = new window.webkitAudioContext();
            this.gain_node = this.audio_context.createGainNode();

            this.base_oscillator = this.audio_context.createOscillator();
            this.base_oscillator.type = 3;
            this.base_oscillator.frequency.value = this.base_frequency;
            this.base_oscillator.connect(this.gain_node);

            this.interval_oscillator = this.audio_context.createOscillator();
            this.interval_oscillator.type = 3;
            this.interval_oscillator.frequency.value = this.interval_frequency;
            this.interval_oscillator.connect(this.gain_node);

            this.gain_node.connect(this.audio_context.destination);

            this.base_oscillator.noteOn(0);
            this.interval_oscillator.noteOn(0);
        },
        _changeOscillatorFrequency: function() {
            this.base_oscillator.frequency.value = this.base_frequency;
            this.interval_oscillator.frequency.value = this.interval_frequency;
        },
        _cleanupOscillators: function() {
            this.base_oscillator.noteOff(0);
            this.interval_oscillator.noteOff(0);

            this.base_oscillator.disconnect();
            this.interval_oscillator.disconnect();
            this.gain_node.disconnect();
        },
        _fadeOut: function(seconds) {
            var end_time = this.audio_context.currentTime;
            this.gain_node.gain.linearRampToValueAtTime(0.0, end_time + seconds);

            setTimeout($.proxy(this._changeState, this), (seconds * 1000) + 10, this.STATE_STOPPED);
        },
        _fadeIn: function(seconds) {
            var start_time = this.audio_context.currentTime;
            this.gain_node.gain.setValueAtTime(0, start_time);
            this.gain_node.gain.linearRampToValueAtTime( 0.25, start_time + seconds );

            setTimeout($.proxy(this._changeState, this), (seconds * 1000) + 10, this.STATE_PLAYING);
        },
        _setInterval: function(interval) {
            var ratio_components = this.scales[interval].split(':');
            var ratio = (+ ratio_components[1]) / (+ ratio_components[0]);

            this.current_interval = interval;
            this.interval_frequency = this.base_frequency * ratio; 
        },
        _changeState: function(state) {
            this.state = state;
        }
    };

    return Sound;
});
