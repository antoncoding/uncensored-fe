import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAddress } from 'viem';
import { useForceInclusionHistory } from '@/hooks/useForceInclusionHistory';
import HistoryList from '@/components/HistoryList';
import { toast } from 'react-toastify';
import Meta from '@/components/Meta';
import { CiWarning } from 'react-icons/ci';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAccount } from 'wagmi';
import { Button, Card, Tooltip } from '@nextui-org/react';
import { IoMdRefresh } from 'react-icons/io';
import { BsQuestionCircle } from "react-icons/bs";

export default function HistoryPage() {
  const router = useRouter();
  const { address } = router.query;
  const { address: connectedAddress } = useAccount();
  const { histories, isLoading, error, refresh } = useForceInclusionHistory(
    address as string
  );

  useEffect(() => {
    if (address && !isAddress(address as string)) {
      toast.error('Invalid address');
      router.push('/');
    }
  }, [address, router]);

  return (
    <>
      <Meta />
      <div className="w-full max-w-2xl mx-auto p-4 font-inter min-h-screen">
        <h1 className="text-3xl mb-12 pt-8">Transaction History</h1>
        <Card className="p-6 h-full">
          <div className="flex flex-col gap-6 h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm">Connected Account</h3>
                  <Tooltip content="The currently connected wallet address">
                    <button className="focus:outline-none">
                      <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                    </button>
                  </Tooltip>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Refresh"
                  isLoading={isLoading}
                  onClick={() => refresh()}
                >
                  <IoMdRefresh className="w-5 h-5" />
                </Button>
              </div>
              {connectedAddress && (
                <div className="text-sm text-gray-500">
                  {connectedAddress}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm">Recent Transactions</h3>
                <Tooltip content="Force Inclusions in the last 5000 L1 blocks">
                  <button className="focus:outline-none">
                    <BsQuestionCircle className="text-gray-400 hover:text-gray-600 transition-colors" size={14} />
                  </button>
                </Tooltip>
              </div>
              {!isLoading && !error && (
                <div className="text-sm text-gray-500">
                  {histories.length} transaction{histories.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {isLoading && (
              <div className="flex-1 flex items-start justify-center pt-12">
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <CiWarning size={20} className="flex-shrink-0" />
                <span className="text-sm">
                  Error loading history: {error.message}
                </span>
              </div>
            )}

            {!isLoading && !error && histories.length === 0 && (
              <div className="flex-1 flex items-start justify-center pt-12 text-gray-500">
                No force inclusion transactions found
              </div>
            )}

            {!isLoading && !error && histories.length > 0 && (
              <div className="flex-1">
                <HistoryList transactions={histories} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
