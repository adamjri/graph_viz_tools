import React, { Component } from 'react';

import "./view_menu.css"

import {
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

export default class ViewMenu extends Component{
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
                <p>Body content</p>
            </AccordionItemBody>
        </AccordionItem>
        );
    }
}
