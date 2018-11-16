
/*
var randomLoc = Math.floor(Math.random() * 5);
var location1 = randomLoc, location2 = location1 + 1, location3 = location2 + 1; // корабль размещался в клетках;
var guess, guesses = 0; // guess - координаты выстрела и guesses - количество попыток;
var hits = 0; // количество попаданий;
var isSunk = false; // если корабль убит то true;

while (isSunk == false) {
	guess = prompt("Цель, готов, огонь(вести номер от 0 до 6):", "");
	if (guess < 0 || guess > 6) {
		alert("Пожалуйста введите номер ячейки");
	} else {
		guesses++;
		if (guess == location1 || guess == location2 || guess == location3) {
			alert("Попал");
			hits = hits + 1;
			if (hits == 3) {
				isSunk = true;
				alert("Вы затонули мой линкор");
			}
		} else {
			alert("Промах");
		}
	}
}
var stats = "Вы взяли " + guesses + " догадки потопить линкор " + "которое означает, что ваша точность стрельбы " + (3/guesses);
alert(stats);
*/

// найти максиму и минимум и выгодное

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};
	

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [
	{ locations: [0, 0, 0], hits: ["", "", ""] }, 
	{ locations: [0, 0, 0], hits: ["", "", ""] },
	{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попал!");
				if (this.isSunk(ship)) {
					view.displayMessage("Корабль потоплен!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Вы промазали");
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() {
		var locations;
		for (var i =0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations)) this.ships[i].locations = locations;

		}
	},
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};


var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Все корабли потоплены, вы сделали выстрелов: " + this.guesses);
			}
		}
	}
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Условие заданных координат не выполняеться.")
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Не число");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Большое или маленькое значение.")
		} else {
			return row + column;
		}
	}
	return null;
}


function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = headleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function headleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;

