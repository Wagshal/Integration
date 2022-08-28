import React from 'react';

import './App.css';
import AutoCopmleteKeyContextProvider from './context/AutoCopmleteKey/AutoCopmleteKeyContext';
import MongoDbMngrContextProvider from './context/MongoDbMngr/MongoDbMngrContext';
import FiltersContextProvider from './context/filter/FiltersContext';
import ScrollableTabsButtonAuto from './components/home/tabPanel';


function App() {
  return (
    <AutoCopmleteKeyContextProvider>
      <MongoDbMngrContextProvider>
        <FiltersContextProvider>
          <ScrollableTabsButtonAuto> </ScrollableTabsButtonAuto>
        </FiltersContextProvider>
      </MongoDbMngrContextProvider>
    </AutoCopmleteKeyContextProvider>
  );
}

export default App;
