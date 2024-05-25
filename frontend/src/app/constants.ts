import { PublicKey } from '@solana/web3.js';
import DoubleOrNothingIDL from '@/idl/doubleornothing.json';

export const programId = new PublicKey(DoubleOrNothingIDL.address);

export const TREASURY_SEED = 'TREASURY';
export const STATSDATA_SEED = 'STATSDATA';
