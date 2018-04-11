import React, {Component} from 'react'

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
        <div className="test_class_css">
            <form onSubmit={this.handleButton}>
                <button>Submit Graph</button>
            </form>
        </div>
        )
    }
}