let CategoryGrouping = {
  createGrouping: tabs => {
    let groups = {};
    let groupless = [];

    for (let tab of tabs) {
      let category = tab.category;
      if (!category) {
        groupless.push(tab);
        continue;
      }

      if (!(category in groups)) {
        groups[category] = [];
      }
      groups[category].push(tab);
    }

    let ordering = Object.keys(groups).sort();

    let grouping = ordering.map(category => {
      return {
        group: category,
        tabs: groups[category],
      };
    });

    if (groupless.length > 0) {
      grouping.unshift({
        group: null,
        tabs: groupless,
      });
    }

    return grouping;
  },
};

export default CategoryGrouping;
