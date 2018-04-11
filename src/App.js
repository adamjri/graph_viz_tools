import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Graph from "./graph_drawing/Graph";
import GraphCanvas from "./graph_view/graph_canvas";
import GraphButton from "./graph_view/graph_button";
import ViewMenu from "./toolbar/view_menu";

class App extends Component {
    constructor(props){
        super(props);
        this.graph_canvas = React.createRef();
    }
    componentDidMount(){
        window.Graph=Graph
    }

    handleGraphButtonPress = (e) => {
        this.graph_canvas.current.handleGraphButtonPress(e)
    }

    render() {
        return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <GraphCanvas ref={this.graph_canvas}/>
            <GraphButton onButtonPress={this.handleGraphButtonPress}/>
            <ViewMenu/>
        </div>
        );
    }
}

export default App;
