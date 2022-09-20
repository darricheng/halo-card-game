window.onload = () => {
    /*****************
     * Page Elements *
     *****************/
    // Board
    const gameButtonDiv = document.querySelector("#game-button");
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

    /****************
     * User Objects *
     ****************/
    /* Some Definitions */
    // Max resources: The maximum for that round
    // Current resources: The amount left for that round
    // Pass counter: Whether the player passed for the round. Two passes advance the round.
    // Turn: Whether the player has action priority.

    // TODO: I might need a total summon counter, because backline and frontline are separate arrays

    // Player
    const player = {
        name: "player",
        deck: defaultPlayerDeck,
        health: 0,
        maxResources: 0,
        currentResources: 0,
        hand: [],
        backline: [],
        frontline: [],
        attackToken: true,
        passCounter: false,
        turn: true,
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
        hand: [],
        backline: [],
        frontline: [],
        attackToken: true,
        passCounter: false,
        turn: false,
        // Com divs
        deckDiv: document.querySelector("#com-deck"),
        handDiv: document.querySelector("#com-hand"),
        healthDiv: document.querySelector("#com-health"),
        resourcesDiv: document.querySelector("#com-resources"),
        resourceBars: document.querySelectorAll("#com-resources .resource-bar"),
        tokenDiv: document.querySelector("#com-token"),
        backlineDiv: document.querySelector("#com-backline"),
        frontlineDiv: document.querySelector("#com-frontline"),
    };

    // For referencing the respective objects when provided with a string
    // Source: https://stackoverflow.com/a/10953396
    const reference = { player: player, com: com };

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
            if (user.name === "com") {
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
        if (user.name === "player") {
            player.turn = false;
            com.turn = true;
        } else {
            player.turn = true;
            com.turn = false;
        }
    }; // toggleTurn

    const renderResources = (user) => {
        // Get inner div for the resources number
        const resourceValue =
            user.resourcesDiv.querySelector(".current-resources");
        // Set the inner div to the current resources
        resourceValue.innerHTML = user.currentResources;
        console.log(user);

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
    };

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
        // Button clicked on card in hand
        if (selectedCard.parentElement.classList.contains("hand")) {
            return summonUnit(user, cardID);
        }
        // Button clicked on card in backline
        if (selectedCard.parentElement.classList.contains("backline")) {
            return shiftUnitFromBackToFrontline(user, cardID);
        }
        // Button clicked on card in frontline
        if (selectedCard.parentElement.classList.contains("frontline")) {
            return shiftUnitFromFrontToBackline(user, cardID);
        }
    }; // cardActionButton

    /**
     * Summons the card from hand to the backline
     * @param {Object} user The user object that summoned a unit
     * @param {Number} card The id of the card that was clicked
     */
    const summonUnit = (user, cardID) => {
        // Search for the card in the hand array
        let selectedCard;
        for (let i = 0; i < user.hand.length; i++) {
            // Convert both values to numbers
            if (Number(user.hand[i].id) === cardID) {
                selectedCard = user.hand[i];
                // Remove selected card from hand array
                user.hand.splice(i, 1);
                break;
            }
        }
        // Add selected card to backline
        user.backline.push(selectedCard);

        // Render the DOM accordingly
        renderHand(user);
        renderBackline(user);

        // TODO: Reactivate the toggleTurn below
        // toggleTurn(user);
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

        // Set resources to round 0 values
        player.maxResources = 0;
        com.maxResources = 0;
        player.currentResources = 0;
        com.currentResources = 0;

        // Clear hands
        player.hand = [];
        com.hand = [];

        // Clear board
        player.backline = [];
        com.backline = [];

        // Set round to 0
        roundNumber = 0;

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
        console.log("Game button hit by " + user.name);
    };

    /**
     * When both players pass, this function will be invoked to advance the round
     * Then set the relevant states accordingly
     */
    const advanceRound = () => {
        // Advance round
        roundNumber++;

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
        } else {
            player.attackToken = false;
            com.attackToken = true;
            player.turn = false;
            com.turn = true;
        }
    }; // advanceRound

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
