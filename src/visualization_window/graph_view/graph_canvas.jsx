import React, { Component } from 'react';

import './graph_canvas.css'

class Rectangle{
    constructor(x, y, width, height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    draw(context){
        context.fillStyle = "#FF0000";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default class GraphCanvas extends Component {
    constructor(props){
        super(props);
        this.state = {
            graphs: [],
            current_graph: -1,
            width: this.props.windowWidth,
            height: this.props.windowHeight,
            current_elements: [],
        }
        this.canvasRef = React.createRef()
        //functions for managing canvas

        // receive graph button press
        this.handleGraphButtonPress = this.handleGraphButtonPress.bind(this)

        this.clearCanvas = this.clearCanvas.bind(this)
        this.drawElements = this.drawElements.bind(this)
        this.updateElements = this.updateElements.bind(this)
        this.loadGraph = this.loadGraph.bind(this)
    }
    componentDidMount() {
        this.clearCanvas();
    }

    componentDidUpdate(){
        this.clearCanvas();
        this.drawElements();
    }

    clearCanvas(){
        let context=this.canvasRef.current.getContext('2d');
        context.clearRect(0,0, this.state.width, this.state.height);
    }

    drawElements(){
        let context=this.canvasRef.current.getContext('2d');
        for(let i=0; i<this.state.current_elements.length; i++){
            this.state.current_elements[i].draw(context)
        }
    }

    updateElements() {
        let r = new Rectangle(10*(this.state.current_graph+18),
                                10*(this.state.current_graph+8),
                                50,
                                50)
        this.setState({
            current_elements: [r]
        })
    }

    loadGraph(graph){
        this.setState(prevState => ({
            graphs: [...prevState.graphs, graph],
            current_graph: prevState.current_graph+1
        }), () => {this.updateElements();})
    }

    handleGraphButtonPress(event) {
        this.loadGraph()
    }

    render() {
        return (
            <div className="GraphCanvas">
                <canvas ref={this.canvasRef} width={window.innerWidth} height={window.innerHeight}/>
            </div>
        );
    }
  }