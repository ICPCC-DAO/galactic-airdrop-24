import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountIdentifier = string;
export type AccountIdentifier__1 = string;
export type Balance = bigint;
export interface BalanceRequest { 'token': TokenIdentifier, 'user': User }
export type BalanceResponse = { 'ok': Balance } |
{ 'err': CommonError__1 };
export type CommonError = { 'InvalidToken': TokenIdentifier } |
{ 'Other': string };
export type CommonError__1 = { 'InvalidToken': TokenIdentifier } |
{ 'Other': string };
export type HeaderField = [string, string];
export interface HttpRequest {
    'url': string,
    'method': string,
    'body': Uint8Array | number[],
    'headers': Array<HeaderField>,
}
export interface HttpResponse {
    'body': Uint8Array | number[],
    'headers': Array<HeaderField>,
    'upgrade': boolean,
    'streaming_strategy': [] | [HttpStreamingStrategy],
    'status_code': number,
}
export interface HttpStreamingCallbackResponse {
    'token': [] | [HttpStreamingCallbackToken],
    'body': Uint8Array | number[],
}
export interface HttpStreamingCallbackToken {
    'key': string,
    'sha256': [] | [Uint8Array | number[]],
    'index': bigint,
    'content_encoding': string,
}
export type HttpStreamingStrategy = {
    'Callback': {
        'token': HttpStreamingCallbackToken,
        'callback': [Principal, string],
    }
};
export type Memo = Uint8Array | number[];
export type MintingEvent = [Uint32Array | number[], AccountIdentifier__1];
export type Result = { 'ok': Uint32Array | number[] } |
{ 'err': CommonError };
export type Result_1 = { 'ok': AccountIdentifier__1 } |
{ 'err': CommonError };
export type SubAccount = Uint8Array | number[];
export type SubAccount__1 = Uint8Array | number[];
export type Time = bigint;
export type TokenIdentifier = string;
export type TokenIdentifier__1 = string;
export type TokenIndex = number;
export interface TransferRequest {
    'to': User,
    'token': TokenIdentifier,
    'notify': boolean,
    'from': User,
    'memo': Memo,
    'subaccount': [] | [SubAccount],
    'amount': Balance,
}
export type TransferResponse = { 'ok': Balance } |
{
    'err': { 'CannotNotify': AccountIdentifier } |
    { 'InsufficientBalance': null } |
    { 'InvalidToken': TokenIdentifier } |
    { 'Rejected': null } |
    { 'Unauthorized': AccountIdentifier } |
    { 'Other': string }
};
export type User = { 'principal': Principal } |
{ 'address': AccountIdentifier };
export interface ecdsa_pk {
    'public_key': Uint8Array | number[],
    'chain_code': Uint8Array | number[],
}
export interface _SERVICE {
    'acceptCycles': ActorMethod<[], undefined>,
    'addMinter': ActorMethod<[Principal], undefined>,
    'availableCycles': ActorMethod<[], bigint>,
    'balance': ActorMethod<[BalanceRequest], BalanceResponse>,
    'bearer': ActorMethod<[TokenIdentifier__1], Result_1>,
    'bioniq_bulk_wrap': ActorMethod<
        [[] | [SubAccount__1], bigint],
        Array<TokenIdentifier__1>
    >,
    'bioniq_unwrap': ActorMethod<
        [TokenIdentifier__1, [] | [SubAccount__1], Uint8Array | number[]],
        Uint8Array | number[]
    >,
    'bioniq_wrap': ActorMethod<[[] | [SubAccount__1]], TokenIdentifier__1>,
    'ext_balance': ActorMethod<[BalanceRequest], BalanceResponse>,
    'ext_bearer': ActorMethod<[TokenIdentifier__1], Result_1>,
    'ext_transfer': ActorMethod<[TransferRequest], TransferResponse>,
    'getTest': ActorMethod<[TokenIdentifier__1], [] | [AccountIdentifier__1]>,
    'http_request': ActorMethod<[HttpRequest], HttpResponse>,
    'http_request_update': ActorMethod<[HttpRequest], HttpResponse>,
    'management_addAdmin': ActorMethod<[Principal], undefined>,
    'management_admins': ActorMethod<[], Array<Principal>>,
    'management_empty': ActorMethod<[TokenIndex], undefined>,
    'management_mint': ActorMethod<
        [TokenIdentifier__1, AccountIdentifier__1],
        boolean
    >,
    'management_pubkey': ActorMethod<[], ecdsa_pk>,
    'management_recycle': ActorMethod<[TokenIndex], undefined>,
    'management_recycledTokens': ActorMethod<[], Uint32Array | number[]>,
    'management_removeAdmin': ActorMethod<[Principal], undefined>,
    'management_settings': ActorMethod<
        [
            {
                'eventTickLength': bigint,
                'eventsPerTick': bigint,
                'eventRestLength': bigint,
            },
        ],
        undefined
    >,
    'management_sign': ActorMethod<
        [TokenIndex, Uint8Array | number[]],
        [] | [Uint8Array | number[]]
    >,
    'management_tokenpubkey': ActorMethod<[TokenIndex], ecdsa_pk>,
    'management_transfer': ActorMethod<
        [TokenIdentifier__1, AccountIdentifier__1],
        boolean
    >,
    'management_unwrappedTokenIds': ActorMethod<[], Array<[TokenIndex, Time]>>,
    'mint_voucher': ActorMethod<[MintingEvent], boolean>,
    'mint_voucher_bulk': ActorMethod<[Array<MintingEvent>], boolean>,
    'minters': ActorMethod<[], Array<Principal>>,
    'queue_pending': ActorMethod<[], Array<[string, bigint]>>,
    'queue_start': ActorMethod<[], undefined>,
    'queue_status': ActorMethod<[], boolean>,
    'queue_stop': ActorMethod<[], undefined>,
    'tokens': ActorMethod<[AccountIdentifier__1], Result>,
    'transfer': ActorMethod<[TransferRequest], TransferResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];