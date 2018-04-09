import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function rect(props) {
  const {ctx, x, y, width, height} = props;
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x, y, width, height);
}

class CanvasComponent extends Component {
  componentDidMount() {
      this.updateCanvas();
  }
  updateCanvas() {
      const ctx = this.refs.canvas.getContext('2d');
      ctx.clearRect(0,0, 300, 300);
      // draw children “components”
      rect({ctx, x: 10, y: 10, width: 50, height: 50});
      rect({ctx, x: 110, y: 110, width: 50, height: 50});
  }
  render() {
      return (
          <canvas ref="canvas" width={300} height={300}/>
      );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <CanvasComponent/>
      </div>
    );
  }
}

export default App;
