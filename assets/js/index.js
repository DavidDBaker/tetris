'use strict';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// scaling size of game pieces
context.scale(20,20);

// filling our canvas
context.fillStyle = '#000';
context.fillRect(0,0,canvas.width,canvas.height);

const matrix = [
  [0,0,0],
  [1,1,1],
  [0,1,0],
];
function draw(){
  drawMatrix(player.matrix,player.pos);
}

function drawMatrix(matrix,offset){
  matrix.forEach((row,y) => {
    row.forEach((value,x) => {
      if(value !== 0){
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1,1);
      }
    });
  });
}

function update(){
    draw();
    requestAnimationFrame(update);
}

const player = {
  pos:{x:5, y:5},
  matrix: matrix,
};

update();