ModularTone = {};

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

// I feel like this is maybe the most clumsy way to do this
// but ... it works.
var forsvg = {
	minorsecond: 1,
	majorsecond: 2,
	minorthird: 3,
	majorthird: 4,
	perfectfourth: 5,
	augfourthdimfifth: 6,
	perfectfifth: 7,
	minorsixth: 8,
	goldensection: 9,
	majorsixth: 10,
	minorseventh: 11,
	majorseventh: 12,
	octave: 13,
	majortenth: 14,
	majoreleventh: 15,
	majortwelfth: 16,
	doubleoctave: 17
};

$("aside a.interval").on("click", function (e) {
    e.preventDefault();
    var next_interval = $(e.currentTarget).data("interval-class");
    if (current_interval) {
        $("body").removeClass(current_interval).addClass(next_interval);
    } else {
        $("body").addClass(next_interval);
    }

    $("section span").text(scales[next_interval]);
    ModularTone.sound.transitionTo(next_interval);

    var bolt = $("svg");
    var newLeft = $("svg span").css("left");

    if (forsvg[current_interval] < forsvg[next_interval]) {
    		bolt.transition({rotate: '-30deg'});
    }
    else if (forsvg[current_interval] > forsvg[next_interval]) {
    		bolt.transition({rotate: '30deg'});
    }
    else {
    	// don't turn
    }
    current_interval = next_interval;
});

$('section').on('click', function (e) {
    ModularTone.sound.togglePlaying();
});

