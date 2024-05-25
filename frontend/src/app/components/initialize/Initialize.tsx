'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorError, BN } from '@coral-xyz/anchor';
import useProgramPDAs from '@/app/hooks/useProgramPDAs';
import useProgram from '@/app/hooks/useProgram';
import { InputUI, useTransactionToast } from '../ui/ui-components';
import toast from 'react-hot-toast';

export default function Initialize() {
  const { connection } = useConnection();
  const { program } = useProgram();
  const wallet = useWallet();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { publicKey, sendTransaction } = useWallet();
  const {
    error: pdaError,
    loading,
    treasuryPDA,
    statsPDA,
    treasuryData,
    statsData,
  } = useProgramPDAs();
  const transactionToast = useTransactionToast();
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (publicKey && treasuryPDA) {
      try {
        let initializeInstruction = await program.methods
          .initialize()
          .accounts({
            initializer: publicKey,
          })
          .instruction();

        let solTransferInstruction = await SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPDA,
          lamports: new BN(amount * LAMPORTS_PER_SOL),
        });

        const transaction = new Transaction().add(
          initializeInstruction,
          solTransferInstruction
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'confirmed');

        transactionToast(signature);
      } catch (error: any) {
        error instanceof AnchorError
          ? toast.error(error.error.errorMessage)
          : console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      console.log(treasuryPDA?.toString());
      console.log(statsPDA?.toString());
      console.log(treasuryData?.authority.toString());
      console.log(statsData?.authority.toString());
      console.log(statsData?.betCount);
      console.log(pdaError);
      if (treasuryData && statsData) {
        setIsInitialized(true);
      }
    }
  }, [loading]);

  if (isInitialized || loading || !wallet.publicKey) return null;
  if (pdaError) {
    return (
      <InputUI
        title='Enter amount to initialize and fund treasury'
        buttonTitle='Fund'
        amount={amount}
        setAmount={setAmount}
        handleSubmit={handleInitialize}
        error={error}
      />
    );
  }
}
