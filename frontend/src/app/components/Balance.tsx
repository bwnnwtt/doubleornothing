'use client';

import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Balance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const wallet = useWallet();

  const truncateNumber = (num: number, decimals: number) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(num * factor) / factor;
  };

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    if (wallet.disconnecting) {
      setBalance(0);
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(truncateNumber(updatedAccountInfo.lamports / LAMPORTS_PER_SOL, 4));
      },
      'confirmed'
    );

    connection.getAccountInfo(publicKey).then((info) => {
      info ? setBalance(truncateNumber((info.lamports / LAMPORTS_PER_SOL), 4)) : null;
    });
  }, [connection, publicKey, wallet]);

  if (!connection || !publicKey) {
    return (
      <div className='text-2xl text-white'>Connect wallet to continue</div>
    );
  }

  return (
    <div className='my-4 flex items-center justify-center text-lg'>
      Balance: {balance} SOL
    </div>
  );
}
