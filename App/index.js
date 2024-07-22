// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const window = Dimensions.get('window');
const CELL_SIZE = 20;
const BOARD_SIZE = 300;

const initialSnake = [
  { x: 2, y: 2 },
  { x: 2, y: 1 },
  { x: 2, y: 0 },
];

const getRandomFoodPosition = () => {
  const maxX = Math.floor(BOARD_SIZE / CELL_SIZE);
  const maxY = Math.floor(BOARD_SIZE / CELL_SIZE);
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [snake, direction]);

  const getNextHeadPosition = () => {
    const head = snake[0];
    switch (direction) {
      case 'UP':
        return { x: head.x, y: head.y - 1 };
      case 'DOWN':
        return { x: head.x, y: head.y + 1 };
      case 'LEFT':
        return { x: head.x - 1, y: head.y };
      case 'RIGHT':
        return { x: head.x + 1, y: head.y };
    }
  };

  const moveSnake = () => {
    const newHead = getNextHeadPosition();
    const newSnake = [newHead, ...snake.slice(0, -1)];

    if (checkCollision(newHead)) {
      setGameOver(true);
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      newSnake.push({});
      setFood(getRandomFoodPosition());
    }

    setSnake(newSnake);
  };

  const checkCollision = (head) => {
    if (
      head.x < 0 ||
      head.x >= BOARD_SIZE / CELL_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE / CELL_SIZE
    ) {
      return true;
    }
    for (const segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return true;
      }
    }
    return false;
  };

  const changeDirection = (newDirection) => {
    if (gameOver) return;

    const isOppositeDirection =
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT');

    if (!isOppositeDirection) {
      setDirection(newDirection);
    }
  };

  const handleTouch = ({ nativeEvent }) => {
    const { locationX, locationY } = nativeEvent;
    const screenWidth = window.width;
    const screenHeight = window.height;

    if (locationX < screenWidth / 2 && locationY < screenHeight / 2) {
      changeDirection('LEFT');
    } else if (locationX >= screenWidth / 2 && locationY < screenHeight / 2) {
      changeDirection('UP');
    } else if (locationX < screenWidth / 2 && locationY >= screenHeight / 2) {
      changeDirection('DOWN');
    } else if (locationX >= screenWidth / 2 && locationY >= screenHeight / 2) {
      changeDirection('RIGHT');
    }
  };

  const resetGame = () => {
    setSnake(initialSnake);
    setFood(getRandomFoodPosition());
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={styles.board}>
          {snake.map((segment, index) => (
            <View
              key={index}
              style={[
                styles.snakeSegment,
                {
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.food,
              {
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
              },
            ]}
          />
          {gameOver && (
            <View style={styles.overlay}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text onPress={resetGame} style={styles.resetText}>Tap to Restart</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#EEFCF9',
    position: 'relative',
  },
  snakeSegment: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#1B998B',
    position: 'absolute',
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#FFF',
    fontSize: 30,
    marginBottom: 10,
  },
  resetText: {
    color: '#FFF',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default function App() {
  return (
    <SafeAreaView style={appStyles.container}>
      <Text style={appStyles.title}>Snake Game</Text>
      <SnakeGame />
    </SafeAreaView>
  );
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
});