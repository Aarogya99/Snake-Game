# Retro Snake

A classic, browser-based Snake game built with HTML5 Canvas, CSS3, and Vanilla JavaScript. It features a retro 8-bit aesthetic, increasing difficulty, and local high score tracking.

## Features

- **Classic Gameplay**: Eat food to grow longer and increase your score. Avoid hitting the walls or your own tail.
- **Retro Aesthetic**: Uses an 8-bit pixel font ("Press Start 2P") and blocky canvas graphics to emulate classic arcade games.
- **Increasing Difficulty**: The game speed increases progressively as you score points, making it more challenging over time.
- **High Score Tracking**: Your highest score is automatically saved to your browser's local storage so you can try to beat it later.
- **Multiple Controls**: Play using either `W, A, S, D` keys or the `Arrow` keys.
- **Responsive Controls**: Quick start/restart feature using the `Spacebar` or on-screen buttons.

## Technologies Used

- **HTML5**: For structure and the `<canvas>` element used to render game graphics.
- **CSS3**: For styling, layout, and the vintage bezel/terminal look.
- **JavaScript (ES6+)**: For core game logic, canvas rendering, collision detection, and input handling without any external libraries.

## How to Play

1. Clone or download this repository.
2. Open the `index.html` file in any modern web browser.
3. Press the **Spacebar** or click **START** to begin the game.
4. Control the snake's direction:
   - **Up**: `Up Arrow` or `W`
   - **Down**: `Down Arrow` or `S`
   - **Left**: `Left Arrow` or `A`
   - **Right**: `Right Arrow` or `D`
5. Game ends if you hit the boundaries or collide with yourself.

## Project Structure

- `index.html`: Contains the main layout, UI overlay, and HTML5 Canvas element.
- `style.css`: Contains all styles including custom fonts, colors, and layout positioning.
- `script.js`: Contains all the game state, canvas drawing updates, logic (moving, consuming food, collisions), and event listeners.

## License

This project is open-source and free to use for educational purposes or personal enjoyment!
