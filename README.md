# puzzleGame
Client-server puzzle game that serves users randomly scrambled words representing a poem, phrase, or puzzle. 
These words appear on a canvas, where users can drag them around with their mouse.
Users solve puzzles by rearranging the words into the correct order. The server then validates the solution.

---
### Features
- Displays shuffled puzzle words on a canvas
- Users can:
  - Drag individual word
  - Select and drag words together as a group
  - Solve puzzle and check correctness
- Color hint for the user: words with the same colour belong on the same line
- Server verifies the solution and returns success or failure
- Fully mouse-controlled UI (click, drag, solve)

### Run
npm install

node server.js

http://localhost:3000/index.html
