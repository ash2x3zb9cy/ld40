class Card {
	effect() {true;}
	constructor(name, cardText) {
		if (name) this.name = name;
		if (cardText) this.cardText = cardText;
	}

	upgrade() {null;}

	get source() {
		return Card.SOURCES.deck;
	}

	static get SOURCES() {
		return {
			'deck': 0,
			'token': 1,
		}
	}
}

var game = {
	log: function(text) {
		console.log(text);
	}
};

function drawCard(num) {
	if (num === undefined) num = 1;
	num > 1 ?
		game.log("Drawing " + num  + " cards")
	:
		game.log("Drawing a card");

	for (var i = 0; i < num; i++) {

		if (game.deck.length === 0) {
			game.log("No cards in deck");
			if (game.discard.length === 0) {
				game.log("No cards in discard. Can't draw");
				return false;
			}
			// moves contents of discard into deck
			game.log("Reshuffling discard into deck");
			while (game.discard.length > 0) {
				let c = game.discard.pop();
				game.deck.push(c);
			}
			updateDiscard();

			shuffle(game.deck);
		}

		let card = game.deck.pop()

		game.hand.push(card);

		$('#hand').append($makeCard(card, clickCard));

	}

	updateDeck();

	return true;

}

function modActions(diff) {
	game.actions += diff;
	$('#actions').text(game.actions)
}

function playCard(card) {
	if (game.actions < 1) return false;
	game.log("Playing card " + (card.name || "UNKNOWN"))

	// remove from hand
	let i = game.hand.indexOf(card);
	if (i < 0) return false; // tried to play card not in hand
	game.hand.splice(i, 1);

	let played = card.effect();

	if (played) {
		game.inplay.push(card);
		//updateDiscard();
		modActions(- 1);
		return true;
	} else {
		game.log("Card was not played.");
		game.hand.push(card);
		return false;
	}

}

function updateDiscard() {
	$('#discard').html('');
	for (var i = 0; i < game.discard.length; i++) {
		let $card = $makeCard(game.discard[i]);

		$card.addClass("discard");

		$('#discard').append($card);

	}

}

function updateHand() {
	$('#hand').html('');
	for (var i = 0; i < game.hand.length; i++) {
		$('#hand').append($makeCard(game.hand[i]));
	}
}

function updateDeck() {
	$('#deck').html('deck (' + game.deck.length + ')');
}

function $makeCard(card, onclick) {
	klasses = [];
	switch (card.source) {
		case Card.SOURCES.token:
			klasses.push("token");
		case Card.SOURCES.deck:
		default:
			/* pass */
	}
	$el = $(
		'<div class="card"><strong class="cardname">'
		+ card.name
		+ '</strong><p class="cardtext">'
		+ card.cardText
		+ '</p></div>');
	for (var i = 0; i < klasses.length; i++) {
		$el.addClass(klasses[i]);
	}
	$el.data('card', card);
	if (onclick) $el.click(onclick);
	return $el;
}

function clickCard(e) {
	let card = $(e.currentTarget).data().card;
	let played = playCard(card);
	if (played) {
		$(e.currentTarget).remove();
	}
}

// Card click event to trash a card.
function trashClickCard(e) {
	let card = $(e.currentTarget).data().card;
	let i = game.hand.indexOf(card);
	if (i > -1) {
		game.hand.splice(i, 1);
	}
	$(e.currentTarget).remove();
	card = null;

	game.trashed++;
	$('#trashed').text(game.trashed);

	// rebind
	$('.card').off('click', trashClickCard);
	$('.card').on('click', clickCard);
}

// Card click event to discard a card.
function discardClickCard(e) {
	let card = $(e.currentTarget).data().card;

	// remove the card from hand and doc
	let i = game.hand.indexOf(card);
	if (i > -1) {
		game.hand.splice(i, 1);
	}
	$(e.currentTarget).appendTo($('#discard'))
		.addClass('discard');

	// actually discard it
	game.discard.push(card);
	//updateDiscard();

	// reset binds
	$('.card').off('click', discardClickCard);
	$('.card').on('click', clickCard);
}

function discardCard(c) {
	let $card = $makeCard(c);
	$card.addClass("discard");
	$('#discard').append($card);
	game.discard.push(c);
}

function upgradeClickCard(e) {
	let card = $(e.currentTarget).data().card;
	let upgr = card.upgrade();
	if (upgr) {
		// reset event listeners
		$('.card').off('click');
		$('.card').on('click', clickCard);

		// delete the old card without trashing
		let i = game.hand.indexOf(card);
		if (i > -1) {
			game.hand.splice(i, 1);
		}
		$(e.currentTarget).remove();
		card = null;

		// put the upgraded card in discard
		discardCard(upgr);
		return true;
	} else {
		game.log("That card has no upgrades");
		return false;
	}
}

function shuffle(arr) {
	// Fisher-Yates shuffle
	for (var i = 0; i < arr.length-1; i++) {
		let j = randint(i, arr.length);
		// interchange i and j
		let tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}

function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

COLLECTIBLE_CARDS = [
	()=>new PotOfGreed(),
	()=>new Audacity(),
	()=>new PyramidScheme(),
	()=>new ToxicAsset(),
	()=>new LawyerUp(),
	()=>new PowerShutdown(),
]

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function newCard() {
	return COLLECTIBLE_CARDS[getRandomInt(0, COLLECTIBLE_CARDS.length)]();
}

$(function() {
	game.deck = [
		new PotOfGreed(),
		new Audacity(),
		new PyramidScheme(),
		new ToxicAsset(),
		new LawyerUp(),
		new PowerShutdown(),
	];
	shuffle(game.deck);
	game.discard = [];
	game.hand = [];
	game.inplay = [];
	game.actions = 0;
	modActions(1);
	game.trashed = 0;
	game.drawnThisTurn = 0;


	updateHand();
	updateDeck();
	updateDiscard();

	drawCard(5);


	$('#endturn').click(endTurn)

});

function endTurn() {
	game.log("End turn");
	while (game.inplay.length > 0) {
		let c = game.inplay.pop();
		game.discard.push(c);
	}

	while (game.hand.length > 0) {
		let c = game.hand.pop();
		game.discard.push(c);
	}

	$('.card').remove();


	shuffle(game.deck);

	game.actions = 0;
	game.drawnThisTurn = 0;
	modActions(1);

	drawCard(5);



	// check for win
	if (game.hand.length + game.deck.length + game.inplay.length + game.discard.length < game.trashed) {
		alert('You win!');
	}

	game.deck.push(newCard());

	updateDiscard();
	updateDeck();

}
