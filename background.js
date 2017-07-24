function selectTab(direction) {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    if (tabs.length <= 1) {
      return;
    }
    chrome.tabs.getSelected(null, function(currentTab) {
      var toSelect;
      switch (direction) {
        case 'next':
          toSelect = tabs[(currentTab.index + 1 + tabs.length) % tabs.length];
          break;
        case 'previous':
          toSelect = tabs[(currentTab.index - 1 + tabs.length) % tabs.length];
          break;
        case 'first':
          toSelect = tabs[0];
          break;
        case 'last':
          toSelect = tabs[tabs.length - 1];
          break;
      }
      chrome.tabs.update(toSelect.id, { selected: true });
    });
  });
}


chrome.commands.onCommand.addListener(function(command) {
  if (command === 'new-tab') {
    // First we need to focus the current window
    // otherwise the new tab won't have the cursor in the OmniBar
    chrome.windows.getCurrent({}, function(win){
      chrome.windows.update(win.id, {focused: true}, function() {
        chrome.tabs.create({});
      });
    });
  }
  else if (command === 'close-tab') {
    chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.remove(tab.id);
    });
  }
  else if (command === 'next-tab') {
    selectTab('next');
  }
  else if (command === 'prev-tab') {
    selectTab('previous');
  }
  else if (command === 'new-window') {
    // Simply passing focused doesn't seem to work so try harder
    chrome.windows.create({focused: true}, function(win){
      chrome.windows.update(win.id, {focused: true});
    });
  }
});
