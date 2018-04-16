import React, { Component } from 'react';

import ViewMenu from "./view_menu";

import {debounce} from "throttle-debounce"

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
            height: 0
        }
        this.handleDragMouseDown=this.handleDragMouseDown.bind(this);
        this.handleDragMouseMove=this.handleDragMouseMove.bind(this)
        this.handleDragMouseUp=this.handleDragMouseUp.bind(this);

        this.updateWindowDimensions = debounce(100, this.updateWindowDimensions.bind(this));
    }

    componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    updateWindowDimensions() {
        this.setState({
            height: document.getElementById('toolbar').clientHeight,
            width: document.getElementById('toolbar').clientWidth
        })
    }

    handleDragMouseDown(e) {
        e.persist()
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
            width: prevState.width+offset,
            lastDownX: prevState.width+offset
        }), this.updateWindowDimensions())
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

