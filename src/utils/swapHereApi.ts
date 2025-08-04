import axios, { AxiosInstance } from 'axios';
import { BlockchainEnum } from '../types/blockchain';
import { CreateRelayRequest, CreateRelayResponse, GetRelayResponse, UpgradeAccountRequest } from '../types/swapHereApi';

/**
 * Configuration options for the SwapHere API client
 * @interface SwapHereClientConfig
 */
export interface SwapHereClientConfig {
    /**
     * Base URL for the API (defaults to https://swaphere.app)
     */
    baseUrl?: string;
    
    /**
     * Optional timeout in milliseconds
     */
    timeout?: number;
}

/**
 * Client for interacting with the SwapHere API
 */
export class SwapHereClient {
    private readonly client: AxiosInstance;
    
    /**
     * Creates a new instance of the SwapHere API client
     * @param config Optional configuration for the client
     */
    constructor(config?: SwapHereClientConfig) {
        this.client = axios.create({
            baseURL: config?.baseUrl || 'https://swaphere.app',
            timeout: config?.timeout || 30000, // Default 30 second timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Submit a request to upgrade an EOA to an EIP-7702 account and register a standard
     * @param blockchain The blockchain to upgrade the account on
     * @param request The upgrade request parameters
     * @throws {Error} If the request fails
     */
    async upgradeAccount(blockchain: BlockchainEnum, request: UpgradeAccountRequest): Promise<void> {
        try {
            await this.client.post(`/api/${blockchain}/upgrade`, request);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to upgrade account: ${error.response?.data || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Create a relay execution request for on-chain execution
     * @param blockchain The blockchain to create the relay request on
     * @param request The create relay request parameters
     * @throws {Error} If the request fails
     */
    async createRelay(blockchain: BlockchainEnum, request: CreateRelayRequest): Promise<CreateRelayResponse> {
        try {
            const response = await this.client.post(`/api/relays/${blockchain}`, request);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to create relay request: ${error.response?.data || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Get the status of a relay request
     * @param requestId The ID of the relay request
     * @throws {Error} If the request fails
     */
    async getRelay(requestId: string): Promise<GetRelayResponse> {
        try {
            const response = await this.client.get(`/api/relays/${requestId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to get relay request status: ${error.response?.data || error.message}`);
            }
            throw error;
        }
    }
}

export const defaultSwapHereClient = new SwapHereClient();
