import { Chain, createPublicClient, createWalletClient, custom, parseUnits, type Address } from 'viem'

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
];

export interface EIP712Data {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };
  types: {
    [key: string]: Array<{ name: string; type: string }>;
  };
  message: Record<string, string | number | boolean>;
  primaryType: string;
}

export const getUserWalletAddress = async (chain: Chain) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum)
  });

  const [address] = await walletClient.requestAddresses();
  return address;
}

export const approveERC20 = async (
  tokenAddress: Address,
  spenderAddress: Address,
  amount: string,
  decimals: number,
  chain: Chain
) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  await switchNetworkIfNeeded(chain);

  const publicClient = createPublicClient({
    chain,
    transport: custom(window.ethereum)
  });

  const walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum)
  });

  const [address] = await walletClient.requestAddresses();
  const parsedAmount = parseUnits(amount, decimals);

  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spenderAddress, parsedAmount],
    account: address
  });

  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
};

export const signTypedData = async (data: EIP712Data, chain: Chain) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum)
  });

  const [address] = await walletClient.requestAddresses();

  const signature = await walletClient.signTypedData({
    account: address,
    domain: data.domain,
    types: data.types,
    primaryType: data.primaryType,
    message: data.message,
  });

  return {
    address,
    signature
  }
};

export const checkAllowance = async (
  tokenAddress: Address,
  spenderAddress: Address,
  amount: string,
  decimals: number,
  chain: Chain
) => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  await switchNetworkIfNeeded(chain);

  const publicClient = createPublicClient({
    chain,
    transport: custom(window.ethereum)
  });

  const walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum)
  });

  const [address] = await walletClient.requestAddresses();
  const parsedAmount = parseUnits(amount, decimals);

  const allowance: bigint = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address, spenderAddress],
  }) as bigint;

  return allowance >= parsedAmount;
};

export const switchNetworkIfNeeded = async (chain: Chain) => {
  const walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum)
  });

  const currentChainId = await walletClient.getChainId();
  console.log('user chain', currentChainId);
  console.log('required chain', chain.id);
  if (currentChainId !== chain.id) {
    try {
      await walletClient.switchChain({ id: chain.id });
    } catch (error) {
      console.error('Error switching chain:', error);
      throw error;
    }
  }
};

export async function transferTokens(
  tokenAddress: Address,
  recipientAddress: Address,
  amount: string,
  decimals: number,
  chain: Chain
): Promise<string> {
  try {
    await switchNetworkIfNeeded(chain);

    // create client for selected chain
    const walletClient = createWalletClient({
      chain,
      transport: custom(window.ethereum)
    });

    // get user address
    const [address] = await walletClient.requestAddresses();

    // send transaction
    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        recipientAddress,
        parseUnits(amount, decimals)
      ],
      account: address
    });

    return hash;

  } catch (error) {
    console.error("Transfer error:", error);
    throw error;
  }
}