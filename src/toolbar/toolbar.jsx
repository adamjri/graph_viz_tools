import React, { Component } from 'react';

import ViewMenu from "./view_menu";

// import {debounce} from "throttle-debounce"

import {
    Accordion,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import './toolbar.css'

export default class Toolbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            isResizing: false,
            lastDownX: 0,
            width: window.innerWidth*0.2,
            min_width: 100,
        }
        this.handleDragMouseDown=this.handleDragMouseDown.bind(this);
        this.handleDragMouseMove=this.handleDragMouseMove.bind(this)
        this.handleDragMouseUp=this.handleDragMouseUp.bind(this);
    }

    handleDragMouseDown(e) {
        e.persist()
        this.props.dragCursor()
        this.setState(prevState => ({
            isResizing: true,
            lastDownX: e.clientX
        }))
    };

    handleDragMouseUp(e){
        this.setState(prevState=>({
            isResizing: false
        }));
    }

    handleDragMouseMove(e) {
        e.persist()
        // we don't want to do anything if we aren't resizing.
        if (!this.state.isResizing) {
            return;
        }
        let offset = e.clientX - this.state.lastDownX;
        this.setState(prevState => ({
            width: Math.max(prevState.width+offset, prevState.min_width),
            lastDownX: prevState.width+offset
        }))
    }

    render()
    {
        var divstyle ={width: this.state.width}
        return(
        <div className="ToolbarDiv" id="toolbar" style={divstyle}>
            <div id="drag"
                onMouseDown={this.handleDragMouseDown}/>
            <Accordion className="Toolbar">
                <ViewMenu/>
                <ViewMenu/>
            </Accordion>
        </div>
        )
    }
};

