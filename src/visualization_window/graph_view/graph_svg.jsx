import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './graph_svg.css'

export default class GraphSvg extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: this.props.windowWidth,
            height: this.props.windowHeight,

            // boolean for whether or not graph is directed
            is_undirected: true,

            // list of descriptions of nodes
            nodes: [],

            // adjacancy matrix
            //items are either null or an object descriptor of the edge
            adjacency_mat: [],

            // state variables for zoom and pan
            transform_mat: [1, 0, 0, 1, 0, 0],
            svg_left_down: false,
            svg_right_down: false,
            right_drag_node: null,
            
            last_down_x: 0,
            last_down_y: 0,
        }
        this.svgRef = React.createRef()

        // receive graph manipulations button press
        this.handleAddNodeButtonPress = this.handleAddNodeButtonPress.bind(this)
        this.handleCreateEdge = this.handleCreateEdge.bind(this)
        this.handleRemoveNodesButtonPress = this.handleRemoveNodesButtonPress.bind(this)
        this.removeNodes = this.removeNodes.bind(this)
        this.handleRemoveEdgesButtonPress = this.handleRemoveEdgesButtonPress.bind(this)
        this.removeEdges = this.removeEdges.bind(this)

        // generates handlers for mouse down and click on nodes
        this.nodeMouseDownGenerator = this.nodeMouseDownGenerator.bind(this)
        this.nodeMouseUpGenerator = this.nodeMouseUpGenerator.bind(this)
        this.nodeDoubleClickGenerator = this.nodeDoubleClickGenerator.bind(this)

        // handler for mouse down on svg
        this.handleSVGMouseDown = this.handleSVGMouseDown.bind(this)

        // handler for releasing mouse down on svg and nodes
        this.handleSVGMouseUp = this.handleSVGMouseUp.bind(this)

        // handler for moving nodes or panning svg
        this.handleSVGMouseMove = this.handleSVGMouseMove.bind(this)

        // handler for zooming on scroll wheel
        this.handleOnWheel = this.handleOnWheel.bind(this)
        
        // handler for resetting transform
        this.resetTransform = this.resetTransform.bind(this)

        this.render_self_edge = this.render_self_edge.bind(this)
        this.render_all_edges = this.render_all_edges.bind(this)
    }

    // ****************************************************************************
    // manipulate transforms for zoom and pan
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
    resetTransform(){
        this.setState({
            transform_mat: [1, 0, 0, 1, 0, 0]
        })
    }

    // ****************************************************************************
    // handle mouse down on nodes
    nodeMouseDownGenerator(node_index){
        return function(e){
            if(e.button===0){
                let new_nodes = this.state.nodes;
                new_nodes[node_index].left_mouse_down = true
                this.setState({
                    nodes: new_nodes,
                    last_down_x: e.clientX,
                    last_down_y: e.clientY,
                })
            }
            else if(e.button===2){
                let new_nodes = this.state.nodes;
                new_nodes[node_index].right_mouse_down = true
                this.setState({
                    nodes: new_nodes,
                    last_down_x: e.clientX,
                    last_down_y: e.clientY,
                })
            }
        }
    }
    // handle mouse up on nodes
    nodeMouseUpGenerator(node_index){
        return function(e){
            let right_down_node=-1;
            for(let i=0; i<this.state.nodes.length; i++){
                if(this.state.nodes[i].right_mouse_down){
                    right_down_node=i;
                    break;
                }
            }
            if(right_down_node===-1){
                return
            }
            this.handleCreateEdge(right_down_node, node_index)
        }
    }
    nodeDoubleClickGenerator(node_index){
        return function(e){
            let new_nodes = this.state.nodes;
            new_nodes[node_index].highlighted = !new_nodes[node_index].highlighted;
            if(new_nodes[node_index].stroke==="blue"){
                new_nodes[node_index].stroke = "purple";
                new_nodes[node_index].fill = "orange";
            }
            else{
                new_nodes[node_index].stroke = "blue";
                new_nodes[node_index].fill = "red";
            }
            this.setState({
                nodes: new_nodes,
            })
        }
    }

    // ****************************************************************************
    // handle pan and dragging of nodes
    handleSVGMouseDown(e){
        if(e.button===0){
            this.setState({
                svg_left_down: true,
                last_down_x: e.clientX,
                last_down_y: e.clientY,
            })
        }
        else if(e.button===2){
            this.setState({
                svg_right_down: true,
                last_down_x: e.clientX,
                last_down_y: e.clientY,
            })
        }
    }
    handleSVGMouseUp(e){
        let id_left_down = -1;
        let id_right_down = -1;
        for(let i=0; i<this.state.nodes.length; i++){
            if(this.state.nodes[i].left_mouse_down){
                id_left_down = i;
            }
            if(this.state.nodes[i].right_mouse_down){
                id_right_down = i;
            }
        }
        let left_down = (id_left_down!==-1);
        let right_down = (id_right_down!==-1);
        if (!left_down && !right_down && (!this.state.svg_left_down)) {
            return;
        }
        if(left_down || right_down){
            let new_nodes = this.state.nodes
            if(left_down){new_nodes[id_left_down].left_mouse_down=false}
            if(right_down){new_nodes[id_right_down].right_mouse_down=false}
            this.setState({
                nodes: new_nodes,
                svg_left_down: false,
                svg_right_down: false,
                right_drag_node: null,
            });
        }
        else{
            this.setState({
                svg_left_down: false,
                svg_right_down: false,
                right_drag_node: null,
            });
        }
    }

    handleSVGMouseMove(e) {
        e.persist()
        // first check if we're dragging from a right-clicked node
        // we don't want to do anything if we aren't resizing.
        let offsetX = e.clientX - this.state.last_down_x;
        let offsetY = e.clientY - this.state.last_down_y;
        let id_left_down = -1;
        let id_right_down = -1;
        for(let i=0; i<this.state.nodes.length; i++){
            if(this.state.nodes[i].left_mouse_down){
                id_left_down = i;
            }
            if(this.state.nodes[i].right_mouse_down){
                id_right_down = i;
            }
        }
        // right dragging from node to create edge
        if(id_right_down!==-1){
            this.setState({
                right_drag_node: id_right_down,
                last_down_x: e.clientX,
                last_down_y: e.clientY,
            })
        }
        // left dragging from node to move node
        else if(id_left_down!==-1){
            let mapped_center = this.transformPoint([this.state.nodes[id_left_down].cx,
                                                    this.state.nodes[id_left_down].cy],
                                                        this.state.transform_mat)
            let inverseTransform = this.getInverseTransform(this.state.transform_mat)
            let next_point_mapped = [mapped_center[0]+offsetX, mapped_center[1]+offsetY]
            let next_point = this.transformPoint(next_point_mapped, inverseTransform)
            let new_nodes = this.state.nodes
            new_nodes[id_left_down].cx = next_point[0]
            new_nodes[id_left_down].cy = next_point[1]
            this.setState({
                nodes: new_nodes,
                last_down_x: e.clientX,
                last_down_y: e.clientY
            })
        }
        // left dragging of svg to pan
        else if(this.state.svg_left_down) {
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

    // ****************************************************************************
    // zoom handlers
    handleOnWheel(e){
        e.preventDefault()
        let center = [e.clientX, e.clientY]
        let new_scale = (1-e.deltaY/300)
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
    // ****************************************************************************

    componentWillReceiveProps(nextProps){
        let widthNotSame = (nextProps.windowWidth !== this.state.width);
        let heightNotSame = (nextProps.windowHeight !== this.state.height);
        if (widthNotSame || heightNotSame) {
            this.setState({
                width: nextProps.windowWidth,
                height: nextProps.windowHeight
            });
        }
    }

    // ****************************************************************************
    // add node button
    handleAddNodeButtonPress(e){
        let new_node = {
            cx: 450,
            cy: 250,
            r: 40,
            stroke: "blue",
            strokeWidth: 4,
            fill: "red",
            fields: {},
            left_mouse_down: false,
            right_mouse_down: false,
            highlighted: false,
        }
        let new_adjacency_mat = this.state.adjacency_mat;
        let num_nodes = this.state.nodes.length;
        let new_row = [];
        for(let i=0; i<num_nodes; i++){
            new_adjacency_mat[i].push(null)
            new_row.push(null)
        }
        new_row.push(null)
        new_adjacency_mat.push(new_row)
        this.setState(prevState => ({
            nodes: [...prevState.nodes, new_node],
            adjacency_mat: new_adjacency_mat,
        }))
    }
    handleCreateEdge(n1, n2){
        let new_adjacency_mat = this.state.adjacency_mat
        if(new_adjacency_mat[n1][n2]===null){
            let new_edge = {
                x1: this.state.nodes[n1].cx,
                y1: this.state.nodes[n1].cy,
                x2: this.state.nodes[n2].cx,
                y2: this.state.nodes[n2].cy,
                stroke: "green",
                strokeWidth: 2,
                fields: {},
                left_mouse_down: false,
                right_mouse_down: false,
                highlighted: false,
            }
            new_adjacency_mat[n1][n2] = new_edge
            if(this.state.is_undirected){
                new_adjacency_mat[n2][n1] = new_edge
            }
            this.setState({
                adjacency_mat: new_adjacency_mat,
            })
        }
    }
    removeNodes(indices){
        // modify lists and perform single render
        let new_nodes = this.state.nodes;
        let new_adjacency_mat = this.state.adjacency_mat;
        // delete nodes and adjacency matrix rows
        for(let i=indices.length-1; i>=0; i--){
            new_nodes.splice(indices[i], 1)
            new_adjacency_mat.splice(indices[i], 1)
        }
        // delete adjacency matrix cols
        for(let j=0; j<new_adjacency_mat.length; j++){
            for(let i=indices.length-1; i>=0; i--){
                new_adjacency_mat[j].splice(indices[i], 1)
            }
        }
        // set new state
        this.setState({
            nodes: new_nodes,
            adjacency_mat: new_adjacency_mat
        })
    }
    // remove highlighted nodes button
    handleRemoveNodesButtonPress(e){
        // get list of indices to delete
        let indices = [];
        for(let i=0; i<this.state.nodes.length; i++){
            if(this.state.nodes.highlighted){
                indices.push(i)
            }
        }
        this.removeNodes(indices)
    }
    removeEdges(coordinates){
        // modify lists and perform single render
        let new_adjacency_mat = this.state.adjacency_mat
        for(let i=0; i<coordinates.length; i++){
            new_adjacency_mat[coordinates[i][0]][coordinates[i][1]] = null
        }
        // set new state
        this.setState({
            adjacency_mat: new_adjacency_mat,
        })
    }
    // remove highlighted edges button
    handleRemoveEdgesButtonPress(e){
        // get list of coordinates to delete
        let indices = [];
        for(let i=0; i<this.state.current_edges.length; i++){
            if(this.state.nodes.highlighted){
                indices.push(i)
            }
        }
        this.removeEdges(indices)
    }

    rotate(point, rotation){
        let cosx = Math.cos(rotation*Math.PI/180);
        let sinx = Math.sin(rotation*Math.PI/180);
        return [point[0]*cosx - point[1]*sinx,
                point[0]*sinx + point[1]*cosx] 
    }
    render_self_edge(node_index, key){
        // draw circle 3/4 away and place arrow
        let rotation = 45;
        let r = this.state.nodes[node_index].r;
        let cx = this.state.nodes[node_index].cx;
        let cy = this.state.nodes[node_index].cy;
        let new_center = this.rotate([1.5*r, 0], rotation)
        new_center = [Math.round(cx+new_center[0]), Math.round(cy-new_center[1])]
        let p0 = this.rotate([0.75*r, 0.66144*r], rotation);
        let p1 = this.rotate([0.89322*r, 1.2018*r], rotation);
        let p2 = this.rotate([1.26822*r, 0.87108*r], rotation);
        p0 = [Math.round(cx+p0[0]), Math.round(cy-p0[1])];
        p1 = [Math.round(cx+p1[0]), Math.round(cy-p1[1])];
        p2 = [Math.round(cx+p2[0]), Math.round(cy-p2[1])];
        let path_description = "M"+p0[0]+" "+p0[1]+
                                " L"+p1[0]+" "+p1[1]+
                                " L"+p2[0]+" "+p2[1]+
                                " Z";
        return (
            <g key={key}>
                <circle cx={new_center[0]}
                        cy={new_center[1]}
                        r={r}
                        stroke="black"
                        strokeWidth={this.state.nodes[node_index].strokeWidth}
                        fill="none"/>
                <path d={path_description}/>
            </g>
        );
    }
    render_all_edges(){
        let l = this.state.adjacency_mat.length;
        let edges = []
        let key=0
        for(let i=0; i<l; i++){
            for(let j=0; j<l; j++){
                if(i===j){
                    if(this.state.adjacency_mat[i][j]!==null){
                        edges.push(this.render_self_edge(i, "e"+key))
                        key++
                    }
                }
            }
        }
        return edges
    }
    render() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let inverse_transform = this.getInverseTransform(this.state.transform_mat);
        if(this.state.right_drag_node!==null){
            startX = this.state.nodes[this.state.right_drag_node].cx;
            startY = this.state.nodes[this.state.right_drag_node].cy;
            [endX, endY] = this.transformPoint([this.state.last_down_x, this.state.last_down_y],
                                                inverse_transform)
            
        }
        const arrow = (this.state.right_drag_node!==null) ?
            (<line x1={startX} y1={startY} x2={endX} y2={endY}
                opacity={0.5} pointerEvents="none"
                stroke="black" strokeWidth="14" markerEnd="url(#arrowhead)"
                />)
            :(<div/>);

        return (
            <div className="GraphSvg">
                <svg id="svg"
                        ref={this.svgRef}
                        width={this.state.width-4}
                        height={this.state.height-4}
                        
                        onMouseDown={this.handleSVGMouseDown}
                        onMouseUp={this.handleSVGMouseUp}
                        onMouseMove={this.handleSVGMouseMove}>
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                refX="1.5" refY="2" orient="auto">
                            <polygon points="0 0, 2 2, 0 4" />
                        </marker>
                    </defs>

                    <g className="transformGroup"
                        transform={`matrix(${this.state.transform_mat.join(' ')})`}>
                        {this.render_all_edges()}
                        {
                            this.state.nodes.map((item, index) => (
                                <g key={"n"+index}
                                    className="draggable"
                                    onMouseDown={this.nodeMouseDownGenerator(index).bind(this)}
                                    onMouseUp={this.nodeMouseUpGenerator(index).bind(this)}
                                    onDoubleClick={this.nodeDoubleClickGenerator(index).bind(this)}>
                                    <circle
                                        opacity={1}
                                        cx={item.cx}
                                        cy={item.cy}
                                        r={item.r}
                                        stroke={item.stroke}
                                        strokeWidth={item.strokeWidth}
                                        fill={item.fill}
                                    />
                                    <text
                                        opacity={1}
                                        x={item.cx}
                                        y={item.cy}
                                        alignmentBaseline="middle"
                                        textAnchor="middle"
                                        stroke="black"
                                        strokeWidth="2px"
                                        dy=".3em">
                                        {""+index}
                                    </text>
                                </g>
                            ))
                        }
                        {arrow}
                    </g>
                </svg>
            </div>
        );
    }
}