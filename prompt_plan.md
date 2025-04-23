Okay, this is a detailed specification. Let's break this down into manageable steps, prioritizing core functionality first. We'll focus on getting a basic game loop working with simplified features before adding complexity.

## **Phase 1: Core Game Loop (Single Match, No Matchmaking)**

This phase will focus on getting a single game instance running, with two players, basic joker mechanics, and a simple scoring system.

**Blueprint:**

1.  **Backend: Project Setup & Basic Card Dealing**
    *   Set up Node.js project with Express and Socket.IO.
    *   Create basic card and deck classes/functions.
    *   Implement shuffling and dealing cards to players.
2.  **Frontend: Basic UI & Card Display**
    *   Set up React project with basic routing.
    *   Create UI components to display cards in hand and community cards.
    *   Establish Socket.IO connection to the backend.
3.  **Backend: Game Round Logic**
    *   Implement the core game round structure (Pre-flop, Flop, Turn, River).
    *   Handle drawing cards for each stage.
4.  **Frontend: Betting UI**
    *   Implement a simple betting UI (Fold, Check, Bet).
    *   Send betting actions to the backend.
5.  **Backend: Basic Scoring**
    *   Implement a basic poker hand evaluation function (no jokers yet).
    *   Determine the winner of the round based on hand rank.
6.  **Frontend: Scoring Display**
    *   Display the winning hand and the winner of the round.
7.  **Backend: Basic Joker Implementation**
    *   Create a small set of basic joker types with simple effects.
    *   Implement logic to apply joker effects to the hand evaluation.
8.  **Frontend: Joker Display & Selection**
    *   Display available jokers to players.
    *   Allow players to select jokers to use in their hand.
9.  **Backend: Game Loop Integration**
    *   Wire up all the backend components to run a full game round.
10. **Frontend: Game Loop Integration**
    *   Wire up all the frontend components to display the game state and interact with the backend.

**Iterative Breakdown:**

Now, let's break down these steps into smaller, iterative chunks:

**1. Backend: Project Setup & Basic Card Dealing**

*   **Step 1.1**: Set up Node.js project with Express and Socket.IO.
*   **Step 1.2**: Define card suits, ranks, and a basic Card class.
*   **Step 1.3**: Implement a Deck class with shuffling functionality.
*   **Step 1.4**: Implement dealing cards from the deck to players.

**2. Frontend: Basic UI & Card Display**

*   **Step 2.1**: Set up React project with basic routing.
*   **Step 2.2**: Create a Card component to display individual cards.
*   **Step 2.3**: Establish Socket.IO connection to the backend.
*   **Step 2.4**: Create a PlayerHand component to display cards in the player's hand.

**3. Backend: Game Round Logic**

*   **Step 3.1**: Implement Pre-flop logic: deal 2 cards to each player.
*   **Step 3.2**: Implement Flop logic: deal 3 community cards.
*   **Step 3.3**: Implement Turn logic: deal 1 community card.
*   **Step 3.4**: Implement River logic: deal 1 community card.

**4. Frontend: Betting UI**

*   **Step 4.1**: Create buttons for Fold, Check, and Bet.
*   **Step 4.2**: Implement basic event handlers for the buttons.
*   **Step 4.3**: Send betting actions to the backend via Socket.IO.

**5. Backend: Basic Scoring**

*   **Step 5.1**: Implement a function to evaluate a poker hand's rank (High Card, Pair, Two Pair, etc.). *Initially, only consider standard poker hands without Jokers.*
*   **Step 5.2**: Implement logic to determine the winner of the round based on the hand rank.

**6. Frontend: Scoring Display**

*   **Step 6.1**: Display the winning hand for each player.
*   **Step 6.2**: Display the winner of the round.

**7. Backend: Basic Joker Implementation**

*   **Step 7.1**: Define a Joker class with a basic effect (e.g., +X chips).
*   **Step 7.2**: Add a few initial Joker instances to the game.
*   **Step 7.3**: Implement logic to allow players to select a Joker.
*   **Step 7.4**: Implement logic to apply the Joker effect to the hand evaluation.

**8. Frontend: Joker Display & Selection**

*   **Step 8.1**: Display available Jokers to players.
*   **Step 8.2**: Allow players to select a Joker to use in their hand.
*   **Step 8.3**: Display the selected Joker.

**9. Backend: Game Loop Integration**

*   **Step 9.1**: Combine all backend components to run a full game round: dealing, betting, scoring, and Joker effects.
*   **Step 9.2**: Handle round transitions.
*   **Step 9.3**: Track game state.

**10. Frontend: Game Loop Integration**

*   **Step 10.1**: Combine all frontend components to display the game state and interact with the backend.
*   **Step 10.2**: Display the round number.
*   **Step 10.3**: Display the game state.

**Further Refinement (Example - Step 1.1):**

Let's refine **Step 1.1: Set up Node.js project with Express and Socket.IO.**

*   **Step 1.1.1**: Create a new directory for the backend.
*   **Step 1.1.2**: Run `npm init -y` to create `package.json`.
*   **Step 1.1.3**: Install Express: `npm install express`.
*   **Step 1.1.4**: Install Socket.IO: `npm install socket.io`.
*   **Step 1.1.5**: Create `index.js` and set up a basic Express server.
*   **Step 1.1.6**: Integrate Socket.IO with the Express server.
*   **Step 1.1.7**: Add a basic Socket.IO connection handler (console log on connection).

I'll stop the iterative breakdown here. This should give you a good sense of the granularity we're aiming for. Each of these steps can be translated into a prompt for the LLM.

Now, let's turn these steps into prompts for a code-generation LLM, keeping in mind the constraints. We'll start with the refined steps for **Step 1.1**.

***

## **Prompts for Step 1.1: Backend Project Setup**

**Prompt 1.1.1:**

```text
Create a new directory named "backend" for a Node.js project.  No code is required, just the command to create the directory.
```

**Prompt 1.1.2:**

```text
Navigate to the "backend" directory and run `npm init -y` to create a `package.json` file with default settings. No code is required, just the command to initialize npm.
```

**Prompt 1.1.3:**

```text
In the "backend" directory, install the Express framework using npm. Provide the npm command.
```

**Prompt 1.1.4:**

```text
In the "backend" directory, install the Socket.IO library using npm. Provide the npm command.
```

**Prompt 1.1.5:**

```text
Create a file named `index.js` in the "backend" directory.  Write the code for a basic Express server that listens on port 3000. The server should respond with "Hello, world!" when a user accesses the root route.
```

**Prompt 1.1.6:**

```text
Modify the `index.js` file. Integrate Socket.IO with the existing Express server. The Socket.IO server should listen on the same port as the Express server (port 3000).
```

**Prompt 1.1.7:**

```text
Modify the `index.js` file. Add a basic Socket.IO connection handler that logs "A user connected" to the console when a new client connects to the server.
```

This breaks down the initial setup into very small, manageable steps. Each prompt builds directly on the previous one, ensuring no orphaned code.

Next we'll continue with step **1.2 Define card suits, ranks, and a basic Card class.**

***

## **Prompts for Step 1.2: Define Card Suits, Ranks, and a Basic Card Class**

**Prompt 1.2.1:**

```text
Modify the `index.js` file. Define an enum (or equivalent constant object if enums are not readily available) for card suits: Clubs, Diamonds, Hearts, Spades.
```

**Prompt 1.2.2:**

```text
Modify the `index.js` file. Define an array (or equivalent constant object) for card ranks: 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace.
```

**Prompt 1.2.3:**

```text
Modify the `index.js` file.  Create a JavaScript class named `Card`. The `Card` class should have a constructor that takes `suit` and `rank` as arguments. The `Card` class should have a `toString()` method that returns a string representation of the card (e.g., "Ace of Spades").
```

**Prompt 1.2.4:**

```text
Modify the `index.js` file. Add a function that allows you to test the `Card` class. Create an instance of a card, output the card to the console, and check its toString value.
```

This provides clear instructions, focuses on small increments, and avoids ambiguity.  The prompts build upon the `index.js` file created in the previous step, ensuring continuous integration.

Next, prompts for **1.3 Implement a Deck class with shuffling functionality**.

***

## **Prompts for Step 1.3: Implement a Deck Class with Shuffling Functionality**

**Prompt 1.3.1:**

```text
Modify the `index.js` file. Create a JavaScript class named `Deck`. The `Deck` class should have a constructor that initializes an empty array to hold the cards.
```

**Prompt 1.3.2:**

```text
Modify the `index.js` file. Add a method named `createDeck` to the `Deck` class. This method should create a standard 52-card deck by iterating through the suits and ranks defined previously and creating a `Card` object for each combination, adding it to the deck's card array.
```

**Prompt 1.3.3:**

```text
Modify the `index.js` file. Add a method named `shuffle` to the `Deck` class. This method should shuffle the cards in the deck's card array using the Fisher-Yates shuffle algorithm.
```

**Prompt 1.3.4:**

```text
Modify the `index.js` file. Add a method named `getCards` to the `Deck` class. This method should return all of the `Cards` in the `Deck`.
```

**Prompt 1.3.5:**

```text
Modify the `index.js` file. Add a method named `printDeck` to the `Deck` class. This method should log each card in the deck to the console using the `toString()` method of the `Card` class.
```

**Prompt 1.3.6:**

```text
Modify the `index.js` file. Add a function that allows you to test the `Deck` class. Create an instance of a deck, call `createDeck()`, call `shuffle()`, and then log the deck to the console using `printDeck()`.
```

Now we move on to **1.4 Implement dealing cards from the deck to players.**

***

## **Prompts for Step 1.4: Implement Dealing Cards From the Deck to Players**

**Prompt 1.4.1:**

```text
Modify the `index.js` file. Add a method named `dealCard` to the `Deck` class. This method should remove and return the top card from the deck's card array. If the deck is empty, it should return null or undefined.
```

**Prompt 1.4.2:**

```text
Modify the `index.js` file. Outside of the Deck class, create a function called `createPlayers` which takes an integer as an argument. This function will return an array of objects which are player objects. The number of players created will be the integer that is passed in. Each player object should have an id and a hand property which is initialized as an empty array.
```

**Prompt 1.4.3:**

```text
Modify the `index.js` file. Add a function named `dealInitialCards` that takes a `Deck` object and an array of `player` objects as arguments. For each player, deal two cards from the deck and add them to the player's hand.
```

**Prompt 1.4.4:**

```text
Modify the `index.js` file. Add a function that allows you to test the `dealCard`, `createPlayers`, and `dealInitialCards` functions. Create a deck, shuffle it, create two players, deal initial hands to the players, and then print each player's hand to the console.
```

At this point, we have a basic backend with card dealing. We will start to create the React frontend.

## **Prompts for Step 2.1: Frontend: Set up React project with basic routing**

**Context:** Assume the frontend project is in a directory named "frontend" separate from the "backend" directory.

**Prompt 2.1.1:**

```text
Create a new React project using Vite in a directory named "frontend". Use TypeScript. Do not create a git repository. Provide the commands to create the React project.
```

**Prompt 2.1.2:**

```text
In the "frontend" directory, install the `react-router-dom` library using npm. Provide the npm command.
```

**Prompt 2.1.3:**

```text
Modify the `frontend/src/App.tsx` file. Set up basic routing using `react-router-dom`. Create two routes: one for the main game view (path "/") and another for a placeholder "About" page (path "/about"). The components for these routes should just display simple text for now (e.g., "Game View" and "About Page").
```

We continue on with **2.2: Create a Card component to display individual cards.**

## **Prompts for Step 2.2: Frontend: Create a Card Component to Display Individual Cards**

**Context:** Working within the "frontend" React project.

**Prompt 2.2.1:**

```text
Create a new file named `frontend/src/components/Card.tsx`. Create a functional React component named `Card` that accepts two props: `suit` (string) and `rank` (string). The component should display the suit and rank of the card. Use a simple `<div>` element for now.
```

**Prompt 2.2.2:**

```text
Modify the `Card` component in `frontend/src/components/Card.tsx`. Add styling to the component to visually represent the card, including different colors for different suits (e.g., red for Hearts and Diamonds, black for Clubs and Spades). Use inline styles or CSS classes.
```

**Prompt 2.2.3:**

```text
Modify the `frontend/src/App.tsx` file. Import the `Card` component. In the main game view route ("/") render several instances of the `Card` component with different suits and ranks.
```

Now we move on to **2.3: Establish Socket.IO connection to the backend.**

## **Prompts for Step 2.3: Frontend: Establish Socket.IO Connection to the Backend**

**Context:** Continuing within the "frontend" React project.  Assume the backend server is running on `http://localhost:3000`.

**Prompt 2.3.1:**

```text
In the "frontend" directory, install the `socket.io-client` library using npm. Provide the npm command.
```

**Prompt 2.3.2:**

```text
Modify the `frontend/src/App.tsx` file. Import the `io` function from `socket.io-client`. Establish a connection to the Socket.IO server running on `http://localhost:3000` when the component mounts. Store the socket instance in a state variable using `useState`.
```

**Prompt 2.3.3:**

```text
Modify the `frontend/src/App.tsx` file. Add a `useEffect` hook that runs when the component mounts. Inside the `useEffect` hook, add a listener for a Socket.IO event named "connect". When the "connect" event is received, log "Connected to server" to the console.
```

**Prompt 2.3.4:**

```text
Modify the `frontend/src/App.tsx` file. Add a cleanup function to the `useEffect` hook to disconnect the socket when the component unmounts.
```

Now we move on to **2.4: Create a PlayerHand component to display cards in the player's hand.**

## **Prompts for Step 2.4: Frontend: Create a PlayerHand Component to Display Cards in the Player's Hand**

**Context:** Continuing within the "frontend" React project.

**Prompt 2.4.1:**

```text
Create a new file named `frontend/src/components/PlayerHand.tsx`. Create a functional React component named `PlayerHand` that accepts a prop named `cards` which is an array of card objects (each card object should have `suit` and `rank` properties).
```

**Prompt 2.4.2:**

```text
Modify the `PlayerHand` component in `frontend/src/components/PlayerHand.tsx`. Inside the component, iterate over the `cards` array and render a `Card` component for each card. Pass the `suit` and `rank` of each card as props to the `Card` component.
```

**Prompt 2.4.3:**

```text
Modify the `frontend/src/App.tsx` file. Create a state variable named `playerHand` using `useState`. Initialize it with an empty array.
```

**Prompt 2.4.4:**

```text
Modify the `frontend/src/App.tsx` file. In the `useEffect` hook (where you establish the Socket.IO connection), add a listener for a Socket.IO event named "deal_hand". When the "deal_hand" event is received, update the `playerHand` state variable with the data received from the server (assuming the server sends an array of card objects).
```

**Prompt 2.4.5:**

```text
Modify the `frontend/src/App.tsx` file. Render the `PlayerHand` component, passing the `playerHand` state variable as the `cards` prop.
```

These prompts establish the link between frontend and backend. Now that the React setup is completed, we can move to step 3 to implement the round logic in the backend.


Okay, let's continue with **Step 3: Backend: Game Round Logic**.  We'll be building upon the `index.js` file in the "backend" directory.

## **Prompts for Step 3.1: Backend: Implement Pre-flop Logic: Deal 2 Cards to Each Player**

**Context:** Continuing from the previous backend prompts.  Assume we have the `Card`, `Deck`, `createPlayers` and `dealInitialCards` functions defined.

**Prompt 3.1.1:**

```text
Modify the `index.js` file. Create a function called `startGame` which takes an array of players as an argument. In the `startGame` function, instantiate a new Deck, shuffle the deck, and deal initial cards to each player using the `dealInitialCards` function.
```

**Prompt 3.1.2:**

```text
Modify the `index.js` file. Add a function to send the players' hands to the client (frontend) through Socket.IO. Within this function, for each player, emit a "deal_hand" event to the client. The event should include the player's hand (an array of card objects) as data.
```

**Prompt 3.1.3:**

```text
Modify the `index.js` file. Within the Socket.IO connection handler, create an array with two players using the `createPlayers` function. Call the `startGame` function with the array of players as the argument. After the players hands have been dealt, call the function to send players hands to the clients, to display the cards.
```

These prompts are intended to continue adding incrementally and connecting the pieces.

Next let's create prompts for **Step 3.2 Implement Flop logic: Deal 3 community cards.**

## **Prompts for Step 3.2: Backend: Implement Flop Logic: Deal 3 Community Cards**

**Context:** Continuing from the previous backend prompts.

**Prompt 3.2.1:**

```text
Modify the `index.js` file. Create a function called `dealFlop` that takes a `Deck` object as an argument. This function should deal three cards from the deck and return them as an array.
```

**Prompt 3.2.2:**

```text
Modify the `index.js` file. Inside the `startGame` function, after dealing initial hands to players, call the `dealFlop` function to deal the flop. Store the flop cards in a variable.
```

**Prompt 3.2.3:**

```text
Modify the `index.js` file. Add a Socket.IO event emitter inside the `startGame` function to send the flop cards to all connected clients. The event name should be "deal_flop", and the data should be the array of flop cards.
```

Now we add the frontend to handle the community cards.

## **Prompts for Step 3.2 - React Frontend: Implement Flop Logic**

**Context:** Continuing from the previous frontend prompts.

**Prompt 3.2.1:**

```text
Modify the `/frontend/src/App.tsx` file. Create a new state variable named `communityCards` using `useState`. Initialize it with an empty array.
```

**Prompt 3.2.2:**

```text
Modify the `/frontend/src/App.tsx` file. Create a new file `/frontend/src/components/CommunityCards.tsx`. Create a `CommunityCards` component. The new component should accept a prop named `cards`. Display all the cards passed as the cards prop using the `<Card />` component. The new component should display the text `Community Cards:` above the cards.
```

**Prompt 3.2.3:**

```text
Modify the `/frontend/src/App.tsx` file. Render the `CommunityCards` component that you just created. Pass in the `communityCards` that you just created as the cards prop.
```

**Prompt 3.2.4:**

```text
Modify the `/frontend/src/App.tsx` file. Add a `useEffect` hook to listen to the "deal_flop" event you just created. The hook should update the communityCards state variable to be the value of the event data.
```

Ok we now have a React App setup to deal cards and display a player's hand and community cards.

We can continue on by adding support for the **Turn:**

## **Prompts for Step 3.3: Backend: Implement Turn Logic: Deal 1 Community Card**

**Context:** Continuing from the previous backend prompts.

**Prompt 3.3.1:**

```text
Modify the `index.js` file. Create a function called `dealTurn` that takes a `Deck` object as an argument. This function should deal one card from the deck and return it.
```

**Prompt 3.3.2:**

```text
Modify the `index.js` file. Inside the `startGame` function, after dealing the flop, call the `dealTurn` function to deal the turn card. Store the turn card in a variable.
```

**Prompt 3.3.3:**

```text
Modify the `index.js` file. Add a Socket.IO event emitter inside the `startGame` function to send the turn card to all connected clients. The event name should be "deal_turn", and the data should be the turn card.
```

## **Prompts for Step 3.3 - React Frontend: Implement Turn Logic**

**Context:** Continuing from the previous frontend prompts.

**Prompt 3.3.1:**

```text
Modify the `/frontend/src/App.tsx` file. Modify the `communityCards` state variable you created earlier to be an array that holds each card object instead of replacing all of them at once.

For example:
communityCards = [{card_1}, {card_2}, {card_3}]
instead of
communityCards = [{card_3}]
```

**Prompt 3.3.2:**

```text
Modify the `/frontend/src/App.tsx` file. Add a `useEffect` hook to listen to the "deal_turn" event you just created. The hook should append the data from the `deal_turn` event to the array in the `communityCards` state variable.
```

And then finally we move to **River**

## **Prompts for Step 3.4: Backend: Implement River Logic: Deal 1 Community Card**

**Context:** Continuing from the previous backend prompts.

**Prompt 3.4.1:**

```text
Modify the `index.js` file. Create a function called `dealRiver` that takes a `Deck` object as an argument. This function should deal one card from the deck and return it.
```

**Prompt 3.4.2:**

```text
Modify the `index.js` file. Inside the `startGame` function, after dealing the turn, call the `dealRiver` function to deal the river card. Store the river card in a variable.
```

**Prompt 3.4.3:**

```text
Modify the `index.js` file. Add a Socket.IO event emitter inside the `startGame` function to send the river card to all connected clients. The event name should be "deal_river", and the data should be the river card.
```

## **Prompts for Step 3.4 - React Frontend: Implement River Logic**

**Context:** Continuing from the previous frontend prompts.

**Prompt 3.4.1:**

```text
Modify the `/frontend/src/App.tsx` file. Add a `useEffect` hook to listen to the "deal_river" event you just created. The hook should append the data from the `deal_river` event to the array in the `communityCards` state variable.
```

Now that the game logic for Pre-Flop, Flop, Turn, and River is implemented in both the frontend and backend, we can move on to Step 4 which is the betting UI.


Okay, let's proceed with **Step 4: Frontend: Betting UI**. We will add buttons and logic to allow players to Fold, Check, and Bet. This will involve both frontend and backend modifications, but we'll start with the UI.

## **Prompts for Step 4.1: Frontend: Create Buttons for Fold, Check, and Bet**

**Context:** Continuing within the "frontend" React project, specifically in the `App.tsx` file.

**Prompt 4.1.1:**

```text
Modify the `frontend/src/App.tsx` file. Create a new `div` element below the `PlayerHand` and `CommunityCards` components. Inside this `div`, create three buttons with the following labels: "Fold", "Check", and "Bet".
```

**Prompt 4.1.2:**

```text
Modify the `frontend/src/App.tsx` file. Add styling to the buttons to make them visually distinct. Use inline styles or CSS classes.
```

Next, we need to implement the event handling.

## **Prompts for Step 4.2: Frontend: Implement Basic Event Handlers for the Buttons**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 4.2.1:**

```text
Modify the `frontend/src/App.tsx` file. Create three functions: `handleFold`, `handleCheck`, and `handleBet`. For now, each function should simply log the corresponding action ("Fold", "Check", "Bet") to the console.
```

**Prompt 4.2.2:**

```text
Modify the `frontend/src/App.tsx` file. Attach the `handleFold` function to the "Fold" button's `onClick` event, the `handleCheck` function to the "Check" button's `onClick` event, and the `handleBet` function to the "Bet" button's `onClick` event.
```

Now, let's connect the frontend actions to the backend via Socket.IO.

## **Prompts for Step 4.3: Frontend: Send Betting Actions to the Backend via Socket.IO**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 4.3.1:**

```text
Modify the `frontend/src/App.tsx` file. In the `handleFold` function, emit a Socket.IO event named "player_fold" to the backend.
```

**Prompt 4.3.2:**

```text
Modify the `frontend/src/App.tsx` file. In the `handleCheck` function, emit a Socket.IO event named "player_check" to the backend.
```

**Prompt 4.3.3:**

```text
Modify the `frontend/src/App.tsx` file. For the `handleBet` function:
    1.  Add a prompt requesting the user to enter a bet amount.
    2.  If the user enters a valid bet amount, emit a Socket.IO event named "player_bet" to the backend. The event data should be an object containing the bet amount (e.g., `{ amount: 50 }`).
```

Now, we need to handle these events on the backend.

## **Prompts for Step 4 - Backend: Handle Betting Actions from the Frontend**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 4.3.4:**

```text
Modify the `index.js` file. Inside the Socket.IO connection handler, add a listener for the "player_fold" event. When the event is received, log "Player folded" to the console.
```

**Prompt 4.3.5:**

```text
Modify the `index.js` file. Inside the Socket.IO connection handler, add a listener for the "player_check" event. When the event is received, log "Player checked" to the console.
```

**Prompt 4.3.6:**

```text
Modify the `index.js` file. Inside the Socket.IO connection handler, add a listener for the "player_bet" event. When the event is received, log "Player bet [amount]" to the console, replacing `[amount]` with the actual bet amount received from the client.
```

This completes the initial implementation of the betting UI and communication with the backend.

Next, we need to move on to implementing the basic scoring mechanism, which is Step 5.

Okay, let's proceed with **Step 5: Backend: Basic Scoring**. This involves implementing a basic poker hand evaluation function and determining the winner of the round. We'll start with the hand evaluation logic. We are still working on `index.js`

## **Prompts for Step 5.1: Backend: Implement a Function to Evaluate a Poker Hand's Rank**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.  Assume we have the `Card` class and the suit/rank definitions. Focus on standard poker hands without jokers for this step.

**Prompt 5.1.1:**

```text
Modify the `index.js` file. Create a function called `evaluateHand` that takes an array of `Card` objects (representing a player's hand and community cards) as input. This function should return an object containing the hand's rank (e.g., "High Card", "Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush") and, for tie-breaking purposes, relevant kicker card(s).

For this initial implementation, only consider the following hand ranks:
    *   Royal Flush
    *   Straight Flush
    *   Four of a Kind
    *   Full House
    *   Flush
    *   Straight
    *   Three of a Kind
    *   Two Pair
    *   Pair
    *   High Card
```

**Prompt 5.1.2:**

```text
Modify the `index.js` file. Inside the `evaluateHand` function, implement the logic to detect each of the poker hands listed above. Refer to standard poker hand ranking rules.  Ensure your function can handle different card ranks (Ace high/low for straights).
```

**Prompt 5.1.3:**

```text
Modify the `index.js` file. Add helper functions to `evaluateHand` to determine the rank of the hand.
```

Now, let's implement the logic to determine the winner based on hand rank.

## **Prompts for Step 5.2: Backend: Implement Logic to Determine the Winner of the Round Based on the Hand Rank**

**Context:** Continuing within the "backend" Node.js project, `index.js` file. Assume the `evaluateHand` function is defined.

**Prompt 5.2.1:**

```text
Modify the `index.js` file. Create a function called `determineWinner` that takes an array of player objects as input. Each player object should have a `hand` property (an array of `Card` objects). This function should use the `evaluateHand` function to determine the rank of each player's hand and then return the player object with the highest-ranking hand. In case of a tie, return null.
```

**Prompt 5.2.2:**

```text
Modify the `index.js` file. Enhance the `determineWinner` function to handle ties. If there's a tie in hand rank, use the kicker cards returned by the `evaluateHand` function to break the tie. If the tie cannot be broken, return null.
```

**Prompt 5.2.3:**

```text
Modify the `index.js` file. Update the `startGame` function to use these helper functions. After the river is dealt, use the functions `evaluateHand` and `determineWinner` to select a winner.
```

Now we need to integrate the functions into the main game flow.

## **Prompts for Step 5.3: Backend: Integrate Scoring Logic into the Game Loop**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 5.3.1:**

```text
Modify the `index.js` file. Inside the Socket.IO connection handler, after the "deal_river" event (or after the betting round, if implemented), call the `determineWinner` function with the array of players.
```

**Prompt 5.3.2:**

```text
Modify the `index.js` file. After calling the `determineWinner` function, emit a Socket.IO event named "round_result" to all connected clients. The event data should include the winning player's ID (or null if there was a tie) and the winning hand (the object returned by `evaluateHand`).
```

This sets up the backend scoring logic. Next, we need to display the results on the frontend.

Okay, let's proceed to **Step 6: Frontend: Scoring Display**. This involves displaying the winning hand and the winner of the round on the frontend.

## **Prompts for Step 6.1: Frontend: Display the Winning Hand for Each Player**

**Context:** Continuing within the "frontend" React project, specifically in the `App.tsx` file.

**Prompt 6.1.1:**

```text
Modify the `frontend/src/App.tsx` file. Create a new state variable named `winningHand` using `useState`. Initialize it with an empty object. This state will hold the winning hand data received from the backend.
```

**Prompt 6.1.2:**

```text
Modify the `frontend/src/App.tsx` file. In the `useEffect` hook (where you establish the Socket.IO connection), add a listener for a Socket.IO event named "round_result". When the event is received, update the `winningHand` state variable with the data received from the server.
```

**Prompt 6.1.3:**

```text
Modify the `frontend/src/App.tsx` file. Create a function that displays a user-friendly message indicating what type of hand the winning hand was.
```

Now we need to display which player won.

## **Prompts for Step 6.2: Frontend: Display the Winner of the Round**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 6.2.1:**

```text
Modify the `frontend/src/App.tsx` file. Create a new state variable named `winningPlayerId` using `useState`. Initialize it with null.
```

**Prompt 6.2.2:**

```text
Modify the `frontend/src/App.tsx` file. Inside the `useEffect` hook listening for the "round_result" event, update the `winningPlayerId` state variable with the winning player's ID received from the server.
```

**Prompt 6.2.3:**

```text
Modify the `frontend/src/App.tsx` file. Add a conditional rendering block that displays the winner of the round.

If `winningPlayerId` is not null, display a message like "Player [winningPlayerId] wins the round with [hand description]!".  Use the hand information stored in the `winningHand` state to provide the hand description.

If `winningPlayerId` is null, display a message like "It's a tie!".
```

At this point the game is setup to deal hands, evaluate the hands, and then to display the output on the screen. The next steps will be to add jokers.

Okay, let's move on to **Step 7: Backend: Basic Joker Implementation**. This involves defining a Joker class, adding a few initial joker instances, allowing players to select a Joker, and applying the Joker effect to the hand evaluation.

## **Prompts for Step 7.1: Backend: Define a Joker Class with a Basic Effect**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 7.1.1:**

```text
Modify the `index.js` file. Create a JavaScript class named `Joker`. The `Joker` class should have a constructor that takes `name`, `description`, and `effect` as arguments. The `effect` should be a function that takes a hand object and returns the new hand object.
```

## **Prompts for Step 7.2: Backend: Add a Few Initial Joker Instances to the Game**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 7.2.1:**

```text
Modify the `index.js` file. Create an array of `Joker` objects. Add two or three different jokers to this array. For example:

*   Joker 1: "High Card Bonus", description: "+10 chips if you have high card", effect: function(hand) { if (hand.rank == "High Card") { hand.chips += 10; } return hand; }
*   Joker 2: "Pair Bonus", description: "+20 chips if you have a pair", effect: function(hand) { if (hand.rank == "Pair") { hand.chips += 20; } return hand; }
```

## **Prompts for Step 7.3: Backend: Implement Logic to Allow Players to Select a Joker**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 7.3.1:**

```text
Modify the `index.js` file. Add a function to the `startGame` function that presents all of the available jokers to a user to pick from.

Emit a socket io event `availableJokers` that is an array of `Joker` objects to the client.
```

## **Prompts for Step 7.4: Backend: Implement Logic to Apply the Joker Effect to the Hand Evaluation**

**Context:** Continuing within the "backend" Node.js project, `index.js` file.

**Prompt 7.4.1:**

```text
Modify the `index.js` file. Create a function called `applyJokerToHand` that will apply the `Joker` to the player's hand.
```

**Prompt 7.4.2:**

```text
Modify the `index.js` file. Enhance the `evaluateHand` function to call the `applyJokerToHand` function.
```

Now we need to make changes to the front end to be able to display these jokers and be able to pick from them.

## **Prompts for Step 8.1: Frontend: Joker Display & Selection**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 8.1.1:**

```text
Modify the `/frontend/src/App.tsx` file. Create a new state variable called `availableJokers` using `useState`. This should default to an empty array.
```

**Prompt 8.1.2:**

```text
Modify the `/frontend/src/App.tsx` file. Create a new `useEffect` hook to listen to the "availableJokers" event. This hook should set the state variable `availableJokers` to the value of the event data.
```

## **Prompts for Step 8.2: Frontend: Joker Display & Selection**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 8.2.1:**

```text
Modify the `/frontend/src/App.tsx` file. Create a new component called `JokerList`. This component should accept the prop called `jokers` and display each one of them using their name and description. Also the component should display a button that the user can press to select a joker.
```

## **Prompts for Step 8.3: Frontend: Joker Display & Selection**

**Context:** Continuing within the "frontend" React project, `App.tsx` file.

**Prompt 8.3.1:**

```text
Modify the `/frontend/src/App.tsx` file. The `JokerList` component should have a selected index. When the user presses the button to select a joker, you should send a socket io event called `selectJoker` with the index of the joker the user picked.
```

The rest of the integration should be fairly straightforward.
