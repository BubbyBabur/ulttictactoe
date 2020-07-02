class ttt {

    constructor(images){
        
        this.canvas = createCanvas(windowWidth, windowHeight);
        this.canvas.id("mycanvas");

        this.canvas.parent("canvas-wrapper");

        this.configBoard();
        this.configDatabase();

        this.configButtons();

    }

    configBoard(){

        this.selected = 0;
        this.selectingBig = "true";
        this.mouseHoveredOver = [];
        this.xo = 1;
        this.completed = -3;
        this.message = "";
        this.locked = "false";

        this.playing = true;

        this.imageObj = images;

        this.spectators = 0;

        //Board construction
        this.smallBoard = []
        for (let i = 0; i < 3; i++) {
            this.smallBoard.push([]);
            for (let j = 0; j < 3; j++) {
                this.smallBoard[i].push(0);
            }
        }
        this.board = [];
        for (let i = 0; i < 3; i++) {
            this.board.push([]);
            for (let j = 0; j < 3; j++) {
                this.board[i].push([]);
                for (let k = 0; k < 3; k++) {
                    this.board[i][j].push([]);
                    for (let l = 0; l < 3; l++) {
                        this.board[i][j][k].push(0);
                    }
                }
            }
        }

    }

    configDatabase(){

        var firebaseConfig = {
            apiKey: "AIzaSyA8gbXoMzSJNN4yz4Cah5esDzi-F2SEGpI",
            authDomain: "ulttictactoe-cd8ac.firebaseapp.com",
            databaseURL: "https://ulttictactoe-cd8ac.firebaseio.com",
            projectId: "ulttictactoe-cd8ac",
            storageBucket: "ulttictactoe-cd8ac.appspot.com",
            messagingSenderId: "465241651265",
            appId: "1:465241651265:web:6812602d0fc86adb67aec0",
            measurementId: "G-JQXTCZ9E5B"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        this.database = firebase.database();

    }

    configButtons(){

        this.createbutton = $("#create-button");
        this.joinbutton = $("#join-button");

        this.createbutton.show();
        this.joinbutton.show();

        this.createbutton.on("click", this.lambdaChangeSceneFromStart(-3,-1));
        this.joinbutton.on("click", this.lambdaChangeSceneFromStart(-3,-2));

        this.keyinput = $("#key-input");
        this.keyinput.hide();

        this.submitbutton = $("#submit-button");

        this.playbutton = $("#play-button");
        this.spectatebutton = $("#spectate-button");

        this.submitbutton.on("click", this.lambdaHandleSubmitButtonClick());

        this.configButtonJQuery();

    }

    configButtonJQuery(){
        $(() => {

            $(".big-button").hover(function () {
                $(this).removeClass("pressed-big-button standard-big-button").addClass("hover-big-button");
            }, function () {
                $(this).removeClass("pressed-big-button hover-big-button").addClass("standard-big-button");
            })

            $(".big-button").mousedown(function () {
                $(this).removeClass("hover-big-button standard-big-button").addClass("pressed-big-button");
            })
            $(".big-button").mouseup(function () {
                $(this).removeClass("pressed-big-button standard-big-button").addClass("hover-big-button");
            })

            let _thisPtr = this;
            $("#play-button").hover(function(){
                if(_thisPtr.playing){
                    $(this).removeClass("pressed-paired-1-button standard-paired-1-button").addClass("hover-paired-1-button");
                }
            }, function(){
                if (_thisPtr.playing) {
                    $(this).removeClass("pressed-paired-1-button hover-paired-1-button").addClass("standard-paired-1-button");
                }
            })

            $("#play-button").mousedown(function(){
                if (_thisPtr.playing) {
                    $(this).removeClass("standard-paired-1-button hover-paired-1-button").addClass("pressed-paired-1-button");
                }
            })

            $("#play-button").mouseup(function () {
                if (_thisPtr.playing) {
                    $(this).removeClass("pressed-paired-1-button hover-paired-1-button").addClass("standard-paired-1-button");
                }
            })

            $("#play-button").click(function(){
                _thisPtr.playing = false;
                $(this).removeClass("standard-paired-1-button hover-paired-1-button").addClass("pressed-paired-1-button");
                $("#spectate-button").removeClass("pressed-paired-2-button hover-paired-2-button").addClass("standard-paired-2-button");
            })

            // Break

            $("#spectate-button").hover(function () {
                if (!_thisPtr.playing) {
                    $(this).removeClass("pressed-paired-2-button standard-paired-2-button").addClass("hover-paired-2-button");
                }
            }, function () {
                if (!_thisPtr.playing) {
                    $(this).removeClass("pressed-paired-2-button hover-paired-2-button").addClass("standard-paired-2-button");
                }
            })

            $("#spectate-button").mousedown(function () {
                if (!_thisPtr.playing) {
                    $(this).removeClass("standard-paired-2-button hover-paired-2-button").addClass("pressed-paired-2-button");
                }
            })

            $("#spectate-button").mouseup(function () {
                if (!_thisPtr.playing) {
                    $(this).removeClass("pressed-paired-2-button hover-paired-2-button").addClass("standard-paired-2-button");
                }
            })

            $("#spectate-button").click(function () {
                _thisPtr.playing = true;
                $(this).removeClass("standard-paired-2-button hover-paired-2-button").addClass("pressed-paired-2-button");
                $("#play-button").removeClass("pressed-paired-1-button hover-paired-1-button").addClass("standard-paired-1-button");
            })

        })
    }

    lambdaHandleSubmitButtonClick(){

        return () => {

            if (this.validKey(this.keyinput.val())) {

                if (this.completed == -1) { // If creating

                    this.ref = this.createRef(this.keyinput.val());

                    this.ref.once("value").then((data) => {

                        if (data.val() == null) {

                            this.lambdaChangeSceneFromStart(-1, 0)();
                            this.createGame(this.ref);

                        } else {
                            this.message = "That key's been taken.";
                        }
                    })

                } else {

                    this.ref = this.database.ref("games/" + this.keyinput.val());

                    this.ref.once("value").then((data) => {

                        if (data.val() == null) {// no game

                            this.message = "There's no game with that key.";
                        
                        } else if(this.playing) {// trying to play

                            if (data.val().locked == "true") { // if locked
                                this.message = "That game already has 2 players.";
                            } else {
                                this.thisxo = 2;
                                this.lockGame(this.ref);

                                this.lambdaChangeSceneFromStart(-2, 0)();
                                this.setRetrieval(this.ref);
                            }

                        } else {

                            this.lambdaChangeSceneFromStart(-2, 0)();
                            this.setRetrieval(this.ref);

                            this.thisxo = 3;
                            this.addSpectator(this.ref);

                            
                        }
                    })
                }

            } else {
                message = "Invalid key. There can't be spaces, /s or .s"
            }

        }
    }

    lambdaChangeSceneFromStart(fromScene,toScene){
        return () => {
            
            if(fromScene == -3){
                this.joinbutton.hide(); 
                this.createbutton.hide(); 
            }
            if (fromScene == -1 || fromScene == -2) {
                this.keyinput.hide();
                this.submitbutton.hide();
            }
            if (fromScene == -2) {
                this.playbutton.hide();
                this.spectatebutton.hide();
            }

            this.completed = toScene;

            if(toScene == -1 || toScene == -2){
                this.keyinput.show(); 
                this.submitbutton.show();
            }
            if(toScene == -2){
                this.playbutton.show(); 
                this.spectatebutton.show(); 
            }
            if (toScene == -3) {
                this.joinbutton.show();
                this.createbutton.show();
            }

        }
    }

    validKey(key){
        return key.indexOf("/") == -1 && key.indexOf(" ") == -1 && key.indexOf(".") == -1 && key != "";
    }

    createRef(directory){
        return this.database.ref("games/" + directory);
    }

    createGame(ref){

        var data = {
            board: this.board,
            selected: this.selected,
            selectingBig: this.selectingBig,
            xo: 1,
            locked: this.locked,
            spectators: 0
        }

        ref.set(data);

        this.thisxo = 1;

        this.setRetrieval(ref);

    }

    setRetrieval(ref){

        ref.on("value", (data) => {

            var v = data.val();
            this.xo = v.xo;
            this.selected = v.selected;
            this.selectingBig = v.selectingBig;
            this.board = v.board;
            this.locked = v.locked;
            this.spectators = v.spectators;
            this.updatebigboard();

        });

    }

    render(){

        background(220);

        // Really janky fix, it originally was 400x400, now it's centered
        push();
        translate(width / 2, height / 2);
        scale(min(width, height) / 400);
        translate(-200,-200);

        if (this.completed > -1) {

            let mx = mouseX;
            let my = mouseY;
            mx -= width / 2;
            my -= height / 2;
            mx /= min(width, height) / 400;
            my /= min(width, height) / 400;
            mx += 200;
            my += 200;

            this.mouseHoveredOver = [floor((mx - 50) / 100), floor((my - 50) / 100), floor(((mx - 50) % 100 - 10) / 30), floor(((my - 50) % 100 - 10) / 30)];
            noFill();
            switch (this.completed) {
                case 1:
                    strokeWeight(3);
                    stroke(255, 0, 0);
                    line(55, 55, 345, 345);
                    line(55, 345, 345, 55);
                    break;
                case 2:
                    strokeWeight(3);
                    stroke(0, 0, 255);
                    ellipse(200, 200, 290, 290);
                    break;
                case 3:
                    strokeWeight(3);
                    stroke(100);
                    arc(200, 200, 290, 290, PI / 4, 7 * PI / 4);
                    break;
            }

            imageMode(CENTER);
            image(this.imageObj.getImage("images/eye.png"), 15, 15, 20, 10);
            fill(0, 0, 0);
            textSize(15);
            text(this.spectators, 30, 20);

            //Large line rendering
            stroke(0, 0, 0);
            strokeWeight(3);
            line(150, 50, 150, 350);
            line(250, 50, 250, 350);
            line(50, 150, 350, 150);
            line(50, 250, 350, 250);

            //Little line rendering
            strokeWeight(1);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    push();
                    translate(i * 100, j * 100);
                    line(85, 55, 85, 145);
                    line(115, 55, 115, 145);
                    line(55, 85, 145, 85);
                    line(55, 115, 145, 115);
                    pop();
                }
            }

            //Symbol rendering
            strokeWeight(1);
            noFill();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.smallBoard[i][j] == 1) {
                        push();
                        translate(i * 100, j * 100);

                        strokeWeight(2);
                        stroke(255, 0, 0);
                        line(55, 55, 145, 145);
                        line(55, 145, 145, 55);
                        pop();
                    }
                    if (this.smallBoard[i][j] == 2) {
                        push();
                        translate(i * 100, j * 100);

                        strokeWeight(2);
                        stroke(0, 0, 255);
                        noFill();
                        ellipse(100, 100, 90, 90);
                        pop();
                    }
                    if (this.smallBoard[i][j] == 3) {
                        push();
                        translate(i * 100, j * 100);

                        strokeWeight(2);
                        stroke(100);
                        noFill();
                        arc(100, 100, 90, 90, PI / 4, 7 * PI / 4);
                        pop();
                    }

                    if ((i == this.mouseHoveredOver[0] && j == this.mouseHoveredOver[1] && this.selectingBig == "true")) {
                        push();
                        translate(i * 100, j * 100);

                        noStroke();
                        fill(0, 0, 0, 100);
                        rect(50, 50, 100, 100);
                        pop();
                    }
                    if (this.selectingBig == "false" && i == this.selected[0] && j == this.selected[1]) {
                        push();
                        translate(i * 100, j * 100);

                        noStroke();
                        fill(0, 0, 0, 100);
                        rect(50, 50, 100, 100);
                        pop();
                    }
                    for (let k = 0; k < 3; k++) {
                        for (let l = 0; l < 3; l++) {
                            if (this.board[i][j][k][l] === 1) {
                                push();
                                translate(k * 30, l * 30);
                                translate(i * 100, j * 100);
                                strokeWeight(1);
                                stroke(255, 0, 0);
                                line(60, 60, 80, 80);
                                line(80, 60, 60, 80);

                                pop();
                            }
                            if (this.board[i][j][k][l] === 2) {
                                push();
                                translate(k * 30, l * 30);
                                translate(i * 100, j * 100);
                                strokeWeight(1);
                                noFill();
                                stroke(0, 0, 255);
                                ellipse(70, 70, 20, 20)

                                pop();
                            }

                            if (i == this.mouseHoveredOver[0] && j == this.mouseHoveredOver[1] && k == this.mouseHoveredOver[2] && l == this.mouseHoveredOver[3] && this.selectingBig == "false") {
                                noStroke();
                                fill(0, 0, 0, 100);
                                push();
                                translate(k * 30, l * 30);
                                translate(i * 100, j * 100);
                                rect(55, 55, 30, 30);
                                pop();
                            }
                        }
                    }
                }
            }

            if (this.thisxo == this.xo) {
                this.message = "It is now your turn."
            } else if (this.thisxo == 3) {
                this.message = "You are a spectator."
            } else {
                this.message = "It is not your turn.";
            }
            fill(0, 0, 0);
            noStroke();
            textAlign(CENTER);
            text(this.message, 200, 20)

        } else {
            textAlign(CENTER);
            textSize(10);
            text(this.message, 200, 370);

            switch(this.completed){
                case -3:
                    textSize(30);
                    textFont("Open Sans");
                    text("Ultimate Tic-Tac-Toe",200,100);
                    break;
                case -2: // join
                    textSize(30);
                    textFont("Open Sans");
                    text("Joining a Game", 200, 100);
                    textSize(15);
                    text("Type in your key:", 200, 220);
                    break;
                case -1: // create
                    break;
            }

        }

        pop();

    }

    updatebigboard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                if (this.smallBoard[i][j] === 0) {
                    let temp = this.board[i][j];

                    let containsZero = false
                    for (let k = 0; k < 3; k++) {
                        for (let l = 0; l < 3; l++) {
                            if (temp[k][l] == 0) {
                                containsZero = true
                            }
                        }
                    }

                    if (!containsZero) {
                        this.smallBoard[i][j] = 3
                    }

                    for (let k = 0; k < 3; k++) {
                        if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
                            this.smallBoard[i][j] = temp[k][0];
                        }
                        if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
                            this.smallBoard[i][j] = temp[0][k];
                        }
                    }
                    if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
                        this.smallBoard[i][j] = temp[0][0];
                    }
                    if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
                        this.smallBoard[i][j] = temp[2][0];
                    }
                }

            }
        }

        if (this.selectingBig == "false" && this.smallBoard[this.selected[0]][this.selected[1]] != 0) {
            this.selectingBig = "true";
        }

        let temp = this.smallBoard;

        let containsZero = false
        for (let k = 0; k < 3; k++) {
            for (let l = 0; l < 3; l++) {
                if (temp[k][l] == 0) {
                    containsZero = true
                }
            }
        }

        if (!containsZero) {
            this.completed = 3
        }

        for (let k = 0; k < 3; k++) {
            if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
                this.completed = temp[k][0];
            }
            if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
                this.completed = temp[0][k];
            }
        }
        if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
            this.completed = temp[0][0];
        }
        if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
            this.completed = temp[2][0];
        }

    }

    addSpectator(ref){
        var data = {
            spectators: data.val().spectators + 1
        }

        ref.update(data);
    }

    lockGame(ref) {
        var updates = { locked: "true" };
        ref.update(updates);
        this.locked = "true";
    }

    onclick() {
        try {
            if (this.completed == 0 && this.xo == this.thisxo) {

                if (this.selectingBig == "true") {
                    
                    if (this.smallBoard[this.mouseHoveredOver[0]][this.mouseHoveredOver[1]] == 0) {
                        this.selected = [this.mouseHoveredOver[0], this.mouseHoveredOver[1]];

                        this.selectingBig = "false";
                    }
                } else if (this.selectingBig == "false" && this.mouseHoveredOver[0] == this.selected[0] && this.mouseHoveredOver[1] == this.selected[1]) {

                    if (this.board[this.mouseHoveredOver[0]][this.mouseHoveredOver[1]][this.mouseHoveredOver[2]][this.mouseHoveredOver[3]] == 0) {

                        this.selected = [this.mouseHoveredOver[2], this.mouseHoveredOver[3]];
                        this.board[this.mouseHoveredOver[0]][this.mouseHoveredOver[1]][this.mouseHoveredOver[2]][this.mouseHoveredOver[3]] = this.xo;
                        if (this.xo == 1) {
                            this.xo = 2;
                        } else {
                            this.xo = 1;
                        }

                        this.updatebigboard();

                    }

                }

                var data = {
                    board: this.board,
                    selected: this.selected,
                    selectingBig: this.selectingBig,
                    xo: this.xo
                }

                this.ref.update(data);

            }
        } catch (err) {

        }
    }

    onresize() {
        resizeCanvas(windowWidth, windowHeight);
    }

}