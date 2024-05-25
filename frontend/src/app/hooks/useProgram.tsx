import DoubleOrNothingIDL from '@/idl/doubleornothing.json';
import { Doubleornothing } from '@/idl/doubleornothing';
import { useAnchorProvider } from '../components/solana/solana-provider';
import { Program } from '@coral-xyz/anchor';

const idl_string = JSON.stringify(DoubleOrNothingIDL);
const idl_object = JSON.parse(idl_string);

export default function useProgram() {
  const provider = useAnchorProvider();
  const program = new Program<Doubleornothing>(idl_object, provider);

  return {
    program,
  };
}
