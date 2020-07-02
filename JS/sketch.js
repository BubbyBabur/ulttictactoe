
let game;
let images;

function preload(){
    images = new ImageWrapper(["images/eye.png"]);
}

function setup() {
    game = new ttt(images);
}

function draw() {
    game.render();
}

mouseClicked = function () {
    game.onclick();
}

windowResized = function(){
    game.onresize();
}

