define(["sound.min"], function(Sound) {
    var ModularTone = function() {
        this.sound = null;
        this.current_interval = "minorsecond";    

        this.initSound();

        $("aside a.interval").on("click", $.proxy(this.onClickInterval, this));
    };

    ModularTone.prototype = {
        onClickInterval: function(e) {
            e.preventDefault();
            var body = $("body");

            var next_interval = $(e.currentTarget).data("interval-class");


            if (this.current_interval != next_interval) {
                if (this.current_interval) {
                body.removeClass(this.current_interval)
                }
                body.addClass(next_interval);
                this.sound.transitionTo(next_interval);
                this.current_interval = next_interval;
                this.sound.playSound();
            } else {
                //body.addClass(this.current_interval);
                this.sound.togglePlaying();
            }


            /*var playpause = $(e).find(".icon");
           console.log(playpause);
           playpause.removeClass("icon-play");*/

        },
        initSound: function() {
            var pause_button = $("svg.pause");
            var play_button = $("svg.play");

            this.sound = new Sound(this.current_interval, pause_button, play_button);
        
        }
    };
    return ModularTone;
});
