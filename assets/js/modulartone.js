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
                var allicons = $(".icon");
                var thisicon = $(e.currentTarget).find(".icon");

                if (allicons.hasClass("icon-stop")) {
                    allicons.removeClass("icon-stop").addClass("icon-play");
                }
                
                if (thisicon.hasClass("icon-play")) {
                    thisicon.removeClass("icon-play").addClass("icon-stop");
                } else {
                    thisicon.removeClass("icon-stop").addClass("icon-play");
                }

            } else {
                this.sound.togglePlaying();
                var thisicon = $(e.currentTarget).find(".icon");
                if (thisicon.hasClass("icon-play")){
                thisicon.removeClass("icon-play").addClass("icon-stop");
                } else {
                thisicon.removeClass("icon-stop").addClass("icon-play");
                }
            }

        },
        initSound: function() {
            this.sound = new Sound(this.current_interval);
        }
    };
    return ModularTone;
});
