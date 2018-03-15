import React from 'react';
import Game from './Game';
import './index.css';

export default class App extends React.Component {
  componentDidMount() {
    this.game = new Game(this.canvas);
  }
  render() {
    return (
      <canvas width="800" height="600" ref={c => { this.canvas = c; }}>
        You need WebGL bro
      </canvas>
    );
  }
}
