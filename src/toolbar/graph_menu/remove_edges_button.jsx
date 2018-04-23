import React, {Component} from 'react'

import "./remove_edges_button.css"

export default class RemoveEdgesButton extends Component{
    constructor(props){
        super(props);
        this.handleButton=this.handleButton.bind(this)
    }

    handleButton(e){
        e.preventDefault();
        this.props.handleRemoveEdgesButtonPress(e)
    }

    render() {
        return(
        <div className="RemoveEdgesButton">
            <form onSubmit={this.handleButton}>
                <button>Remove Edges</button>
            </form>
        </div>
        )
    }
}