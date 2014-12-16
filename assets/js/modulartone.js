define(["sound.min"], function(Sound) {
    var ModularTone = function() {
        this.sound = null;
        this.current_interval = "minorsecond";    

        this.initSound();

        // While we're transitioning between states (stop/play, between intervals),
        // we queue up the users actions, then flush them all once the transition completes
        this.interval_change_queue = [];

        $("aside a.interval").on("click", $.proxy(this.onClickInterval, this));
        $(window).keypress(function(pressed){
            // This is messy; will refactor shortly; wanted to make sure it worked first.
            switch(pressed.which){
                case 49 : $('.interval:nth-child(2)').click();
                          break;
                case 50 : $('.interval:nth-child(3)').click();
                          break;
                case 51 : $('.interval:nth-child(4)').click();
                          break;
                case 52 : $('.interval:nth-child(5)').click();
                          break;
                case 53 : $('.interval:nth-child(6)').click();
                          break;
                case 54 : $('.interval:nth-child(7)').click();
                          break;
                case 55 : $('.interval:nth-child(8)').click();
                          break;
                case 56 : $('.interval:nth-child(9)').click();
                          break;
                case 57 : $('.interval:nth-child(10)').click();
                          break;       
                case 113 : $('.interval:nth-child(11)').click();
                          break;
                case 119 : $('.interval:nth-child(12)').click();
                          break;
                case 101 : $('.interval:nth-child(13)').click();
                          break;
                case 114 : $('.interval:nth-child(14)').click();
                          break;
                case 116 : $('.interval:nth-child(15)').click();
                          break;
                case 121 : $('.interval:nth-child(16)').click();
                          break;
                case 117 : $('.interval:nth-child(17)').click();
                          break;
                case 105 : $('.interval:nth-child(18)').click();
                          break;                       
            }
        });
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
