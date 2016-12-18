import React from 'react';
import ReactDOM from 'react-dom';

import Storage from './services/storage';
import Tab from './services/tab';


ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

Storage._getTabIDs().then((tab) => {
    console.log(tab);

    var tab = Tab.create({
        url: "fake.com",
        favicon: "fake favicon"
    });


    tab.add().then(() => {
        Tab.get(tab.id).then((tab) => {
            console.log(tab);
            Tab.getRecent().then(tabs => {
                tabs[0].remove();
                console.log(tabs);
            })
        })
    });

});
