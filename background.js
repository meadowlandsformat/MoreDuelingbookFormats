chrome.webNavigation.onCommitted.addListener(function(e) {
	keepAlive();
}, {url: [{hostSuffix: 'duelingbook.com'}]});


const edisonCards = [];
const animationCards = [];

function Eyal_ReadFile(_path, _cb)
{

	fetch(_path, {mode:'same-origin'})   // <-- important

	.then(function(_res) {
		return _res.blob();
	})

	.then(function(_blob) {
		var reader = new FileReader();

		reader.addEventListener("loadend", function() {
			_cb(this.result);
		});

		reader.readAsText(_blob); 
	});
};

if(edisonCards.length == 0)
{
	Eyal_ReadFile("./edison_cardpool.txt", function(_res){
	
		let eyal_arr = [];
		
		eyal_arr = _res.split('\r\n');
		
		for(let abc=0;abc < eyal_arr.length;abc++)
		{
			if(eyal_arr[abc][0] == ';')
				continue;
			
			edisonCards.push(eyal_arr[abc]);
		}
		
	});
}

if(animationCards.length == 0)
{
	Eyal_ReadFile("./masterduel_cards_with_animations.txt", function(_res){
	
		let eyal_arr = [];
		
		eyal_arr = _res.split('\r\n');
		
		for(let abc=0;abc < eyal_arr.length;abc++)
		{
			if(eyal_arr[abc][0] == ';')
				continue;
			
			animationCards.push(eyal_arr[abc]);
		}
		
	});
}
	

setInterval(function () {
	performInjection();
}, 4500);

let Eyal_timestamp = 0;

setInterval(function () {
	Eyal_timestamp = Eyal_timestamp + 0.1;
	
	if(Eyal_timestamp >= 1.0)
	{
		Eyal_timestamp = 0.0;
		performFastInjection(true);
	}
	else
	{
		performFastInjection(false);
	}
}, 100);


setInterval(function () {
	
	performCensorInjection();
}, 500);

// This is a race

let intervalCounters = 50;

let raceInterval = setInterval(function () {
	if(intervalCounters > 0)
		intervalCounters--;
	
	else
		clearInterval(raceInterval);
	
	performInjection();
}, 250);



function performFastInjection(bSecond)
{
	// Is the extension user dueling? "duel_active" is for dueling and watching, while "duelist" is only for dueling
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		if(tabs[0] && tabs[0].url && (tabs[0].url.search("www.duelingbook.com") != -1 || tabs[0].url.search("https://duelingbook.com") != -1))
		{
			if(typeof tabs[0].id !== 'undefined')
			{
				chrome.storage.sync.get(['potOfSwitch', 'femOfSwitch', 'normalMusicDL', 'victoryMusicDL_V2', 'musicSliderDL', 'limitedCardsSound', 'cardLogging', 'randomRPS'], function(result)
				{
					let potOfSwitch = false;
					
					if(result && result.potOfSwitch == true)
						potOfSwitch = true;
				
					let femOfSwitch = false;
					
					if(result && result.femOfSwitch == true)
						femOfSwitch = true;
					
					let musicSliderDL = 0;
					
					if(result && result.musicSliderDL > 0)
						musicSliderDL = result.musicSliderDL;
					
					let limitedCardsSound = true;
					
					if(result && result.limitedCardsSound == false)
						limitedCardsSound = false;
					
					let cardLogging = true;
					
					if(result && result.cardLogging == false)
						cardLogging = false;
					
					let randomRPS = false;
					
					if(result && result.randomRPS == true)
						randomRPS = result.randomRPS;
						
					
					chrome.scripting.executeScript(
					{
						args: [potOfSwitch, femOfSwitch, musicSliderDL, limitedCardsSound, cardLogging, randomRPS, bSecond, , animationCards],
						target: {tabId: tabs[0].id},
						world: "MAIN", // Main world is mandatory to edit other website functions
						func: fastInjectFunction,
						//files: ['inject.js'],
					});
				});
			}
		}
	}); 
}

function performInjection()
{
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		if(tabs[0] && tabs[0].url && (tabs[0].url.search("www.duelingbook.com") != -1 || tabs[0].url.search("https://duelingbook.com") != -1))
		{
			if(typeof tabs[0].id !== 'undefined')
			{
				chrome.storage.sync.get(['unlockCardMechanics', 'potOfSwitch', 'femOfSwitch', 'normalMusicDL', 'victoryMusicDL_V2', 'musicSliderDL', 'musicSliderMD', 'limitedCardsSound', 'cardLogging'], function(result)
				{
					let unlockCardMechanics = true;
					
					if(result && result.unlockCardMechanics == false)
						unlockCardMechanics = false;
					
					let potOfSwitch = false;
					
					if(result && result.potOfSwitch == true)
						potOfSwitch = true;
				
					let femOfSwitch = false;
					
					if(result && result.femOfSwitch == true)
						femOfSwitch = true;
					
					let normalMusicDL = "kaibaDSOD";
					
					if(result && result.normalMusicDL)
						normalMusicDL = result.normalMusicDL;
					
					let victoryMusicDL = "DSOD";
					
					if(result && result.victoryMusicDL_V2)
						victoryMusicDL = result.victoryMusicDL_V2;
					
					let musicSliderDL = 0;
					
					if(result && result.musicSliderDL > 0)
						musicSliderDL = result.musicSliderDL;
					
					let musicSliderMD = 0;
					
					if(result && result.musicSliderMD > 0)
						musicSliderMD = result.musicSliderMD;
					
					let limitedCardsSound = true;
					
					if(result && result.limitedCardsSound == false)
						limitedCardsSound = false;
					
					let cardLogging = true;
					
					if(result && result.cardLogging == false)
						cardLogging = false;
						
					
					chrome.scripting.executeScript(
					{
						args: [unlockCardMechanics, potOfSwitch, femOfSwitch, normalMusicDL, victoryMusicDL, musicSliderDL, musicSliderMD, limitedCardsSound, cardLogging, , animationCards, edisonCards],
						target: {tabId: tabs[0].id},
						world: "MAIN", // Main world is mandatory to edit other website functions
						func: injectFunction,
						//files: ['inject.js'],
					});
				});
			}
		}
	}); 
}

function performCensorInjection()
{
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		if(tabs[0] && tabs[0].url && (tabs[0].url.search("www.duelingbook.com") != -1 || tabs[0].url.search("https://duelingbook.com") != -1))
		{
			console.log(tabs[0].url);
			if(typeof tabs[0].id !== 'undefined')
			{
				chrome.storage.sync.get(['potOfSwitch', 'femOfSwitch'], function(result)
				{
					let potOfSwitch = false;
					
					if(result && result.potOfSwitch == true)
						potOfSwitch = true;
				
					let femOfSwitch = false;
					
					if(result && result.femOfSwitch == true)
						femOfSwitch = true;
					
					chrome.scripting.executeScript(
					{
						args: [potOfSwitch, femOfSwitch, ],
						target: {tabId: tabs[0].id},
						world: "MAIN", // Main world is mandatory to edit other website functions
						func: censorInjectFunction,
						//files: ['inject.js'],
					});
				});
			}
		}
	}); 
}

let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: 'keepAlive' }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}









/*
====================================
======= Start of inject.js =========
====================================
*/

/*
=== List of Effects that generate mechanics ===

1. This card can attack from your Pendulum Scale
2. This card can attack during your opponent's battle phase
3. This card can attack while in face-up Defense Position
4. You can Set this card from your hand to your Spell
5. each player swaps the cards in their graveyard with the cards in their deck
6. swap the cards in your graveyard with the cards in your deck
7. Shuffle this card face-up into your opponent's Deck
8. Shuffle 1 "Archetype" card face-up into your opponent's Deck.
9. Shuffle 1 "Archetype" monster face-up into your opponent's Deck.
10. pay half your LP
11. Special Summon 1 "Gorz Token"
12. Special Summon 4 "Named Tokens"
13. Special Summon as many "Named Tokens" (Stats Here!!!) as possible
14. Excavate the top 5 cards
15. Excavate the top card of
16. You can Special Summon this card (from your hand) to your opponent's field
17. Special Summoned (from your hand) to your opponent's field
18. Normal Summon to that side of the field
*/


function fastInjectFunction(potOfSwitch, femOfSwitch, musicSliderDL, limitedCardsSound, cardLogging, randomRPS, bSecond)
{
	if(duelist && typeof Eyal_swapCardMenuForPlayer == "function")
	{
		if(actionsQueue.indexOf(simultaneousDraw) >= 0)
		{
			window.GYwarning = [];
		}
		
		Eyal_swapCardMenuForPlayer(player1);
		Eyal_swapCardMenuForPlayer(player2);
		
		if(tag_duel)
		{
			Eyal_swapCardMenuForPlayer(player3)
			Eyal_swapCardMenuForPlayer(player4)
		}
	}	
	
	if(bSecond && randomRPS && duelist && player1.username == username)
	{
		if(currentLabel == "rps_start" && !pickedRPS && typeof rock1 !== 'undefined' && typeof paper1 !== 'undefined' && typeof scissors1 !== 'undefined')
		{
			let arr = [rock1[0], paper1[0], scissors1[0]];
			arr[Eyal_getRandomInt(0, arr.length-1)].click();
		}
	}
}

function censorInjectFunction(potOfSwitch, femOfSwitch, )
{
	window.loadThumbnails = function(data) {
		$('#' + currentLabel + ' .prev_thumb_btn').hide();
		$('#' + currentLabel + ' .next_thumb_btn').hide();
		$('#' + currentLabel + ' .thumbs .thumbnail').css("opacity", 0);
		$('#' + currentLabel + ' .thumbs .thumbnail .nsfw').hide();
		totalThumbs = data.pics.length;
		var thumbs = $('#' + currentLabel + ' .thumbs .thumbnail');
		for (var i = 0; i < thumbs.length; i++) {
			var thumb = thumbs.eq(i);
			thumb.off("click", uploadAvatarE);
			thumb.off("click", onThumbClick);
			if (data.pics.length >= i + 1) {
				thumb.data("index", i);
				thumb.data("id", data.ids[i]);
				thumb.data("nsfw", data.nsfws[i]);
				
				
				thumb.find('img').attr("src", IMAGES_START + "loading.gif");
				if (!data.nsfws[i] || always_show_nsfw)
				{
					thumb.find('img').attr("src", getAvatarStart(data.pics[i]));
				}
				
				thumb.click(onThumbClick);
				if (selectedThumb > 1) {
					$('#' + currentLabel + ' .prev_thumb_btn').show();
				}
				if (i < data.pics.length - 1) {
					$('#' + currentLabel + ' .next_thumb_btn').show();
				}
				if (data.pic == data.pics[i]) {
					$('#' + currentLabel + ' .profile_avatar').data("id", data.ids[i]);
				}
				thumb.find('.no_image').hide();
			}
			else {
				thumb.find('img').attr("src", IMAGES_START + "blank.png");
				thumb.find('.no_image').show();
				thumb.click(uploadAvatarE);
			}
			thumb.data("index", i);
			TweenMax.to(thumb, (i * 200 + 342) / 1000, {onComplete:function(){
				$(this.target).css("opacity", 1);
			}});
		}
		$('#' + currentLabel + ' .thumbs').show();
	}
	window.Eyal_cardPoolChanged = function()
	{
		if($('#my_banlists .banlists2 .cardpool_sel').val() == "Eyal_clipboard")
		{
			getConfirmation("Make sure you have a .conf list of EDO Pro in your clipboard.", "Important notes:<br>1. Every 10% progress the decklist will save itself<br>2. You cannot stop this action, and it will lag you.<br>3. It will not delete the existing cardpool, only add cards.", Eyal_ClipboardBanlistYes, undefined, true);
			$('#my_banlists .banlists2 .cardpool_sel').selectedIndex(0);
		}
	}
	
	window.Eyal_ClipboardBanlistYes = function()
	{
		Eyal_ClipboardBanlistYesAsync();

	}
	
	window.Eyal_ClipboardBanlistYesAsync = async function()
	{
		let str = await navigator.clipboard.readText();
		
		let import_arr = str.split("\n");
		
		let cards = [];
		
		let lastPercent = 0;
		
		console.log("Percents of completion for clipboard banlist importing:");
		for (let abc = 0;abc < import_arr.length;abc++)
		{
			curPercent = Math.floor((parseFloat(abc) / import_arr.length) * 100.0);
		
			if(lastPercent < curPercent)
			{
				if(curPercent % 10 == 0)
				{
					saveBanlistE();
					
					await Eyal_delay(1);
				}
				console.log("Progress: " + curPercent + "%");
				
				lastPercent = curPercent;
			}
			import_arr[abc] = import_arr[abc].trim();
			
			if(isNaN(import_arr[abc].charAt(0)))
				continue;
			
			let splittedLine = import_arr[abc].split(" ", 2);
			let cardId = parseInt(splittedLine[0]);
			let cardLimit = splittedLine[1];
			
			if(isNaN(cardLimit))
				continue;
			
			cardLimit = parseInt(cardLimit);
			
			if(cardLimit != 0 && cardLimit != 1 && cardLimit != 2 && cardLimit != 3)
				continue;
			
			for(let i=0;i < Cards.length;i++)
			{
				if(parseInt(Cards[i].serial_number) == cardId)
				{
					let cardfront = Eyal_lookupCard(Cards[i].name);
					
					if(cardfront == undefined)
						break;

					switch(parseInt(cardLimit))
					{
						case 0:
							addToBanlist(cardfront, $('.forbidden_section .banlist_cards'));
						break;
						
						case 1:
							addToBanlist(cardfront, $('.limited_section .banlist_cards'));
						break;
						
						case 2:
							addToBanlist(cardfront, $('.semi_limited_section .banlist_cards'));
						break;
						
						case 3:
							addToBanlist(cardfront, $('.unlimited_section .banlist_cards'));
						break;
					}
				}
			}
		}
		
		saveBanlistE();
	}
	
	window.Eyal_DeckConstructorCardPoolChanged = async function()
	{
		let currentVal = $(`#search .custom_cb option[value='${$("#search .custom_cb").val()}']`)
		
		for(let abc=0;abc < $("#search .combobox.proxy.unselectable").length;abc++)
		{
			if($("#search .combobox.proxy.unselectable")[abc].previousSibling.className != "custom_cb")
				continue;
			
			$("#search .combobox.proxy.unselectable")[abc].innerHTML = $("#search .combobox.proxy.unselectable")[abc].innerHTML.replace($("#search .combobox.proxy.unselectable")[abc].textContent, currentVal.text())
			
		}
		
		if($("#search .custom_cb").val() == "Eyal From Clipboard")
		{
			if(typeof window.Eyal_old_cards === "undefined")
			{
				window.Eyal_old_cards = [].concat(Cards);
			}
			
			Cards.length = 0;
			
			let str = await navigator.clipboard.readText();
			
			if(str.length == 0)
				return;
			
			let import_arr = str.split("\n");
				
			let cards = [];
			
			let optimizing_arr = [];
			
			for(let abc=0;abc < import_arr.length;abc++)
			{
				let passcode = parseInt(import_arr[abc].substring(0, import_arr[abc].indexOf(" ")));
				
				let limit = parseInt(import_arr[abc].substring(import_arr[abc].indexOf(" "), import_arr[abc].length))
				
				// For inventory based cardpools
				if(limit > 3)
					limit = 3;
				
				// Not dealing with anime variants of cards...
				else if(limit == -1)
					continue;
				
				optimizing_arr[passcode] = limit;
			}
			
			for(let abc=0;abc < Eyal_old_cards.length;abc++)
			{
				let passcode = parseInt(Eyal_old_cards[abc].serial_number);
					
				if(typeof optimizing_arr[passcode] !== "undefined")
				{
					let card = jQuery.extend({}, window.Eyal_old_cards[abc]);
					
					card.tcg_limit = optimizing_arr[passcode];
					card.ocg_limit = optimizing_arr[passcode];
					
					Cards.push(card);
				}
			}
		}
		else if($("#search .custom_cb").val() == "Eyal Master Duel")
		{
			if(typeof window.Eyal_old_cards === "undefined")
			{
				window.Eyal_old_cards = [].concat(Cards);
			}
			
			Cards.length = 0;
			
			let import_arr = [].concat(Eyal_MDCardpool);
				
			let cards = [];
			
			let optimizing_arr = [];
			
			for(let abc=0;abc < import_arr.length;abc++)
			{
				let passcode = parseInt(import_arr[abc].substring(0, import_arr[abc].indexOf(" ")));
				
				let limit = parseInt(import_arr[abc].substring(import_arr[abc].indexOf(" "), import_arr[abc].length))
				
				// For inventory based cardpools
				if(limit > 3)
					limit = 3;
				
				// Not dealing with anime variants of cards...
				else if(limit == -1)
					continue;
				
				optimizing_arr[passcode] = limit;
			}
			
			for(let abc=0;abc < Eyal_old_cards.length;abc++)
			{
				let passcode = parseInt(Eyal_old_cards[abc].serial_number);
					
				if(typeof optimizing_arr[passcode] !== "undefined")
				{
					let card = jQuery.extend({}, window.Eyal_old_cards[abc]);
					
					card.tcg_limit = optimizing_arr[passcode];
					card.ocg_limit = optimizing_arr[passcode];
					
					Cards.push(card);
				}
			}
		}
		else if($("#search .custom_cb").val() == "Eyal Edison Format")
		{
			if(typeof window.Eyal_old_cards === "undefined")
			{
				window.Eyal_old_cards = [].concat(Cards);
			}
			
			Cards.length = 0;
			
			let import_arr = [].concat(Eyal_EdisonCardpool);
				
			let cards = [];
			
			let optimizing_arr = [];
			
			for(let abc=0;abc < import_arr.length;abc++)
			{
				let passcode = parseInt(import_arr[abc].substring(0, import_arr[abc].indexOf(" ")));
				
				let limit = parseInt(import_arr[abc].substring(import_arr[abc].indexOf(" "), import_arr[abc].length))
				
				// For inventory based cardpools
				if(limit > 3)
					limit = 3;
				
				// Not dealing with anime variants of cards...
				else if(limit == -1)
					continue;
				
				optimizing_arr[passcode] = limit;
			}
			
			for(let abc=0;abc < Eyal_old_cards.length;abc++)
			{
				let passcode = parseInt(Eyal_old_cards[abc].serial_number);
					
				if(typeof optimizing_arr[passcode] !== "undefined")
				{
					let card = jQuery.extend({}, window.Eyal_old_cards[abc]);
					
					card.tcg_limit = optimizing_arr[passcode];
					card.ocg_limit = optimizing_arr[passcode];
					
					Cards.push(card);
				}
			}
		}
		else
		{
			if(typeof window.Eyal_old_cards !== "undefined")
			{
				Cards = [].concat(window.Eyal_old_cards)
			}
		}
	}
	
	
	window.exitDeckConstructor = function()
	{
		gotoMainMenu();
		deckCleanup();
		updateActive(false);
		
		if(typeof window.Eyal_old_cards !== "undefined")
		{
			Cards = [].concat(window.Eyal_old_cards)
		}
	}
	window.Eyal_lookupCard = function(str)
	{
		if (!str) {
			return undefined;
		}
		var card = null;
		for (var i = 0; i < Cards.length; i++) {
			if (Cards[i] == null || Cards[i].name == null) {
				continue;
			}
			
			// Eyal282 here, this property breaks banlists and gives error "One or more cards are no longer available"
			
			if(Cards[i].hidden)
				continue;
				
			if (Cards[i].name.toLowerCase() == str.toLowerCase()) {
				card = Cards[i];
				break;
			}
			else if (Cards[i].name.toLowerCase().indexOf(str.toLowerCase()) >= 0) {
				card = Cards[i];
			}
		}
		if (card) {
			var cardfront = newCardFront();
			cardfront.initializeFromData(card);
			return cardfront;
		}
		
		return undefined;
	}
	
	if(typeof window.Eyal_RealImpermColumns === "undefined")
	{
		window.Eyal_RealImpermColumns = [false, false, false, false, false];
	}
	
	if(typeof window.Eyal_TrueAllCardsArr === "undefined")
	{
		window.Eyal_TrueAllCardsArr = [];
	}
	
	if(duelist)
	{
		Eyal_GenerateTrueAllCardsArray();
	}
	
	if(typeof window.Eyal_excavatedArr === 'undefined')
	{
		window.Eyal_excavatedArr = [];
	}
	
	
	if(typeof removeButton !== 'undefined')
	{
		removeButton($('#view .exit_btn'))
		addButton($('#view .exit_btn'), Eyal_exitViewing);
	}
	
	if($("#search .custom_cb option[value='Eyal Edison Format']").length == 0)
	{
			$("#search .custom_cb").append($('<option>', {
             text: "Edison Format",
             value: 'Eyal Edison Format'
		}));
	}

	if ($("#search .custom_cb option[value='Eyal From Clipboard']").length == 0) {
		$("#search .custom_cb").append($('<option>', {
			text: "From Clipboard",
			value: 'Eyal From Clipboard'
		}));
	}
	
	// Code for dragging view deck & pressing keys on the document.

	if($('#view').length > 0)
	{
		jQuery(document).off('keyup');
		jQuery(document).on('keyup', Eyal_OnKeyPressed);
		
		$('#view').draggable({distance: "75", cursor: "move", helper: "title_txt", cursorat: {top: "50"}});
		$("#view .title_txt").css("cursor", "move")
	}


	if (Eyal_waitingForAction)
	{
		if (actionsQueue.length > 0)
			Eyal_waitingForAction = false;
    }
	// We're currently in https://www.duelingbook.com/card?id=513 
	if(typeof master !== "undefined" && typeof card_id !== "undefined")
	{
		let cardfront = my_card;
		
		let levelStr = "LEVEL: ";
		
		if(cardfront.data("monster_color") == "Xyz")
			levelStr = "RANK: ";
		
		if (cardfront.data("pendulum"))
		{
			preview_txt.html("<b>" + levelStr + cardfront.data("level") + "<br>" + "Pendulum Effect:</b><br>" + Eyal_MakePSCTColorOnEffect(escapeHTML(cardfront.data("pendulum_effect"))) + '<br><br>' + "<b>Monster Effect:</b><br>");
			if (cardfront.data("monster_color") == "Normal")
			{
				preview_txt.append("<i>" + escapeHTML(cardfront.data("effect")) + "</i>");
			} else
			{
				preview_txt.append(Eyal_MakePSCTColorOnEffect(escapeHTML(cardfront.data("effect"))));
			}
		}
		else if (cardfront.data("rush") && cardfront.data("monster_color") != "Normal")
		{
			preview_txt.html(escapeHTML(cardfront.data("effect")).replace('[Requirement]', '<b>[Requirement]</b>').replace('<br>[Effect]', '<br><b>[Effect]</b>').replace('<br>[Continuous Effect]', '<br><b>[Continuous Effect]</b>').replace('<br>[Multi-Choice Effect]', '<br><b>[Multi-Choice Effect]</b>').replace('[REQUIREMENT]', '<b>[REQUIREMENT]</b>').replace('<br>[EFFECT]', '<br><b>[EFFECT]</b>').replace('<br>[CONTINUOUS EFFECT]', '<br><b>[CONTINUOUS EFFECT]</b>').replace('<br>[MULTI-CHOICE EFFECT]', '<br><b>[MULTI-CHOICE EFFECT]</b>'));
		}
		else
		{
			if (cardfront.data("monster_color") == "Normal")
			{
				preview_txt.html("<b>" + levelStr + cardfront.data("level") + "</b><br>" + "<i>" + escapeHTML(cardfront.data("effect")) + "</i>");
			}
			else if (cardfront.data("level") > 0 && cardfront.data("monster_color") != "Link")
			{
				preview_txt.html("<b>" + levelStr + cardfront.data("level") + "</b><br>" + Eyal_MakePSCTColorOnEffect(escapeHTML(cardfront.data("effect"))));
			}
			else if (cardfront.data("card_type") == "Skill")
			{
				preview_txt.html(escapeHTML(cardfront.data("pendulum_effect")) + "<br><br>" + escapeHTML(cardfront.data("effect")));
			}
			else
			{
				preview_txt.html(Eyal_MakePSCTColorOnEffect(escapeHTML(cardfront.data("effect"))));
			}
		}
	}
}
