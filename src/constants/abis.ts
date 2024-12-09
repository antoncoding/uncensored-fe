export const INBOX_ABI = [
  // ... other ABI entries
  {
    type: 'event',
    name: 'ForceIncluded',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value' },
      { type: 'bytes', name: 'data' }
    ]
  }
] as const; 