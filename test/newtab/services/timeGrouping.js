import TimeGrouping from '../../../src/services/timeGrouping';
import { assert } from 'chai';

var now = Date.now();

describe('TimeGroupingService', function() {
    describe('#createGrouping()', function() {
        it('should return corrent groupings of tabs', function() {
            var tabs = [];
            tabs.push({
                added: now
            });
            tabs.push({
                added: now - 10 * 1000
            });
            tabs.push({
                added: now - 5 * 60 * 1000
            });
            tabs.push({
                added: now - 8 * 60 * 60 * 1000
            });
            tabs.push({
                added: now - 3 * 24 * 60 * 60 * 1000
            });

            var timeGrouping = new TimeGrouping(now);
            var groupings = timeGrouping.createGrouping(tabs);

            assert.isArray(groupings, 'should be an array');
            assert.lengthOf(groupings, 5);
            assert.equal(groupings[0].group, 'just now');
            assert.equal(groupings[1].group, '10 seconds ago');
            assert.equal(groupings[2].group, '5 minutes ago');
            assert.equal(groupings[3].group, '8 hours ago');
            assert.equal(groupings[4].group, '3 days ago');
        });

        it('should return corrent number in groupings', function() {
            var tabs = [];
            tabs.push({
                added: now
            });
            tabs.push({
                added: now - 1000
            });
            tabs.push({
                added: now - 3 * 24 * 60 * 60 * 1000
            });
            tabs.push({
                added: now - 3 * 24 * 60 * 60 * 1000 - 60000
            });
            tabs.push({
                added: now - 3 * 24 * 60 * 60 * 1000 - 200000
            });

            var timeGrouping = new TimeGrouping(now);
            var groupings = timeGrouping.createGrouping(tabs);

            assert.isArray(groupings, 'should be an array');
            assert.lengthOf(groupings, 2);
            assert.equal(groupings[0].group, 'just now');
            assert.equal(groupings[1].group, '3 days ago');

            assert.lengthOf(groupings[0].tabs, 2);
            assert.lengthOf(groupings[1].tabs, 3);
        });
    });
});
