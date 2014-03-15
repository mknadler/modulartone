var current_interval = 'minorsecond';
var scales = {
	minorsecond: "15:16",
	majorsecond: "8:9",
	minorthird: "5:6",
	majorthird: "4:5",
	perfectfourth: "3:4",
	augfourthdimfifth: "1:√2",
	perfectfifth: "2:3",
	minorsixth: "5:8",
	goldensection: "1:1.618",
	majorsixth: "3:5",
	minorseventh: "9:16",
	majorseventh: "8:15",
	octave: "1:2",
	majortenth: "2:5",
	majoreleventh: "3:8",
	majortwelfth: "1:3",
	doubleoctave: "1:4"
};

var ac = new (window.webkitAudioContext);

var current_sound = null;
var stopping = false;
$("aside a.interval").on("click", function (e) {
    e.preventDefault();
    var next_interval = $(e.currentTarget).data("interval-class");
    if (current_interval) {
        $("body").removeClass(current_interval).addClass(next_interval);
    } else {
        $("body").addClass(next_interval);
    }

    $("section span").text(scales[next_interval]);
    play_interval(scales[next_interval].split(':'));
    current_interval = next_interval;
});

$('section').on('click', function (e) {
    play_interval(scales[current_interval].split(':'));
});


var play_interval = function(ratio) {
    if (stopping) {
        return;
    }

    if (current_sound !== null) {
        stop_sound(current_sound.base_oscillator, current_sound.interval_oscillator, current_sound.gain_node, 0.2);        
        setTimeout(function() {play_interval(ratio);}, 205);
        return;
    }

    var gn = ac.createGainNode();

    var start_time = ac.currentTime;
    gn.gain.setValueAtTime(0, start_time );
    gn.gain.linearRampToValueAtTime( 0.25, start_time + 0.1 );

    var base_frequency = 440;
    var interval_frequency = 440 * ((+ ratio[1]) / (+ ratio[0]));

    var base_oscillator = ac.createOscillator();
    base_oscillator.type = 3;
    base_oscillator.frequency.value = base_frequency;
    base_oscillator.connect(gn);

    var interval_oscillator = ac.createOscillator();
    interval_oscillator.type = 3;
    interval_oscillator.frequency.value = interval_frequency;
    interval_oscillator.connect(gn);

    gn.connect(ac.destination);

    base_oscillator.noteOn(0);
    interval_oscillator.noteOn(0);

    setTimeout(function () {
        stop_sound(base_oscillator, interval_oscillator, gn, 1);
    }, 1000);

    current_sound = {
        base_oscillator: interval_oscillator,
        interval_oscillator: interval_oscillator,
        gain_node: gn
    };
}

var stop_sound = function(base_oscillator, interval_oscillator, gain_node, fadeout_seconds) {
    stopping = true;

    var now = ac.currentTime;
    gain_node.gain.linearRampToValueAtTime(0.0, now + fadeout_seconds);

    setTimeout(function () {
        base_oscillator.noteOff(0);
        interval_oscillator.noteOff(0);

        base_oscillator.disconnect();
        interval_oscillator.disconnect();
        gain_node.disconnect();

        current_sound = null;
        stopping = false;
    }, (fadeout_seconds * 1000) + 10);
}
