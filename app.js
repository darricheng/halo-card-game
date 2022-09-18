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
    let roundNumber = 1;

    /****************
     * User Objects *
     ****************/
    // Player
    const player = {
        deck: defaultPlayerDeck,
        health: 20,
        maxResources: 1,
        currentResources: 1,
        hand: [],
        backline: [],
        battle: [],
        attackToken: true,
        passCounter: false,
        // Player divs
        deckDiv: document.querySelector("#player-deck"),
        handDiv: document.querySelector("#player-hand"),
        healthDiv: document.querySelector("#player-health"),
        resourcesDiv: document.querySelector("#player-resources"),
        tokenDiv: document.querySelector("#player-token"),
        boardDiv: document.querySelector("#player-board"),
        battleDiv: document.querySelector("#player-battle"),
    };

    // Computer
    const com = {
        deck: defaultComDeck,
        health: 20,
        maxResources: 1,
        currentResources: 1,
        hand: [],
        backline: [],
        battle: [],
        attackToken: true,
        passCounter: false,
        // Com divs
        deckDiv: document.querySelector("#com-deck"),
        handDiv: document.querySelector("#com-hand"),
        healthDiv: document.querySelector("#com-health"),
        resourcesDiv: document.querySelector("#com-resources"),
        tokenDiv: document.querySelector("#com-token"),
        boardDiv: document.querySelector("#com-board"),
        battleDiv: document.querySelector("#com-battle"),
    };

    /*********************
     * Support Functions *
     *********************/
    /**
     * Fisher-Yates Shuffle
     * Shuffles the array in-place then returns it
     * Source: https://bost.ocks.org/mike/shuffle/
     * @param {Array} array
     * @returns {Array}
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
     * Draws num card(s) for the indicated user
     * Then add the card(s) to the hand
     * @param {Object} user
     * @param {Number} num
     */
    const draw = (user, num = 1) => {
        for (let i = 0; i < num; i++) {
            // Remove top card from deck (end of array)
            const drawnCard = user.deck.pop();
            // Push drawn card to end of hand
            user.hand.push(drawnCard);
            // Render the card
            const cardDOM = renderCard(drawnCard);
            // Only push card into hand if user has < 10 cards
            if (user.hand.length < 10) {
                user.handDiv.append(cardDOM);
            }
            // TODO: Add a class of hidden for cards drawn by the opponent
        }
    };

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

        // Assign the card values to the respective divs
        cardName.innerHTML = card.name;
        cardCost.innerHTML = card.cost;
        cardAttack.innerHTML = card.attack;
        cardHealth.innerHTML = card.health;

        return renderedCard;
    }; // renderCard

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

        // TODO: Do I need to attach a unique id to every card?
        // I think it makes it easier to identify the individual cards when
        // manipulating the DOM and editing the data in the respective arrays

        // Set health to full
        player.health = 20;
        com.health = 20;

        // Set resources to starting values
        player.maxResources = 1;
        com.maxResources = 1;
        player.currentResources = 1;
        com.currentResources = 1;

        // Clear hands
        player.hand = [];
        com.hand = [];

        // Clear board
        player.backline = [];
        com.backline = [];
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
    gameStart();
};
