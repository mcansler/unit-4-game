$(document).ready(function() {


var heroes = {
    'Spiderman': {
        name: "Spiderman",
        health: 100,
        attack: 12,
        imageUrl: "assets/images/spiderman.jpg",
        counterAttack: 5
    }, 
    'Captain America': {
        name: "Captain America",
        health: 120,
        attack: 8,
        imageUrl: "assets/images/captainamerica.jpg",
        counterAttack: 9
    }, 
    'Iron Man': {
        name: "Iron Man",
        health: 150,
        attack: 6,
        imageUrl: "assets/images/ironman.jpg",
        counterAttack: 20
    }, 
    'Thor': {
        name: 'Thor',
        health: 180,
        attack: 4,
        imageUrl: "assets/images/thor.jpg",
        counterAttack: 25
    }
};

var currSelectedCharacter;
var currDefender;
var defenders = [];
var turnCounter = 1;
var killCount = 0;
	
// Function to create character icons
var charIcon = function(character, contentArea, makeChar) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(contentArea).append(charDiv);
    	if (makeChar === 'enemy') {
      		$(charDiv).addClass('enemy');
    	} else if (makeChar === 'defender') {
      		currDefender = character;
      		$(charDiv).addClass('target-enemy');
    	}
  };
  
  	// Create function to select character icons
	var createIcons = function(charObj, areaDiv) {
    	if (areaDiv === '.charSection') {
      		$(areaDiv).empty();
      		for (var key in charObj) {
        		if (charObj.hasOwnProperty(key)) {
          			charIcon(charObj[key], areaDiv, '');
        		}
      		}
    	}
		
  		//Selected player character icon
    	if (areaDiv === '.selChar') {
			$('.selChar').prepend("");       
			charIcon(charObj, areaDiv, '');
      	
    	}
		
  		//Available defenders icons
    	if (areaDiv === '.enemySection') {
             
      		for (var i = 0; i < charObj.length; i++) {

        		charIcon(charObj[i], areaDiv, 'enemy');
	  		}
      		//move one enemy to defender area
      		$(document).on('click', '.enemy', function() {
        		//select an enemy to fight
        		name = ($(this).data('name'));
        		//if defender area is empty
        		if ($('.defenderSection').children().length === 0) {
          			createIcons(name, '.defenderSection');
          			$(this).hide();
          			writeMessage("clearMessage");
        		}
      		});
    	}
    //create defender icon
    if (areaDiv === '.defenderSection') {
      $(areaDiv).empty();
      for (var i = 0; i < defenders.length; i++) {
        //add enemy to defender area
        if (defenders[i].name === charObj) {
        	charIcon(defenders[i], areaDiv, 'defender');
        }
      }
    }
    //redraw defender when attacked
    if (areaDiv === 'playerDamage') {
      $('.defenderSection').empty();
      charIcon(charObj, '.defenderSection', 'defender');
      
    }
    //redraw player character when attacked
    if (areaDiv === 'enemyDamage') {
      $('.selChar').empty();
      charIcon(charObj, '.selChar', '');
    }
    //erase defeated enemy, send message to DOM
    if (areaDiv === 'enemyDefeated') {
      $('.defenderSection').empty();
      var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
      writeMessage(gameStateMessage);
      
    }
  };
  //Create onclick event to choose players and defenders
  createIcons(heroes, '.charSection');
  $(document).on('click', '.character', function() {
    name = $(this).data('name');
    //if no player char has been selected
    if (!currSelectedCharacter) {
      currSelectedCharacter = heroes[name];
      for (var key in heroes) {
        if (key !== name) {
          defenders.push(heroes[key]);
        }
      }
      $(".charSection").hide();
      createIcons(currSelectedCharacter, '.selChar');
      //this is to draw all characters for user to choose to fight against
      createIcons(defenders, '.enemySection');
    }
  });

 // Create function for attack and counter-attack
  $("#attack-button").on("click", function() {
    //if defernder area has enemy
    if ($('.defenderSection').children().length !== 0) {
      //defender state change
      var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
      writeMessage("clearMessage");
      //combat
      currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);

      //win condition
      if (currDefender.health > 0) {
        //enemy not dead keep playing
        createIcons(currDefender, 'playerDamage');
        //player state change
        var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.counterAttack + " damage.";
        writeMessage(attackMessage);
        writeMessage(counterAttackMessage);

        currSelectedCharacter.health = currSelectedCharacter.health - currDefender.counterAttack;
        createIcons(currSelectedCharacter, 'enemyDamage');
        if (currSelectedCharacter.health <= 0) {
          writeMessage("clearMessage");
          restartGame("You have been defeated...GAME OVER!!!");
          
          $("#attack-button").off("click");
        }
      } else {
        createIcons(currDefender, 'enemyDefeated');
        killCount++;
        if (killCount >= 3) {
          writeMessage("clearMessage");
          restartGame("You Won!!!! GAME OVER!!!");
          
        }
      }
      turnCounter++;
    } else {
      writeMessage("clearMessage");
      writeMessage("No enemy here.");
      
    }
  });
	
// Create function to write game messages to DOM
  var writeMessage = function(message) {
  	var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").text(message);
	gameMesageSet.append(newMessage);

    if (message === 'clearMessage') {
      	gameMesageSet.text('');
    }
  };

//Restarts the game - creates a reset button
  var restartGame = function(inputEndGame) {
    //When 'Restart' button is clicked, reload the page.
    var restart = $('<button class="btn">Restart</button>').click(function() {
      location.reload();
    });
    var gameState = $("<div>").text(inputEndGame);
    $("#gameMessage").append(gameState);
    $("#restart").append(restart);
  };	
	
});