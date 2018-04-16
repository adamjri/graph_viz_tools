import React, {Component} from 'react'

import "./graph_button.css"

export default class GraphButton extends Component{
    constructor(props){
        super(props);
        this.handleButton=this.handleButton.bind(this)
    }

    handleButton(e){
        e.preventDefault();
        this.props.onButtonPress(e)
    }

    render() {
        return(
        <div className="GraphButton">
            <form onSubmit={this.handleButton}>
                <button>Submit Graph</button>
            </form>
        </div>
        )
    }
}