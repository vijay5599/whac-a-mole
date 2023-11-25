import "./App.css";
import mole from "./assets/mole.png";
import hole from "./assets/hole.png";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

function App() {
  const [moles, setMoles] = useState(new Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [popupResultCount, setPopupResultCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const initialTimer = 30;
  const [timer, setTimer] = useState(initialTimer);
  const [gameWon, setGameWon] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function setVisibilityMoles(index, isVisible) {
    setMoles((curMoles) => {
      const newMoles = [...curMoles];
      newMoles[index] = isVisible;
      return newMoles;
    });
  }

  function wackMole(index) {
    if (!moles[index]) return;
    setVisibilityMoles(index, false);
    setScore(score + 1);
  }

  useEffect(() => {
    if (score !== 0) {
      setPopupResultCount(score);
    }
  });
  useEffect(() => {
    const interval = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      setVisibilityMoles(randomIndex, true);
      setTimeout(() => {
        setVisibilityMoles(randomIndex, false);
      }, 1000);
    }, 1200);
    return () => {
      clearInterval(interval);
    };
  }, [moles]);

  useEffect(() => {
    let countdown;
    if (timer > 0 && !gameWon) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !gameWon) {
      // Reset the game after 30 seconds
      // alert("Time's up! Game will reset.");
      setShowModal(true);
      resetGame();
    }
    return () => {
      clearTimeout(countdown);
    };
  }, [timer, gameWon]);

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setTimer(initialTimer);
    // setGameWon(false);
    setMoles(() => new Array(9).fill(false));
    setScore(0);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "300px", // Set the width of the modal
      height: "200px", // Set the height of the modal
    },
  };

  useEffect(() => {
    const storedHighdcore = JSON.parse(localStorage.getItem("highScore"));
    if (storedHighdcore) {
      setHighScore(storedHighdcore);
    }
    console.log(storedHighdcore);
  }, []);

  useEffect(() => {
    localStorage.setItem("highScore", JSON.stringify(highScore));
  }, [highScore]);

  return (
    <>
      <h1 className="m-2 font-bold">Score : {score}</h1>
      <h2 className="m-2 font-bold">High Score: {highScore}</h2>
      <p className="m-2 font-bold"> ⏰ Time : {timer}</p>
      <div className="grid grid-cols-3 gap-2">
        {moles.map((isMole, idx) => (
          <img
            key={idx}
            style={{ cursor: "pointer" }}
            src={isMole ? mole : hole}
            onClick={() => wackMole(idx)}
          />
        ))}
      </div>

      <button className="mt-4" onClick={() => resetGame()}>
        🔃Reset
      </button>

      <ReactModal
        isOpen={showModal}
        contentLabel="Time's Up"
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <h2 className="text-black text-xl font-semibold">
          Time's up! Your score is{" "}
          <span className="text-red-600 font-bold text-2xl">
            {popupResultCount}.
          </span>
        </h2>
        <button className="mt-20 ml-48" onClick={closeModal}>
          OK
        </button>
      </ReactModal>
    </>
  );
}

export default App;
