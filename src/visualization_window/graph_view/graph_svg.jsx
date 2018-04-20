import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './graph_svg.css'

export default class GraphSvg extends Component {
    constructor(props){
        super(props);
        this.state = {
            graphs: [],
            current_graph: -1,
            width: this.props.windowWidth,
            height: this.props.windowHeight,
            current_elements: [],

            // state variables for zoom and pan
            transform_mat: [1, 0, 0, 1, 0, 0],
            svg_down: false,

            // state variables for dragging circle
            circle_down: false,
            circleX: 450,
            circleY: 250,
            
            last_down_x: 0,
            last_down_y: 0,
        }
        this.svgRef = React.createRef()

        // receive graph button press
        this.handleGraphButtonPress = this.handleGraphButtonPress.bind(this)

        this.handleCircleMouseDown = this.handleCircleMouseDown.bind(this)
        this.handleSVGMouseDown = this.handleSVGMouseDown.bind(this)
        this.handleSVGMouseUp = this.handleSVGMouseUp.bind(this)
        this.handleSVGMouseMove = this.handleSVGMouseMove.bind(this)

        this.handleOnWheel = this.handleOnWheel.bind(this)
    }
    getInverseTransform(transform){
        let scale = transform[0];
        let p = transform[4];
        let q = transform[5];
        return [1/scale, 0, 0, 1/scale, -p/scale, -q/scale];
    }
    transformPoint(point, transform){
        return [transform[0]*point[0]+transform[4], transform[0]*point[1]+transform[5]]
    }
    mult_transforms(left, right){
        let new_scale = left[0]*right[0]
        let delta_x = left[0]*right[4]+left[4]
        let delta_y = left[0]*right[5]+left[5]
        return [new_scale, 0, 0, new_scale, delta_x, delta_y]
    }
    handleCircleMouseDown(e){
        this.setState({
            circle_down: true,
            last_down_x: e.clientX,
            last_down_y: e.clientY,
        })
    }
    handleSVGMouseDown(e){
        this.setState({
            svg_down: true,
            last_down_x: e.clientX,
            last_down_y: e.clientY,
        })
    }
    handleSVGMouseUp(e){
        if ((!this.state.circle_down) && (!this.state.svg_down)) {
            return;
        }
        this.setState(prevState=>({
            svg_down: false,
            circle_down: false
        }));
    }

    handleSVGMouseMove(e) {
        e.persist()
        // we don't want to do anything if we aren't resizing.
        let offsetX = e.clientX - this.state.last_down_x;
        let offsetY = e.clientY - this.state.last_down_y;
        if (this.state.circle_down) {
            let mapped_center = this.transformPoint([this.state.circleX, this.state.circleY],
                                                this.state.transform_mat)
            let inverseTransform = this.getInverseTransform(this.state.transform_mat)
            let next_point_mapped = [mapped_center[0]+offsetX, mapped_center[1]+offsetY]
            let next_point = this.transformPoint(next_point_mapped, inverseTransform)
            this.setState({
                circleX: next_point[0],
                circleY: next_point[1],
                last_down_x: e.clientX,
                last_down_y: e.clientY
            })
        }
        else if(this.state.svg_down) {
            let new_transform = this.state.transform_mat
            new_transform[4]+=offsetX;
            new_transform[5]+=offsetY;
            this.setState({
                transform_mat: new_transform,
                last_down_x: e.clientX,
                last_down_y: e.clientY
            })
        }
    }
    handleOnWheel(e){
        e.preventDefault()
        let center = [e.clientX, e.clientY]
        let new_scale = (1-e.deltaY/200)
        let new_transform = [new_scale, 0, 0, new_scale,
                            (-new_scale+1)*center[0], (-new_scale+1)*center[1]]
        this.setState(prevState=>({
            transform_mat: this.mult_transforms(new_transform, prevState.transform_mat)
        }))
    }
    componentDidMount(){
        ReactDOM.findDOMNode(this.svgRef.current).addEventListener("wheel", this.handleOnWheel)
    }
    componentWillUnmount(){
        ReactDOM.findDOMNode(this.svgRef.current).removeEventListener("wheel", this.handleOnWheel)
    }


    componentWillReceiveProps(nextProps){
        // You don't have to do this check first, but it can help prevent an unneeded render
        let widthNotSame = (nextProps.windowWidth !== this.state.width);
        let heightNotSame = (nextProps.windowHeight !== this.state.height);
        if (widthNotSame || heightNotSame) {
            this.setState({
                width: nextProps.windowWidth,
                height: nextProps.windowHeight
            });
        }
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
            <div className="GraphSvg">
                <svg id="svg"
                        ref={this.svgRef}
                        width={this.state.width-4}
                        height={this.state.height-4}
                        
                        onMouseDown={this.handleSVGMouseDown}
                        onMouseUp={this.handleSVGMouseUp}
                        onMouseMove={this.handleSVGMouseMove}>
                    <g className="transformGroup" transform={`matrix(${this.state.transform_mat.join(' ')})`}>
                        <circle className="draggable"
                                cx={this.state.circleX}
                                cy={this.state.circleY}
                                r="40"
                                stroke="blue"
                                strokeWidth="4"
                                fill="red"
                                
                                onMouseDown={this.handleCircleMouseDown}/>
                    </g>
                </svg>
            </div>
        );
    }
  }