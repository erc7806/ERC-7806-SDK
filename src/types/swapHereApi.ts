import { BlockchainEnum } from "./blockchain";

/**
 * Request schema for the account upgrade API
 * @interface UpgradeAccountRequest
 */
export interface UpgradeAccountRequest {
    /**
     * The sender's address
     * @type {string}
     * @memberof UpgradeAccountRequest
     */
    sender: string;

    /**
     * The signed authorization message
     * @type {string}
     * @memberof UpgradeAccountRequest
     */
    signedAuthorization: string;

    /**
     * Whether registering or unregistering (optional)
     * @type {boolean}
     * @memberof UpgradeAccountRequest
     */
    registering?: boolean;

    /**
     * The standard contract address
     * @type {string}
     * @memberof UpgradeAccountRequest
     */
    standard: string;

    /**
     * The nonce value
     * @type {string}
     * @memberof UpgradeAccountRequest
     */
    nonce: string;

    /**
     * The signature for standard registration
     * @type {string}
     * @memberof UpgradeAccountRequest
     */
    standardRegistrationSig: string;
}

export interface CreateRelayRequest {
    /**
     * The signed RelayExecutionStandard intent
     * @type {string}
     * @memberof CreateRelayRequest
     */
    intent?: string;
}

export interface CreateRelayResponse {
    /**
     * 
     * @type {string}
     * @memberof CreateRelayResponse
     */
    requestId?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateRelayResponse
     */
    status?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateRelayResponse
     */
    message?: string;
}

export const RelayRequestStatusEnum = {
    Received: 'RECEIVED',
    Verified: 'VERIFIED',
    Rejected: 'REJECTED',
    Submitted: 'SUBMITTED',
    Failed: 'FAILED',
    ConfirmedOnChain: 'CONFIRMED_ON_CHAIN',
    Complete: 'COMPLETE'
} as const;
export type RelayRequestStatusEnum = typeof RelayRequestStatusEnum[keyof typeof RelayRequestStatusEnum];

export interface GetRelayResponse {
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    id?: string;
    /**
     * 
     * @type {Date}
     * @memberof GetRelayResponse
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetRelayResponse
     */
    updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    blockchain?: BlockchainEnum;
    /**
     * 
     * @type {string}
     * @memberof GetRelayStatusResponse
     */
    paymentTokenAddress?: string;
    /**
     * 
     * @type {number}
     * @memberof GetRelayResponse
     */
    paymentAmount?: number;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    intent?: string;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    state?: RelayRequestStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    transactionHash?: string;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    providerTransactionId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetRelayResponse
     */
    errorReason?: string;
}
