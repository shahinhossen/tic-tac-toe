import { useEffect, useState } from "react";

// winner calculation function
const calculateWinner = (squares) => {
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
    let [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// square button
const Square = ({ value, onClickSquare }) => {
  return (
    <button
      className={`border border-blue-700 w-full h-28 text-3xl ${
        value === "X" ? "text-green-500" : "text-red-500"
      } font-bold`}
      onClick={onClickSquare}
    >
      {value}
    </button>
  );
};

// Board component
const Board = ({ isXMove, currentSquares, handleClick }) => {
  return (
    <div className="h-screen w-full max-w-sm flex flex-col gap-5 justify-center items-center">
      <span
        className={`${
          isXMove ? "text-gray-600" : "text-yellow-500"
        } text-3xl font-bold`}
      >
        O
      </span>

      <div className="w-full max-h-[384px] grid grid-cols-3">
        {currentSquares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClickSquare={() => handleClick(index)}
          />
        ))}
      </div>

      <span
        className={`${
          isXMove ? "text-yellow-500" : "text-gray-600"
        } text-3xl font-bold`}
      >
        You - X
      </span>
    </div>
  );
};

// History component
const History = ({ history, jumpTo }) => {
  return (
    <ul className="border-5 w-full border-white min-w-xs bg-gray-200">
      {history.map((square, move) => {
        if (move > 0) {
          return (
            <li
              key={move}
              className="py-1 px-3 mt-1 cursor-pointer bg-black font-bold text-xl"
            >
              <button onClick={() => jumpTo(move)}>Go to move #{move}</button>
            </li>
          );
        } else {
          return (
            <li key={move} className="py-1 px-3 bg-black font-bold text-xl">
              <button>Go to start game</button>
            </li>
          );
        }
      })}
    </ul>
  );
};

// Winner component
const Winner = ({ isDraw, isXMove, currentSquares }) => {
  return calculateWinner(currentSquares) ? (
    <h1 className="text-2xl font-bold">
      Winner is {calculateWinner(currentSquares)}
    </h1>
  ) : isDraw ? (
    <h1 className="text-2xl font-bold">No winner. It's Draw</h1>
  ) : (
    <h1 className="text-2xl font-bold">Next Player - {isXMove ? "X" : "O"}</h1>
  );
};

// Play with Bot Button
const PlayBot = ({ playWithBot, handleBotPlay }) => {
  return (
    <div>
      <button
        onClick={handleBotPlay}
        className={`px-5 py-2 ${playWithBot ? "bg-red-600" : "bg-green-700"}`}
      >
        {playWithBot ? "Stop Bot" : "Play with Bot"}
      </button>
    </div>
  );
};

//Game
function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isXMove, setIsXMove] = useState(true);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDraw, setIsDraw] = useState(null);
  const [playWithBot, setPlayWithBot] = useState(false);

  const currentSquares = history[currentMove];

  // square click function
  const handleClick = (i) => {
    if (currentSquares[i] || calculateWinner(currentSquares)) return;
    const nextSquares = [...currentSquares]; // I copied array using spread oparator instead of slice() method
    nextSquares[i] = isXMove ? "X" : "O"; // I use ternary oparator for oneline of code it will decide square input will be X or O
    setIsXMove(!isXMove); // toggle player turn
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // it was bit confusing for me but I understand but not clearly. ekhane history array tar ekta copy banano hoyeche and seta theke slice kore first element theke suru kore currentMove er ek index pore giye slice kore puro array neowa hoyeche tarpor nextSquare k add kore deowa hoyeche etar jonno amader history te back kore sekhan theke abr game start kora jacche kintu tarporeo amr mone hocche ami mone hoy etuku thik moto bujhte pari ni.
    setHistory(nextHistory); // nextHistory is new history array that's why we set nextHistory in history array
    setCurrentMove(nextHistory.length - 1); // update currentMove. nextHistory.length show how many objects are there and we know that array index start from 0 that's why we did -1;
  };

  // jump into the history and play from there
  const jumpTo = (move) => {
    setCurrentMove(move);
    setIsXMove(move % 2 === 0);
  };

  //Bot Player
  const handleBotPlay = () => setPlayWithBot(!playWithBot);

  useEffect(() => {
    const botMove = () => {
      const emptyBox = currentSquares
        .map((val, i) => (val === null ? i : null))
        .filter((val) => val !== null);
      if (emptyBox.length === 0) return setIsDraw(true);
      const randomBox = emptyBox[Math.floor(Math.random() * emptyBox.length)];
      handleClick(randomBox);
    };
    if ((playWithBot && !isXMove) || calculateWinner(currentSquares)) {
      setTimeout(() => {
        botMove();
      }, 700);
    }
  }, [isXMove]); // I am getting eslint error here because of dependency I don't know much about use effect dependency so I will learn useEffect when useEffect class start.

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 bg-gray-800 text-white items-center justify-center">
        <Board
          isXMove={isXMove}
          currentSquares={currentSquares}
          handleClick={handleClick}
        />

        <div className="flex flex-col gap-5">
          <PlayBot playWithBot={playWithBot} handleBotPlay={handleBotPlay} />

          <Winner
            isDraw={isDraw}
            isXMove={isXMove}
            currentSquares={currentSquares}
          />

          <History history={history} jumpTo={jumpTo} />
        </div>
      </div>
    </>
  );
}

export default App;
