	

localStorage["sticky_0"] = "Возмите из химчистки.";
localStorage["sticky_0"];

window.onload = init;

function init() {
	var button = document.getElementById("add_button");
	button.onclick = createSticky;

	var stickiesArray = getStickiesArray();

	for (var i = 0; i < stickiesArray.length; i++) {
		var key = stickiesArray[i];
		var value = JSON.parse(localStorage[key]);
		addStickyToDOM(key, value);
	}

	var clearButton = document.getElementById("clear_button");
	clearButton.onclick = clearStorage;

	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.substring(0, 6) == "sticky") {
			var value = localStorage.getItem(key);
			addStickyToDOM(value);
		}
	}
}

function addStickyToDOM(key, stickyObj) {
	var stickies = document.getElementById("stickies");
	var sticky = document.createElement("li");
	var span = document.createElement("span");

	sticky.setAttribute("id", key);
	sticky.style.backgroundColor = stickyObj.color;
	span.setAttribute("class", "sticky");
	span.innerHTML = stickyObj.value;
	sticky.appendChild(span);
	stickies.appendChild(sticky);
	sticky.onclick = deleteSticky;
}

function createSticky() {
	var stickiesArray = getStickiesArray();
	var currentDate = new Date();
	var colorSelectObj = document.getElementById("note_color");
	var index = colorSelectObj.selectedIndex;
	var color = colorSelectObj[index].value;
	var key = "sticky_" + currentDate.getTime();
	var value = document.getElementById("note_text").value;
	var stickyObj = {
		"value": value,
		"color": color
	}

	localStorage.setItem(key, JSON.stringify(stickyObj));
	stickiesArray.push(key);
	localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

	addStickyToDOM(key, stickyObj);
}

function clearStorage() {
	localStorage.clear();
}

function getStickiesArray() {
	var stickiesArray = localStorage["stickiesArray"];
	if (!stickiesArray) {
		stickiesArray = [];
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
	} else {
		stickiesArray = JSON.parse(stickiesArray);
	}
	return stickiesArray;
}

function deleteSticky(e) {
	var key = e.target.id;
	if (e.target.tagName.toLowerCase() == "span") {
		key = e.target.parentNode.id;
	}

	localStorage.removeItem(key);
	var stickiesArray = getStickiesArray();
	if (stickiesArray) {
		for (var i = 0; i < stickiesArray.length; i++) {
			if (key == stickiesArray[i]) {
				stickiesArray.splice(i, 1);
			}
		}
		localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
		removeStickyFromDOM(key);
	}
}

function removeStickyFromDOM(key) {
	var sticky = document.getElementById(key);
	sticky.parentNode.removeChild(sticky);
}

try {
	localStorage.setItem(myKey, myValue);
} catch(e) {
	if (e == QUOTA_EXCEEDED_ERR) { 
		alert("Из хранения: объем хранения превышен!");
	}
}

