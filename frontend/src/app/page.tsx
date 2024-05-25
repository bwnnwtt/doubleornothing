import { Toaster } from 'react-hot-toast';
import Balance from './components/Balance';
import Header from './components/Header';
import Bet from './components/bet/Bet';
import Initialize from './components/initialize/Initialize';

export default function Home() {
  return (
    <>
      <Header />
      <main className='flex min-h-[calc(100vh-100px)] flex-col items-center justify-start px-24 py-8'>
        <Balance />
        <Initialize />
        <Bet />
        <Toaster
          position='bottom-center'
          toastOptions={{
            className: '',
            duration: 7000,
            style: {
              background: '#16213D',
              color: '#67E8F9',
              padding: '10px 18px',
              border: '1px solid #67E8F9',
            },
            success: {
              duration: 7000,
            },
          }}
        />
      </main>
    </>
  );
}
