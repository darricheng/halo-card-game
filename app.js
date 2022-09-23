window.onload = () => {
    /*****************
     * Page Elements *
     *****************/
    const containerDiv = document.querySelector("#container");
    // Board
    const gameButtonDiv = document.querySelector("#game-button");
    const gameMessageDiv = document.querySelector("#game-message");
    // Card
    const cardTemplate = document.querySelector("#card-template");

    /*************
     * Resources *
     *************/
    // Default decks
    const defaultPlayerDeck = [
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
        {
            name: "Marine",
            cost: 1,
            attack: 2,
            health: 2,
        },
    ];
    const defaultComDeck = [
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
        {
            name: "Grunt",
            cost: 1,
            attack: 1,
            health: 2,
        },
    ];

    /**********
     * States *
     **********/
    // Round counter
    let roundNumber = 0;

    // Battle
    const unitsInBattle = [];
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
        attackToken: true,
        passCounter: false,
        turn: true,
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
        attackToken: true,
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
                return hitGameButton(this);
            }, 3000);
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
    }; // Fisher-Yates Shuffle

    /**
     * Takes a card and returns a DOM Object
     * @param {Object} card The card to be rendered
     * @return {DOM Object}
     */
    const renderCard = (card) => {
        // Clone the template to a variable
        const renderedCard =
            cardTemplate.content.firstElementChild.cloneNode(true);
        // Get the inner divs of the new rendered card
        const cardName = renderedCard.querySelector(".card-name");
        const cardCost = renderedCard.querySelector(".card-cost");
        const cardAttack = renderedCard.querySelector(".card-attack");
        const cardHealth = renderedCard.querySelector(".card-health");
        const cardButton = renderedCard.querySelector(".card-action-button");

        // Assign the card values to the respective divs
        cardName.innerHTML = card.name;
        cardCost.innerHTML = card.cost;
        cardAttack.innerHTML = card.attack;
        cardHealth.innerHTML = card.health;

        // Add a unique ID to the card
        renderedCard.setAttribute("card-id", card.id);

        // Add event listener to card button
        cardButton.addEventListener("click", cardActionButton);

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
            const cardDOM = renderCard(user.hand[i]);
            user.handDiv.append(cardDOM);
            // Add a class of hidden for com's cards in hand
            if (user.name === com.name) {
                cardDOM.classList.add("hidden");
            }
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
            showHideCursor(false);
            // Com's turn
            return com.takeTurn();
        } else {
            player.turn = true;
            com.turn = false;
            showHideCursor(true);
            return;
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
        gameMessageDiv.innerHTML = msg;
        setTimeout(() => (gameMessageDiv.innerHTML = ""), 2500);
    }; // printMessage

    /**
     * Resets both pass counters to false
     * Invoked whenever a user takes an action other than passing
     * When both counters are true, the game will advance to the next round
     */
    const resetPassCounters = () => {
        player.passCounter = false;
        com.passCounter = false;
    };

    /**
     * Shows or hides the player's cursor based on turn
     * If true, show the cursor
     * If false, hide it
     * @param {Boolean} bool
     */
    const showHideCursor = (bool) => {
        switch (bool) {
            case true:
                containerDiv.classList.remove("hide-cursor");
                break;
            case false:
                containerDiv.classList.add("hide-cursor");
                break;
        }
    }; // showHideCursor

    /**
     * Updates the health value of the affected user
     * @param {Object} user User whose health was affected
     */
    const renderHealth = (user) => {
        user.healthDiv.innerHTML = user.health;
    }; // renderHealth

    // TODO: Disable and enable card action button to summon unit
    // To be used when declaring blockers
    // And also when opponent's turn
    // function(user, "disable") or function(user, "enable")
    // Loop through the user's hand to disable or enable all cards' action button

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
        for (let i = 0; i < num; i++) {
            // Remove top card from deck (end of array)
            const drawnCard = user.deck.pop();
            // Only push card into hand if user has < 10 cards
            if (user.hand.length < 10) {
                // Push drawn card to end of hand
                user.hand.push(drawnCard);
            }
            // TODO: Add an else statement to burn cards + animation
        }
        renderHand(user);
    }; // draw

    /**
     * When the card action button is clicked,
     * invoke the corresponding function
     * @param {Event} e
     */
    const cardActionButton = (e) => {
        // Assign the cardID to a variable
        const selectedCard = e.target.parentElement;
        const cardID = Number(selectedCard.getAttribute("card-id"));
        // Save element id as String into variable
        const userStr = selectedCard.parentElement.parentElement.id;
        // Use reference object to convert it to actual user object
        const user = reference[userStr];

        // Conditions for the various actions

        // Button clicked when user is defending and card is in a defense slot
        if (
            user.isDefending &&
            selectedCard.parentElement.classList.contains("defence-slot")
        ) {
            // Shift the card back from the def div to the backline
        }

        // Button clicked when user is defending
        if (user.isDefending) {
            // After clicking button, user can click on a defDiv next to assign the card to that def position
            // TODO: Add event listeners to all available defDivs
            const defDivs = user.frontline.querySelectorAll("defence-slot");
            // Remove defDivs with a card in it (i.e. don't add an event listener)
            // (How to check if a div is empty: https://bobbyhadz.com/blog/javascript-check-if-div-is-empty)
            const emptyDefDivs = [];
            for (let i = 0; i < defDivs.length; i++) {
                if (defDivs[i].childNodes.length === 0) {
                    // Animate available def divs
                    defDivs[i].classList.add("clickable-def-slot");
                    // Add to empty def divs array
                    emptyDefDivs.push(defDivs[i]);
                }
            }

            // Add an event listener to the empty def divs
            // Upon selecting a def div, do the following
            // - Remove the cardDOM from the backline
            // - Add the cardDOM to the selected def div
            // - Remove the listeners for all defDivs
            // - Remove the clickable-def-slot class from all empty def divs
            /****************************************/
            // Deciding which units to block which attacker
            // Click on a card's action button
            // Available defence slots light up
            // Click on a defence slot to transfer card to that slot
            // Can explore using event handlers with parameters, see: https://stackoverflow.com/a/10000178
            // Because I'll want a way to pass the cardDOM to the clicked defence slot
            // Add the relevant data to the unitsInBattle array once the defender hits the game button
            // TODO: Have an option to remove the defender also
        }

        // Button clicked on card in hand
        if (selectedCard.parentElement.classList.contains("hand")) {
            return summonUnit(user, cardID);
        }

        // Button clicked on card in backline
        else if (selectedCard.parentElement.classList.contains("backline")) {
            if (!user.attackToken) {
                return printMessage("You do not have the attack token!");
            }
            return shiftUnitFromBackToFrontline(user, cardID);
        }

        // Button clicked on card in frontline
        else if (selectedCard.parentElement.classList.contains("frontline")) {
            return shiftUnitFromFrontToBackline(user, cardID);
        }
    }; // cardActionButton

    /**
     * Summons the card from hand to the backline
     * @param {Object} user The user object that summoned a unit
     * @param {Number} card The id of the card that was clicked
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
        let selectedCard;
        let index;
        for (let i = 0; i < user.hand.length; i++) {
            // Convert both values to numbers
            if (Number(user.hand[i].id) === cardID) {
                selectedCard = user.hand[i];
                index = i;
                break;
            }
        }
        // Check whether user has sufficient resources to summon the selected card
        if (user.currentResources - selectedCard.cost < 0) {
            return printMessage(
                `Insufficient resources to summon ${selectedCard.name}!`
            );
        }

        // Remove selected card from hand array
        user.hand.splice(index, 1);
        // Add selected card to backline
        user.backline.push(selectedCard);

        // Render the DOM accordingly
        renderHand(user);
        renderBackline(user);

        // Reduce the user's resources accordingly
        user.currentResources -= selectedCard.cost;
        renderResources(user);

        // Increaase the summonCount accordingly
        user.summonCount++;

        // Reset the pass counters since an action was taken
        resetPassCounters();

        // Print the relevant message
        printMessage(`${user.name} has summoned ${selectedCard.name}`);

        // Pass the turn after summoning
        toggleTurn(user);
    }; // summonUnit

    /**
     * Shifts card from backline to frontline
     * @param {Object} user The user object that shifted the unit
     * @param {Number} card The id of the card that was clicked
     */
    const shiftUnitFromBackToFrontline = (user, cardID) => {
        // Search for the card in the backline array
        let selectedCard;
        for (let i = 0; i < user.backline.length; i++) {
            // Convert both values to numbers
            if (Number(user.backline[i].id) === cardID) {
                selectedCard = user.backline[i];
                // Remove selected card from backline array
                user.backline.splice(i, 1);
                break;
            }
        }
        // Add selected card to frontline
        user.frontline.push(selectedCard);

        // Render the DOM accordingly
        renderBackline(user);
        renderFrontline(user);
    }; // shiftUnitFromBackToFrontline

    /**
     * Shifts card from frontline to backline
     * @param {Object} user The user object that shifted the unit
     * @param {Number} card The id of the card that was clicked
     */
    const shiftUnitFromFrontToBackline = (user, cardID) => {
        // Search for the card in the frontline array
        let selectedCard;
        for (let i = 0; i < user.frontline.length; i++) {
            // Convert both values to numbers
            if (Number(user.frontline[i].id) === cardID) {
                selectedCard = user.frontline[i];
                // Remove selected card from frontline array
                user.frontline.splice(i, 1);
                break;
            }
        }
        // Add selected card to backline
        user.backline.push(selectedCard);

        // Render the DOM accordingly
        renderFrontline(user);
        renderBackline(user);
    }; // shiftUnitFromFrontToBackline

    /* Game Action Functions */

    /*****************************
     * Game Management Functions *
     *****************************/
    /**
     * Reset everything
     */
    const init = () => {
        // Reset both decks
        player.deck = defaultPlayerDeck;
        com.deck = defaultComDeck;

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

        // Set round to 0
        roundNumber = 0;

        // Reset all battle states
        player.isAttacking = false;
        player.isDefending = false;
        com.isAttacking = false;
        com.isDefending = false;

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
        /** Actions that a user can take:
         * Summon a unit (Turn taken care of by action of summoning)
         * Declare an attack
         * Declare blockers & finalise the attack
         * Pass the turn
         */
        // If user has placed at least one unit in the frontline, declare an attack
        if (user.frontline.length > 0) {
            // Set attack token to false
            user.attackToken = false;
            // Enter the battle sequence
            return declareAttackers(user);
        }

        // Invoke the resolve battle function when the defender hits the game button
        if (user.isDefending) {
            return resolveBattle(user);
        }

        // Pass the turn if user took no action
        user.passCounter = true;
        // If both players passed, advance to a new round
        if (player.passCounter && com.passCounter) {
            return advanceRound();
        }
        printMessage(`${user.name} has passed`);
        return toggleTurn(user);
    }; // hitGameButton

    /**
     * Declares the attacker for the attacking user
     * @param {Object} attacker The user that is attacking
     */
    const declareAttackers = (attacker) => {
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
        // Do the necessary calculations for the units and the defender's health
        // At the end, remember to clear the defender's frontline of defence divs
    };

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
            showHideCursor(true);
        } else {
            player.attackToken = false;
            com.attackToken = true;
            player.turn = false;
            com.turn = true;
            showHideCursor(false);
            // Com takes turn first
            com.takeTurn();
        }
    }; // advanceRound

    /* Game Management Functions */

    /*******************
     * Event Listeners *
     *******************/
    gameButtonDiv.addEventListener("click", () => hitGameButton(player));

    /****************
     * Run the game *
     ****************/
    init();
    gameStart();
};
