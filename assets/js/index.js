'use strict';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// scaling size of game pieces
context.scale(20,20);

function collision(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}


function createMatrix(w,h){
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type){
  if (type === 'T'){
    return [
      [0,0,0],
      [1,1,1],
      [0,1,0],
    ];
  } else if (type === 'o'){
    return [
      [1,1],
      [1,1],
    ];
  } else if (type === 'l'){
    return [
      [0,1,0],
      [0,1,0],
      [0,1,1],
    ];
  } else if (type === 'j'){
    return [
      [0,1,0],
      [0,1,0],
      [1,1,0],
    ];
  } else if (type === 'j'){
    return [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
    ];
  } else if (type === 's'){
    return [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ];
  } else if (type === 'z'){
    return [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ];
  }
  return;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function draw(){
// filling our canvas
  context.fillStyle = '#000';
  context.fillRect(0,0,canvas.width,canvas.height);

  drawMatrix(arena,{x:0,y:0});
  drawMatrix(player.matrix,player.pos);
}

function merge(arena,player){
  player.matrix.forEach((row,y) => {
    row.forEach((value, x) =>{
      if (value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop(){
  player.pos.y++;
  if (collision(arena, player)) {
    player.pos.y--;
    merge(arena,player);
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(dir){
  player.pos.x += dir;
  if (collision(arena,player)){
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collision(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}

function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix,dir);
  while (collision(arena,player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length){
      rotate(player.matrix, -dir);
      player.pos = pos;
      return;
    }
  }
}

function rotate(matrix,dir){
  for(let y=0;y <matrix.length; ++y){
    for (let x=0; x <y; ++x){
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }
  if (dir > 0){
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}


let dropCounter = 0; 
let dropInterval = 1000;


let lastTime = 0;

function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;
    
  dropCounter += deltaTime;
  if (dropCounter > dropInterval){
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

const player = {
  pos:{x:5, y:5},
  matrix: createPiece('T'),
};

const arena = createMatrix(12,20);

document.addEventListener('keydown', event => {

  if (event.keyCode === 37){
    playerMove(-1);
  } else if (event.keyCode === 39){
    playerMove(+1);
  } else if (event.keyCode === 40){
    playerDrop();
  } else if(event.keyCode === 81){
    playerRotate(-1);
  } else if(event.keyCode === 87){
    playerRotate(1);
  }
});

update();