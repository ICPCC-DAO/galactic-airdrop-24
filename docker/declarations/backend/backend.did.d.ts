import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AirdropDashboard {
  'id': bigint,
  'startTime': [] | [Time],
  'status': AirdropStatus,
  'name': string,
  'description': string,
  'learnMore': string,
  'maxDuration': Time,
  'maxParticipants': bigint,
  'prize': Prize__1,
  'qualified': boolean,
  'numberOfParticipants': bigint,
}
export interface AirdropInit {
  'id': bigint,
  'startTime': Time,
  'ledgerId': Principal,
  'code': Code__2,
  'name': string,
  'description': string,
  'learnMore': string,
  'distributionPrizes': [number, number, number],
  'maxDuration': Time,
  'maxParticipants': bigint,
  'prize': Prize__1,
  'distributionTiers': [number, number, number],
}
export interface AirdropManager {
  'addAdmin': ActorMethod<[string], Result__1>,
  'collectCanisterMetrics': ActorMethod<[], undefined>,
  'cronAirdrops': ActorMethod<[], undefined>,
  'defineAirdrop': ActorMethod<[AirdropInit], Result>,
  'getAdmins': ActorMethod<[], Result__1_1>,
  'getAllAirdropsDashboard': ActorMethod<[], Array<AirdropDashboard>>,
  'getBalanceAdmin': ActorMethod<[], Array<Balance>>,
  'getCanisterLog': ActorMethod<
    [[] | [CanisterLogRequest]],
    [] | [CanisterLogResponse]
  >,
  'getCanisterMetrics': ActorMethod<
    [GetMetricsParameters],
    [] | [CanisterMetrics]
  >,
  'getEmails': ActorMethod<[], Array<Email>>,
  'getPrizes': ActorMethod<[], Array<Prize>>,
  'getUser': ActorMethod<[], Result_2>,
  'getWalletAddressAdmin': ActorMethod<[], string>,
  'initiateWithdrawalRequest': ActorMethod<[], Result_1>,
  'registerUser': ActorMethod<[string, Principal], Result>,
  'removeAdmin': ActorMethod<[string], Result__1>,
  'reportSentEmails': ActorMethod<[Array<bigint>], Result>,
  'setMaxMessagesCount': ActorMethod<[bigint], undefined>,
  'setWallet': ActorMethod<[Principal], Result>,
  'startAirdropAdmin': ActorMethod<[bigint], Result>,
  'submitCode': ActorMethod<[bigint, string], CodeSubmissionResult>,
  'updatePrizesAdmin': ActorMethod<[], undefined>,
  'verifyUser': ActorMethod<[Code], Result>,
}
export type AirdropStatus = { 'Distributed': null } |
{ 'Ended': null } |
{ 'Active': null } |
{ 'Upcoming': null };
export interface Balance { 'realAmount': bigint, 'committedAmount': bigint }
export type CanisterCyclesAggregatedData = BigUint64Array | bigint[];
export type CanisterHeapMemoryAggregatedData = BigUint64Array | bigint[];
export type CanisterLogFeature = { 'filterMessageByContains': null } |
{ 'filterMessageByRegex': null };
export interface CanisterLogMessages {
  'data': Array<LogMessagesData>,
  'lastAnalyzedMessageTimeNanos': [] | [Nanos],
}
export interface CanisterLogMessagesInfo {
  'features': Array<[] | [CanisterLogFeature]>,
  'lastTimeNanos': [] | [Nanos],
  'count': number,
  'firstTimeNanos': [] | [Nanos],
}
export type CanisterLogRequest = { 'getMessagesInfo': null } |
{ 'getMessages': GetLogMessagesParameters } |
{ 'getLatestMessages': GetLatestLogMessagesParameters };
export type CanisterLogResponse = { 'messagesInfo': CanisterLogMessagesInfo } |
{ 'messages': CanisterLogMessages };
export type CanisterMemoryAggregatedData = BigUint64Array | bigint[];
export interface CanisterMetrics { 'data': CanisterMetricsData }
export type CanisterMetricsData = { 'hourly': Array<HourlyMetricsData> } |
{ 'daily': Array<DailyMetricsData> };
export type Code = string;
export type CodeSubmissionError = { 'CodeInvalid': null } |
{ 'CodeMaxUsageReached': null } |
{ 'UserAlreadyQualified': null } |
{ 'AirdropNotStarted': null } |
{ 'CodeNotFound': null } |
{ 'AirdropEnded': null } |
{ 'AirdropNotFound': null };
export type CodeSubmissionResult = { 'ok': null } |
{ 'err': CodeSubmissionError };
export type Code__1 = string;
export type Code__2 = string;
export interface DailyMetricsData {
  'updateCalls': bigint,
  'canisterHeapMemorySize': NumericEntity,
  'canisterCycles': NumericEntity,
  'canisterMemorySize': NumericEntity,
  'timeMillis': bigint,
}
export interface Email { 'id': bigint, 'code': string, 'email': string }
export interface GetLatestLogMessagesParameters {
  'upToTimeNanos': [] | [Nanos],
  'count': number,
  'filter': [] | [GetLogMessagesFilter],
}
export interface GetLogMessagesFilter {
  'analyzeCount': number,
  'messageRegex': [] | [string],
  'messageContains': [] | [string],
}
export interface GetLogMessagesParameters {
  'count': number,
  'filter': [] | [GetLogMessagesFilter],
  'fromTimeNanos': [] | [Nanos],
}
export interface GetMetricsParameters {
  'dateToMillis': bigint,
  'granularity': MetricsGranularity,
  'dateFromMillis': bigint,
}
export interface HourlyMetricsData {
  'updateCalls': UpdateCallsAggregatedData,
  'canisterHeapMemorySize': CanisterHeapMemoryAggregatedData,
  'canisterCycles': CanisterCyclesAggregatedData,
  'canisterMemorySize': CanisterMemoryAggregatedData,
  'timeMillis': bigint,
}
export interface LogMessagesData { 'timeNanos': Nanos, 'message': string }
export type MetricsGranularity = { 'hourly': null } |
{ 'daily': null };
export type Nanos = bigint;
export interface NumericEntity {
  'avg': bigint,
  'max': bigint,
  'min': bigint,
  'first': bigint,
  'last': bigint,
}
export type Prize = { 'Token': Token };
export type Prize__1 = { 'Token': Token__1 };
export type Result = { 'ok': null } |
{ 'err': string };
export type Result_1 = { 'ok': bigint } |
{ 'err': WithdrawalError };
export type Result_2 = { 'ok': User } |
{ 'err': string };
export type Result__1 = { 'ok': null } |
{ 'err': string };
export type Result__1_1 = { 'ok': Array<string> } |
{ 'err': string };
export type Time = bigint;
export interface Token {
  'fee': bigint,
  'ledgerId': Principal,
  'name': string,
  'amount': bigint,
  'decimal': bigint,
  'symbol': string,
}
export interface Token__1 {
  'fee': bigint,
  'ledgerId': Principal,
  'name': string,
  'amount': bigint,
  'decimal': bigint,
  'symbol': string,
}
export type UpdateCallsAggregatedData = BigUint64Array | bigint[];
export interface User {
  'numberOfSubmissions': bigint,
  'principal': Principal,
  'withdrawalAccount': Principal,
  'email': string,
  'verification': Verification,
}
export interface Verification {
  'status': VerificationStatus,
  'code': Code__1,
  'attempts': bigint,
}
export type VerificationStatus = { 'Failed': null } |
{ 'Verified': null } |
{ 'Pending': null };
export type WithdrawalError = { 'AlreadyPending': null } |
{ 'NoPrizes': null } |
{ 'WithdrawalAccountNotFound': null } |
{ 'TooManyPending': null } |
{ 'UserNotFound': null };
export interface _SERVICE extends AirdropManager { }
export declare const idlFactory: IDL.InterfaceFactory;
// export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
