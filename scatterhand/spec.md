
---

# **Game Specification for Multiplayer Poker-Balatro Hybrid**

## **Game Overview**

This is a **multiplayer poker-based game** combining **Texas Hold'em** with **Balatro-style mechanics**. Players build custom decks and play against others in tournament-style matches, where jokers and card enhancements provide dynamic and unpredictable gameplay. The game features **auto-join matchmaking** and **VS. rounds** with joker upgrades, loot rewards, and player eliminations based on their ability to beat escalating blinds.

---

## **Core Features**

### **1. Matchmaking System**

#### **Auto-Join Mode**

- **Queue Management**:
    
    - Players join a global matchmaking queue.
        
    - Matches try to fill up to 10 players.
        
    - If **< 10 players** after **1 minute**, **bots** fill remaining slots.
        
    - **Min players to start**: 2 real players.
        
    - **Game Start**: Automatically starts when the minimum player count is reached (even if fewer than 10 players).
        

#### **Custom Game Mode** (Deferred to later versions)

- Player can create custom lobbies with the following features:
    
    - **Public or Private** with invite code.
        
    - Set custom rules (e.g., starting jokers, round count).
        
    - Players wait for full lobby or host can manually start.
        

### **2. Game Rounds**

#### **Round Structure**

- Each round consists of:
    
    - **Pre-flop**: Draw 1 joker and 2 cards (can discard cards and jokers).
        
    - **Flop**: 3 community cards + 1 community joker (draw jokers until you have 2 in hand).
        
    - **Turn**: 1 more community card + 1 community joker (draw jokers until you have 3 in hand).
        
    - **River**: 1 more community card + 1 community joker.
        
    - **Scoring**: Highest poker hand wins the round, jokers can be used up to 3, and scoring is based on the hand played.
        

#### **Blinds**

- **Small Blind** and **Big Blind** reward loot for meeting certain chip thresholds.
    
- **Boss Blind** escalates each round. Players who fail to meet the boss blind are eliminated.
    
- Players who survive **beat Boss Blind** and progress to the next round.
    

#### **VS. Round (Every Second Round)**

- **No blind score threshold**.
    
- **Lowest scoring player** is eliminated.
    
- **Highest scoring player** can **select a Joker** from the eliminated player's deck (up to 5 random jokers).
    

---

### **3. Joker System**

#### **Joker Types & Categories**

- **Common Jokers (40)**: Basic jokers with simple effects.
    
- **Uncommon Jokers (20)**: Moderate effects, accessible mid-game.
    
- **Rare Jokers (10)**: Powerful effects with higher utility.
    
- **Legendary Jokers (5)**: Very rare, powerful effects.
    
- **Unique Jokers (3)**: Single-use jokers with game-altering effects.
    

#### **Joker Upgrades**

- Each Joker can be upgraded **up to 5 levels**.
    
- **Level 1**: Base effect (e.g., +50 chips per heart).
    
- **Level 5**: Maxed out, ultimate effect (e.g., +300 chips per heart).
    
- **Upgrade Process**: Available during loot selection after rounds. Players choose to upgrade an existing Joker or select a new one.
    
- **Upgrade Persistence**: When jokers go back into the global pool after player elimination, **their level is maintained**.
    
- **Visibility**: Upgraded jokers are shown to all players at the end of each round.
    

---

### **4. Loot System**

- **Loot Rewards**:
    
    - Meet **boss blind threshold**: Receive loot.
        
    - **Top 3 scoring players** in each round: Get extra loot (1st: Rare Joker, 2nd: Uncommon Joker, 3rd: Enhanced cards).
        
    - Players can choose from **Joker upgrades**, **new jokers**, or **enhanced cards** in loot selection after each round.
        

#### **Loot Example Choices**

- Upgrade one of your jokers.
    
- Pick a new joker.
    
- Pick an enhanced card (wilds, multipliers, etc.).
    

---

### **5. Scoring**

- **Final Poker Hand**: Highest hand wins the round.
    
- **Joker Effects**: Jokers can be applied to the hand, and up to **3 jokers** can be used in any hand.
    
- **Scoring Hierarchy**:
    
    - **Highest score** after each round determines who gets loot and if it's a VS. round who gets eliminated.
        
    - **Boss Blind** gives extra good loot.
        

---

## **Architecture Choices**

### **Frontend (UI/UX)**

- Built with **React Router 7**.
    
- Components:
    
    - **Matchmaking Queue**: UI for joining and managing games.
        
    - **Lobby View**: Viewing players, creating private games.
        
    - **Deck View**: View current deck, jokers, upgrades.
        
    - **Gameplay Screen**: Show round details, cards, jokers in hand, community cards, and the betting UI.
        
    - **Scoring Screen**: Show final hands, joker upgrades, loot rewards, and rankings.
        
    - **Joker Upgrade Screen**: View, select, and upgrade jokers after each round.
        

#### **Backend (Game Logic)**

- **Server**: Node.js with Socket.IO for real-time multiplayer communication.
    
- **Database**: SQLite to track player profiles, jokers, card decks, and game progress.
    
    - **Player Data**: Name, deck, jokers (upgraded and un-upgraded).
        
    - **Match Data**: Active game state, current round, player actions, loot status.
        
    - **Joker Pool**: Global pool for jokers, with persistence for upgrades and selections.
        

### **Data Flow**:

- **Game Instance**: Each match is tracked as a unique instance on the server.
    
- **Matchmaking**: Players are queued in a global system, and games start when minimum players (2) are met. Bots fill remaining spots.
    
- **Joker Persistence**: Jokers and upgrades persist across rounds. When a player is eliminated, their jokers are returned to the global pool.
    
- **Scoring**: Poker hand is scored at the end of each round, jokers can be applied during hand formation.
    

---

## **Error Handling**

- **Matchmaking Errors**: If a game fails to start due to server issues, players are notified and given the option to **retry**.
    
- **Disconnection**: If a player disconnects, the server:
    
    - Attempts to reconnect (up to 30 seconds).
        
    - If disconnected for more than 30 seconds, the player is **automatically eliminated** and their jokers returned to the pool.
        
- **Bot Fallback**: If not enough players are available, bots are deployed to ensure the game can proceed.