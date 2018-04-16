import React, { Component } from 'react';
import './App.css';

import Graph from "./graph_drawing/Graph";
import GraphCanvas from "./graph_view/graph_canvas";
import GraphButton from "./graph_view/graph_button";
import Toolbar from "./toolbar/toolbar";

class App extends Component {
    constructor(props){
        super(props);
        this.graph_canvas = React.createRef();
        this.toolbar = React.createRef();


        this.handleGraphButtonPress=this.handleGraphButtonPress.bind(this)
        this.handleMouseUp=this.handleMouseUp.bind(this)
        this.handleMouseMove=this.handleMouseMove.bind(this)
    }
    // componentDidMount(){
    //     window.Graph=Graph
    // }

    handleGraphButtonPress(e){
        this.graph_canvas.current.handleGraphButtonPress(e)
    }

    handleMouseUp(e){
        this.toolbar.current.handleDragMouseUp(e)
    }

    handleMouseMove(e){
        this.toolbar.current.handleDragMouseMove(e)
    }

    render() {
        return (
        <div className="App"
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}>
            <Toolbar ref={this.toolbar}/>
            {/* <GraphCanvas ref={this.graph_canvas}/>
            <GraphButton onButtonPress={this.handleGraphButtonPress}/> */}
        </div>
        );
    }
}

export default App;
