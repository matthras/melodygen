import React, { Component } from 'react';
import './App.css';
// Components
import Header from './header';
import Footer from './footer';
import Body from './body';

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}

export default App;
