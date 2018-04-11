import React, { Component } from 'react';

function rect(props) {
    const {ctx, x, y, width, height} = props;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, width, height);
}

export default class GraphCanvas extends Component {
    constructor(props){
        super(props);
        this.state = {
            graphs: [],
            current_graph: -1,
        }
        this.handleGraphButtonPress = this.handleGraphButtonPress.bind(this)
    }
    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0,0, 300, 300);
        // draw children “components"
        if(this.state.current_graph!==null){
            rect({ctx, x: 10*(this.state.current_graph+1),
                       y: 10*(this.state.current_graph+1),
                       width: 50, height: 50});
        }
    }

    loadGraph(graph){
        this.setState(prevState => ({
            graphs: [...prevState.graphs, graph],
            current_graph: prevState.current_graph+1
        }), () => {this.updateCanvas();})
    }

    handleGraphButtonPress(event) {
        this.loadGraph()
    }

    render() {
        return (
            <div className="GraphCanvas" id="1">
                <canvas ref="canvas" width={300} height={300}/>
            </div>
        );
    }
  }