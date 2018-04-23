import React, {Component} from 'react'

import "./remove_nodes_button.css"

export default class RemoveNodesButton extends Component{
    constructor(props){
        super(props);
        this.handleButton=this.handleButton.bind(this)
    }

    handleButton(e){
        e.preventDefault();
        this.props.handleRemoveNodesButtonPress(e)
    }

    render() {
        return(
        <div className="RemoveNodesButton">
            <form onSubmit={this.handleButton}>
                <button>Remove Nodes</button>
            </form>
        </div>
        )
    }
}