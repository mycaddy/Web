import React from 'react';
import logo from './logo.svg';
import './App.css';
import HooksExample from './snippet4test/HooksExample'
import HooksContext from './snippet4test/HooksContext'
import LeftPane from './snippet4test/LeftPane'
import RightPane from './snippet4test/RightPane'
import { SampleProvider } from './snippet4test/context/sample'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SampleProvider>
          <div className="panes">
            <LeftPane />
            <RightPane />
          </div>
        </SampleProvider>
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <HooksExample />
        <HooksContext />
      </header>
    </div>
  )

}

export default App;
