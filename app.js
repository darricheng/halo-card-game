window.onload = () => {
    /*****************
     * Page Elements *
     *****************/
    // Start Screen
    const startScreen = document.querySelector("#start-screen");
    const campaignButton = document.querySelector("#campaign-button");
    const homeTutorialButton = document.querySelector("#home-tutorial-button");
    const showCreditsButton = document.querySelector("#credits-button");

    // Tutorial
    const tutorialDiv = document.querySelector("#tutorial");
    const closeTutorialButton = document.querySelector(
        "#close-tutorial-button"
    );

    // Credits
    const creditsDiv = document.querySelector("#credits");
    const closeCreditsButton = document.querySelector("#close-credits-button");

    // Ending Screen
    const endingScreen = document.querySelector("#ending-screen");
    const endingScreenButton = document.querySelector("#return-to-main");

    // Game
    const containerDiv = document.querySelector("#container");
    const gameTutorialButton = document.querySelector("#game-tutorial-button");
    // Board
    const gameButtonDiv = document.querySelector("#game-button");
    const gameMessagesDiv = document.querySelector("#game-message");
    const gameMessages = document.querySelector("#game-message ol");
    // Card
    const cardTemplate = document.querySelector("#card-template");

    /*************
     * Resources *
     *************/
    // Decks
    class Card {
        constructor(name, cost, attack, health, imgName) {
            this.name = name;
            this.cost = cost;
            this.attack = attack;
            this.health = health;
            this.bg = `./cards-bg/${imgName}`;
        }
    }

    // Create the player deck
    const defaultPlayerDeck = [];
    // Cards with 1 copy
    defaultPlayerDeck.push(
        new Card(
            "Sergeant Johnson",
            10,
            11,
            17,
            "almost-unkillable-sergeant-johnson.jpg"
        )
    );
    // Cards with 2 copies
    for (let i = 0; i < 2; i++) {
        defaultPlayerDeck.push(
            new Card("Rocket Mongoose", 2, 5, 1, "rocket-mongoose.jpeg")
        );
        defaultPlayerDeck.push(
            new Card("Scorpion Tank", 8, 9, 8, "scorpion-tank.jpeg")
        );
    }
    // Cards with 3 copies
    for (let i = 0; i < 3; i++) {
        defaultPlayerDeck.push(new Card("Mongoose", 1, 3, 1, "mongoose.jpg"));
        defaultPlayerDeck.push(
            new Card("Rocket Marine", 1, 4, 1, "rocket-marine.jpeg")
        );
        defaultPlayerDeck.push(new Card("Warthog", 2, 2, 4, "warthog.jpeg"));
        defaultPlayerDeck.push(
            new Card("Marine Squad", 2, 2, 3, "marine-squad.jpeg")
        );
        defaultPlayerDeck.push(new Card("ODST", 2, 4, 2, "odst.jpeg"));
        defaultPlayerDeck.push(
            new Card("Rocket-hog", 3, 4, 3, "rocket-warthog.jpeg")
        );
        defaultPlayerDeck.push(new Card("Falcon", 3, 3, 4, "falcon.jpg"));
        defaultPlayerDeck.push(new Card("Hornet", 3, 2, 5, "hornet.jpg"));
        defaultPlayerDeck.push(
            new Card("Gauss-hog", 4, 5, 4, "gauss-warthog.jpg")
        );
        defaultPlayerDeck.push(new Card("SPARTAN", 5, 5, 7, "spartan.jpeg"));
    }
    // Cards with 5 copies
    for (let i = 0; i < 5; i++) {
        defaultPlayerDeck.push(new Card("Marine", 1, 2, 2, "marine.jpg"));
    }
    // End create player deck

    // Create the com deck
    const defaultComDeck = [];
    // Cards with 1 copy
    defaultComDeck.push(new Card("Wraith", 8, 7, 9, "wraith.jpeg"));
    defaultComDeck.push(
        new Card("Elite Honor Guard", 9, 9, 9, "elite-honor-guard.jpg")
    );
    // Cards with 2 copies
    for (let i = 0; i < 2; i++) {
        defaultComDeck.push(
            new Card("Fuel-rod Grunt", 1, 4, 1, "fuel-rod-grunt.jpeg")
        );
        defaultComDeck.push(new Card("Banshee", 2, 4, 2, "banshee.jpg"));
        defaultComDeck.push(
            new Card("Jackal Sniper", 3, 5, 2, "jackal-sniper.jpg")
        );
        defaultComDeck.push(
            new Card("Elite Ultra", 6, 7, 6, "elite-ultra.jpg")
        );
    }
    // Cards with 3 copies
    for (let i = 0; i < 3; i++) {
        defaultComDeck.push(
            new Card("Suicide Grunt", 1, 3, 1, "suicide-grunt.jpg")
        );
        defaultComDeck.push(new Card("Drone", 1, 2, 2, "drone.jpg"));
        defaultComDeck.push(new Card("Jackal", 2, 1, 4, "jackal.jpeg"));
        defaultComDeck.push(new Card("Ghost", 2, 3, 2, "ghost.jpg"));
        defaultComDeck.push(new Card("Brute", 2, 2, 3, "brute.webp"));
        defaultComDeck.push(new Card("Elite", 3, 3, 4, "elite.webp"));
        defaultComDeck.push(
            new Card("Brute Chopper", 3, 4, 3, "brute-chopper.jpg")
        );
        defaultComDeck.push(new Card("Hunter", 4, 4, 5, "hunter.jpg"));
        defaultComDeck.push(new Card("Revenant", 5, 4, 6, "revenant.jpg"));
        defaultComDeck.push(new Card("Grunt", 1, 1, 3, "grunt.jpg"));
    }
    // End create com deck

    /**********
     * States *
     **********/
    // Tutorial display
    let tutorialShown = false;

    // Credits display
    let creditsShown = false;

    // Round counter
    let roundNumber = 0;

    // Battle
    let unitsInBattle = [];
    // [{ atk: {atkUnit}, def: {defUnit} }, ...]
    // Where the array index is the unit position
    // The array length also determines the number of defenders required
    // At each index, atk is the attacking unit, def is the defending unit. These two units will do battle.
    // If the def has no unit, the atk unit strikes the defender's health
    // We can use a for loop to determine the battle outcome and damage to health
    // It's a matter of setting up the case for this to work

    /****************
     * User Objects *
     ****************/
    /* Some Definitions */
    // Max resources: The maximum for that round
    // Current resources: The amount left for that round
    // Pass counter: Whether the player passed for the round. Two passes advance the round.
    // Turn: Whether the player has action priority.

    // Player
    const player = {
        name: "player",
        deck: defaultPlayerDeck,
        health: 0,
        maxResources: 0,
        currentResources: 0,
        summonCount: 0,
        hand: [],
        backline: [],
        frontline: [],
        attackToken: false,
        passCounter: false,
        turn: false,
        isAttacking: false,
        isDefending: false,
        // Player divs
        deckDiv: document.querySelector("#player-deck"),
        handDiv: document.querySelector("#player-hand"),
        healthDiv: document.querySelector("#player-health"),
        resourcesDiv: document.querySelector("#player-resources"),
        resourceBars: document.querySelectorAll(
            "#player-resources .resource-bar"
        ),
        tokenDiv: document.querySelector("#player-token"),
        backlineDiv: document.querySelector("#player-backline"),
        frontlineDiv: document.querySelector("#player-frontline"),
    };

    // Computer
    const com = {
        name: "com",
        deck: defaultComDeck,
        health: 0,
        maxResources: 0,
        currentResources: 0,
        summonCount: 0,
        hand: [],
        backline: [],
        frontline: [],
        attackToken: false,
        passCounter: false,
        turn: false,
        isAttacking: false,
        isDefending: false,
        // Com divs
        deckDiv: document.querySelector("#com-deck"),
        handDiv: document.querySelector("#com-hand"),
        healthDiv: document.querySelector("#com-health"),
        resourcesDiv: document.querySelector("#com-resources"),
        resourceBars: document.querySelectorAll("#com-resources .resource-bar"),
        tokenDiv: document.querySelector("#com-token"),
        backlineDiv: document.querySelector("#com-backline"),
        frontlineDiv: document.querySelector("#com-frontline"),
        // Com functions
        // Com takes their turn
        takeTurn() {
            setTimeout(() => {
                // * Summon a unit
                // Check for sufficient resources and board space, and not currently defending
                if (
                    !this.isDefending &&
                    this.currentResources > 0 &&
                    this.summonCount < 6
                ) {
                    // Loop through hand to find cards that are low enough cost to summon
                    for (let i = 0; i < this.hand.length; i++) {
                        if (this.hand[i].cost <= this.currentResources) {
                            return summonUnit(this, this.hand[i].id);
                        }
                    }
                }

                // * Attack!
                if (this.attackToken) {
                    // Shift units to frontline
                    const backlineLength = this.backline.length;
                    for (let i = backlineLength - 1; i >= 0; i--) {
                        shiftUnitFromBackToFrontline(this, this.backline[i].id);
                    }
                    return hitGameButton(this);
                }

                // * Defend
                if (this.isDefending) {
                    // Determine how many units can block
                    let numOfDef = 0;
                    // Based on the lowest number of units either player has
                    if (unitsInBattle.length <= this.backline.length) {
                        numOfDef = unitsInBattle.length;
                    } else {
                        numOfDef = this.backline.length;
                    }

                    // Assign the defenders
                    for (let i = 0; i < numOfDef; i++) {
                        const cardButtons = this.backlineDiv.querySelectorAll(
                            ".card-action-button"
                        );

                        // Get the available empty def divs
                        // Search for empty divs first, else after clicking a card button, the def div will have text, i.e. by definition no longer empty
                        const emptyDefDivs = filterEmptyDefDivs(this);

                        // Click the first unit in the backline
                        cardButtons[0].click();

                        // Click the first available empty def div
                        emptyDefDivs[0].click();
                    }
                    return setTimeout(() => hitGameButton(this), 2000);
                }

                // Default
                return hitGameButton(this);
            }, 2000);
        }, // takeTurn
    };

    // For referencing the respective objects when provided with a string
    // Source: https://stackoverflow.com/a/10953396
    const reference = { player: player, com: com };

    /* User Objects */

    /*********************
     * Support Functions *
     *********************/
    /**
     * Fisher-Yates Shuffle
     * Shuffles the array in-place then returns it
     * Source: https://bost.ocks.org/mike/shuffle/
     * @param {Array} array Deck to be shuffled
     * @returns {Array} Shuffled deck
     */
    const shuffle = (array) => {
        var m = array.length,
            t,
            i;

        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }; // shuffle

    /**
     * Takes a card and returns a DOM Object
     * @param {Object} card The card to be rendered
     * @param {Boolean} cardBack Whether the card to be rendered needs to be just the card back
     * @return {DOM Object}
     */
    const renderCard = (card, cardBack = false) => {
        // Clone the template to a variable
        const renderedCard =
            cardTemplate.content.firstElementChild.cloneNode(true);

        // Get the inner div of the card button
        const cardButton = renderedCard.querySelector(".card-action-button");
        // Add event listener to card button
        cardButton.addEventListener("click", cardActionButton);

        // If it's not just rendering the card back
        if (!cardBack) {
            // Get inner divs of the card details
            const cardName = renderedCard.querySelector(".card-name");
            const cardCost = renderedCard.querySelector(".card-cost");
            const cardAttack = renderedCard.querySelector(".card-attack");
            const cardHealth = renderedCard.querySelector(".card-health");
            // Assign the card values to the respective divs
            cardName.innerHTML = card.name;
            cardCost.innerHTML = card.cost;
            cardAttack.innerHTML = card.attack;
            cardHealth.innerHTML = card.health;

            // Render card bg
            renderedCard.style.backgroundImage = `url(${card.bg})`;
        }

        // Add a unique ID to the card
        renderedCard.setAttribute("card-id", card.id);

        return renderedCard;
    }; // renderCard

    /**
     * Renders the hand of the stated user
     * @param {Object} user
     */
    const renderHand = (user) => {
        // Empty the hand
        user.handDiv.textContent = "";
        // Render the hand
        for (let i = 0; i < user.hand.length; i++) {
            let cardDOM;
            if (user.name === com.name) {
                cardDOM = renderCard(user.hand[i], true);
            } else {
                cardDOM = renderCard(user.hand[i]);
            }
            user.handDiv.append(cardDOM);
        }
    }; // renderHand

    /**
     * Renders the backline of the stated user
     * @param {Object} user
     */
    const renderBackline = (user) => {
        // Empty the backline
        user.backlineDiv.textContent = "";
        // Render the backline
        for (let i = 0; i < user.backline.length; i++) {
            const cardDOM = renderCard(user.backline[i]);
            user.backlineDiv.append(cardDOM);
        }
    }; // renderBackline

    /**
     * Renders the frontline of the stated user
     * @param {Object} user
     */
    const renderFrontline = (user) => {
        // Empty the frontline
        user.frontlineDiv.textContent = "";
        // Render the frontline
        for (let i = 0; i < user.frontline.length; i++) {
            const cardDOM = renderCard(user.frontline[i]);
            user.frontlineDiv.append(cardDOM);
        }
    }; // renderFrontline

    /**
     * Toggles the turn away from the user that invoked this function
     * @param {Object} user
     */
    const toggleTurn = (user) => {
        // I.e. when player.turn is false
        if (user.name === player.name) {
            player.turn = false;
            com.turn = true;
            // showHideCursor(false);
        } else {
            player.turn = true;
            com.turn = false;
            // showHideCursor(true);
        }
        // Render the game button text
        renderGameButtonText();
        if (com.turn) {
            return com.takeTurn();
        }
    }; // toggleTurn

    /**
     * Renders the resources of the user
     * @param {Object} user User object
     */
    const renderResources = (user) => {
        // Get inner div for the resources number
        const resourceValue =
            user.resourcesDiv.querySelector(".current-resources");
        // Set the inner div to the current resources
        resourceValue.innerHTML = user.currentResources;

        // Render resources according to amount left
        // Always render from 9 to 0 because of the div ordering
        // 9 is bottom bar, 0 is topmost

        // Render max resources first
        // Current resources will override only the number of current resources

        // Render the max resources
        for (let i = 9; i > 9 - user.maxResources; i--) {
            user.resourceBars[i].style.background = "black";
        }
        // Render the current resources
        for (let i = 9; i > 9 - user.currentResources; i--) {
            user.resourceBars[i].style.background = "lightgreen";
        }
    }; // renderResources

    /**
     * Prints the given string to the game message box
     * @param {String} msg
     */
    const printMessage = (msg) => {
        const newMsg = document.createElement("li");
        newMsg.textContent = msg;
        gameMessages.append(newMsg);

        // Scroll the message box to the bottom whenever a message is added
        gameMessagesDiv.scrollTop = gameMessagesDiv.scrollHeight;
    }; // printMessage

    /**
     * Resets both pass counters to false
     * Invoked whenever a user takes an action other than passing
     * When both counters are true, the game will advance to the next round
     */
    const resetPassCounters = () => {
        player.passCounter = false;
        com.passCounter = false;
    }; // resetPassCounters

    /**
     * Shows or hides the player's cursor based on turn
     * If true, show the cursor
     * If false, hide it
     * @param {Boolean} bool
     */
    /*
    const showHideCursor = (bool) => {
        switch (bool) {
            case true:
                containerDiv.classList.remove("hide-cursor");
                break;
            case false:
                containerDiv.classList.add("hide-cursor");
                break;
        }
    }; */ // showHideCursor

    /**
     * Updates the health value of the affected user
     * @param {Object} user User whose health was affected
     */
    const renderHealth = (user) => {
        user.healthDiv.innerHTML = user.health;
    }; // renderHealth

    /**
     * Updates the attack token of the indicated user
     * @param {Object} user User who's attack token needs to be updated
     */
    const renderAttackToken = (user) => {
        // Render attack token
        if (user.attackToken) {
            const tokenImg = document.createElement("div");
            tokenImg.classList.add("weapon");
            user.tokenDiv.append(tokenImg);
        }
        // Remove the attack token
        else {
            user.tokenDiv.textContent = "";
        }
    }; // renderAttackToken

    /**
     * Updates the text in the game button accordingly for the player
     */
    const renderGameButtonText = () => {
        // If player is preparing to attack
        if (player.frontline.length > 0) {
            gameButtonDiv.textContent = "ATTACK";
        }
        // If player is defending an attack
        else if (player.isDefending) {
            gameButtonDiv.textContent = "DECLARE BLOCKERS";
        }
        // If it's opponent's turn
        else if (!player.turn) {
            gameButtonDiv.textContent = "OPPONENT TURN";
        }
        // If com passed
        else if (com.passCounter) {
            gameButtonDiv.textContent = "END ROUND";
        }
        // If player hasn't taken any action, i.e. can pass
        else {
            gameButtonDiv.textContent = "PASS";
        }
    }; // renderGameButtonText

    /**
     * Filters out the defence divs that already contains a unit for the user
     * @param {Object} user The user that is defending the attack
     * @returns An array with the empty def divs
     */
    const filterEmptyDefDivs = (user) => {
        // After clicking button, user can click on a defDiv next to assign the card to that def position
        // Add event listeners to all available defDivs
        const defDivs = user.frontlineDiv.querySelectorAll(".defence-slot");
        // Remove defDivs with a card in it (i.e. don't add an event listener)
        // (How to check if a div is empty: https://bobbyhadz.com/blog/javascript-check-if-div-is-empty)
        const emptyDefDivs = [];
        for (let i = 0; i < defDivs.length; i++) {
            if (defDivs[i].childNodes.length === 0) {
                // Add to empty def divs array
                emptyDefDivs.push(defDivs[i]);
            }
        }
        return emptyDefDivs;
    }; // filterEmptyDefDivs

    /* Support Functions */

    /*************************
     * Game Action Functions *
     *************************/
    /**
     * Draws num card(s) for the indicated user
     * Then add the card(s) to the hand
     * @param {Object} user
     * @param {Number} num
     */
    const draw = (user, num = 1) => {
        if (user.deck.length > 0) {
            for (let i = 0; i < num; i++) {
                // Remove top card from deck (end of array)
                const drawnCard = user.deck.pop();
                // Only push card into hand if user has < 10 cards
                if (user.hand.length < 10) {
                    // Push drawn card to end of hand
                    user.hand.push(drawnCard);
                }
                // Burn cards if hand is too full
                else {
                    printMessage(
                        `${user.name} burnt ${drawnCard.name} because their hand is too full`
                    );
                }
            }
        }
        renderHand(user);
    }; // draw

    /**
     * When the card action button is clicked,
     * invoke the corresponding function
     * @param {Event} e
     */
    const cardActionButton = (e) => {
        // Assign the card DOM to a variable
        const selectedCardDOM = e.currentTarget.parentElement;
        // Assign the cardID to a variable
        const cardID = Number(selectedCardDOM.getAttribute("card-id"));
        // Save element id as String into variable
        const userStr = selectedCardDOM.parentElement.parentElement.id;
        // Use reference object to convert it to actual user object
        const user = reference[userStr];

        // Conditions for the various actions

        // Check for user if card is in defence slot first (else any user below will be undefined)
        // Button clicked when user is defending and card is in a defense slot
        if (selectedCardDOM.parentElement.classList.contains("defence-slot")) {
            // Specifically for shifting card out of def div
            const defUserStr =
                selectedCardDOM.parentElement.parentElement.parentElement.id;
            const defUser = reference[defUserStr];

            // Don't do anything if it isn't the user's turn
            if (!defUser.turn) return;

            return shiftCardOutOfDefDiv(defUser, selectedCardDOM, cardID);
        }

        // Don't do anything if it isn't the user's turn
        if (!user.turn) return;

        // Button clicked on card in backline when user is defending
        if (user.isDefending) {
            return addCardToDefDiv(user, selectedCardDOM, cardID);
        }

        // Button clicked on card in hand
        if (selectedCardDOM.parentElement.classList.contains("hand")) {
            return summonUnit(user, cardID);
        }

        // Button clicked on card in backline
        else if (selectedCardDOM.parentElement.classList.contains("backline")) {
            if (!user.attackToken) {
                return printMessage("You do not have the attack token");
            }
            return shiftUnitFromBackToFrontline(user, cardID);
        }

        // Button clicked on card in frontline
        else if (
            selectedCardDOM.parentElement.classList.contains("frontline")
        ) {
            return shiftUnitFromFrontToBackline(user, cardID);
        }
    }; // cardActionButton

    /**
     * Summons the card from hand to the backline
     * @param {Object} user The user object that summoned a unit
     * @param {Number} cardID The id of the card that was clicked
     */
    const summonUnit = (user, cardID) => {
        // Check that user doesn't have more than 6 units in play
        if (user.summonCount >= 6) {
            return printMessage("Too many units in play!");
        }
        // Check that user isn't preparing for an attack (i.e. unit in frontline)
        if (user.frontline.length > 0) {
            return printMessage(
                "You can't summon when a unit is preparing to attack."
            );
        }

        // Search for the card in the hand array
        let selectedCardObj;
        let index;
        for (let i = 0; i < user.hand.length; i++) {
            // Convert both values to numbers
            if (Number(user.hand[i].id) === cardID) {
                selectedCardObj = user.hand[i];
                index = i;
                break;
            }
        }
        // Check whether user has sufficient resources to summon the selected card
        if (user.currentResources - selectedCardObj.cost < 0) {
            return printMessage(
                `Insufficient resources to summon ${selectedCardObj.name}!`
            );
        }

        // Remove selected card from hand array
        user.hand.splice(index, 1);
        // Add selected card to backline
        user.backline.push(selectedCardObj);

        // Render the DOM accordingly
        renderHand(user);
        renderBackline(user);

        // Reduce the user's resources accordingly
        user.currentResources -= selectedCardObj.cost;
        renderResources(user);

        // Increaase the summonCount accordingly
        user.summonCount = user.backline.length;

        // Reset the pass counters since an action was taken
        resetPassCounters();

        // Print the relevant message
        printMessage(`${user.name} has summoned ${selectedCardObj.name}`);

        // Pass the turn after summoning
        toggleTurn(user);
    }; // summonUnit

    /**
     * Shifts card from backline to frontline
     * @param {Object} user The user object that shifted the unit
     * @param {Number} cardID The id of the card that was clicked
     */
    const shiftUnitFromBackToFrontline = (user, cardID) => {
        // Search for the card in the backline array
        let selectedCardObj;
        for (let i = 0; i < user.backline.length; i++) {
            // Convert both values to numbers
            if (Number(user.backline[i].id) === cardID) {
                selectedCardObj = user.backline[i];
                // Remove selected card from backline array
                user.backline.splice(i, 1);
                break;
            }
        }
        // Add selected card to frontline
        user.frontline.push(selectedCardObj);

        // Render the game button text
        renderGameButtonText();

        // Render the DOM accordingly
        renderBackline(user);
        renderFrontline(user);
    }; // shiftUnitFromBackToFrontline

    /**
     * Shifts card from frontline to backline
     * @param {Object} user The user object that shifted the unit
     * @param {Number} cardID The id of the card that was clicked
     */
    const shiftUnitFromFrontToBackline = (user, cardID) => {
        // Search for the card in the frontline array
        let selectedCardObj;
        for (let i = 0; i < user.frontline.length; i++) {
            // Convert both values to numbers
            if (Number(user.frontline[i].id) === cardID) {
                selectedCardObj = user.frontline[i];
                // Remove selected card from frontline array
                user.frontline.splice(i, 1);
                break;
            }
        }
        // Add selected card to backline
        user.backline.push(selectedCardObj);

        // Render the game button text
        renderGameButtonText();

        // Render the DOM accordingly
        renderFrontline(user);
        renderBackline(user);
    }; // shiftUnitFromFrontToBackline

    /**
     * Shifts the clicked card's DOM Object to the selected def div during the defending player's turn to place defenders
     * @param {Object} user The user clicking the cards
     * @param {DOM Object} selectedCardDOM The DOM Object of the selected card
     * @param {Number} cardID The id of the card that was clicked
     */
    const addCardToDefDiv = (user, selectedCardDOM, cardID) => {
        // TODO (Bug): If I click two action buttons before clicking the def div, both clicked cards get appended to the same div
        // The above bug can be solved by clicking the buttons to shift the cards back to the backline

        // I have to re-render the cards every time they are added to the def div
        // I think when I shift the card into the def div, the event listener isn't removed,
        // so when I shift the second card into the def div, the first card follows.

        /****************************************/
        // Deciding which units to block which attacker
        // Click on a card's action button
        // Available defence slots light up
        // Click on a defence slot to transfer card to that slot
        // Can explore using event handlers with parameters, see: https://stackoverflow.com/a/10000178
        // Because I'll want a way to pass the cardDOM to the clicked defence slot
        /****************************************/

        const emptyDefDivs = filterEmptyDefDivs(user);

        // Search for the card in the backline array
        let selectedCardObj;
        for (let i = 0; i < user.backline.length; i++) {
            // Convert both values to numbers
            if (Number(user.backline[i].id) === cardID) {
                selectedCardObj = user.backline[i];
            }
        }

        // Add event listeners to empty def divs

        /**
         * Trasfers the selectedCardDOM to the clicked def div
         * @param {Event} e
         */
        const defDivEventListener = (e) => {
            console.log(e);
            // Remove the text from all def divs
            for (let i = 0; i < emptyDefDivs.length; i++) {
                emptyDefDivs[i].textContent = "";
            }
            // Remove the cardDOM from the backline, add the cardDOM to the selected def div
            const selectedDefDiv = e.currentTarget;
            selectedCardDOM.remove();
            selectedDefDiv.append(renderCard(selectedCardObj));

            // Remove the listeners and clickable-def-slot class for all defDivs
            for (let i = 0; i < emptyDefDivs.length; i++) {
                // emptyDefDivs[i].textContent = "";
                emptyDefDivs[i].classList.remove("clickable-def-slot");
                emptyDefDivs[i].removeEventListener(
                    "click",
                    defDivEventListener
                );
            }
        };

        for (let i = 0; i < emptyDefDivs.length; i++) {
            // Animate available def divs
            emptyDefDivs[i].classList.add("clickable-def-slot");
            // Add event listener to the empty def divs
            emptyDefDivs[i].addEventListener("click", defDivEventListener);
            // Add instruction text to the def slot
            emptyDefDivs[i].textContent = "CLICK TO DEFEND HERE";
        }
    }; // addCardToDefDiv

    const shiftCardOutOfDefDiv = (user, selectedCardDOM, cardID) => {
        // Remove card DOM from def div
        selectedCardDOM.remove();

        // Search for the card in the backline array
        let selectedCardObj;
        for (let i = 0; i < user.backline.length; i++) {
            // Convert both values to numbers
            if (Number(user.backline[i].id) === cardID) {
                selectedCardObj = user.backline[i];
            }
        }

        // Append the card DOM to the backline
        user.backlineDiv.append(renderCard(selectedCardObj));
    }; // shiftCardOutOfDefDiv

    /* Game Action Functions */

    /*****************************
     * Game Management Functions *
     *****************************/
    /**
     * Reset everything
     */
    const init = () => {
        // Reset both decks by copying from the default
        player.deck = [...defaultPlayerDeck];
        com.deck = [...defaultComDeck];

        // Add unique IDs to each card
        let k = 0;
        for (let i = 0; i < player.deck.length; i++) {
            player.deck[i].id = k;
            k++;
        }
        for (let i = 0; i < com.deck.length; i++) {
            com.deck[i].id = k;
            k++;
        }

        // Set health to full
        player.health = 20;
        com.health = 20;
        // Render health of players
        renderHealth(player);
        renderHealth(com);

        // Set resources to round 0 values
        player.maxResources = 0;
        com.maxResources = 0;
        player.currentResources = 0;
        com.currentResources = 0;

        // Set summonCount to 0
        player.summonCount = 0;
        com.summonCount = 0;

        // Clear hands
        player.hand = [];
        com.hand = [];

        // Clear board
        player.backline = [];
        com.backline = [];
        renderBackline(player);
        renderBackline(com);

        // Set round to 0
        roundNumber = 0;

        // Reset all battle states
        player.isAttacking = false;
        player.isDefending = false;
        com.isAttacking = false;
        com.isDefending = false;

        // Empty game messages
        gameMessages.textContent = "";

        // Advance the round to round 1
        advanceRound();
    }; // init

    /**
     * Start the game till first action
     */
    const gameStart = () => {
        // Shuffle both decks
        shuffle(player.deck);
        shuffle(com.deck);

        // Both players draw 4
        draw(player, 4);
        draw(com, 4);
    }; // gameStart

    /**
     * Progress the game based on the current game state
     * @param {Object} user The user object that hits the game button
     */
    const hitGameButton = (user) => {
        // Don't do anything if it isn't the user's turn
        if (!user.turn) return;
        /** Actions that a user can take:
         * Summon a unit (Turn taken care of by action of summoning)
         * Declare an attack
         * Declare blockers & finalise the attack
         * Pass the turn
         */
        // If user has placed at least one unit in the frontline, declare an attack
        if (user.frontline.length > 0) {
            printMessage(`${user.name} is declaring an attack`);
            // Enter the battle sequence
            return declareAttackers(user);
        }

        // Invoke the resolve battle function when the defender hits the game button
        if (user.isDefending) {
            return resolveBattle(user);
        }

        // Pass the turn if user took no action
        user.passCounter = true;
        printMessage(`${user.name} has passed`);
        // If both players passed, advance to a new round
        if (player.passCounter && com.passCounter) {
            printMessage(`Both players passed, end of round ${roundNumber}`);
            return advanceRound();
        }
        return toggleTurn(user);
    }; // hitGameButton

    /**
     * Declares the attacker for the attacking user
     * @param {Object} attacker The user that is attacking
     */
    const declareAttackers = (attacker) => {
        // Reset the pass counters since an action was taken
        resetPassCounters();
        // Set attack token accordingly
        attacker.attackToken = false;
        renderAttackToken(attacker);
        // Declare the defender variable
        let defender;
        // Set the relevant battle states & assign the relevant user object to defender
        // Attacker
        attacker.isAttacking = true;
        // Defender
        if (attacker.name === player.name) {
            com.isDefending = true;
            defender = com;
        } else {
            player.isDefending = true;
            defender = player;
        }

        // Push the attacking units into the battle array
        for (let i = 0; i < attacker.frontline.length; i++) {
            const attackingUnit = attacker.frontline[i];
            const battleTemp = { atk: attackingUnit, def: null };
            unitsInBattle.push(battleTemp);
        }
        // Empty the frontline array (all the card data is now in unitsInBattle)
        attacker.frontline = [];

        // Store the number of units attacking (which is also max number of possible defenders)
        const numberOfFights = unitsInBattle.length;

        // Create the relevant number of divs for the defender to place units
        for (let i = 0; i < numberOfFights; i++) {
            // Create the div and add the relevant class
            const defDiv = document.createElement("div");
            defDiv.classList.add("defence-slot");

            // Add a unique defender id to each div (this id will match the index of respective attackers)
            defDiv.setAttribute("def-id", i);

            // Append the div to the frontline
            defender.frontlineDiv.append(defDiv);
        }

        return toggleTurn(attacker);
    }; // declareAttackers

    /**
     * Resolves the battle after the defender hits the game button with optional placing of defending units
     * @param {Object} defender The user that hits the game button
     */
    const resolveBattle = (defender) => {
        // Push the defender's units into the unitsInBattle array
        const defDivs = defender.frontlineDiv.querySelectorAll(".defence-slot");
        for (let i = 0; i < defDivs.length; i++) {
            // Variable to store the index of the non-empty def div
            let defDivID = -1;
            // Variable to store the id of the defending card
            let defCardID = -1;
            // Variable to store the card object
            let cardObj = null;
            // Check if the def div has a card in it
            if (defDivs[i].childNodes.length > 0) {
                defDivID = defDivs[i].getAttribute("def-id");
                defCardID = defDivs[i].childNodes[0].getAttribute("card-id");

                // Shift card object from backline array to unitsInBattle array
                for (let j = 0; j < defender.backline.length; j++) {
                    // Store card in cardObj
                    if (Number(defender.backline[j].id) === Number(defCardID)) {
                        cardObj = defender.backline.splice(j, 1).pop();
                        // Assign the cardObj to the respective def slot in the unitsInBattle array
                        unitsInBattle[defDivID].def = cardObj;
                    }
                }
            }
        } // At this point, the units are gone from the attacker's frontline array
        // and gone from the defender's backline array.
        // They are stored in the unitsInBattle array.
        // Any surviving units will be pushed to the end of the respective backline arrays.

        // Attacker
        let attacker;
        if (defender.name === player.name) {
            attacker = com;
        } else {
            attacker = player;
        }

        // Do the necessary calculations for the units and the defender's health
        let totalDmg = 0;
        for (let i = 0; i < unitsInBattle.length; i++) {
            // Resolve the combat for the two units. If unit died, change atk/def to null.
            if (unitsInBattle[i].def) {
                // Calculate damage to fighting units
                unitsInBattle[i].atk.health -= unitsInBattle[i].def.attack;
                unitsInBattle[i].def.health -= unitsInBattle[i].atk.attack;
            }
            // If the def property is null, deal the atk's attack to the defender's health
            else {
                defender.health -= unitsInBattle[i].atk.attack;
                // Add up the total damage for printing
                totalDmg += unitsInBattle[i].atk.attack;
            }

            // Shift the alive units back to the respective backline arrays.
            // Attacker
            if (unitsInBattle[i].atk.health > 0) {
                attacker.backline.push(unitsInBattle[i].atk);
            }
            // Defender
            if (unitsInBattle[i].def && unitsInBattle[i].def.health > 0) {
                defender.backline.push(unitsInBattle[i].def);
            }
        }

        // Print message accordingly
        let msg = "Battle resolved, ";
        if (totalDmg > 0) {
            msg += `${defender.name} got hit for ${totalDmg} damage`;
        } else {
            msg += `${defender.name} took no damage`;
        }
        printMessage(msg);

        // Set the summon count accordingly
        attacker.summonCount = attacker.backline.length;
        defender.summonCount = defender.backline.length;

        // Render the defender's new health
        renderHealth(defender);

        // Re-render the frontlines
        renderFrontline(attacker);
        renderFrontline(defender);

        // Re-render the backlines
        renderBackline(attacker);
        renderBackline(defender);

        // Set the states back
        attacker.isAttacking = false;
        defender.isDefending = false;
        unitsInBattle = [];

        // Clear the defender's frontline of def divs.
        defender.frontlineDiv.textContent = "";

        // Render the game button text accordingly
        renderGameButtonText();

        // Check whether the defender is still alive
        if (defender.health <= 0) {
            return endTheGame(defender);
        }

        // At the end, return the turn to the defender.
        if (com.turn) {
            com.takeTurn();
        }
    }; // resolveBattle

    /**
     * When both players pass, this function will be invoked to advance the round
     * Then set the relevant states accordingly
     */
    const advanceRound = () => {
        // Set both pass counters to false
        resetPassCounters();

        // Advance round
        roundNumber++;

        // Draw cards
        draw(player);
        draw(com);

        // Tie game if both players run out of cards
        if (player.deck.length === 0 && com.deck.length === 0) {
            return showEndingScreen("tie");
        }

        // Print the round number
        printMessage(`Round ${roundNumber}`);

        // Increment max resources by 1
        if (player.maxResources !== 10) {
            player.maxResources++;
        }
        if (com.maxResources !== 10) {
            com.maxResources++;
        }
        // Refill current resources to full
        player.currentResources = player.maxResources;
        com.currentResources = com.maxResources;

        // Render the resources
        renderResources(player);
        renderResources(com);

        // Pass attack token based on round number
        // Then set the turns based on attacker first
        // Player gets token on round 1
        if (roundNumber % 2 !== 0) {
            player.attackToken = true;
            com.attackToken = false;
            player.turn = true;
            com.turn = false;
            // showHideCursor(true);
        } else {
            player.attackToken = false;
            com.attackToken = true;
            player.turn = false;
            com.turn = true;
            // showHideCursor(false);
        }

        // Render the game button text
        renderGameButtonText();

        // Render attack tokens
        renderAttackToken(player);
        renderAttackToken(com);

        if (com.turn) {
            // Com takes turn
            com.takeTurn();
        } else {
            printMessage("You have the attack token");
        }
    }; // advanceRound

    /**
     * Invoked when one player's health drops below 0
     * @param {Object} user The user who's health dropped below 0
     */
    const endTheGame = (user) => {
        // Determine winner
        if (user.name === player.name) {
            printMessage(`Defeat`);
            return showEndingScreen("lose");
        } else {
            printMessage(`Victory`);
            return showEndingScreen("win");
        }
    }; // endTheGame

    /* Game Management Functions */

    /******************
     * Menu Functions *
     ******************/
    /**
     * Starts the game when the campaign button on the home screen is clicked
     */
    const startCampaign = () => {
        startScreen.style.display = "none";
        containerDiv.style.display = "block";
        init();
        gameStart();
    }; // startCampaign

    /**
     * Shows and hides the tutorial for the game
     */
    const toggleTutorial = () => {
        // Close tutorial if it is shown
        if (tutorialShown) {
            tutorialShown = false;
            tutorialDiv.style.display = "none";
        }
        // Open tutorial
        else {
            tutorialShown = true;
            tutorialDiv.style.display = "block";
        }
    }; // toggleTutorial

    /**
     * Shows and hides the game credits
     */
    const toggleCredits = () => {
        // Close credits if it is shown
        if (creditsShown) {
            creditsShown = false;
            creditsDiv.style.display = "none";
        }
        // Open tutorial
        else {
            creditsShown = true;
            creditsDiv.style.display = "block";
        }
    };

    /**
     * Renders the ending screen depending on the result of the game
     * @param result Pass in either win, lose, or tie strings
     */
    const showEndingScreen = (result) => {
        const mainResult = endingScreen.querySelector("h1");
        const description = endingScreen.querySelector("p");
        if (result === "win") {
            mainResult.textContent = "VICTORY";
            description.textContent = "You beat the covenant, well done!";
        } else if (result === "lose") {
            mainResult.textContent = "DEFEAT";
            description.textContent = "Better luck next time!";
        } else if (result === "tie") {
            mainResult.textContent = "TIE";
            description.textContent = "You have found the Tie Skull.";
        }
        endingScreen.style.display = "block";
    }; // showEndingScreen

    const returnToMainScreen = () => {
        startScreen.style.display = "block";
        containerDiv.style.display = "none";
        tutorialDiv.style.display = "none";
        endingScreen.style.display = "none";
    }; // returnToMainScreen

    /* Menu Functions */

    /*******************
     * Event Listeners *
     *******************/
    gameButtonDiv.addEventListener("click", () => hitGameButton(player));
    campaignButton.addEventListener("click", startCampaign);
    homeTutorialButton.addEventListener("click", toggleTutorial);
    gameTutorialButton.addEventListener("click", toggleTutorial);
    closeTutorialButton.addEventListener("click", toggleTutorial);
    showCreditsButton.addEventListener("click", toggleCredits);
    closeCreditsButton.addEventListener("click", toggleCredits);
    endingScreenButton.addEventListener("click", returnToMainScreen);
};
