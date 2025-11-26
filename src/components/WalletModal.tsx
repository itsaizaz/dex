import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { X, Wallet } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { account, isConnecting, error, connectWallet } = useWallet();

  if (!isOpen) return null;

  const handleMetaMaskClick = async () => {
    try {
      await connectWallet();
      
      if (!error) {
        setTimeout(() => onClose(), 500);
      }
    } catch (err) {
      
    }
  };

  const isMetaMaskInstalled = typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {account ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">Successfully Connected</p>
            <p className="text-xl font-mono font-semibold text-white bg-slate-800 py-3 px-4 rounded-lg">
              {formatAddress(account)}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-6">Choose a wallet provider to connect</p>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
                {error === 'MetaMask is not installed' && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline mt-2 inline-block"
                  >
                    Download MetaMask
                  </a>
                )}
              </div>
            )}

            <button
              onClick={handleMetaMaskClick}
              disabled={isConnecting}
              className="w-full flex items-center justify-between p-5 border-2 border-slate-700 rounded-xl hover:border-blue-500 hover:bg-slate-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-lg">MetaMask</p>
                  <p className="text-xs text-slate-400">
                    {isMetaMaskInstalled ? 'Connect to your wallet' : 'Not installed'}
                  </p>
                </div>
              </div>
              {isConnecting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              ) : (
                <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>

            <p className="text-xs text-slate-500 mt-4 text-center">
              By connecting, you agree to our Terms of Service
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletModal;