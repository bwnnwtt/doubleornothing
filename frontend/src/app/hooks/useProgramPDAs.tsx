'use client';

import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { STATSDATA_SEED, TREASURY_SEED, programId } from '../constants';
import { BN } from '@coral-xyz/anchor';
import useProgram from './useProgram';
import { useConnection } from '@solana/wallet-adapter-react';

interface TreasuryData {
  authority: PublicKey;
}

interface StatsData {
  authority: PublicKey;
  betCount: number;
}

export default function useProgramPDAs() {
  const { program } = useProgram();

  const [loading, setLoading] = useState<boolean>(true);
  const [treasuryPDA, setTreasuryPDA] = useState<PublicKey | undefined>();
  const [treasuryData, setTreasuryData] = useState<TreasuryData | undefined>();
  const [statsPDA, setStatsPDA] = useState<PublicKey | undefined>();
  const [statsData, setStatsData] = useState<StatsData | undefined>();
  const [error, setError] = useState<string | null>();
  const { connection } = useConnection();

  const fetchData = async () => {
    if (treasuryPDA && statsPDA) {
      try {
        const treasuryData = await program.account.treasury.fetch(
          treasuryPDA,
          'confirmed'
        );
        if (treasuryData?.authority) {
          setTreasuryData({ authority: treasuryData.authority });
        }

        const statsData = await program.account.stats.fetch(
          statsPDA,
          'confirmed'
        );
        if (statsData?.authority) {
          setStatsData({
            authority: statsData.authority,
            betCount: new BN(statsData.betCount).toNumber(),
          });
        }

        setError(null);
      } catch (error: any) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const [treasuryPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from(TREASURY_SEED)],
        programId
      );
      const [statsPDA] = await PublicKey.findProgramAddressSync(
        [Buffer.from(STATSDATA_SEED)],
        programId
      );

      setTreasuryPDA(treasuryPDA);
      setStatsPDA(statsPDA);

      fetchData();
    };

    fetcher();

    if (treasuryPDA) {
      connection.onAccountChange(treasuryPDA, fetchData, 'confirmed');
    }
  }, [connection]);

  return {
    error,
    loading,
    treasuryPDA,
    statsPDA,
    treasuryData,
    statsData,
  };
}
