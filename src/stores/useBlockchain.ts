import { CHARITY_PAYMASTER_ADDRESS } from '@/address'
import { BUNDLER_URL, CHAIN_ID, EXPLORER_URL, RPC_URL } from '@/config'
import { MyPaymaster } from '@/lib/pmGetter'
import { JsonRpcProvider } from 'ethers'
import { defineStore } from 'pinia'
import { PimlicoBundler } from 'sendop'

const DEFAULT_CHAIN_ID = CHAIN_ID.LOCAL

export const useBlockchainStore = defineStore('useBlockchainStore', () => {
	const chainId = ref<CHAIN_ID>(DEFAULT_CHAIN_ID)

	function setChainId(id: CHAIN_ID) {
		chainId.value = id
	}

	const rpcUrl = computed(() => RPC_URL[chainId.value])

	const explorerUrl = computed(() => `${EXPLORER_URL[chainId.value]}`)

	const client = computed(() => new JsonRpcProvider(rpcUrl.value))

	const bundlerUrl = computed(() => BUNDLER_URL[chainId.value])

	const bundler = computed(() => new PimlicoBundler(chainId.value, bundlerUrl.value))

	const pmGetter = computed(
		() => new MyPaymaster({ client: client.value, paymasterAddress: CHARITY_PAYMASTER_ADDRESS }),
	)

	return {
		chainId,
		rpcUrl,
		explorerUrl,
		client,
		bundlerUrl,
		bundler,
		setChainId,
		pmGetter,
	}
})

export function useBlockchain() {
	const blockchainStore = useBlockchainStore()
	return {
		...blockchainStore,
		...storeToRefs(blockchainStore),
	}
}
