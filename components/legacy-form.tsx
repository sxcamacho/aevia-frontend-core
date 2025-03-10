"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { Label } from "@headlessui/react";
import { useToast } from "@/hooks/use-toast"
// import { Description, Field, Label, Switch } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/16/solid";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  approveERC20,
  getUserWalletAddress,
  signTypedData,
  checkAllowance,
  ERC20_ABI,
  transferTokens,
  approveERC721,
  checkERC721Approval,
} from "@/lib/blockchain";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  parseUnits,
  type Address,
  type Abi,
  Chain,
} from "viem";
import { sepolia, mantle, mantleSepoliaTestnet, modeTestnet, baseSepolia, avalancheFuji, polygon, mainnet, avalanche, sonicTestnet } from "viem/chains";
import { defineChain } from "viem/chains/utils";
import { createLegacy, getSignatureMessage, setSignature, startCron } from "@/lib/api";
import { useContract } from "@/hooks/use-contract"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Add this type definition
type TokenType = {
  id: number;
  name: string;
  image: string;
  address: Address;
  chainId: number;
  type: string;
  decimals: number;
  investment?: boolean;
};

type TokensType = {
  [chainId: number]: TokenType[];
};

// Agregar el tipo para el contrato
type ContractType = {
  address: Address;
  abi: Abi;
};

const networks = [
  {
    name: "Ethereum",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 1,
  },
  {
    name: "Sepolia",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    chainId: 11155111,
  },
  {
    name: "Sonic Blaze Testnet",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/32684.png",
    chainId: 57054,
  },
  // {
  //   name: "Mode Sepolia Testnet",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/31016.png",
  //   chainId: 919,
  // },
  // {
  //   name: "Avalanche Fuji Testnet",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
  //   chainId: 43113,
  // },
  // {
  //   name: "Mantle Sepolia Testnet",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png",
  //   chainId: 5003,
  // },
  // {
  //   name: "Mantle Mainnet",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png",
  //   chainId: 5000,
  // },
  // {
  //   name: "Movement Network",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/32452.png",
  //   chainId: 30732,
  // },
  // {
  //   name: "Base Sepolia Testnet",
  //   image: "https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png",
  //   chainId: 84532,
  // },
];

const tokens: TokensType = {
  11155111: [
    {
      id: 1,
      name: "USDT",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" as Address,
      chainId: 11155111,
      type: "ERC20",
      decimals: 6,
    },
    {
      id: 2,
      name: "USDC",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address,
      chainId: 11155111,
      type: "ERC20",
      decimals: 6,
    },
  ],
  5003: [
    {
      id: 1,
      name: "USDT",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" as Address,
      chainId: 5003,
      type: "ERC20",
      decimals: 6,
    },
    {
      id: 2,
      name: "USDC",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address,
      chainId: 5003,
      type: "ERC20",
      decimals: 6,
    },
    {
      id: 3,
      name: "Just a Boy",
      image: "https://trump-boys.vercel.app/boyss.jpg",
      address: "0xAef300963d15241AF89EB4bD9bea326867d397a6" as Address,
      chainId: 5003,
      type: "ERC721",
      decimals: 0,
    }
  ],
  5000: [
    {
      id: 3,
      name: "Just a Boy",
      image: "https://trump-boys.vercel.app/boyss.jpg",
      address: "0x144cfdAe8a75E5D7008740992eD2694E660b6C2C" as Address,
      chainId: 5000,
      type: "ERC721",
      decimals: 0,
    },
  ],
  84532: [
    {
      id: 1,
      name: "USDC",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as Address,
      chainId: 84532,
      type: "ERC20",
      decimals: 6,
    },
  ],
  919: [
    {
      id: 1,
      name: "AEVIA (Fake ERC20)",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      address: "0xB8a4b92ffFd0eEd15BbE22a65922Ac389262C719" as Address,
      chainId: 919,
      type: "ERC20",
      decimals: 18,
    },
  ],
  43113: [
    {
      id: 1,
      name: "USDC",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      address: "0x5425890298aed601595a70AB815c96711a31Bc65" as Address,
      chainId: 43113,
      type: "ERC20",
      decimals: 6,
    },
  ],
  1: [
    {
      id: 1,
      name: "POL",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/28321.png",
      address: "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6" as Address,
      chainId: 1,
      type: "ERC20",
      decimals: 18,
      investment: true,
    },
  ],
  30732: [
    {
      id: 1,
      name: "MOVE",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/32452.png",
      address: "0x3073f7aAA4DB83f95e9FFf17424F71D4751a3073" as Address,
      chainId: 1,
      type: "ERC20",
      decimals: 18,
    },
  ],
  57054: [
    {
      id: 1,
      name: "CORAL",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/32684.png",
      address: "0xAF93888cbD250300470A1618206e036E11470149" as Address,
      chainId: 57054,
      type: "ERC20",
      decimals: 18
    },
    {
      id: 2,
      name: "RUBY",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/32684.png",
      address: "0x75190d6e62B8984b987B2336fD10552eD0e6a538" as Address,
      chainId: 57054,
      type: "ERC20",
      decimals: 18
    },
  ]
};

const sonicBlazeTestnet = defineChain({
  id: 57054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: { http: ['https://rpc.blaze.soniclabs.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Blaze Testnet Explorer',
      url: 'https://testnet.sonicscan.org/',
    },
  },
  testnet: true,
})

// Add a mapping of chainId to Chain object
const chainsByChainId: { [chainId: number]: Chain } = {
  1: mainnet,
  11155111: sepolia,
  5000: mantle,
  5003: mantleSepoliaTestnet,
  84532: baseSepolia,
  919: modeTestnet,
  43113: avalancheFuji,
  43114: avalanche,
  137: polygon,
  57054: sonicBlazeTestnet
  // ... add other chains as needed
};

interface Props {
  onClose?: () => void;
}

export default function LegacyForm({ onClose }: Props) {
  // const [emailFeatureEnabled, setEmailFeatureEnabled] = useState(true);
  // const [cryptoFeatureEnabled, setCryptoFeatureEnabled] = useState(true);
  const [emailFeatureEnabled] = useState(true);
  const [cryptoFeatureEnabled] = useState(true);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState("0");
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const { contract: protocolContract } = useContract(selectedNetwork.chainId);
  const { toast } = useToast()

  const defaultNetwork = networks[0].chainId;
  const [selectedToken, setSelectedToken] = useState(
    tokens[defaultNetwork][0]
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "United States",
    trustedContactEmail: "",
    emailTo: "",
    emailMessage: "",
    recipientAddress: "",
    amount: "",
    tokenId: "",
    useInvestment: false,
    riskLevel: 0,
    investmentAccount: "",
  });

  const [riskLevel, setRiskLevel] = useState(0);

  const riskLabels = ["Low", "Medium", "High"];

  const [custodialAddress, setCustodialAddress] = useState<string | null>(null);
  const [isAssigningAddress, setIsAssigningAddress] = useState(false);

  // Agregar nuevo estado
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userWalletAddress = cryptoFeatureEnabled
        ? await getUserWalletAddress(chainsByChainId[selectedNetwork.chainId])
        : null;

      if (cryptoFeatureEnabled && !userWalletAddress) {
        throw new Error("User wallet address not found");
      }

      // Uncomment when ready to use
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        trustedContactName: "",
        trustedContactEmail: formData.trustedContactEmail,
        emailTo: emailFeatureEnabled ? formData.emailTo : null,
        emailMessage: emailFeatureEnabled ? formData.emailMessage : null,
        cryptoWalletFrom: cryptoFeatureEnabled ? userWalletAddress : null,
        cryptoWalletTo: cryptoFeatureEnabled ? formData.recipientAddress : null,
        cryptoTokenAddress: cryptoFeatureEnabled ? selectedToken.address : null,
        cryptoTokenId: selectedToken.type === "ERC721" ? formData.tokenId : null,
        cryptoAmount: (() => {
          switch (selectedToken.type) {
            case "ERC20":
              return parseUnits(formData.amount, selectedToken.decimals).toString();
            case "ERC721":
              return "1";
            case "ERC1155":
              return formData.amount;
            default:
              return null;
          }
        })(),
        cryptoChainId: cryptoFeatureEnabled ? selectedToken.chainId : null,
        cryptoTokenType: selectedToken.type === "ERC20" ? 0 : 1,
      };

      
      
      const legacyData = await createLegacy(payload);
      console.log("Legacy saved successfully:", legacyData);

      if(formData.useInvestment) {
        console.log("Investment enabled");
        
        try {
          const hash = await transferTokens(
            selectedToken.address,
            custodialAddress as Address,
            formData.amount,
            selectedToken.decimals,
            chainsByChainId[selectedNetwork.chainId]
          );
          
          console.log("Transfer successful, hash:", hash);

          onClose?.();

          toast({
            title: "Transfer successful",
            description: "Your funds have been transferred to the investment account.",
          });

        } catch (error) {
          console.error("Transfer error:", error);
          toast({
            title: "Transfer failed",
            description: "There was an error transferring your funds. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      else {
        const message = await getSignatureMessage(legacyData.id);
        console.log("getSignatureMessage",message);
  
        const { address, signature } = await signTypedData(message, chainsByChainId[selectedNetwork.chainId]);
        console.log("signTypedData",{ address, signature });
  
        await setSignature(legacyData.id, signature);
        console.log("Signature set successfully");
  
        await startCron({
          user: formData.email,
          beneficiary: formData.emailTo,
          contact_id: formData.trustedContactEmail,
          legacy: `${formData.amount} ${selectedToken.name}`,
        });
        console.log("Cron started successfully");
      }   
      
      onClose?.();

      toast({
        title: "Legacy created successfully",
        description: `You can now be quiet. We'll contact you periodically to ensure the legacy is delivered.`,
      });

    } catch (error) {
      console.error("Error saving legacy:", error);
      toast({
        title: "Error saving legacy",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para verificar allowance
  const verifyAllowance = useCallback(async () => {
    if (!cryptoFeatureEnabled || !protocolContract) return;

    try {
      const chain = chainsByChainId[selectedNetwork.chainId];

      if (selectedToken.type === "ERC20") {
        if (!formData.amount) return;
        
        const allowed = await checkAllowance(
          selectedToken.address,
          protocolContract.address,
          formData.amount,
          selectedToken.decimals,
          chain
        );
        setHasAllowance(allowed);
      } 
      else if (selectedToken.type === "ERC721") {
        const isApproved = await checkERC721Approval(
          selectedToken.address,
          protocolContract.address,
          chain
        );
        setHasAllowance(isApproved);
      }
    } catch (error) {
      console.error("Error checking approval:", error);
      setHasAllowance(false);
    }
  }, [
    cryptoFeatureEnabled,
    formData.amount,
    selectedToken,
    protocolContract,
    selectedNetwork.chainId
  ]);

  useEffect(() => {
    verifyAllowance();
  }, [verifyAllowance]);

  const handleApprove = async () => {
    if (!protocolContract) return;

    try {
      if (selectedToken.type === "ERC20") {
        await approveERC20(
          selectedToken.address,
          protocolContract.address,
          formData.amount,
          selectedToken.decimals,
          chainsByChainId[selectedNetwork.chainId]
        );
      } else if (selectedToken.type === "ERC721") {
        await approveERC721(
          selectedToken.address,
          protocolContract.address,
          chainsByChainId[selectedNetwork.chainId]
        );
      }
      
      setHasAllowance(true);
      toast({
        title: "Approval successful",
        description: "You can now proceed with the legacy creation.",
      });
    } catch (error) {
      console.error("Error approving:", error);
      toast({
        title: "Approval failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getCurrentAllowance = useCallback(async () => {
    if (cryptoFeatureEnabled && selectedToken.type === "ERC20") {
      if (!protocolContract?.address) return;

      try {
        const chain = chainsByChainId[selectedNetwork.chainId];
        const publicClient = createPublicClient({
          chain,
          transport: custom(window.ethereum),
        });
        const walletClient = createWalletClient({
          chain,
          transport: custom(window.ethereum),
        });
        const [address] = await walletClient.requestAddresses();
        const allowance: bigint = await publicClient.readContract({
          address: selectedToken.address,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address, protocolContract.address],
        }) as bigint;
        setCurrentAllowance(formatUnits(allowance, selectedToken.decimals));
      } catch (error) {
        console.error("Error getting allowance:", error);
        setCurrentAllowance("0");
      }
    }
  }, [cryptoFeatureEnabled, selectedToken, protocolContract, selectedNetwork.chainId]);

  useEffect(() => {
    getCurrentAllowance();
  }, [getCurrentAllowance]);

  useEffect(() => {
    const networkTokens = tokens[selectedNetwork.chainId];
    if (networkTokens?.length > 0) {
      setSelectedToken(networkTokens[0]);
    }
  }, [selectedNetwork.chainId]);

  useEffect(() => {
    const checkApproval = async () => {
      if (!protocolContract) return;

      try {
        if (selectedToken.type === "ERC20") {
          const hasAllowance = await checkAllowance(
            selectedToken.address,
            protocolContract.address,
            formData.amount,
            selectedToken.decimals,
            chainsByChainId[selectedNetwork.chainId]
          );
          setHasAllowance(hasAllowance);
        } else if (selectedToken.type === "ERC721") {
          const isApproved = await checkERC721Approval(
            selectedToken.address,
            protocolContract.address,
            chainsByChainId[selectedNetwork.chainId]
          );
          setHasAllowance(isApproved);
        }
      } catch (error) {
        console.error("Error checking approval:", error);
      }
    };

    checkApproval();
  }, [selectedToken, formData.amount, protocolContract]);

  const handleAssignAddress = async () => {
    setIsAssigningAddress(true);
    // simulate API call
    const fakeAddress = "0x415b7843212d7a90bd8ad23877d6dc36e4db36b1";
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCustodialAddress(fakeAddress);
    setIsAssigningAddress(false);
    
    // update both states
    setFormData(prev => ({
      ...prev,
      recipientAddress: fakeAddress,
      investmentAccount: fakeAddress
    }));
  };

  const isFormValid = useCallback(() => {
    // basic required fields
    const basicFieldsValid = 
      formData.firstName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.trustedContactEmail.trim() !== "" &&
      formData.emailTo.trim() !== "" &&
      (
        // For ERC20 and ERC1155, check amount
        ((selectedToken.type === "ERC20" || selectedToken.type === "ERC1155") && formData.amount.trim() !== "") ||
        // For ERC721, amount is always 1
        selectedToken.type === "ERC721"
      ) &&
      (
        // if not investment, we need recipientAddress
        (!formData.useInvestment && formData.recipientAddress.trim() !== "") ||
        // if investment, we need investmentAccount
        (formData.useInvestment && formData.investmentAccount.trim() !== "")
      );

    // if token is ERC20, we need allowance
    if (selectedToken.type === "ERC20" && !formData.useInvestment && !hasAllowance) {
      return false;
    }

    return basicFieldsValid;
  }, [formData, hasAllowance, selectedToken.type]);

  return (
    <div className="flex flex-col h-full">
      {/* Banner de testing */}
      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mt-8 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Testing Phase
            </h3>
            <div className="mt-1 text-sm text-yellow-700">
              Aevia is currently in testing phase and not yet operational. Please do not send real assets at this time.
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-8 flex justify-center items-start mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl w-full">
            <form id="legacy-form" onSubmit={handleSubmit}>
              {/* Personal Information */}
              
              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div> */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Verification contact
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Your Telegram username"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Colombia</option>
                      <option>Mexico</option>
                      <option>Argentina</option>
                      <option>Uruguay</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div> */}
              </div>
              

              
              {/* <h2 className="text-base/7 font-semibold text-gray-900">
                Emergency Contact
              </h2> */}
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="trusted-contact-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="trusted-contact-name"
                      name="trustedContactName"
                      type="text"
                      value={formData.trustedContactName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div> */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="trusted-contact-email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Emergency contact
                  </label>
                  <div className="mt-2">
                    <input
                      id="trusted-contact-email"
                      name="trustedContactEmail"
                      type="text"
                      placeholder="Telegram username"
                      value={formData.trustedContactEmail}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="username"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Heir contact
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="email_to"
                        name="emailTo"
                        type="text"
                        placeholder="Telegram username"
                        value={formData.emailTo}
                        onChange={handleInputChange}
                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              

              {/* <div className="mt-12">
                <Field>
                  <Label
                    as="h3"
                    passive
                    className="text-base font-semibold text-gray-900"
                  >
                    Send a final message
                  </Label>
                  <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div className="max-w-xl text-sm text-gray-500">
                      <Description>
                        Send a heartfelt final message to your friend, loved one, or
                        family member.
                      </Description>
                    </div>
                    <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center">
                      <Switch
                        checked={emailFeatureEnabled}
                        onChange={setEmailFeatureEnabled}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                      </Switch>
                    </div>
                  </div>
                </Field>
              </div> */}

              {/* {emailFeatureEnabled && (
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Beneficiary telegram username
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="email_to"
                          name="emailTo"
                          type="text"
                          placeholder="john@doe.com"
                          value={formData.emailTo}
                          onChange={handleInputChange}
                          className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Message
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="email_message"
                        name="emailMessage"
                        rows={6}
                        value={formData.emailMessage}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                    <p className="mt-3 text-sm/6 text-gray-600">
                      We'll send this message as it is.
                    </p>
                  </div>
                </div>
              )} */}

              {/* <div className="mt-12">
                <Field>
                  <Label
                    as="h3"
                    passive
                    className="text-base font-semibold text-gray-900"
                  >
                    Send cryptos
                  </Label>
                  <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div className="max-w-xl text-sm text-gray-500">
                      <Description>
                        Send your cryptos to your family or a friend
                      </Description>
                    </div>
                    <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center">
                      <Switch
                        checked={cryptoFeatureEnabled}
                        onChange={setCryptoFeatureEnabled}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                      </Switch>
                    </div>
                  </div>
                </Field>
              </div> */}

              {/* <div className="mt-12">
                <Field>
                  <Label
                    as="h3"
                    passive
                    className="text-base font-semibold text-gray-900"
                  >
                    Send cryptos
                  </Label>
                  <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div className="max-w-xl text-sm text-gray-500">
                      <Description>
                        Send your cryptos to your family or a friend
                      </Description>
                    </div>
                    <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:shrink-0 sm:items-center">
                      <Switch
                        checked={cryptoFeatureEnabled}
                        onChange={setCryptoFeatureEnabled}
                        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                      </Switch>
                    </div>
                  </div>
                </Field>
              </div> */}

              
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Listbox value={selectedNetwork} onChange={setSelectedNetwork}>
                    <Label className="block text-sm/6 font-medium text-gray-900">
                      Network
                    </Label>
                    <div className="relative mt-2">
                      <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                          <img
                            alt=""
                            src={selectedNetwork.image}
                            className="size-5 shrink-0 rounded-full"
                          />
                          <span className="block truncate">
                            {selectedNetwork.name}
                          </span>
                        </span>
                        <ChevronUpDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </ListboxButton>

                      <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                      >
                        {networks.map((network) => (
                          <ListboxOption
                            key={network.chainId}
                            value={network}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                          >
                            <div className="flex items-center">
                              <img
                                alt=""
                                src={network.image}
                                className="size-5 shrink-0 rounded-full"
                              />
                              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                {network.name}
                              </span>
                            </div>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                              <CheckIcon aria-hidden="true" className="size-5" />
                            </span>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
                <div className="sm:col-span-3">
                  <Listbox
                    value={selectedToken}
                    onChange={setSelectedToken}
                  >
                    <Label className="block text-sm/6 font-medium text-gray-900">
                      Token
                    </Label>
                    <div className="relative mt-2">
                      <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                          <img
                            alt=""
                            src={selectedToken.image}
                            className="size-5 shrink-0 rounded-full"
                          />
                          <span className="block truncate">
                            {selectedToken.name}
                          </span>
                        </span>
                        <ChevronUpDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </ListboxButton>

                      <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                      >
                        {tokens[selectedNetwork.chainId]?.map((token) => (
                          <ListboxOption
                            key={token.id}
                            value={token}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                          >
                            <div className="flex items-center">
                              <img
                                alt=""
                                src={token.image}
                                className="size-5 shrink-0 rounded-full"
                              />
                              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                {token.name}
                              </span>
                            </div>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                              <CheckIcon aria-hidden="true" className="size-5" />
                            </span>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
                {selectedToken.type === "ERC20" ? (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="amount"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Amount
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="amount"
                          name="amount"
                          type="text"
                          placeholder="1000"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        />
                      </div>
                      <p className="mt-3 text-sm/6 text-gray-600">
                        This contract can move up to {currentAllowance} {selectedToken.name} from your account
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="tokenId"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Token ID
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="tokenId"
                          name="tokenId"
                          type="text"
                          placeholder="1"
                          value={formData.tokenId}
                          onChange={handleInputChange}
                          className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="recipient_address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Heir's Wallet Address
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                      <input
                        id="recipient_address"
                        name="recipientAddress"
                        type="text"
                        placeholder="0x00000000000000"
                        value={formData.recipientAddress}
                        onChange={handleInputChange}
                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                {selectedToken.investment && (
                  <div className="sm:col-span-6 space-y-4">
                    <Alert className="border-primary/50 bg-primary/10">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-primary space-y-2">
                        <p>
                          <span className="font-medium">{selectedToken.name}</span> on{" "}
                          <span className="font-medium">{selectedNetwork.name}</span> allows Aevia to invest your funds based on your selected risk profile, 
                          generating passive income automatically. Enable this option to put your capital to work.
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs border-t border-primary/20">
                          <span>Powered by</span>
                          <div className="flex items-center gap-1">
                            <img 
                              src="https://files.readme.io/2f4c532-small-icon.png" 
                              alt="StakeKit" 
                              className="h-4 w-4"
                            />
                            <span className="font-medium">StakeKit</span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="investment"
                          name="useInvestment"
                          onCheckedChange={(checked: boolean) => {
                            setFormData(prev => ({
                              ...prev,
                              useInvestment: checked
                            }))
                          }}
                        />
                        <label
                          htmlFor="investment"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable passive investment with Aevia
                        </label>
                      </div>

                      {formData.useInvestment && (
                        <div className="space-y-6">
                          <label className="mt-8 block text-sm font-medium text-gray-900">
                            Investment risk tolerance
                          </label>
                          <div className="flex justify-between px-1">
                            {riskLabels.map((label, index) => (
                              <span 
                                key={label} 
                                className={cn(
                                  "text-sm", 
                                  riskLevel === index ? "font-medium text-primary" : "text-muted-foreground"
                                )}
                              >
                                Risk {label}
                              </span>
                            ))}
                          </div>
                          <Slider
                            max={2}
                            step={1}
                            value={[riskLevel]}
                            onValueChange={([value]) => {
                              setRiskLevel(value)
                              setFormData(prev => ({
                                ...prev,
                                riskLevel: value
                              }))
                            }}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    {formData.useInvestment && (
                      <div className="space-y-6">
                        <Alert className="border-secondary/50 bg-secondary/50">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-primary space-y-2">
                            <p>
                              To enable passive investment, your funds will be transferred to a dedicated investment account managed by Aevia. 
                              This account is exclusively yours and secured by industry-leading protocols.
                            </p>
                            <p className="text-sm">
                              Your assets remain under your control while earning returns, and you can withdraw them at any time. 
                              We prioritize the security of your funds above all else.
                            </p>
                          </AlertDescription>
                        </Alert>

                        <div className="flex items-center space-x-4">
                          {!custodialAddress ? (
                            <button
                              type="button"
                              onClick={handleAssignAddress}
                              disabled={isAssigningAddress}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-100 text-amber-900 hover:bg-amber-200 h-9 px-4"
                            >
                              {isAssigningAddress && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                              Assign Investment Account
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Account assigned:</span>
                              <span className="font-medium">{custodialAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer fijo */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between gap-x-6 p-4">
          <div>
            {cryptoFeatureEnabled && !formData.useInvestment && !hasAllowance && (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-100 text-blue-900 hover:bg-blue-200 h-10 px-4 py-2"
              >
                {selectedToken.type === "ERC20" ? (
                  <>Approve {formData.amount} {selectedToken.name}</>
                ) : (
                  <>Approve {selectedToken.name} Collection</>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-x-6">
            <button
              type="button"
              onClick={onClose}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="legacy-form"
              disabled={!isFormValid() || isSubmitting}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
                (!isFormValid() || isSubmitting) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
