import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
    'owner': Principal,
    'subaccount': [] | [Uint8Array | number[]],
}
export interface Allowance {
    'allowance': bigint,
    'expires_at': [] | [bigint],
}
export interface AllowanceArgs { 'account': Account, 'spender': Account }
export interface Approve {
    'fee': [] | [bigint],
    'from': Account,
    'memo': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
    'expected_allowance': [] | [bigint],
    'expires_at': [] | [bigint],
    'spender': Account,
}
export interface ApproveArgs {
    'fee': [] | [bigint],
    'memo': [] | [Uint8Array | number[]],
    'from_subaccount': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
    'expected_allowance': [] | [bigint],
    'expires_at': [] | [bigint],
    'spender': Account,
}
export type ApproveError = {
    'GenericError': { 'message': string, 'error_code': bigint }
} |
{ 'TemporarilyUnavailable': null } |
{ 'Duplicate': { 'duplicate_of': bigint } } |
{ 'BadFee': { 'expected_fee': bigint } } |
{ 'AllowanceChanged': { 'current_allowance': bigint } } |
{ 'CreatedInFuture': { 'ledger_time': bigint } } |
{ 'TooOld': null } |
{ 'Expired': { 'ledger_time': bigint } } |
{ 'InsufficientFunds': { 'balance': bigint } };
export interface ArchivedRange {
    'callback': [Principal, string],
    'start': bigint,
    'length': bigint,
}
export interface ArchivedRange_1 {
    'callback': [Principal, string],
    'start': bigint,
    'length': bigint,
}
export interface Burn {
    'from': Account,
    'memo': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
    'spender': [] | [Account],
}
export interface DataCertificate {
    'certificate': [] | [Uint8Array | number[]],
    'hash_tree': Uint8Array | number[],
}
export interface GetBlocksRequest { 'start': bigint, 'length': bigint }
export interface GetBlocksResponse {
    'certificate': [] | [Uint8Array | number[]],
    'first_index': bigint,
    'blocks': Array<Value>,
    'chain_length': bigint,
    'archived_blocks': Array<ArchivedRange>,
}
export interface GetTransactionsResponse {
    'first_index': bigint,
    'log_length': bigint,
    'transactions': Array<Transaction>,
    'archived_transactions': Array<ArchivedRange_1>,
}
export interface HttpRequest {
    'url': string,
    'method': string,
    'body': Uint8Array | number[],
    'headers': Array<[string, string]>,
}
export interface HttpResponse {
    'body': Uint8Array | number[],
    'headers': Array<[string, string]>,
    'status_code': number,
}
export type MetadataValue = { 'Int': bigint } |
{ 'Nat': bigint } |
{ 'Blob': Uint8Array | number[] } |
{ 'Text': string };
export interface Mint {
    'to': Account,
    'memo': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
}
export type Result = { 'Ok': bigint } |
{ 'Err': TransferError };
export type Result_1 = { 'Ok': bigint } |
{ 'Err': ApproveError };
export type Result_2 = { 'Ok': bigint } |
{ 'Err': TransferFromError };
export interface StandardRecord { 'url': string, 'name': string }
export interface Transaction {
    'burn': [] | [Burn],
    'kind': string,
    'mint': [] | [Mint],
    'approve': [] | [Approve],
    'timestamp': bigint,
    'transfer': [] | [Transfer],
}
export interface Transfer {
    'to': Account,
    'fee': [] | [bigint],
    'from': Account,
    'memo': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
    'spender': [] | [Account],
}
export interface TransferArg {
    'to': Account,
    'fee': [] | [bigint],
    'memo': [] | [Uint8Array | number[]],
    'from_subaccount': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
}
export type TransferError = {
    'GenericError': { 'message': string, 'error_code': bigint }
} |
{ 'TemporarilyUnavailable': null } |
{ 'BadBurn': { 'min_burn_amount': bigint } } |
{ 'Duplicate': { 'duplicate_of': bigint } } |
{ 'BadFee': { 'expected_fee': bigint } } |
{ 'CreatedInFuture': { 'ledger_time': bigint } } |
{ 'TooOld': null } |
{ 'InsufficientFunds': { 'balance': bigint } };
export interface TransferFromArgs {
    'to': Account,
    'fee': [] | [bigint],
    'spender_subaccount': [] | [Uint8Array | number[]],
    'from': Account,
    'memo': [] | [Uint8Array | number[]],
    'created_at_time': [] | [bigint],
    'amount': bigint,
}
export type TransferFromError = {
    'GenericError': { 'message': string, 'error_code': bigint }
} |
{ 'TemporarilyUnavailable': null } |
{ 'InsufficientAllowance': { 'allowance': bigint } } |
{ 'BadBurn': { 'min_burn_amount': bigint } } |
{ 'Duplicate': { 'duplicate_of': bigint } } |
{ 'BadFee': { 'expected_fee': bigint } } |
{ 'CreatedInFuture': { 'ledger_time': bigint } } |
{ 'TooOld': null } |
{ 'InsufficientFunds': { 'balance': bigint } };
export type Value = { 'Int': bigint } |
{ 'Map': Array<[string, Value]> } |
{ 'Nat': bigint } |
{ 'Nat64': bigint } |
{ 'Blob': Uint8Array | number[] } |
{ 'Text': string } |
{ 'Array': Vec };
export type Vec = Array<
    { 'Int': bigint } |
    { 'Map': Array<[string, Value]> } |
    { 'Nat': bigint } |
    { 'Nat64': bigint } |
    { 'Blob': Uint8Array | number[] } |
    { 'Text': string } |
    { 'Array': Vec }
>;
export interface _SERVICE {
    'get_blocks': ActorMethod<[GetBlocksRequest], GetBlocksResponse>,
    'get_data_certificate': ActorMethod<[], DataCertificate>,
    'get_transactions': ActorMethod<[GetBlocksRequest], GetTransactionsResponse>,
    'http_request': ActorMethod<[HttpRequest], HttpResponse>,
    'icrc1_balance_of': ActorMethod<[Account], bigint>,
    'icrc1_decimals': ActorMethod<[], number>,
    'icrc1_fee': ActorMethod<[], bigint>,
    'icrc1_metadata': ActorMethod<[], Array<[string, MetadataValue]>>,
    'icrc1_minting_account': ActorMethod<[], [] | [Account]>,
    'icrc1_name': ActorMethod<[], string>,
    'icrc1_supported_standards': ActorMethod<[], Array<StandardRecord>>,
    'icrc1_symbol': ActorMethod<[], string>,
    'icrc1_total_supply': ActorMethod<[], bigint>,
    'icrc1_transfer': ActorMethod<[TransferArg], Result>,
    'icrc2_allowance': ActorMethod<[AllowanceArgs], Allowance>,
    'icrc2_approve': ActorMethod<[ApproveArgs], Result_1>,
    'icrc2_transfer_from': ActorMethod<[TransferFromArgs], Result_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];