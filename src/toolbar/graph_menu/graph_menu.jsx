import React, { Component } from 'react';

import "./graph_menu.css"

import {
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

import AddNodeButton from './add_node_button';
import RemoveNodesButton from './remove_nodes_button';
import RemoveEdgesButton from './remove_edges_button';

export default class ViewMenu extends Component{
    constructor(props){
        super(props);
        //graph button
        this.handleAddNodeButtonPress=this.handleAddNodeButtonPress.bind(this)
        this.handleRemoveNodesButtonPress=this.handleRemoveNodesButtonPress.bind(this)
        this.handleRemoveEdgesButtonPress=this.handleRemoveEdgesButtonPress.bind(this)
    }

    // receive button press from GraphButton element
    // pass up to toolbar
    handleAddNodeButtonPress(e){
        e.preventDefault();
        this.props.handleAddNodeButtonPress(e)
    }
    handleRemoveNodesButtonPress(e){
        e.preventDefault();
        this.props.handleRemoveNodesButtonPress(e)
    }
    handleRemoveEdgesButtonPress(e){
        e.preventDefault();
        this.props.handleRemoveEdgesButtonPress(e)
    }

    render() {
        return (
        <AccordionItem id="graphmenu">
            <AccordionItemTitle id="graphmenutitle">
                <h3 className="u-position-relative">
                    Graph
                    <div className="accordion__arrow" role="presentation" />
                </h3>
            </AccordionItemTitle>
            <AccordionItemBody id="graphmenubody">
                <AddNodeButton handleAddNodeButtonPress={this.handleAddNodeButtonPress}/>
                <RemoveNodesButton handleRemoveNodesButtonPress={this.handleRemoveNodesButtonPress}/>
                <RemoveEdgesButton handleRemoveEdgesButtonPress={this.handleRemoveEdgesButtonPress}/>
            </AccordionItemBody>
        </AccordionItem>
        );
    }
}
