import React, { Component } from 'react';
import './App.css';
// Components
import Header from './header';
import Footer from './footer';

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Header />
        <Footer />
      </div>
    );
  }
}

export default App;
