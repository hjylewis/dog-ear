import React from 'react';
import Storage from '../../services/storage/index';
import TimeGrouping from '../../services/timeGrouping';
import CategoryGrouping from '../../services/categoryGrouping';
import settings from '../../services/settings';

import { ErrorAlert } from './alert';
import List from './list';
import Guide from './Guide';
import ActionBar from './actionBar';
import GroupingModeDropDown from './groupingModeDropDown';

import DogLogo from '../assets/Dog.svg';

const PAGE_SIZE = 40;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.tabNumber = PAGE_SIZE;

    this.state = {
      tabs: null,
      errorMessage: null,
      groupingMode: settings.groupingMode || 'ADDED', // ADDED or CATEGORY
      selection: {},
    };

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.openTabs = this.openTabs.bind(this);
    this.removeTabs = this.removeTabs.bind(this);
    this.select = this.select.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.changeGroupingMode = this.changeGroupingMode.bind(this);
  }

  componentDidMount() {
    this.loadTabs();
    Storage.onChange(() => {
      this.loadTabs();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.groupingMode !== prevState.groupingMode) {
      settings.groupingMode = this.state.groupingMode;
      settings.save();
    }
  }

  loadTabs() {
    // TODO: Remove this hotfix
    // once storage is changed
    if (this.state.groupingMode === 'CATEGORY') {
      Storage.getRecentTabs(500)
        .then(tabs => {
          this.setState({
            tabs: tabs,
          });
          this.tabNumber = tabs.length;
        })
        .catch(error => this.setErrorMessage(error));
      return;
    }

    Storage.getRecentTabs(this.tabNumber)
      .then(tabs => {
        this.setState({
          tabs: tabs,
        });
      })
      .catch(error => this.setErrorMessage(error));
  }

  loadMore() {
    if (this.state.tabs && this.state.tabs.length === this.tabNumber) {
      this.tabNumber += PAGE_SIZE;
      this.loadTabs();
    }
  }

  onScroll(e) {
    var distanceFromBottom =
      e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight);

    if (distanceFromBottom < 50) {
      this.loadMore();
    }
  }

  removeTabs(tabs) {
    if (!Array.isArray(tabs)) {
      tabs = [tabs];
    }

    tabs.forEach(tab => {
      tab.remove().catch(error => this.setErrorMessage(error));
    });
  }

  openTabs(tabs) {
    if (!Array.isArray(tabs)) {
      tabs = [tabs];
    }
    chrome.tabs.getCurrent(currentTab => {
      var count = 0;

      tabs.forEach(tab => {
        tab
          .remove()
          .then(() => {
            count++;
            chrome.tabs.create({ url: tab.url });

            // If last one
            if (count === tabs.length) {
              chrome.tabs.remove(currentTab.id);
            }
          })
          .catch(error => this.setErrorMessage(error));
      });
    });
  }

  // Works like a toggle when force is not defined
  select(tab, force) {
    var selection = this.state.selection;

    if ((tab.url in selection && force === undefined) || force === false) {
      delete selection[tab.url];
    } else {
      selection[tab.url] = tab;
    }

    this.setState({
      selection: selection,
    });
  }

  setErrorMessage(error) {
    let message;
    // If Error object
    if (error && error.message) {
      message = error.message;
    } else {
      message = error;
    }

    this.setState({
      errorMessage: message,
    });

    if (error) throw error;
  }

  changeGroupingMode(mode) {
    this.setState({ groupingMode: mode });
  }

  render() {
    let groups = [];
    if (this.state.tabs) {
      if (this.state.groupingMode === 'ADDED') {
        groups = TimeGrouping.createGrouping(this.state.tabs);
      } else {
        groups = CategoryGrouping.createGrouping(this.state.tabs);
      }
    }

    return (
      <div className="app" onScroll={this.onScroll}>
        <div className="header">
          <ErrorAlert
            message={this.state.errorMessage}
            closeAlert={this.setErrorMessage.bind(null, null)}
          />
          <div className="header-content">
            <DogLogo className="dog-logo" />
            <div>
              <h1>Your Dog Ears</h1>
              <GroupingModeDropDown
                mode={this.state.groupingMode}
                changeMode={this.changeGroupingMode}
              />
            </div>
          </div>
        </div>
        <div className="app-content">
          <Guide
            tabsLoaded={!!this.state.tabs}
            tabNumber={this.state.tabs ? this.state.tabs.length : 0}
            setErrorMessage={this.setErrorMessage}
          />
          <List
            groups={groups}
            customizable={this.state.groupingMode === 'CATEGORY'}
            removeTabs={this.removeTabs}
            select={this.select}
            selection={this.state.selection}
          />
        </div>
        {Object.keys(this.state.selection).length > 0 ? (
          <ActionBar
            select={this.select}
            openTabs={this.openTabs}
            selection={this.state.selection}
            setErrorMessage={this.setErrorMessage}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default App;
