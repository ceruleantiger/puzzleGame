


document.addEventListener('DOMContentLoaded', function() {
  //This is called after the browser has loaded the web page

  //add mouse down listener to our canvas object
  document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  timer = setInterval(handleTimer, 100)

  randomizeWordArrayLocations(words) 

  //ask server for a list of the puzzles it has.
  handleRequestForPuzzleList()

  document.getElementById('puzzle_select_menu_id').addEventListener('change', function(e) {
    e.stopPropagation()
    e.preventDefault()
    let nowpuzzle = e.target.value
    if (nowpuzzle) {
      handlePuzzleRequest(nowpuzzle)
    }
  })

  document.getElementById('solve').addEventListener('click', function(e) {
    e.stopPropagation()
    e.preventDefault()
    handleSolvePuzzle()
  })

  drawCanvas()
})
