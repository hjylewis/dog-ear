let CategoryGrouping = {
    createGrouping: (tabs) => {
        let groups = {};

        for (let tab of tabs) {
            let category = tab.category || null;

            if (!(category in groups)) {
                groups[category] = [];
            }
            groups[category].push(tab);
        }

        let ordering = Object.keys(groups).sort();
        let idxOfNull = ordering.indexOf(null);

        // Move null to the front
        if (idxOfNull > -1) {
            ordering.splice(idxOfNull, 1);
            ordering.unshift(null);
        }

        return ordering.map((category) => {
            return {
                group: category,
                tabs: groups[category]
            };
        });
    }
};

export default CategoryGrouping;
