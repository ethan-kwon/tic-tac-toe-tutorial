import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for(let i = 0; i < 3; i++){
      let row = [];
      for(let j = 0; j < 3; j++){
        row.push(<span key={(i * 3) + j}>{this.renderSquare((i * 3) + j)}</span>);
      }
      board.push(<div className="board-row" key={i}>{row}</div>);
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      location: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
      descending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const location = this.state.location.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    location[this.state.stepNumber] = i;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      location: location,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });


    for (let element of document.getElementsByClassName("selected")) {
      element.classList.remove("selected");
    }

    let selected = document.getElementById(step);
    selected.classList.add("selected");
  }

  getLocation(i) {
    switch (i) {
      case 0:
        return " (1,1)";
      case 1:
        return " (1,2)";
      case 2:
        return " (1,3)";
      case 3:
        return " (2,1)";
      case 4:
        return " (2,2)";
      case 5:
        return " (2,3)";
      case 6:
        return " (3,1)";
      case 7:
        return " (3,2)";
      case 8:
        return " (3,3)";
      default:
        return;
    }
  }

  handleToggle() {
    this.setState({
      descending: !this.state.descending,
    });

    let toggle = document.getElementById("toggleButton");

    if (this.state.descending) {
      toggle.innerHTML = "Moves Descending";
    } else {
      toggle.innerHTML = "Moves Ascending";
    }

  }

  render() {
    const history = this.state.history;
    const location = this.state.location;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + ":" + this.getLocation(location[move - 1]):
      'Go to game start';
      return (
        <li key={move}>
          <button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.descending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (calculateTie(current.squares.slice())) {
      status = 'Tie';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button id='toggleButton' className='toggle' 
            onClick={() => this.handleToggle()}>
          Moves Descending
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
 // ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateTie(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }

  return true;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}