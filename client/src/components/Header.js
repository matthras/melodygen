import React, { Component } from 'react';

class Header extends Component {
    render() {
        return(
            <div id="header">
                <h1>MelodyGen</h1>
                <div id="menu">
                    <ul>
                        <li>About</li>
                        <li>Blog</li>
                        <li>Github</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Header;