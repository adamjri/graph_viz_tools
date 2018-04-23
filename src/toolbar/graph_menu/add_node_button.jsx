import React, {Component} from 'react'

import "./add_node_button.css"

export default class AddNodeButton extends Component{
    constructor(props){
        super(props);
        this.handleButton=this.handleButton.bind(this)
    }

    handleButton(e){
        e.preventDefault();
        this.props.handleAddNodeButtonPress(e)
    }

    render() {
        return(
        <div className="AddNodeButton">
            <form onSubmit={this.handleButton}>
                <button>Add Node</button>
            </form>
        </div>
        )
    }
}