'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import Image from 'next/image';
import { ClusterUiSelect } from './cluster/cluster-ui';

export default function Header() {
  return (
    <div className='mt-4 flex justify-center'>
      <div className='flex w-full items-center justify-around lg:w-[75%]'>
        <div className='flex items-center gap-4'>
          <h1 className='inline-block bg-gradient-to-br from-blue-300 to-cyan-600 bg-clip-text text-md md:text-2xl font-extrabold text-transparent'>
            <div>Double</div>
            <div>
              <Image
                src='coin.svg'
                alt='coin'
                width={30}
                height={30}
                className='inline w-[24px] h-[24px] md:w-[30px]'
              />
              r Nothing
            </div>
          </h1>
        </div>
        <div className='flex gap-2 h-[32px] md:h-[48px]'>
          <WalletMultiButton className='bg-cyan-500 ' />
          <ClusterUiSelect />
        </div>
      </div>
    </div>
  );
}
