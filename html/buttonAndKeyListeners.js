//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40



function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW

  }
  if (e.which == ENTER) {
      //NOT USED ANYMORE
  }

  e.stopPropagation()
  e.preventDefault()

}

let currentpuzzle = ""

function handlePuzzleRequest(userText) {
  
  currentpuzzle = userText //puzzleName
  //let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)

    
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
        console.dir(responseObj) //pretty print response data to console
        
        if (responseObj.puzzleLines) {
          document.getElementById("solutionArea").innerHTML = ""
          words = [] //clear words on canvas
          for (let line of responseObj.puzzleLines) {
            let lineWords = line.split(" ")
            let lineColor = getRandomColor()
            for (let w of lineWords) {
              let word = {
                word: w, colour: lineColor, select: false
              }
              assignRandomIntCoords(word, canvas.width, canvas.height)
              words.push(word)
            }
          }
        }

        drawCanvas()
      }

    }
    xhttp.open("POST", "puzzleRequest") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}


function handleRequestForPuzzleList() {

  const REQUEST_TEXT = 'puzzlesListRequest'

  let userRequestObj = {text: REQUEST_TEXT}
  let userRequestJSON = JSON.stringify(userRequestObj)

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
        console.dir(responseObj) //pretty print response data to console.
        
        let puzzleList = responseObj.puzzleFiles
        let puzzleSelectMenu = document.getElementById('puzzle_select_menu_id')

        for (let i in puzzleList){
          puzzleSelectMenu.innerHTML += `<option value='${puzzleList[i]}'>${puzzleList[i]}</option>`
        }
        drawCanvas()
      }
    }
    xhttp.open("POST", REQUEST_TEXT) //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
}


function handleSolvePuzzle() {
  //compare by y-coordinate
  words.sort(function(a, b) {
    return a.y - b.y
  })
  const TOLERANCE = 10
  let currentLine = []
  let allLines = []
  let previousy = null

  for (let w of words) {
    
    if (previousy == null || Math.abs(w.y-previousy) < TOLERANCE) {
      currentLine.push(w)
      
    }
    //get words in currentLine then push them onto allLines
    else {
      let theline = []
      for (let c of currentLine) {
        theline.push(c)
      }
      allLines.push(theline)
      currentLine = [w]   //start a new line
    }
    previousy = w.y
  }

  //put current(last) line in all
  if (currentLine.length > 0) {
    let theline = []
    for (let c of currentLine) {
      theline.push(c)
    }
    allLines.push(theline)
  }

  //sort words in each line by x-coordinate
  for (let i = 0; i < allLines.length; i++) {
    for (let j = 0; j < allLines[i].length-1; j++) {
      //compare words with next words
      for (let n = j+1; n < allLines[i].length; n++) {
        if (allLines[i][j].x > allLines[i][n].x) {
          let temp = allLines[i][j]
          allLines[i][j] = allLines[i][n]
          allLines[i][n] = temp
        }
      }
    }
  }


  //extract word without other features(x, y...)
  let stringlines = []
  for (let i = 0; i < allLines.length; i++) {
    let stringwords = []
    for (let j = 0; j < allLines[i].length; j++) {
      stringwords.push(allLines[i][j].word)
    }
    stringlines.push(stringwords)
  }


  let userRequestObj = {puzzleName: currentpuzzle, solution: stringlines}

  fetch('/solvePuzzle', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(userRequestObj),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data)
    
    let solutionArea = document.getElementById('solutionArea')
    solutionArea.innerHTML = ''

    let style
    if (data.isCorrect) {
      style = "correct"
    } else {
      style = "wrong"
    }

    //make lines as paragraph
    for (let i = 0; i < stringlines.length; i++) {
      let p = document.createElement('p')
      p.innerText = stringlines[i].join(" ")
      p.className = style
      solutionArea.appendChild(p)
    }
    
    drawCanvas()

  })
  .catch((error) => {
    console.error('Error:', error)
  })



}