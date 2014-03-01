var current_interval = undefined;

$("aside a").on("click", function (e) {
    e.preventDefault();
    var next_interval = $(e.currentTarget).data("interval-class");
    if (current_interval) {
        $("body").removeClass(current_interval).addClass(next_interval);
    } else {
        $("body").addClass(next_interval);
    }

    $("section span").text(scales[next_interval]);
    current_interval = next_interval;
});

var scales = {
	"minorsecond": "15:16",
	"majorsecond": "8:9",
	"minorthird": "5:6",
	"majorthird": "4:5",
	"perfectfourth": "3:4",
	"augfourthdimfifth": "1:√2",
	"perfectfifth": "2:3",
	"minorsixth": "5:8",
	"goldensection": "1:1.618",
	"majorsixth": "3:5",
	"minorseventh": "9:16",
	"majorseventh": "8:15",
	"octave": "1:2",
	"majortenth": "2:5",
	"majoreleventh": "3:8",
	"majortwelfth": "1:3",
	"doubleoctave": "1:4"
};
