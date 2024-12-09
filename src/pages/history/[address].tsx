import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAddress } from 'viem';
import { useForceInclusionHistory } from '@/hooks/useForceInclusionHistory';
import HistoryList from '@/components/HistoryList';
import { toast } from 'react-toastify';
import Meta from '@/components/Meta';
import { CiWarning } from 'react-icons/ci';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HistoryPage() {
  const router = useRouter();
  const { address } = router.query;
  const { histories, isLoading, error } = useForceInclusionHistory(
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
      <div className="min-h-[calc(100vh-64px)] w-full flex flex-col py-8">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl px-4">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Force Inclusion History</h1>
                {!isLoading && !error && (
                  <span className="text-sm text-gray-500">
                    {histories.length} transaction
                    {histories.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {isLoading && (
                <div className="py-12">
                  <LoadingSpinner />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 my-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                  <CiWarning size={20} className="flex-shrink-0" />
                  <span className="text-sm">
                    Error loading history: {error.message}
                  </span>
                </div>
              )}

              {!isLoading && !error && histories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No force inclusion transactions found
                </div>
              )}

              {!isLoading && !error && histories.length > 0 && (
                <HistoryList transactions={histories} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
