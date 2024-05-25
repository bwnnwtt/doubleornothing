'use client';

import { FormEvent, useState } from 'react';
import { useAnchorProvider } from '../solana/solana-provider';
import { AnchorError, BN } from '@coral-xyz/anchor';
import useProgramPDAs from '@/app/hooks/useProgramPDAs';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { InputUI, useTransactionToast } from '../ui/ui-components';
import useProgram from '@/app/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

export default function Bet() {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { program } = useProgram();
  const provider = useAnchorProvider();
  const wallet = useWallet();
  const {
    error: pdaError,
    loading
  } = useProgramPDAs();
  const [winOrLose, setWinOrLose] = useState<string | null>(null);
  const transactionToast = useTransactionToast();

  const handleBet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (amount === 0) {
      setError('Please set a bet amount!');
      setTimeout(() => {
        setError(null);
      }, 3500);
    } else {
      if (!loading) {
        console.log(amount * LAMPORTS_PER_SOL);
        try {
          let txId = await program.methods
            .bet(new BN(amount * LAMPORTS_PER_SOL))
            .accounts({
              player: wallet.publicKey || undefined,
            })
            .rpc({ commitment: 'confirmed' });
          transactionToast(txId);
          getTransactionDetails(txId);
        } catch (error: any) {
          error instanceof AnchorError
            ? toast.error(error.error.errorMessage)
            : console.error(error);
        } finally {
          setAmount(0);
        }
      }
    }
  };

  const getTransactionDetails = async (tx: string) => {
    await provider.connection.confirmTransaction(tx, 'confirmed');
    const transactionDetails = await provider.connection.getTransaction(tx, {
      commitment: 'confirmed',
    });

    if (transactionDetails) {
      const transactionLogs = transactionDetails.meta?.logMessages || [];

      if (transactionLogs[8].includes('won')) {
        setWinOrLose('won');
        setTimeout(() => {
          setWinOrLose(null);
        }, 7000);
      } else if (transactionLogs[8].includes('lost')) {
        setWinOrLose('lost');
        setTimeout(() => {
          setWinOrLose(null);
        }, 7000);
      }
    } else {
      console.error('Transaction details not found');
    }
  };

  if (pdaError || !wallet.publicKey) return null;

  return (
    <>
      <InputUI
        title={'Enter Bet Amount'}
        buttonTitle={'Bet'}
        handleSubmit={handleBet}
        amount={amount}
        setAmount={setAmount}
        error={error}
      />
      {winOrLose && <div className='mt-4 text-lg'>You {winOrLose} the bet!</div>}
    </>
  );
}
