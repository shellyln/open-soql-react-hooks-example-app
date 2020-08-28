
import React    from 'react';
import Accounts from './Accounts';
import logo     from './logo.svg';
import               './App.css';



function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link"
                   href="https://reactjs.org"
                   target="_blank"
                   rel="noopener noreferrer">
                    Learn React
                </a>
                <div style={{ display: "flex" }}>
                    <div style={{ border: "solid 1px", margin: 2, paddingRight: 20 }}>
                        <Accounts />
                    </div>
                    <div style={{ border: "solid 1px", margin: 2, paddingRight: 20 }}>
                        <Accounts />
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
