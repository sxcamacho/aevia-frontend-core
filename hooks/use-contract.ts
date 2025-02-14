"use client"

import useSWR from 'swr'
import type { Address, Abi } from 'viem'
import { config } from "@/lib/config"

type ContractType = {
  address: Address
  abi: Abi
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch contract')
  return res.json()
}

export function useContract(chainId: number) {
  const { data: contract, error } = useSWR<ContractType>(
    chainId ? `${config.api.baseUrl}/contracts/AeviaProtocol/${chainId}` : null,
    fetcher
  )

  return {
    contract: contract ?? null,
    loading: !error && !contract,
    error
  }
} 