import React, { Component } from 'react';
import Collapsible from 'react-collapsible';

import "./view_menu.css"

export default class ViewMenu extends Component{
    render() {
        return (
        <div>

        <Collapsible trigger="Start here">
        <p>Hello</p>
        </Collapsible>

        </div>
        );
    }
}
