import React, { Component } from 'react';
import './App.css';

import Graph from "./graph_drawing/Graph";

import DisplayManager from "./visualization_window/display_manager";
import Toolbar from "./toolbar/toolbar";

class App extends Component {
    constructor(props){
        super(props);
        this.displaymanager = React.createRef();
        this.toolbar = React.createRef();
        this.state = {
            cursor: "default",

            width: window.innerWidth,
            height: window.innerHeight,

        }

        //Window resizing
        this.updateDimensions = this.updateDimensions.bind(this)
        this.createWindowResizeListener = this.createWindowResizeListener.bind(this)
        this.deleteWindowResizeListener = this.deleteWindowResizeListener.bind(this)

        //toolbar
            //viewmenu
                //add node button
                this.handleAddNodeButtonPress=this.handleAddNodeButtonPress.bind(this)
                this.handleRemoveNodesButtonPress=this.handleRemoveNodesButtonPress.bind(this)
                this.handleRemoveEdgesButtonPress=this.handleRemoveEdgesButtonPress.bind(this)
            //drag bar
            this.handleMouseUp=this.handleMouseUp.bind(this)
            this.handleMouseMove=this.handleMouseMove.bind(this)
            this.toolbarDragCursor=this.toolbarDragCursor.bind(this)
            this.resetCursor=this.resetCursor.bind(this)
    }

    //***********************************************************
    // Handle mount and unmount
    componentDidMount(){
        window.Graph=Graph

        this.updateDimensions()
        this.createWindowResizeListener()
    }

    componentWillUnmount(){
        this.deleteWindowResizeListener()
    }

    //***********************************************************
    //functions for detecting window resizing
    updateDimensions(){
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }
    createWindowResizeListener(){
        window.addEventListener("resize", this.updateDimensions);
    }
    deleteWindowResizeListener(){
        window.removeEventListener("resize", this.updateDimensions);
    }

    //***********************************************************

    // receive graph button press from toolbar
    // pass down to display manager
    handleAddNodeButtonPress(e){
        this.displaymanager.current.handleAddNodeButtonPress(e)
    }
    handleRemoveNodesButtonPress(e){
        this.displaymanager.current.handleRemoveNodesButtonPress(e)
    }
    handleRemoveEdgesButtonPress(e){
        this.displaymanager.current.handleRemoveEdgesButtonPress(e)
    }

    // pass mouse up down to toolbar for drag bar
    handleMouseUp(e){
        this.resetCursor()
        this.toolbar.current.handleDragMouseUp(e)
    }

    // pass mouse up down to toolbar for drag bar
    handleMouseMove(e){
        this.toolbar.current.handleDragMouseMove(e)
    }

    // cursor for drag bar
    toolbarDragCursor(){
        this.setState({
            cursor: "ew-resize"
        })
    }
    // cursor for drag bar
    resetCursor(){
        this.setState({
            cursor: "default"
        })
    }

    render() {
        return (
        <div className="App"
            onContextMenu={(e)=>{e.preventDefault()}}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            style={{cursor: this.state.cursor}}>
            <DisplayManager ref={this.displaymanager}
                            windowWidth={this.state.width}
                            windowHeight={this.state.height}/>
            <Toolbar ref={this.toolbar}
                    dragCursor={this.toolbarDragCursor}
                    handleAddNodeButtonPress={this.handleAddNodeButtonPress}
                    handleRemoveNodesButtonPress={this.handleRemoveNodesButtonPress}
                    handleRemoveEdgesButtonPress={this.handleRemoveEdgesButtonPress}/>
        </div>
        );
    }
}

export default App;
