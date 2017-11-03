import Timeago from 'timeago.js';

Timeago.register('simplified_local', (number, index) => {
  return [
    ['just now', 'right now'],
    ['just now', 'right now'], //['%s seconds ago', 'in %s seconds'],
    ['1 minute ago', 'in 1 minute'],
    [
      `${Math.ceil(number / 5) * 5} minutes ago`,
      `in ${Math.ceil(number / 5) * 5} minutes`,
    ],
    ['1 hour ago', 'in 1 hour'],
    ['%s hours ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years'],
  ][index];
});

class TimeGrouping {
  constructor(relativeTime) {
    this.timeago = new Timeago(relativeTime, 'simplified_local');
  }

  static createGrouping(tabs) {
    return new TimeGrouping().createGrouping(tabs);
  }

  createGrouping(tabs) {
    var groups = {};
    var ordering = [];

    tabs.forEach(tab => {
      var timeago = this.timeago.format(tab.added);
      if (!(timeago in groups)) {
        groups[timeago] = [];
        ordering.push(timeago);
      }
      groups[timeago].push(tab);
    });

    return ordering.map(timeago => {
      return {
        group: timeago,
        tabs: groups[timeago],
      };
    });
  }
}

export default TimeGrouping;
