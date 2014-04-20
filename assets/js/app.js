require(["sound.min", "scales.min"], function (Sound, Scales) {
    var ModularTone = {};

    var pause_button = $("svg.pause");
    var play_button = $("svg.play");
    var current_interval = 'minorsecond';

    ModularTone.sound = new Sound(current_interval, Scales.ratios, pause_button, play_button);
    ModularTone.sound.playSound();


    $("aside a.interval").on("click", function (e) {
        e.preventDefault();
        var next_interval = $(e.currentTarget).data("interval-class");
        if (current_interval) {
            $("body").removeClass(current_interval).addClass(next_interval);
        } else {
            $("body").addClass(next_interval);
        }

        $("section span").text(Scales.ratios[next_interval]);
        ModularTone.sound.transitionTo(next_interval);

        var bolt = $("svg.bolt");
        
        /* lol sorry */
        var for_mula = Scales.decimals[next_interval];
        // var mula = (100*(1 / (for_mula + 1)))-2;
        var mula = (1/(for_mula+1))*97;

        if (Scales.forsvg[current_interval] < Scales.forsvg[next_interval]) {
                bolt.css({rotate: '-=100deg', left: mula + '%'}, 1000, 'in-out');
                //n -= 60;
        }
        else if (Scales.forsvg[current_interval] > Scales.forsvg[next_interval]) {
                bolt.css({rotate: '+=100deg', left: mula + '%'}, 1000, 'in-out');
                //n += 60;
        }
        else {
            // don't turn
        }
        current_interval = next_interval;
    });

    $('section').on('click', function (e) {
        ModularTone.sound.togglePlaying();
    });
});
