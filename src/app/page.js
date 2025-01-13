"use client";
import React, { useState, useEffect, useCallback } from "react";
import cardDeck from "../data/cards.json";
import Card from "./components/Card";
import styles from "./page.module.css";
import Image from "next/image";
import Mittens from "../assets/mittens.jpg";
import Confetti from "react-confetti";

export default function Home() {
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [isBlurred, setIsBlurred] = useState(true);
  const [backgroundAnimation, setBackgroundAnimation] = useState("");
  const [isWinner, setIsWinner] = useState(false);

  const startGame = () => {
    const shuffledDeck = [...cardDeck.cards].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    setCurrentCard(shuffledDeck[0]);
    setCurrentCount(0);
    setUserInput("");
    setGameStarted(true);
    setMessage("");
    setIsBlurred(true);
    setBackgroundAnimation("");
    setIsWinner(false);
  };

  const resetGame = () => {
    setDeck([]);
    setCurrentCard(null);
    setCurrentCount(0);
    setUserInput("");
    setGameStarted(false);
    setMessage("");
    setIsBlurred(true);
    setBackgroundAnimation("");
    setIsWinner(false);
  };

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  const handleGuess = useCallback(() => {
    const expectedValue = currentCard?.value;
    const newCount = currentCount + expectedValue;

    if (parseInt(userInput) === newCount) {
      setBackgroundAnimation(styles.correctBackground);
      setTimeout(() => setBackgroundAnimation(""), 500);

      const remainingDeck = deck.slice(1);
      setDeck(remainingDeck);
      setCurrentCard(remainingDeck[0] || null);
      setCurrentCount(newCount);
      setUserInput("");
      setMessage("");

      if (remainingDeck.length === 0) {
        setMessage("Game over! You completed the deck!");
        setGameStarted(false);
        setIsWinner(true);
      }
    } else {
      setBackgroundAnimation(styles.incorrectBackground);
      setTimeout(() => setBackgroundAnimation(""), 500);
      setMessage(`Incorrect! Try again.`);
      setUserInput("");
    }
  }, [currentCard, currentCount, userInput, deck]);

  const handleKeyPress = useCallback(
    (event) => {
      if (!gameStarted) return;

      const activeElement = document.activeElement;

      if (event.key === "Enter") {
        handleGuess();
        return;
      }

      if (activeElement && activeElement.tagName === "INPUT") {
        return;
      }

      const key = event.key;

      if (!isNaN(key) || key === "-") {
        setUserInput((prev) => prev + key);
      } else if (key === "Backspace") {
        setUserInput((prev) => prev.slice(0, -1));
      }
    },
    [gameStarted, handleGuess] // Dependencies
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameStarted, userInput, handleKeyPress]);

  return (
    <div className={`${styles.background} ${backgroundAnimation}`}>
      <div className={`${styles.container}`}>
        {isWinner && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}{" "}
        {!gameStarted && (
          <>
            <h1>Omega 2 Count Practice</h1>
            <Image src={Mittens} width={400} height={0} alt="mittens" />
            <button onClick={startGame} className={styles.startButton}>
              Start Game
            </button>
          </>
        )}
        {gameStarted && currentCard && (
          <>
            <div className={styles.status}>
              <h1>Cards Remaining: {deck.length}</h1>
              <h2 onClick={toggleBlur}>
                Current Count:{" "}
                <span className={isBlurred ? styles.blurred : ""}>
                  {currentCount}
                </span>
              </h2>
            </div>

            <div className={`${styles.cardDisplay}`}>
              <Card
                rank={currentCard.rank}
                suit={currentCard.suit}
                symbolCount={currentCard.symbolCount}
                symbol={currentCard.symbol}
              />
            </div>

            <p>{message ? message : <br />}</p>
            <div className={styles.inputSection}>
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter count value"
                className={styles.inputField}
              />
            </div>
            <button onClick={resetGame} className={styles.resetButton}>
              Reset Game
            </button>
          </>
        )}
        {!currentCard && gameStarted && isWinner && (
          <>
            <h2>Congratulations! You&apos;ve completed the game!</h2>
            <Image src={Mittens} width={400} height={0} alt="mittens" />{" "}
            <button onClick={resetGame} className={styles.resetButton}>
              Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
