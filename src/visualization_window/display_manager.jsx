import React, { Component } from 'react';

import './display_manager.css'

import GraphCanvas from "./graph_view/graph_canvas";

// class for toggling between graph and text display
export default class DisplayManager extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: this.props.windowWidth,
            height: this.props.windowHeight,
            display_type: "graph",
            graphs: [],
            current_graph: -1,
        }
        this.GraphDisplayRef = React.createRef();
        this.TextDisplayRef = React.createRef();

        // bind functions
        this.setDisplayToGraph = this.setDisplayToGraph.bind(this);
        this.setDisplayToText = this.setDisplayToText.bind(this);
    }

    setDisplayToGraph(){
        if(this.state.display_type!=="graph"){
            this.setState({
                display_type: "graph"
            })
        }
    }
    setDisplayToText(){
        if(this.state.display_type!=="text"){
            this.setState({
                display_type: "text"
            })
        }
    }

    handleGraphButtonPress(e){
        if(this.state.display_type==="graph"){
            this.GraphDisplayRef.current.handleGraphButtonPress(e)
        }
    }

    render() {
        let graph_style={}
        let text_style={}
        if(this.state.display_type==="graph"){
            graph_style["z-index"]= 3;
            text_style["z-index"]=2;
        }
        else{
            graph_style["z-index"]= 2;
            text_style["z-index"]=3;
        }
        return (
            <div className="DisplayManager">
                <GraphCanvas ref={this.GraphDisplayRef}
                            style={graph_style}
                            windowWidth={this.state.width}
                            windowHeight={this.state.height}/>
            </div>
        );
    }
  }