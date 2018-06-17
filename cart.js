/**
 * BCLearningNetwork.com
 * Ballistic Cart   
 * Parsa Rajabi - ParsaRajabiPR@gmail.com
 * June 2018
 */

//// VARIABLES ////

var mute = false;
var FPS = 20;
var STAGE_WIDTH, STAGE_HEIGHT;
var gameStarted = false;
var move = 5; //m/s
var selectY = 85; // works well on firefox
var ball;
var intialY = 397;
var earthGrav = 9.81;
var moonGrav = 1.62;
var marsGrav = 3.71;
var bulletTimer;


var planetOptionValues = [];
planetOptionValues['Earth'];
planetOptionValues['Moon'];
planetOptionValues['Mars'];

var speedOptionValues = [];
speedOptionValues['Slow'];
speedOptionValues['Moderate'];
speedOptionValues['Fast'];

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

/*
 * Initialize the stage and some createJS settings
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    // init state object
    stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    stage.update();
}
/*
 * Main update loop.
 */

function update(event) {
    if (gameStarted) {
//         cart.x = -160;
        cart.y = 350;
        //moves cart with speed of variable "move"
        cart.x += move;
        console.log("Cart X is " + cart.x);
        loopCart();
        
        ball.y -= 5;
//    bulletTime = bulletTime + 50; //milliseconds past since button hit
//	t = bulletTime * 0.00015; //scaling factor to slow down time

    }
            stage.update(event);

}

/*
 * Ends the game.
 */
function endGame() {
    gameStarted = false;
}



/*
 * Place graphics and add them to the stage.
 */
function initGraphics() {

   

    //default planet is Earth
    stage.addChild(Earth);
    stage.addChild(cart);

    //Box Selection   
    var planetSelectHTML = document.createElement('select');
    planetSelectHTML.id = "planetSelect";
    planetSelectHTML.class = "overlayed";
    var planetOption = ["Earth", "Moon", "Mars"];
    addOptionsToSelect(planetSelectHTML, planetOption);
    planetSelectHTML.style.position = "absolute";
    planetSelectHTML.style.top = 0;
    planetSelectHTML.style.left = 0;
    planetSelectHTML.style.width = "80px";
    planetSelectHTML.onchange = updatePlanet;
    document.body.appendChild(planetSelectHTML);
    planetSelect = new createjs.DOMElement(planetSelectHTML);

    stage.addChild(planetSelect);

    //Box Selection   
    var speedSelectHTML = document.createElement('select');
    speedSelectHTML.id = "speedSelect";
    speedSelectHTML.class = "overlayed";
    var speedOption = ["Slow", "Moderate", "Fast"];
    addOptionsToSelect(speedSelectHTML, speedOption);
    speedSelectHTML.style.position = "absolute";
    speedSelectHTML.style.top = 0;
    speedSelectHTML.style.left = 0;
    speedSelectHTML.style.width = "80px";
    speedSelectHTML.onchange = updateSpeed;
    document.body.appendChild(speedSelectHTML);
    speedSelect = new createjs.DOMElement(speedSelectHTML);

    stage.addChild(speedSelect);

    updateSelectPositions();


    ball = new createjs.Shape();
    ball.graphics.beginFill("red").drawCircle(0, 0, 15);
//    ball.x = 500;
    ball.y = intialY;
    stage.addChild(ball);
//    ball.visible = false;
    
    fireButton.x = firePressedButton.x = 30;
    fireButton.y = firePressedButton.y = 170;
    stage.addChild(fireButton);

    initMuteUnMuteButtons();
    initListeners();
    // start the game
    gameStarted = true;
    stage.update();
}


function loopCart() {
    //loops back the cart back around after exiting from one side to other  
    cart.x += move;
    ball.x = cart.x + 55;
    if (cart.x >= 800) {
        console.log("In the loop");
        ball.x = cart.x = -160;
        ball.x = cart.x += move;
    }
}

/*
 * Maintain positions of select HTML elements when page is zoomed or canvas is moved
 */

function updateSelectPositions() {
    if (isChrome) {
        selectY = 85;
    }

    planetSelect.x = gameCanvas.getBoundingClientRect().left + 125;
    planetSelect.y = gameCanvas.getBoundingClientRect().top + selectY;


    speedSelect.x = gameCanvas.getBoundingClientRect().left + 125;
    speedSelect.y = gameCanvas.getBoundingClientRect().top + selectY + 55;



}

function addAll() {
    stage.addChild(cart);
    stage.addChild(fireButton);
    stage.addChild(unmuteButton);
    stage.addChild(ball);

//    stage.addChildAt(Cart,0);
//    stage.addChildAt(fireButton,);

//    initMuteUnMuteButtons();

}

//Adds the options to the drop down lists 

function addOptionsToSelect(select, options) {
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        select.appendChild(option);
    }
}

function updatePlanet() {

    if (planetSelect.htmlElement.value == "Earth") {
        stage.removeChild(Moon);
        stage.removeChild(Mars);
        stage.addChild(Earth);
        addAll();

    } else if (planetSelect.htmlElement.value == "Moon") {
        stage.removeChild(Earth);
        stage.removeChild(Mars);
        stage.addChild(Moon);
        addAll();


    } else if (planetSelect.htmlElement.value == "Mars") {
        stage.removeChild(Earth);
        stage.removeChild(Moon);
        stage.addChild(Mars);
        addAll();

    }
}

function updateSpeed() {

    if (speedSelect.htmlElement.value == "Slow") {
        move = 8;
        loopCart();
        console.log("Speed is now slow")

    } else if (speedSelect.htmlElement.value == "Moderate") {
        move = 16;
        loopCart();
        console.log("Speed is now moderate")



    } else if (speedSelect.htmlElement.value == "Fast") {
        move = 25;
        loopCart();
        console.log("Speed is now fast")

    }
}
/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
    muteButton.hitArea = unmuteButton.hitArea = hitArea;

    muteButton.x = unmuteButton.x = 5;
    muteButton.y = unmuteButton.y = 5;

    muteButton.cursor = "pointer";
    unmuteButton.cursor = "pointer";

    muteButton.on("click", toggleMute);
    unmuteButton.on("click", toggleMute);

    stage.addChild(unmuteButton);
}

/*
 * Add listeners to objects.
 */
function initListeners() {

    fireButton.on("mouseover", function () {
        stage.addChild(firePressedButton);
        stage.removeChild(fireButton);
        playSound("click");
    });
    firePressedButton.on("mouseout", function () {
        stage.addChild(fireButton);
        stage.removeChild(firePressedButton);
    });
    firePressedButton.on("click", fire);

    
}

function fire() {
    playSound("blast");
//    ball.visible = true;
//    console.log("Shots Fired!");
//    ball.y -= earthGrav+60; 
//    ball.y = intialY - 100* 5 + 0.5*-9.8;
//    ball.x = Math.cos(40)+100; 
    
    bulletTimer = setInterval(update(Event), 50);
		bulletTime = 0;
}



//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var Earth, Mars, Moon;
var cart;
var fireButton, firePressedButton;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "sounds/click.mp3",
            id: "click"
    },{
            src: "sounds/blast.mp3",
            id: "blast"
    },{
            src: "images/cart.png",
            id: "cart"
    }, {
            src: "images/Earth_Background.png",
            id: "Earth"
    }, {
            src: "images/Mars_Background.png",
            id: "Mars"
    }, {
            src: "images/Moon_Background.png",
            id: "Moon"
    }, {
            src: "images/mute_white.png",
            id: "mute"
    }, {
            src: "images/unmute_white.png",
            id: "unmute"
    }, {
            src: "images/fireButton.png",
            id: "fireButton"
    }, {
            src: "images/firePressedButton.png",
            id: "firePressedButton"
		},
 	];
}


function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

/*
 * Specify how to load each file.
 */
function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "mute") {
        muteButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "unmute") {
        unmuteButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "Earth") {
        Earth = new createjs.Bitmap(event.result);
    } else if (event.item.id == "Mars") {
        Mars = new createjs.Bitmap(event.result);
    } else if (event.item.id == "Moon") {
        Moon = new createjs.Bitmap(event.result);
    } else if (event.item.id == "cart") {
        cart = new createjs.Bitmap(event.result);
    } else if (event.item.id == "fireButton") {
        fireButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "firePressedButton") {
        firePressedButton = new createjs.Bitmap(event.result);
    }
}

function loadError(evt) {
    console.log("Error!", evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {

}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addEventListener("tick", update); // call update function

    //    stage.addChild(background);
    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
