import Storage from '../../../src/services/storage/index';
import { TAB_ARRAY_KEY } from '../../../src/services/storage/constants';
import Tab from '../../../src/services/tab';
import Mock from '../../../src/services/storage/mockConnection';
import { assert } from 'chai';

// Change connection to mock connection
function setStore(store) {
  var mock = new Mock(store);

  Storage.__Rewire__('Connection', mock);

  return mock;
}

setStore({});

describe('StorageService', function() {
  describe('#getTab()', function() {
    it('should return undefined when no tab with that id exits', function(
      done
    ) {
      setStore({});

      Storage.getTab('url')
        .then(tab => {
          assert.isUndefined(tab, 'no tab defined');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should return tab when one exits', function(done) {
      setStore({
        '0': {
          url: 'url',
        },
      });

      Storage.getTab('0')
        .then(tab => {
          assert.isDefined(tab, 'tab not defined');
          assert.instanceOf(tab, Tab, 'result is not an instance of Tab');
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe('#addTab()', function() {
    it('should add tab to store', function(done) {
      var mock = setStore({});
      var tab = Tab.create({
        url: 'url',
      });

      Storage.addTab(tab)
        .then(() => {
          assert.property(mock.getStore(), tab.url, 'tab id is not in store');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should not add tab with reserved id', function(done) {
      setStore({});
      var tab = Tab.create({
        url: TAB_ARRAY_KEY,
      });

      Storage.addTab(tab)
        .then(() => {
          done('Should not reach');
        })
        .catch(err => {
          assert.isDefined(err);
          done();
        });
    });

    it('should add tab id to array', function(done) {
      var mock = setStore({});
      var tab = Tab.create({
        url: 'url',
      });

      Storage.addTab(tab)
        .then(() => {
          var store = mock.getStore();
          assert.property(
            store,
            TAB_ARRAY_KEY,
            'tab id array has not be created'
          );

          var tabIDs = store[TAB_ARRAY_KEY];
          assert.lengthOf(tabIDs, 1, 'tab id array does not contain new id');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should overwrite if tab with same url has been added', function(done) {
      var mock = setStore({});
      var tab = Tab.create({
        url: 'url',
      });

      var secondTab = Tab.create({
        url: 'url',
      });
      Promise.all([Storage.addTab(tab), Storage.addTab(secondTab)])
        .then(() => {
          assert.lengthOf(
            mock.getStore()[TAB_ARRAY_KEY],
            1,
            'tab id was not overwritten'
          );
          assert.lengthOf(
            Object.keys(mock.getStore()),
            2,
            'tab was not overwritten'
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should be limited to max items limit', function(done) {
      var mock = setStore({});

      var tabs = [];
      for (let i = 0; i < mock.MAX_ITEMS + 100; i++) {
        tabs.push(
          Tab.create({
            url: i.toString(),
          })
        );
      }
      Promise.all(tabs.map(tab => Storage.addTab(tab)))
        .then(() => {
          var store = mock.getStore();
          assert.isAtMost(
            Object.keys(store).length,
            mock.MAX_ITEMS,
            'store size should be capped'
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe('#removeTab()', function() {
    it('should remove tab from store', function(done) {
      var url = 'an_url';
      var tab = { url: url };
      var store = {};
      store[url] = tab;
      store[TAB_ARRAY_KEY] = [url];

      var mock = setStore(store);

      Storage.removeTab(tab)
        .then(() => {
          assert.notProperty(mock.getStore(), url, 'tab is still in store');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should remove tab id from array', function(done) {
      var url = 'an_url';
      var tab = { url: url };
      var store = {};
      store[url] = tab;
      store[TAB_ARRAY_KEY] = [url];

      var mock = setStore(store);

      Storage.removeTab(tab)
        .then(() => {
          assert.lengthOf(
            mock.getStore()[TAB_ARRAY_KEY],
            0,
            'tab id array not empty'
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should fail if tab not in store', function(done) {
      var url = 'an_url';
      var tab = { url: url };
      var store = {};

      setStore(store);

      Storage.removeTab(tab)
        .then(() => {
          done('Should not reach');
        })
        .catch(err => {
          assert.isDefined(err);
          done();
        });
    });
  });

  describe('#getRecentTabs()', function() {
    it('should work on empty store', function(done) {
      setStore({});
      Storage.getRecentTabs()
        .then(tabs => {
          assert.lengthOf(tabs, 0, 'should be empty');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should get most recent tab', function(done) {
      setStore({});

      Promise.all([
        Storage.addTab(Tab.create({ url: 'not recent 1' })),
        Storage.addTab(Tab.create({ url: 'not recent 2' })),
        Storage.addTab(Tab.create({ url: 'not recent 3' })),
        Storage.addTab(Tab.create({ url: 'not recent 4' })),
        Storage.addTab(Tab.create({ url: 'not recent 5' })),
        Storage.addTab(Tab.create({ url: 'not recent 6' })),
      ])
        .then(() => {
          return Storage.addTab({ url: 'most recent' });
        })
        .then(() => {
          return Storage.getRecentTabs(1);
        })
        .then(tabs => {
          assert.lengthOf(tabs, 1, 'should be length 1');
          assert.equal(tabs[0].url, 'most recent');
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should get most recent number of tabs', function(done) {
      setStore({});

      Promise.all([
        Storage.addTab(Tab.create({ url: '1' })),
        Storage.addTab(Tab.create({ url: '2' })),
        Storage.addTab(Tab.create({ url: '3' })),
        Storage.addTab(Tab.create({ url: '4' })),
        Storage.addTab(Tab.create({ url: '5' })),
        Storage.addTab(Tab.create({ url: '6' })),
      ])
        .then(() => {
          return Storage.getRecentTabs(3);
        })
        .then(tabs => {
          assert.lengthOf(tabs, 3, 'should be length 3');
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe('#cleanUpOrphans()', function() {
    it('should remove orphans in store', function(done) {
      var mock = setStore({
        orphan: {},
      });

      var tab = Tab.create({
        url: 'url',
      });

      Storage.addTab(tab)
        .then(() => {
          return Storage.cleanUpOrphans();
        })
        .then(() => {
          assert.property(
            mock.getStore(),
            'url',
            'non-orphan is still in store'
          );
          assert.property(
            mock.getStore(),
            TAB_ARRAY_KEY,
            'reserved id is still in store'
          );
          assert.notProperty(
            mock.getStore(),
            'orphan',
            'orphan is no longer in store'
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe('#size()', function() {
    //TODO
  });

  describe('#clearUpSpace()', function() {
    //TODO
  });
});
