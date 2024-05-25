'use client';

import * as React from 'react';
import { ChangeEvent, ReactNode, useEffect, useRef } from 'react';
import { ExplorerLink } from '../cluster/cluster-ui';
import toast from 'react-hot-toast';

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className='modal' ref={dialogRef}>
      <div className='modal-box space-y-5'>
        <h3 className='text-lg font-bold'>{title}</h3>
        {children}
        <div className='modal-action'>
          <div className='join space-x-2'>
            {submit ? (
              <button
                className='btn btn-xs lg:btn-md btn-primary'
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className='btn'>
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className='text-sm md:text-lg'>Transaction sent!</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className='text-xs md:text-md text-white underline hover:cursor-pointer hover:font-extrabold'
        />
      </div>
    );
  };
}

export function InputUI({
  title = 'Title',
  buttonTitle = 'Bet',
  handleSubmit,
  amount,
  setAmount,
  error,
}: {
  title: string;
  buttonTitle: string;
  amount: number;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  error: string | null;
}) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    }
  };

  return (
    <div className='flex flex-col items-center justify-start'>
      <form
        className='flex flex-col items-center justify-start'
        onSubmit={handleSubmit}
      >
        <label
          htmlFor='input'
          className='mb-3 text-center text-lg text-cyan-300'
        >
          {title}
        </label>
        <input
          className='text-md w-[200px] justify-center border border-[#aaaaaa] bg-slate-900 py-3 text-center text-cyan-300 focus:border-cyan-500'
          id='input'
          type='number'
          min={0}
          step={0.0001}
          value={amount}
          onChange={handleInputChange}
          placeholder='Enter amount (SOL)'
        />
        <button
          type='submit'
          className='mt-3 w-[200px] rounded-lg bg-slate-900 py-3 text-lg text-cyan-300 hover:outline hover:outline-1 hover:outline-cyan-500'
        >
          {buttonTitle} {amount ? `${amount} SOL` : null}
        </button>
      </form>
      {error && <div className='text-md mt-1 text-red-500'>{error}</div>}
    </div>
  );
}
