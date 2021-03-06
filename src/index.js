import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let classVal = props.winner ? 'square winner' : 'square';
  
  return (
    <button className={classVal} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = (this.props.winnerArray != null) && 
      (this.props.winnerArray.indexOf(i) >= 0);
    return (
      <Square
        winner={winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }
  
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    // Ignore clicks if the user is reviewing history
    if (this.state.stepNumber < (history.length - 1)) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1
    });
  }
  
  jumpTo(index) {
    this.setState({
      stepNumber: index,
      xIsNext: (index % 2) === 0
    });
  }
    
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const winnerArray = calculateWinner(squares);
    let status;
    if (winnerArray) {
      status = `Winner: ${squares[winnerArray[0]]}`;
    }
    else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    
    const moves = history.map((squares, i) => {
      const desc = i ?
        `Move #${i}` :
        `Game start`;
        
      let link = <a href = "#" onClick={() => this.jumpTo(i)}>{desc}</a>;
      if (i === this.state.stepNumber) {
        link = (<b>{link}</b>);
      }

      return (
        <li key={i}>
          {link}
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={squares}
            onClick={(i) => this.handleClick(i)}
            winnerArray={winnerArray}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  
  return null;
}