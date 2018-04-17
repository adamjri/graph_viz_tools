import React, { Component } from 'react';

import "./view_menu.css"

import {
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

import GraphButton from './graph_button';

export default class ViewMenu extends Component{
    constructor(props){
        super(props);
        //graph button
        this.handleGraphButtonPress=this.handleGraphButtonPress.bind(this)
    }

    // receive button press from GraphButton element
    // pass up to toolbar
    handleGraphButtonPress(e){
        e.preventDefault();
        this.props.handleGraphButtonPress(e)
    }

    render() {
        return (
        <AccordionItem id="viewmenu">
            <AccordionItemTitle id="viewmenutitle">
                <h3 className="u-position-relative">
                    View
                    <div className="accordion__arrow" role="presentation" />
                </h3>
            </AccordionItemTitle>
            <AccordionItemBody id="viewmenubody">
                <GraphButton handleGraphButtonPress={this.handleGraphButtonPress}/>
            </AccordionItemBody>
        </AccordionItem>
        );
    }
}
