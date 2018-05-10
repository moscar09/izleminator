var emojione = require("emojione");

window.EmojiBar = class {
	constructor(args) {
		this.element  = document.getElementById("izl-emojis");
		this.emojis   = emojione.emojioneList;
		this.position = 0;
		console.log("built emojibar");
	}

	show(partial) {
		this.element.className = "visible";
		this.state = 'visible';

		while(this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}

		var show = false;
		var countElements = 0;
		this.emojis = [];

		for (var shortcode in emojione.emojioneList) {
			if (shortcode.startsWith(partial)) {
				var li = document.createElement("li");
				li.innerHTML = emojione.shortnameToUnicode(shortcode);
				this.element.appendChild(li);
				this.emojis.push(li);
				show = true;
				countElements++;
			}
		}

		this.maxElements = countElements - 1;

		this._setPosition(0);

		if(show) {
			this.element.className = "visible";
			this.state = 'visible';
		} else {
			this.hide();
		}
	}

	hide() {
		this.element.className = "";
		this.state = 'hidden';
	}

	isActive() {
		return this.state == 'visible';
	}

	sendLeft() {
		this._setPosition(this.position - 1);
	}

	sendRight() {
		this._setPosition(this.position + 1);
	}

	autocompleteEmoji() {
		this.hide();
		return this.emojis[this.position].innerHTML;
	}

	_setPosition(position) {
		if(position >= 0 && position <= this.maxElements) {

			if(this.emojis[this.position] != undefined) {
				this.emojis[this.position].className = '';
			}
			this.position = position;
			this.emojis[position].className = 'selected';
		}
	}

	getEmoji(string) {
		var potentialEmoji = emojione.shortnameToUnicode(string);
		if(potentialEmoji == string) {
			return null;
		} else {
			return potentialEmoji;
		}
	}
}