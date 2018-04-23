import React, { Component } from 'react';

import "./graph_menu.css"

import {
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

import AddNodeButton from './add_node_button';

export default class ViewMenu extends Component{
    constructor(props){
        super(props);
        //graph button
        this.handleAddNodeButtonPress=this.handleAddNodeButtonPress.bind(this)
    }

    // receive button press from GraphButton element
    // pass up to toolbar
    handleAddNodeButtonPress(e){
        e.preventDefault();
        this.props.handleAddNodeButtonPress(e)
    }

    render() {
        return (
        <AccordionItem id="graphmenu">
            <AccordionItemTitle id="graphmenutitle">
                <h3 className="u-position-relative">
                    View
                    <div className="accordion__arrow" role="presentation" />
                </h3>
            </AccordionItemTitle>
            <AccordionItemBody id="graphmenubody">
                <AddNodeButton handleAddNodeButtonPress={this.handleAddNodeButtonPress}/>
            </AccordionItemBody>
        </AccordionItem>
        );
    }
}
