import React, { Component } from 'react';
import './App.css';

import Graph from "./graph_drawing/Graph";

import GraphCanvas from "./graph_view/graph_canvas";
import Toolbar from "./toolbar/toolbar";

class App extends Component {
    constructor(props){
        super(props);
        this.graph_canvas = React.createRef();
        this.toolbar = React.createRef();
        this.state = {
            cursor: "default"
        }

        //toolbar
            //viewmenu
                //graph button
                this.handleGraphButtonPress=this.handleGraphButtonPress.bind(this)
            //drag bar
            this.handleMouseUp=this.handleMouseUp.bind(this)
            this.handleMouseMove=this.handleMouseMove.bind(this)
            this.toolbarDragCursor=this.toolbarDragCursor.bind(this)
            this.resetCursor=this.resetCursor.bind(this)
    }

    componentDidMount(){
        window.Graph=Graph
    }

    // receive graph button press from toolbar
    // pass down to graph canvas
    handleGraphButtonPress(e){
        this.graph_canvas.current.handleGraphButtonPress(e)
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
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            style={{cursor: this.state.cursor}}>

            <Toolbar ref={this.toolbar}
                    dragCursor={this.toolbarDragCursor}
                    handleGraphButtonPress={this.handleGraphButtonPress}/>
                    
            <GraphCanvas ref={this.graph_canvas}/>
        </div>
        );
    }
}

export default App;
