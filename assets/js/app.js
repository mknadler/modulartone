var current_interval = undefined;

$("aside a").on("click", function (e) {
    e.preventDefault();
    var next_interval = $(e.currentTarget).data("interval-class");
    if (current_interval) {
        $("body").removeClass(current_interval).addClass(next_interval);
    } else {
        $("body").addClass(next_interval);
    }

    current_interval = next_interval;
});
