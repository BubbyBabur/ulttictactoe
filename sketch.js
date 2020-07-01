let board, selected, selectingBig, mouseHoveredOver, xo, thisxo, smallBoard, completed;
let keyinput, joinbutton, createbutton, submitbutton, database, ref, realref, message, key, locked;

function setup() {
    createCanvas(400, 400);

    selected = 0;
    selectingBig = "true";
    mouseHoveredOver = [];
    xo = 1;
    completed = -3;
    message = "";
    locked = "false";

    //Board construction
    smallBoard = []
    for (let i = 0; i < 3; i++) {
        smallBoard.push([]);
        for (let j = 0; j < 3; j++) {
            smallBoard[i].push(0);
        }
    }
    board = [];
    for (let i = 0; i < 3; i++) {
        board.push([]);
        for (let j = 0; j < 3; j++) {
            board[i].push([]);
            for (let k = 0; k < 3; k++) {
                board[i][j].push([]);
                for (let l = 0; l < 3; l++) {
                    board[i][j][k].push(0);
                }
            }
        }
    }

    // Your web app's Firebase configuration
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

    database = firebase.database();

    createbutton = createButton("Create a Game");
    joinbutton = createButton("Join a Game");

    createbutton.position(100,130);
    createbutton.size(200,40);
    joinbutton.position(100,230);
    joinbutton.size(200, 40);

    createbutton.mouseClicked(function(){joinbutton.hide(); createbutton.hide(); completed = -1; keyinput.show(); submitbutton.show();});
    joinbutton.mouseClicked(function () { joinbutton.hide(); createbutton.hide(); completed = -2; keyinput.show(); submitbutton.show();});

    keyinput = createInput();
    keyinput.position(50,200);
    keyinput.hide();

    submitbutton = createButton("Submit Key");
    submitbutton.position(keyinput.x + keyinput.width, keyinput.y);
    submitbutton.hide();

    submitbutton.mouseClicked(function(){

        if(keyinput.value().indexOf("/") == -1 && keyinput.value() != ""){

            if(completed == -1){

                submitbutton.hide();
                keyinput.hide();
                completed = 0;
                ref = database.ref("games/" + keyinput.value());

                var data = {
                    board: board,
                    selected: selected,
                    selectingBig: selectingBig,
                    xo: 1,
                    locked: locked
                }

                ref.set(data);

                completed = 0;
                thisxo = 1;

                key = keyinput.value();

                realref = database.ref("games/" + key);
                realref.on("value", function (data) {
                    var v = data.val();
                    xo = v.xo;
                    selected = v.selected;
                    selectingBig = v.selectingBig;
                    board = v.board;
                    locked = v.locked;
                    updatebigboard();
                });

            } else {
                key = keyinput.value();
                ref = database.ref("games/" + keyinput.value());
                console.log(keyinput.value());
                ref.once("value").then(function(data){

                    if(data.val() == null){

                        message = "There's no game with that key.";

                    } else {
                        message = "Accepted!";
                        
                        submitbutton.hide();
                        keyinput.hide();

                        completed = 0;
                        realref = database.ref("games/" + key);
                        realref.on("value", function (data) {
                            var v = data.val();
                            xo = v.xo;
                            selected = v.selected;
                            selectingBig = v.selectingBig;
                            board = v.board;
                            locked = v.locked;
                            updatebigboard();
                        });

                        locked = "true";
                        var updates = { locked: "true" };
                        realref.update(updates);

                        if (data.val().locked != "false"){
                            thisxo  = 3;
                        } else {
                            thisxo = 2;
                        }
                    }
                })
            }
        }

    });

}

function draw() {
    background(220);

    if(completed > -1){

        mouseHoveredOver = [floor((mouseX - 50) / 100), floor((mouseY - 50) / 100), floor(((mouseX - 50) % 100 - 10) / 30), floor(((mouseY - 50) % 100 - 10) / 30)];

        switch (completed) {
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

        //Large line rendering
        stroke(0, 0, 0);
        strokeWeight(3);
        line(150, 50, 150, 350)
        line(250, 50, 250, 350)
        line(50, 150, 350, 150)
        line(50, 250, 350, 250)

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
                if (smallBoard[i][j] == 1) {
                    push();
                    translate(i * 100, j * 100);

                    strokeWeight(2);
                    stroke(255, 0, 0);
                    line(55, 55, 145, 145);
                    line(55, 145, 145, 55);
                    pop();
                }
                if (smallBoard[i][j] == 2) {
                    push();
                    translate(i * 100, j * 100);

                    strokeWeight(2);
                    stroke(0, 0, 255);
                    noFill();
                    ellipse(100, 100, 90, 90);
                    pop();
                }
                if (smallBoard[i][j] == 3) {
                    push();
                    translate(i * 100, j * 100);

                    strokeWeight(2);
                    stroke(100);
                    noFill();
                    arc(100, 100, 90, 90, PI / 4, 7 * PI / 4);
                    pop();
                }

                if ((i == mouseHoveredOver[0] && j == mouseHoveredOver[1] && selectingBig == "true")) {
                    push();
                    translate(i * 100, j * 100);

                    noStroke();
                    fill(0, 0, 0, 100);
                    rect(50, 50, 100, 100);
                    pop();
                }
                if (selectingBig == "false" && i == selected[0] && j == selected[1]) {
                    push();
                    translate(i * 100, j * 100);

                    noStroke();
                    fill(0, 0, 0, 100);
                    rect(50, 50, 100, 100);
                    pop();
                }
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        if (board[i][j][k][l] === 1) {
                            push();
                            translate(k * 30, l * 30);
                            translate(i * 100, j * 100);
                            strokeWeight(1);
                            stroke(255, 0, 0);
                            line(60, 60, 80, 80);
                            line(80, 60, 60, 80);

                            pop();
                        }
                        if (board[i][j][k][l] === 2) {
                            push();
                            translate(k * 30, l * 30);
                            translate(i * 100, j * 100);
                            strokeWeight(1);
                            noFill();
                            stroke(0, 0, 255);
                            ellipse(70, 70, 20, 20)

                            pop();
                        }

                        if (i == mouseHoveredOver[0] && j == mouseHoveredOver[1] && k == mouseHoveredOver[2] && l == mouseHoveredOver[3] && selectingBig == "false") {
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

        if(thisxo == xo){
            message = "It is now your turn."
        } else if(thisxo == 3){
            message = "You are a spectator."
        } else {
            message = "It is not your turn.";
        }
        fill(0,0,0);
        noStroke();
        textAlign(CENTER);
        text(message, 200, 20) 

    } else if(completed == -3) {
        
    } else if(completed == -2) {
        textAlign(CENTER);
        text(message, 200, 300);   
    }

}

let updatebigboard = function(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            if (smallBoard[i][j] === 0) {
                let temp = board[i][j];

                let containsZero = false
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        if (temp[k][l] == 0) {
                            containsZero = true
                        }
                    }
                }

                if (!containsZero) {
                    smallBoard[i][j] = 3
                }

                for (let k = 0; k < 3; k++) {
                    if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
                        smallBoard[i][j] = temp[k][0];
                    }
                    if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
                        smallBoard[i][j] = temp[0][k];
                    }
                }
                if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
                    smallBoard[i][j] = temp[0][0];
                }
                if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
                    smallBoard[i][j] = temp[2][0];
                }
            }

        }
    }

    if (smallBoard[selected[0]][selected[1]] != 0) {
        selectingBig = "true";
    }

    temp = smallBoard;

    let containsZero = false
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            if (temp[k][l] == 0) {
                containsZero = true
            }
        }
    }

    if (!containsZero) {
        completed = 3
    }

    for (let k = 0; k < 3; k++) {
        if (temp[k][0] == temp[k][1] && temp[k][1] == temp[k][2] && temp[k][0] != 0) {
            completed = temp[k][0];
        }
        if (temp[0][k] == temp[1][k] && temp[1][k] == temp[2][k] && temp[0][k] != 0) {
            completed = temp[0][k];
        }
    }
    if (temp[0][0] == temp[1][1] && temp[0][0] == temp[2][2] && temp[0][0] != 0) {
        completed = temp[0][0];
    }
    if (temp[2][0] == temp[1][1] && temp[2][0] == temp[0][2] && temp[2][0] != 0) {
        completed = temp[2][0];
    }

}

mouseClicked = function () {

    try {
        if (completed == 0 && xo == thisxo) {

            if (selectingBig == "true") {
                if (smallBoard[mouseHoveredOver[0]][mouseHoveredOver[1]] == 0) {
                    selected = [mouseHoveredOver[0], mouseHoveredOver[1]];
                    if(selectingBig == "true"){
                        selectingBig = "false";
                    } else {
                        selectingBig = "true";
                    }
                }
            } else if (selectingBig == "false" && mouseHoveredOver[0] == selected[0] && mouseHoveredOver[1] == selected[1]) {

                if (board[mouseHoveredOver[0]][mouseHoveredOver[1]][mouseHoveredOver[2]][mouseHoveredOver[3]] == 0) {

                    selected = [mouseHoveredOver[2], mouseHoveredOver[3]];
                    board[mouseHoveredOver[0]][mouseHoveredOver[1]][mouseHoveredOver[2]][mouseHoveredOver[3]] = xo;
                    if (xo == 1) {
                        xo = 2;
                    } else {
                        xo = 1;
                    }


                    updatebigboard();

                }

            }

            var data = {
                board: board,
                selected: selected,
                selectingBig: selectingBig,
                xo: xo,
                locked: locked
            }

            realref.set(data);

        }
    } catch (err) {

    }
}

