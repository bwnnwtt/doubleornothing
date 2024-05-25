'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { AppModal } from '../ui/ui-components';
import { ClusterNetwork, useCluster } from './cluster-data-access';
import { Connection } from '@solana/web3.js';

export function ExplorerLink({
  path,
  label,
  className,
}: {
  path: string;
  label: string;
  className?: string;
}) {
  const { getExplorerUrl } = useCluster();
  return (
    <a
      href={getExplorerUrl(path)}
      target='_blank'
      rel='noopener noreferrer'
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  });
  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data) {
    return (
      <div className='alert alert-warning text-warning-content/80 flex justify-center rounded-none'>
        <span>
          Error connecting to cluster <strong>{cluster.name}</strong>
        </span>
        <button
          className='btn btn-xs btn-neutral'
          onClick={() => query.refetch()}
        >
          Refresh
        </button>
      </div>
    );
  }
  return children;
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster();
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <div
      className='relative inline-block h-[48px] text-sm md:text-base'
      onBlur={() => {
        setTimeout(() => {
          setShowDropDown(false);
        }, 100);
      }}
    >
      <button
        className='h-full rounded-lg bg-[#16213D] px-4 md:px-6 max-w-[80px] md:max-w-full truncate text-cyan-300 hover:bg-[#0F172A]'
        onClick={() => setShowDropDown(!showDropDown)}
      >
        {cluster.name}
      </button>
      <div
        className={`${showDropDown ? 'absolute mt-2 w-auto min-w-[100%] rounded-md bg-[#0F172A] py-2' : 'hidden'}`}
      >
        <ul className='flex flex-col text-center'>
          {clusters.map((item) => (
            <li key={item.name}>
              <button
                className={`my-1 w-[90%] rounded-lg py-[6px] hover:bg-[#1A1F2E] ${
                  item.active ? 'text-cyan-300' : ''
                }`}
                onClick={() => {
                  setCluster(item);
                  setShowDropDown(false);
                }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ClusterUiModal({
  hideModal,
  show,
}: {
  hideModal: () => void;
  show: boolean;
}) {
  const { addCluster } = useCluster();
  const [name, setName] = useState('');
  const [network, setNetwork] = useState<ClusterNetwork | undefined>();
  const [endpoint, setEndpoint] = useState('');

  return (
    <AppModal
      title={'Add Cluster'}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          new Connection(endpoint);
          if (name) {
            addCluster({ name, network, endpoint });
            hideModal();
          } else {
            console.log('Invalid cluster name');
          }
        } catch {
          console.log('Invalid cluster endpoint');
        }
      }}
      submitLabel='Save'
    >
      <input
        type='text'
        placeholder='Name'
        className='input input-bordered w-full'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type='text'
        placeholder='Endpoint'
        className='input input-bordered w-full'
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
      />
      <select
        className='select select-bordered w-full'
        value={network}
        onChange={(e) => setNetwork(e.target.value as ClusterNetwork)}
      >
        <option value={undefined}>Select a network</option>
        <option value={ClusterNetwork.Devnet}>Devnet</option>
        <option value={ClusterNetwork.Testnet}>Testnet</option>
        <option value={ClusterNetwork.Mainnet}>Mainnet</option>
      </select>
    </AppModal>
  );
}

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster();
  return (
    <div className='overflow-x-auto'>
      <table className='border-base-300 table border-separate border-4'>
        <thead>
          <tr>
            <th>Name/ Network / Endpoint</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((item) => (
            <tr key={item.name} className={item?.active ? 'bg-base-200' : ''}>
              <td className='space-y-2'>
                <div className='space-x-2 whitespace-nowrap'>
                  <span className='text-xl'>
                    {item?.active ? (
                      item.name
                    ) : (
                      <button
                        title='Select cluster'
                        className='link link-secondary'
                        onClick={() => setCluster(item)}
                      >
                        {item.name}
                      </button>
                    )}
                  </span>
                </div>
                <span className='text-xs'>
                  Network: {item.network ?? 'custom'}
                </span>
                <div className='whitespace-nowrap text-xs text-gray-500'>
                  {item.endpoint}
                </div>
              </td>
              <td className='space-x-2 whitespace-nowrap text-center'>
                <button
                  disabled={item?.active}
                  className='btn btn-xs btn-default btn-outline'
                  onClick={() => {
                    if (!window.confirm('Are you sure?')) return;
                    deleteCluster(item);
                  }}
                >
                  <IconTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
