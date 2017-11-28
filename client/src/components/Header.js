import React, { Component } from 'react';

class Header extends Component {
  render() {
    return(
      <div id="header">
        <h1>MelodyGen</h1>
        <div id="menu">
          <a className="button primary" href="https://matthras.com/blog/post/melodygen-intro" target="_blank" rel="noopener noreferrer">About</a>
          <a className="button primary" href="https://matthras.com/blog/melodygen" target="_blank" rel="noopener noreferrer">Blog</a>
          <a className="button primary" href="https://github.com/matthras/melodygen" target="_blank" rel="noopener noreferrer">Github</a>
        </div>
      </div>
    );
  }
}

export default Header;