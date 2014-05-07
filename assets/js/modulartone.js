define(["sound.min"], function(Sound) {
    var ModularTone = function() {
        this.sound = null;
        this.current_interval = "minorsecond";    

        this.initSound();

        // While we're transitioning between states (stop/play, between intervals),
        // we queue up the users actions, then flush them all once the transition completes
        this.interval_change_queue = [];

        $("aside a.interval").on("click", $.proxy(this.onClickInterval, this));
    };

    ModularTone.prototype = {
        onClickInterval: function(e) {
            e.preventDefault();
            var old_sound_state = this.sound.getState();
            var next_interval = $(e.currentTarget).data("interval-class");

            if (old_sound_state === this.sound.STATE_CHANGING) {
                // We'll handle this event once the current transition finishes
                this.interval_change_queue.push(next_interval);
                this.sound.onChange($.proxy(this.flushChangeQueue, this));
            } else {
                if (this.current_interval === next_interval) {
                    this.sound.togglePlaying();

                    var icon = $(e.currentTarget).find(".icon");
                    if (old_sound_state === this.sound.STATE_STOPPED) {
                        icon.removeClass("icon-play").addClass("icon-stop");
                    } else if (old_sound_state === this.sound.STATE_PLAYING) {
                        icon.removeClass("icon-stop").addClass("icon-play");
                    }
                } else {
                    // Switching between intervals
                    $("body").removeClass(this.current_interval).addClass(next_interval);
                    this.current_interval = next_interval;

                    this.sound.transitionTo(next_interval);
                    this.sound.playSound();

                    var previous_icon = $(".icon-stop");
                    var target_icon = $(e.currentTarget).find(".icon");

                    target_icon.removeClass("icon-play").addClass("icon-stop");
                    previous_icon.removeClass("icon-stop").addClass("icon-play");
                }
            }
        },
        initSound: function() {
            this.sound = new Sound(this.current_interval);
        },
        flushChangeQueue: function() {
            var old_interval = this.current_interval,
                target_interval = old_interval,
                old_state = (this.sound.getState() === this.sound.STATE_PLAYING),
                target_state = old_state;

            while (this.interval_change_queue.length > 0) {
                var next_interval = this.interval_change_queue.pop();

                if (next_interval === target_interval) {
                    target_state = !target_state;
                } else {
                    target_state = true;
                }

                target_interval = next_interval;
            }

            if (target_interval !== old_interval) {
                $("body").removeClass(this.current_interval).addClass(target_interval);
                this.current_interval = target_interval;

                this.sound.transitionTo(target_interval);
                this.sound.playSound();
            }

            if (target_state != old_state) {
                this.sound.togglePlaying();
            }

            $(".icon").removeClass("icon-stop").addClass("icon-play");

            if (target_state) {
                var foo = $('[data-interval-class="' + target_interval + '"] .icon');
                foo.removeClass("icon-play").addClass("icon-stop");
            }
        }
    };
    return ModularTone;
});
