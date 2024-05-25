# Double or Nothing

## Description
This is a simple betting game where the player bets 'double or nothing' on a coin toss flip against the house.
To play the game, the player submits a bet amount (in SOL). A bet fee of 2% is collected on the bet amount.
If win, the player wins the bet amount. If lose, the player gets nothing.

For example, a player bets 1 SOL and wins:  
The cost of the bet is 1.02 SOL  
The house will give the player 2 SOL back  
The player wins 2 - 1.02 = 0.98 SOL  

## How it works
In the program, an initialize instruction initializes 2 PDAs (treasury and stats). The treasury PDA is an account to collect fees and pay out winnings to players. The stats account stores the total amount of bets placed on this program. The signer, acting as the house, will call the initialize instruction to initialize the PDAs. On the frontend, the house is able to set the initial funds to fund the treasury. This is only displayed on the frontend if the PDAs have not been initialized.

A bet instruction contains the betting logic for this program. On the frontend, a player is able to place bets and see the outcome once the transaction is confirmed.

There are two other instructions for this program. One instruction is to allow transfer of update authority for the PDAs. The other instruction is to close the PDAs. These instructions can only be called by the signer who initialized the PDAs.

## How to build and test the Anchor program

Install the npm packages
```
npm install
# or
yarn
```

This program is developed with anchor version 0.30.0

To install anchor, refer to [anchor documentation](https://www.anchor-lang.com/docs/installation).

To use the correct version:
```
avm use 0.30.0
```

To build the program:
```
anchor build
```

After program build is successful, sync the program keys:
```
anchor keys sync
```

To test the program:
```
anchor test
```
