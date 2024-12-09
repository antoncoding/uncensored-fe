import { L1DepositHistory, TransactionStatus } from '@/hooks/useForceInclusionHistory';
import { Card, Link, Chip } from '@nextui-org/react';
import { chainIdToExplorer, chainIdToAddressExplorer } from '@/utils/chains';
import { formatDate } from '@/utils/date';
import { sepolia } from 'viem/chains';
import Image from 'next/image';
import { formatEther } from 'ethers';

type Props = {
  transactions: L1DepositHistory[];
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.SUCCEEDED:
      return 'success';
    case TransactionStatus.FAILED:
      return 'danger';
    case TransactionStatus.PENDING:
      return 'warning';
    default:
      return 'default';
  }
};

const getChainLogo = (chainId: number) => {
  switch (chainId) {
    case 11155420: // optimismSepolia
      return '/img/op.png';
    default:
      return '/img/eth.png';
  }
};

const formatTxHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function HistoryList({ transactions }: Props) {
  if (!transactions.length) {
    return <p>No transactions found.</p>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <Card key={tx.txHash} className="p-3">
          <div className="flex gap-3">
            {/* Left: Chain Logo */}
            <div className="flex-shrink-0 self-center">
              <Image 
                src={getChainLogo(tx.l2Chain.id)} 
                alt={tx.l2Chain.name} 
                width={24} 
                height={24} 
                className="rounded-full"
              />
            </div>

            {/* Right: Two Row Layout */}
            <div className="flex-grow min-w-0">
              {/* Upper Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  { tx.l2TransactionHash && 
                  
                  <div className='flex gap-2'>
                  Tx: 
                  <Link
                    href={`${chainIdToExplorer(tx.l2Chain.id, tx.l2TransactionHash)}`}
                    isExternal
                    className="font-mono text-sm truncate"
                  >
                    {tx.l2TransactionHash ? formatTxHash(tx.l2TransactionHash) : '...'}
                  </Link>
                  </div>
                  }
                  
                  <span className="ml-4 text-gray-500"> To </span>
                  <Link
                    href={`${chainIdToAddressExplorer(tx.l2Chain.id, tx.to)}`}
                    isExternal
                    className="font-mono text-sm truncate text-gray-600"
                  >
                    {formatAddress(tx.to)}
                  </Link>
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={getStatusColor(tx.l2Status || TransactionStatus.PENDING)}
                  className="min-w-[70px] ml-2"
                >
                  {tx.l2Status || 'Pending'}
                </Chip>
              </div>

              {/* Lower Row */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-gray-400">Forced</span>
                <Link
                  href={`${chainIdToExplorer(sepolia.id, tx.txHash)}`}
                  isExternal
                  className="font-mono truncate text-gray-500 text-xs hover:text-gray-700"
                >
                  {formatTxHash(tx.txHash)}
                </Link>

                <span className="text-gray-400"> Fee: </span>
                <span>{Number(formatEther(tx.l1TxFee)).toFixed(7)} ETH</span>
                <span>•</span>
                
                <span>{formatDate(tx.timestamp)}</span>
                
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}