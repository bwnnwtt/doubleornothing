The frontend is developed with [Next.js](https://nextjs.org/).

The app is deployed [here](https://doubleornothing.vercel.app/).

Things to note:  
For Phantom users, phantom would show a warning when submitting a transaction through the deployed site. Click on "Proceed anyway (unsafe)" at the bottom of the Phantom confirmation.  
The cluster (i.e. localnet, devnet) needs to be toggled on the wallet extension (i.e. for Phantom, go to settings -> Developer Settings -> turn on Testnet mode -> select the appropriate cluster (The dropdown button on the top right of the frontend page does not switch the setting of the wallet extension)  

Alternatively, run the project locally to view the frontend.

## To run the project locally

First, install the npm packages:
```bash
npm install
# or
yarn
```

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
