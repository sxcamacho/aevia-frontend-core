import { EIP712Data } from "@/lib/blockchain";
import { config } from "@/lib/config";

const API_BASE_URL = config.api.baseUrl;

interface LegacyPayload {
  chain_id: number | null;
  token_type: number | null;
  token_address: string | null;
  token_id: string | null;
  amount: string | null;
  wallet: string | null;
  heir_wallet: string | null;
  name: string;
  telegram_id: string;
  telegram_id_emergency: string;
  telegram_id_heir: string | null;
  investment_enabled: boolean;
  investment_risk: number | null;
}

export const createLegacy = async (payload: LegacyPayload) => {
  const response = await fetch(`${API_BASE_URL}/legacies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save legacy");
  }

  return response.json();
};

export const getSignatureMessage = async (id: string): Promise<EIP712Data> => {
  const response = await fetch(`${API_BASE_URL}/legacies/${id}/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get signature message");
  }

  return response.json();
};

export const setSignature = async (id: string, signature: string) => {
  const response = await fetch(`${API_BASE_URL}/legacies/${id}/sign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signature }),
  });

  if (!response.ok) {
    throw new Error("Failed to set signature");
  }

  return response.json();
};

export const getContractByNameAndChainId = async (name: string, chainId: number) => {
  const response = await fetch(`${API_BASE_URL}/contracts/${name}/${chainId}`);

  if (!response.ok) {
    throw new Error("Failed to get contract");
  }

  return response.json();
};

export const startCron = async (params: { user: string, beneficiary: string, contact_id: string, legacy: string }) => {
  const response = await fetch(`${API_BASE_URL}/protocol/start_cron`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to start cron");
  }

  return response.json();
};