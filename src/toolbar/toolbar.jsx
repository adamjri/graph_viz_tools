import React, { Component } from 'react';

import GraphMenu from "./graph_menu/graph_menu";

// import {debounce} from "throttle-debounce"

import {Accordion} from 'react-accessible-accordion';

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
        // ViewMenu
            // graph button
            this.handleAddNodeButtonPress=this.handleAddNodeButtonPress.bind(this)

        // Drag bar
        this.handleDragMouseDown=this.handleDragMouseDown.bind(this);
        this.handleDragMouseMove=this.handleDragMouseMove.bind(this)
        this.handleDragMouseUp=this.handleDragMouseUp.bind(this);
    }

    // receive button press from ViewMenu element
    // pass up to App
    handleAddNodeButtonPress(e){
        e.preventDefault();
        this.props.handleAddNodeButtonPress(e)
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
        if(!this.state.isResizing){
            return;
        }
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
        var divstyle = {width: this.state.width}
        var accordionstyle = {fontSize: this.state.width*0.15}
        return(
        <div className="ToolbarDiv" id="toolbar" style={divstyle}>
            <div id="inner">
            <Accordion id="toolbar" accordion={false} style={accordionstyle}>
                <GraphMenu handleAddNodeButtonPress={this.handleAddNodeButtonPress}/>
            </Accordion>
            </div>
            <div id="drag" onMouseDown={this.handleDragMouseDown}/>
        </div>
        )
    }
};

