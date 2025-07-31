let deltaX, deltaY //location where mouse is pressed relative to targeted string
//drag by the same amount
let dragX, dragY
let dragAmount = []


function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  /*
  This code took some trial and error. If someone wants to write a
  nice tutorial on how mouse-locations work that would be great.
  */
  let rect = canvas.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled

  //get the scroll offset
  const element = document.getElementsByTagName("html")[0]
  let scrollOffsetX = element.scrollLeft
  let scrollOffsetY = element.scrollTop

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let canvasMouseLoc = getCanvasMouseLocation(e)

  console.log("mouse down:" + canvasMouseLoc.canvasX + ", " + canvasMouseLoc.canvasY)

  wordBeingMoved = getWordAtLocation(canvasMouseLoc.canvasX, canvasMouseLoc.canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    wordBeingMoved.select = !wordBeingMoved.select
    deltaX = wordBeingMoved.x - canvasMouseLoc.canvasX
    deltaY = wordBeingMoved.y - canvasMouseLoc.canvasY
    
    //store selected words along with their relative positions from where the mouse clicked
    if (wordBeingMoved.select == true) {
      dragAmount = []
      for (let w of words) {
        if (w.select) {
          dragAmount.push({word: w, x: w.x-canvasMouseLoc.canvasX,
            y: w.y-canvasMouseLoc.canvasY})

          //offset x y, how far word's original x y from mouse x y
        }
      }
    }
    
    document.getElementById('canvas1').addEventListener('mousemove', handleMouseMove)
    document.getElementById('canvas1').addEventListener('mouseup', handleMouseUp)
  }
  else {
    for (let w of words) {
      w.select = false
    }
  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}



function handleMouseMove(e) {

  console.log("mouse move");

  //get mouse location relative to canvas top left

  let canvasMouseLoc = getCanvasMouseLocation(e)

  //get new position, same distance relative to the mouse  
  wordBeingMoved.x = canvasMouseLoc.canvasX + deltaX
  wordBeingMoved.y = canvasMouseLoc.canvasY + deltaY

  //moves each selected word to maintain offset from the mouse
  for (let d of dragAmount) {
    d.word.x = canvasMouseLoc.canvasX + d.x
    d.word.y = canvasMouseLoc.canvasY + d.y
  }

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {

  console.log("mouse up")

  e.stopPropagation()

  //remove mouse move and mouse up handlers but leave mouse down handler
  document.getElementById('canvas1').removeEventListener('mousemove', handleMouseMove)
  document.getElementById('canvas1').removeEventListener('mouseup', handleMouseUp)

  drawCanvas() //redraw the canvas
}
