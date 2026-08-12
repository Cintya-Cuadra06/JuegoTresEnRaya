import { useState } from 'react'
import confetti from "canvas-confetti"

const TURNS = {
  X: '❌',
  O: '🔵'
}
//componente que representa una casilla del tablero
// Recibe el contenido, el estado de seleccion, la funcion para actualizar
// el tablero y la posicion de la casilla
const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function App() {
  const [board, setBoard] = useState(() =>{
   const boardFromStorage = window.localStorage.getItem('board')
   return boardFromStorage ? JSON.parse(boardFromStorage) :  Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage  ?? TURNS.x
    TURNS.X
  })
  const [winner, setWinner] = useState(null) 
  const checkWinner = (boardToCheck) => {
//revisa todas las combinaciones ganadoras para ver 
//si hay un ganador, ya sea X u O
    for (const combo of WINNER_COMBOS){
      const [a, b, c] = combo 
      if (
        boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    //sino hay ganador
    return null 
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
  //no se actualiza el estado de una casilla, si ya hay un valor de por medio
    if(board[index] || winner) return
//Actualiza el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
//cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X 
    setTurn(newTurn)

//guardar la partida 
window.localStorage.setItem('board', JSON.stringify(newBoard))
window.localStorage.setItem('turn', newTurn)

//revisar si hay un ganador
  const newWinner = checkWinner(newBoard)
  if(newWinner){
    confetti()
    setWinner(newWinner)
  } else if (checkEndGame(newBoard)){
    setWinner(false) //empate, termina el juego
  }
  }

  return (
    <main className="board">
      <h1>Tres en raya</h1>
      <button onClick= {resetGame}>Reset del juego</button>

      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>

        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      {
        winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>
                {
                  winner === false 
                  ? 'Empate'
                  : 'Gana: ' 
                }
              </h2>

              <header className="win">
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App