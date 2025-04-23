# Poker-Balatro Hybrid Game - To-Do List

## Phase 1: Core Game Loop (Single Match, No Matchmaking)

### 1. Backend: Project Setup & Basic Card Dealing

- [ ] 1.1 Project Setup & Basic Card Dealing
    - [ ] 1.1.1 Create a new directory named "backend".
    - [ ] 1.1.2 Run `npm init -y` in "backend" to create `package.json`.
    - [ ] 1.1.3 Install Express: `npm install express`.
    - [ ] 1.1.4 Install Socket.IO: `npm install socket.io`.
    - [ ] 1.1.5 Create `index.js` and set up a basic Express server (port 3000, "Hello, world!").
    - [ ] 1.1.6 Integrate Socket.IO with the Express server (listening on port 3000).
    - [ ] 1.1.7 Add a basic Socket.IO connection handler (console log on connection).

- [ ] 1.2 Define Card Suits, Ranks, and a Basic Card Class
    - [ ] 1.2.1 Define an enum (or constant object) for card suits (Clubs, Diamonds, Hearts, Spades).
    - [ ] 1.2.2 Define an array (or constant object) for card ranks (2-10, Jack, Queen, King, Ace).
    - [ ] 1.2.3 Create a JavaScript class named `Card` with `suit`, `rank`, and `toString()` method.
    - [ ] 1.2.4 Test the `Card` class. Create an instance, output to console, check `toString()` value.

- [ ] 1.3 Implement a Deck Class with Shuffling Functionality
    - [ ] 1.3.1 Create a JavaScript class named `Deck` with an empty cards array.
    - [ ] 1.3.2 Add a method named `createDeck` to populate the deck with 52 cards.
    - [ ] 1.3.3 Add a method named `shuffle` to shuffle the cards (Fisher-Yates).
    - [ ] 1.3.4 Add a method named `getCards` to return the cards in the deck.
    - [ ] 1.3.5 Add a method named `printDeck` to log each card to the console using `toString()`.
    - [ ] 1.3.6 Test the `Deck` class. Create, createDeck, shuffle, and printDeck.

- [ ] 1.4 Implement Dealing Cards From the Deck to Players
    - [ ] 1.4.1 Add a method named `dealCard` to the `Deck` class to remove and return the top card.
    - [ ] 1.4.2 Create a function called `createPlayers` which takes an integer as an argument.
    - [ ] 1.4.3 Add a function named `dealInitialCards` that takes a `Deck` object and an array of `player` objects as arguments.
    - [ ] 1.4.4 Test the `dealCard`, `createPlayers`, and `dealInitialCards` functions.

### 2. Frontend: Basic UI & Card Display

- [ ] 2.1 Set up React project with basic routing
    - [ ] 2.1.1 Create a new React project using Vite in a directory named "frontend". Use TypeScript.
    - [ ] 2.1.2 Install the `react-router-dom` library using npm.
    - [ ] 2.1.3 Set up basic routing using `react-router-dom`. Create routes for the main game view (path "/") and another for a placeholder "About" page (path "/about").

- [ ] 2.2 Create a Card Component to Display Individual Cards
    - [ ] 2.2.1 Create a functional React component named `Card` that accepts two props: `suit` and `rank`
    - [ ] 2.2.2 Add styling to the component to visually represent the card, including different colors for different suits
    - [ ] 2.2.3 Render several instances of the `Card` component with different suits and ranks.

- [ ] 2.3 Establish Socket.IO Connection to the Backend
    - [ ] 2.3.1 Install the `socket.io-client` library using npm.
    - [ ] 2.3.2 Establish a connection to the Socket.IO server running on `http://localhost:3000` when the component mounts
    - [ ] 2.3.3 Add a `useEffect` hook that runs when the component mounts. Inside the `useEffect` hook, add a listener for a Socket.IO event named "connect".
    - [ ] 2.3.4 Add a cleanup function to the `useEffect` hook to disconnect the socket when the component unmounts.

- [ ] 2.4 Create a PlayerHand Component to Display Cards in the Player's Hand
    - [ ] 2.4.1 Create a functional React component named `PlayerHand` that accepts a prop named `cards`
    - [ ] 2.4.2 Iterate over the `cards` array and render a `Card` component for each card.
    - [ ] 2.4.3 Create a state variable named `playerHand` using `useState`. Initialize it with an empty array.
    - [ ] 2.4.4 Add a `useEffect` hook to listen to the "deal_hand" event you just created.
    - [ ] 2.4.5 Render the `PlayerHand` component

### 3. Backend: Game Round Logic

- [ ] 3.1 Implement Pre-flop Logic: Deal 2 Cards to Each Player
    - [ ] 3.1.1 Create a function called `startGame` which takes an array of players as an argument.
    - [ ] 3.1.2 Add a function to send the players' hands to the client (frontend) through Socket.IO.
    - [ ] 3.1.3 Call the `startGame` function with the array of players as the argument.

- [ ] 3.2 Implement Flop Logic: Deal 3 Community Cards
    - [ ] 3.2.1 Create a function called `dealFlop` that takes a `Deck` object as an argument.
    - [ ] 3.2.2 Inside the `startGame` function, after dealing initial hands to players, call the `dealFlop` function to deal the flop.
    - [ ] 3.2.3 Add a Socket.IO event emitter inside the `startGame` function to send the flop cards to all connected clients. The event name should be "deal_flop", and the data should be the array of flop cards.

- [ ] 3.2 - React Frontend: Implement Flop Logic
    - [ ] 3.2.1 Create a new state variable named `communityCards` using `useState`. Initialize it with an empty array.
    - [ ] 3.2.2 Create a new file `/frontend/src/components/CommunityCards.tsx`. Create a `CommunityCards` component.
    - [ ] 3.2.3 Render the `CommunityCards` component that you just created.
    - [ ] 3.2.4 Add a `useEffect` hook to listen to the "deal_flop" event you just created.

- [ ] 3.3 Implement Turn Logic: Deal 1 Community Card
    - [ ] 3.3.1 Create a function called `dealTurn` that takes a `Deck` object as an argument.
    - [ ] 3.3.2 Inside the `startGame` function, after dealing the flop, call the `dealTurn` function to deal the turn card.
    - [ ] 3.3.3 Add a Socket.IO event emitter inside the `startGame` function to send the turn card to all connected clients. The event name should be "deal_turn", and the data should be the turn card.

- [ ] 3.3 - React Frontend: Implement Turn Logic
    - [ ] 3.3.1 Modify the `communityCards` state variable you created earlier to be an array that holds each card object instead of replacing all of them at once.
    - [ ] 3.3.2 Add a `useEffect` hook to listen to the "deal_turn" event you just created.

- [ ] 3.4 Implement River Logic: Deal 1 Community Card
    - [ ] 3.4.1 Create a function called `dealRiver` that takes a `Deck` object as an argument.
    - [ ] 3.4.2 Inside the `startGame` function, after dealing the turn, call the `dealRiver` function to deal the river card.
    - [ ] 3.4.3 Add a Socket.IO event emitter inside the `startGame` function to send the river card to all connected clients. The event name should be "deal_river", and the data should be the river card.

- [ ] 3.4 - React Frontend: Implement River Logic
    - [ ] 3.4.1 Add a `useEffect` hook to listen to the "deal_river" event you just created.

### 4. Frontend: Betting UI

- [ ] 4.1 Create Buttons for Fold, Check, and Bet
    - [ ] 4.1.1 Create a new `div` element below the `PlayerHand` and `CommunityCards` components.
    - [ ] 4.1.2 Add styling to the buttons to make them visually distinct.

- [ ] 4.2 Implement Basic Event Handlers for the Buttons
    - [ ] 4.2.1 Create three functions: `handleFold`, `handleCheck`, and `handleBet`.
    - [ ] 4.2.2 Attach the `handleFold` function to the "Fold" button's `onClick` event, the `handleCheck` function to the "Check" button's `onClick` event, and the `handleBet` function to the "Bet" button's `onClick` event.

- [ ] 4.3 Send Betting Actions to the Backend via Socket.IO
    - [ ] 4.3.1 In the `handleFold` function, emit a Socket.IO event named "player_fold" to the backend.
    - [ ] 4.3.2 In the `handleCheck` function, emit a Socket.IO event named "player_check" to the backend.
    - [ ] 4.3.3 For the `handleBet` function: Prompt for bet amount, emit "player_bet" with amount if valid.

- [ ] 4.3 Backend: Handle Betting Actions from the Frontend
    - [ ] 4.3.4 Inside the Socket.IO connection handler, add a listener for the "player_fold" event.
    - [ ] 4.3.5 Inside the Socket.IO connection handler, add a listener for the "player_check" event.
    - [ ] 4.3.6 Inside the Socket.IO connection handler, add a listener for the "player_bet" event.

### 5. Backend: Basic Scoring

- [ ] 5.1 Implement a Function to Evaluate a Poker Hand's Rank
    - [ ] 5.1.1 Create a function called `evaluateHand` that takes an array of `Card` objects as input.
    - [ ] 5.1.2 Inside the `evaluateHand` function, implement the logic to detect each of the poker hands listed above.
    - [ ] 5.1.3 Add helper functions to `evaluateHand` to determine the rank of the hand.

- [ ] 5.2 Implement Logic to Determine the Winner of the Round Based on the Hand Rank
    - [ ] 5.2.1 Create a function called `determineWinner` that takes an array of player objects as input.
    - [ ] 5.2.2 Enhance the `determineWinner` function to handle ties. If there's a tie in hand rank, use the kicker cards returned by the `evaluateHand` function to break the tie.
    - [ ] 5.2.3 Update the `startGame` function to use these helper functions. After the river is dealt, use the functions `evaluateHand` and `determineWinner` to select a winner.

- [ ] 5.3 Integrate Scoring Logic into the Game Loop
    - [ ] 5.3.1 Inside the Socket.IO connection handler, after the "deal_river" event (or after the betting round, if implemented), call the `determineWinner` function with the array of players.
    - [ ] 5.3.2 After calling the `determineWinner` function, emit a Socket.IO event named "round_result" to all connected clients.

### 6. Frontend: Scoring Display

- [ ] 6.1 Frontend: Display the Winning Hand for Each Player
    - [ ] 6.1.1 Create a new state variable named `winningHand` using `useState`.
    - [ ] 6.1.2 Add a `useEffect` hook to listen to the "round_result" event you just created.
    - [ ] 6.1.3 Create a function that displays a user-friendly message indicating what type of hand the winning hand was.

- [ ] 6.2 Frontend: Display the Winner of the Round
    - [ ] 6.2.1 Create a new state variable named `winningPlayerId` using `useState`.
    - [ ] 6.2.2 Inside the `useEffect` hook listening for the "round_result" event, update the `winningPlayerId` state variable with the winning player's ID received from the server.
    - [ ] 6.2.3 Add a conditional rendering block that displays the winner of the round.

### 7. Backend: Basic Joker Implementation

- [ ] 7.1 Backend: Define a Joker Class with a Basic Effect
    - [ ] 7.1.1 Create a JavaScript class named `Joker`.

- [ ] 7.2 Backend: Add a Few Initial Joker Instances to the Game
    - [ ] 7.2.1 Create an array of `Joker` objects.

- [ ] 7.3 Backend: Implement Logic to Allow Players to Select a Joker
    - [ ] 7.3.1 Add a function to the `startGame` function that presents all of the available jokers to a user to pick from.

- [ ] 7.4 Backend: Implement Logic to Apply the Joker Effect to the Hand Evaluation
    - [ ] 7.4.1 Create a function called `applyJokerToHand` that will apply the `Joker` to the player's hand.
    - [ ] 7.4.2 Enhance the `evaluateHand` function to call the `applyJokerToHand` function.

### 8. Frontend: Joker Display & Selection

- [ ] 8.1 Frontend: Joker Display & Selection
    - [ ] 8.1.1 Modify the `/frontend/src/App.tsx` file. Create a new state variable called `availableJokers` using `useState`.
    - [ ] 8.1.2 Modify the `/frontend/src/App.tsx` file. Create a new `useEffect` hook to listen to the "availableJokers" event.

- [ ] 8.2 Frontend: Joker Display & Selection
    - [ ] 8.2.1 Modify the `/frontend/src/App.tsx` file. Create a new component called `JokerList`.

- [ ] 8.3 Frontend: Joker Display & Selection
    - [ ] 8.3.1 Modify the `/frontend/src/App.tsx` file. The `JokerList` component should have a selected index. When the user presses the button to select a joker, you should send a socket io event called `selectJoker` with the index of the joker the user picked.

