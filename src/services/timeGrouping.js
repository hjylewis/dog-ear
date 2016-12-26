import Timeago from 'timeago.js';

class TimeGrouping {
    constructor (relativeTime) {
        this.timeago = new Timeago(relativeTime);
    }

    createGrouping (tabs) {
        var groups = {};
        var ordering = [];

        tabs.forEach((tab) => {
            var timeago = this.timeago.format(tab.added);
            if (!(timeago in groups)) {
                groups[timeago] = [];
                ordering.push(timeago);
            }
            groups[timeago].push(tab);
        });


        return ordering.map((timeago) => {
            return {
                timeago: timeago,
                tabs: groups[timeago]
            };
        });
    }
}

export default TimeGrouping;
