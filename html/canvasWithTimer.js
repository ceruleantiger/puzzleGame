/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

function getRandomColor() {
  //source: https://stackoverflow.com/questions/1484506/random-color-generator
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//DATA MODELS
//Use javascript array of objects to represent words and their locations
let words = []
/*words.push({word: "I", x: 50, y: 50, colour: getRandomColor()})
words.push({word: "like", x: 70, y: 50, colour: getRandomColor()})
words.push({word: "javascript", x: 120, y: 50, colour: getRandomColor()})

*/

let timer //used for the motion animation

const canvas = document.getElementById('canvas1') //our drawing canvas


function assignRandomIntCoords(object, maxX, maxY) {
  //object expected to have .x and .y co-ordinates

  const MARGIN = 50 //keep way from edge of canvas by MARGIN
  object.x = MARGIN + Math.floor(Math.random() * (maxX - 2*MARGIN))
  object.y = MARGIN + Math.floor(Math.random() * (maxY - MARGIN))
}


function randomizeWordArrayLocations(wordsArray) {
  for(let word of wordsArray){
    assignRandomIntCoords(word, canvas.width, canvas.height)
  }
}

randomizeWordArrayLocations(words)
//====================================

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using length of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now

  
    var context = canvas.getContext('2d')
    context.font = '20pt Arial'
    const TOLERANCE = 20
    for(var i=0; i<words.length; i++){
       var wordWidth = context.measureText(words[i].word).width
     if((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth))  &&
        Math.abs(words[i].y - aCanvasY) < TOLERANCE) return words[i]
    }
    return null
}



function drawCanvas() {

  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) { //note i declared as var

    let data = words[i]
    
    //box frame
    if (data.select) {
      let w = context.measureText(data.word).width
      let h = 28
      context.strokeRect(data.x, data.y - h, w, h)
      context.lineWidth = 1
      
    }

    if(data.colour){
      context.fillStyle = data.colour
      context.strokeStyle = data.colour

    }
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

    

  }
  //reset fill colour for text
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'
  context.stroke()

  
  
}
