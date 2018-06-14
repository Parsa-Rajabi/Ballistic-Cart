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
var planetText;
var move = 20; //m/s
let selectY = 70; // works well on firefox

var planetOptionValues = [];
planetOptionValues['Earth'];
planetOptionValues['Moon'];
planetOptionValues['Mars'];

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
//moves cart with speed of variable "move"
    Cart.x += move;
        //loops back the cart back around after exiting from one side to other  
        if (Cart.x == 800){
            console.log("WOW");
            Cart.x = -160;
        Cart.x += move;
        }
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

    initMuteUnMuteButtons();
    initListeners();
    
    Cart.x = -160;
    Cart.y = 350;
    
    //default planet is Earth
    stage.addChild(Earth);

    stage.addChild(Cart);
  
    //Box Selection   
    var planetSelectHTML = document.createElement('select');
 	planetSelectHTML.id = "planetSelect";
 	planetSelectHTML.class = "overlayed";
 	var planetOption = ["Earth", "Moon", "Mars"];
 	addOptionsToSelect(planetSelectHTML, planetOption);
  	planetSelectHTML.style.position = "absolute";
 	planetSelectHTML.style.top = 0;
  	planetSelectHTML.style.left = 0;
 	planetSelectHTML.style.width = "70px";
  	planetSelectHTML.onchange = updatePlanet;
  	document.body.appendChild(planetSelectHTML);
  	planetSelect = new createjs.DOMElement(planetSelectHTML);

  	stage.addChild(planetSelect);

//    planetSelect.x = 120;
//    planetSelect.y = 50
  	updateSelectPositions();

    //planet Text
    planetText = new createjs.Text("Planet: ", "23px Lato", "#ffffff");
    //implement this into the background 
    planetText.x = planetSelect.x ;
    planetText.y = planetSelect.y ;
    stage.addChild(planetText);
    
    fireButton.x = firePressedButton.x = 500;
    fireButton.y = firePressedButton.y = 500;
    stage.addChild(fireButton);
    
    
    // start the game
    gameStarted = true;
    stage.update();
}
/*
 * Maintain positions of select HTML elements when page is zoomed or canvas is moved
 */
function updateSelectPositions() {
  if (isChrome) {
    selectY = 70;
  }

  planetSelect.x = gameCanvas.getBoundingClientRect().left + 100;
  planetSelect.y = gameCanvas.getBoundingClientRect().top + selectY;

 
}



function addAll(){
    stage.addChild(planetText);
    stage.addChild(Cart);
    stage.addChild(fireButton);
    initMuteUnMuteButtons();

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

function updatePlanet(){

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
    });
    firePressedButton.on("mouseout", function () {
        stage.addChild(fireButton);
        stage.removeChild(firePressedButton);
    });
    firePressedButton.on("click", fire);


}

function fire(){
    console.log (" Fired!");
}



//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var Earth, Mars, Moon;
var Cart;
var fireButton, firePressedButton;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
         {
            src: "images/Cart.png",
            id: "Cart"
    },{
            src: "images/Earth_Background.png",
            id: "Earth"
    }, {
            src: "images/Mars_Background.png",
            id: "Mars"
    }, {
            src: "images/Moon_Background.png",
            id: "Moon"
    },{
            src: "images/mute.png",
            id: "mute"
    },{
            src: "images/unmute.png",
            id: "unmute"
    },{
			src: "images/fire_btn.png",
			id: "fireButton"
    },{
			src: "images/firePressed.png",
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
    }  else if (event.item.id == "Cart") {
        Cart = new createjs.Bitmap(event.result);
    } else if (event.item.id == "fireButton"){
        fireButton = new createjs.Bitmap(event.result);
    }else if (event.item.id == "firePressedButton"){
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

