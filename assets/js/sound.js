define(["scales.min"], function(Scales) {
    var Sound = function (interval) {
        this.STATE_STOPPED = 1;
        this.STATE_PLAYING = 2;
        this.STATE_CHANGING = 3;

        this.state = this.STATE_STOPPED;
        this.change_callback = undefined;

        this.base_frequency = 440;
        this._setInterval(interval);
        this._setupOscillators();
    };

    Sound.prototype = {
        getState: function() {
            return this.state;
        },
        togglePlaying: function() {
            if (this.state === this.STATE_STOPPED) {
                this.playSound();
            } else if (this.state === this.STATE_PLAYING) {
                this.stopSound();
            }
        },
        playSound: function() {
            var fade_seconds = 0.1;

            if (this.state === this.STATE_STOPPED) {
                this._changeState(this.STATE_CHANGING);
                this._fadeIn(fade_seconds, true);
            }
        },
        stopSound: function() {
            var fadeout_seconds = 2;

            if (this.state === this.STATE_PLAYING) {
                this._changeState(this.STATE_CHANGING);
                this._fadeOut(fadeout_seconds, true);
            }
        },
        transitionTo: function(interval) {
            var fade_seconds = 0.5;

            if (this.state === this.STATE_PLAYING) {
                this._changeState(this.STATE_CHANGING);
                this._fadeOut(fade_seconds);

                setTimeout(
                    $.proxy(function () {
                        this._setInterval(interval);
                        this._changeOscillatorFrequency();
                        this._changeState(this.STATE_CHANGING);
                        this._fadeIn(fade_seconds, true);
                    }, this),
                    (fade_seconds * 1000) + 10
                );
            } else if (this.state === this.STATE_STOPPED) {
                this._setInterval(interval);
                this._changeOscillatorFrequency();
                this._fireChangeCallback();
            }
        },
        onChange: function (callback) {
            this.change_callback = callback;
        },
        _setupOscillators: function() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audio_context = new window.AudioContext();
            var mobileContext = this.audio_context;

            // Play an empty sound so iOS unmutes sound
            window.addEventListener('touchstart', function() {
                var buffer = mobileContext.createBuffer(1, 1, 22050);
                var source = mobileContext.createBufferSource();
                source.buffer = buffer;
                source.connect(mobileContext.destination);
                source.noteOn(0);
            }, false);

            this.gain_node = this.audio_context.createGain();
            this.gain_node.gain.value = 0.0;
            this.base_oscillator = this.audio_context.createOscillator();
            this.base_oscillator.type = 3;

            this.base_oscillator.frequency.value = this.base_frequency;
            this.base_oscillator.connect(this.gain_node);

            this.interval_oscillator = this.audio_context.createOscillator();
            this.interval_oscillator.type = 3;
            this.interval_oscillator.frequency.value = this.interval_frequency;
            this.interval_oscillator.connect(this.gain_node);

            this.gain_node.connect(this.audio_context.destination);

            this.base_oscillator.start(0);
            this.interval_oscillator.start(0);
        },
        _changeOscillatorFrequency: function() {
            this.base_oscillator.frequency.value = this.base_frequency;
            this.interval_oscillator.frequency.value = this.interval_frequency;
        },
        _cleanupOscillators: function() {
            this.base_oscillator.stop(0);
            this.interval_oscillator.stop(0);

            this.base_oscillator.disconnect();
            this.interval_oscillator.disconnect();
            this.gain_node.disconnect();
        },
        _fadeOut: function(seconds, fire_callback) {
            var end_time = this.audio_context.currentTime;
            this.gain_node.gain.linearRampToValueAtTime(0.0, end_time + seconds);

            setTimeout($.proxy(this._changeState, this), (seconds * 1000) + 10, this.STATE_STOPPED, fire_callback);

        },
        _fadeIn: function(seconds, fire_callback) {
            var start_time = this.audio_context.currentTime;
            this.gain_node.gain.setValueAtTime(0, start_time);
            this.gain_node.gain.linearRampToValueAtTime( 0.25, start_time + seconds );

            setTimeout($.proxy(this._changeState, this), (seconds * 1000) + 10, this.STATE_PLAYING, fire_callback);
        },
        _setInterval: function(interval) {
            var ratio_components = Scales[interval].split(':');
            var ratio = (+ ratio_components[1]) / (+ ratio_components[0]);

            this.current_interval = interval;
            this.interval_frequency = this.base_frequency * ratio; 
        },
        _changeState: function(state, fire_callback) {
            this.state = state;

            if (fire_callback) {
                this._fireChangeCallback();
            }
        },
        _fireChangeCallback: function() {
            if (this.change_callback !== undefined) {
                this.change_callback();
                this.change_callback = undefined;
            }
        }
    };

    return Sound;
});
