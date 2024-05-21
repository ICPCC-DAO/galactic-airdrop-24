import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountIdentifier = string;
export interface Airdrop {
  'status' : AirdropStatus,
  'timing' : AirdropTiming,
  'metadata' : AirdropMetadata,
  'code' : Code__1,
  'tokenDetails' : TokenDetails,
  'raffle' : [] | [RaffleData],
  'distribution' : AirdropDistribution,
  'qualified' : Array<Principal>,
  'limits' : AirdropLimits,
}
export interface AirdropDashboard {
  'status' : AirdropStatus,
  'metadata' : AirdropMetadata,
  'tokenDetails' : TokenDetails,
  'limits' : AirdropLimits,
  'numberOfQualified' : bigint,
}
export interface AirdropDistribution {
  'distributionPrizes' : [number, number, number],
  'distributionTiers' : [number, number, number],
}
export type AirdropId = bigint;
export interface AirdropInit {
  'timing' : AirdropTiming,
  'metadata' : AirdropMetadata,
  'code' : Code__1,
  'tokenDetails' : TokenDetails,
  'distribution' : AirdropDistribution,
  'limits' : AirdropLimits,
}
export interface AirdropLimits { 'maxParticipants' : bigint }
export interface AirdropManager {
  'addAdmin' : ActorMethod<[string], Result>,
  'allocatePrizes' : ActorMethod<[], undefined>,
  'blacklistAdmin' : ActorMethod<[Principal], undefined>,
  'collectCanisterMetrics' : ActorMethod<[], undefined>,
  'exportDataAirdrop' : ActorMethod<
    [],
    Array<[string, Principal, Principal, bigint]>
  >,
  'getAdmins' : ActorMethod<[], Array<Principal>>,
  'getAirdrop' : ActorMethod<[AirdropId], [] | [Airdrop]>,
  'getAlienId' : ActorMethod<[Principal], [] | [number]>,
  'getAllAirdropsDashboard' : ActorMethod<[], Array<AirdropDashboard>>,
  'getBlacklist' : ActorMethod<[], Array<Principal>>,
  'getCanisterLog' : ActorMethod<
    [[] | [CanisterLogRequest]],
    [] | [CanisterLogResponse]
  >,
  'getCanisterMetrics' : ActorMethod<
    [GetMetricsParameters],
    [] | [CanisterMetrics]
  >,
  'getEmails' : ActorMethod<[], Array<Email>>,
  'getNumberOfPoints' : ActorMethod<[Principal], bigint>,
  'getQualifiedAirdrops' : ActorMethod<[], Array<bigint>>,
  'getRunningJobsAdmin' : ActorMethod<[], Array<TimerId>>,
  'getStats' : ActorMethod<[], Stats>,
  'getTransfersDataAirdrop' : ActorMethod<[bigint], Result_3>,
  'getUser' : ActorMethod<[], Result_2>,
  'getUserAdmin' : ActorMethod<[Principal], Result_2>,
  'isMissingData' : ActorMethod<[], Uint32Array | number[]>,
  'loadAirdropAdmin' : ActorMethod<[AirdropInit], Result>,
  'loadSpecialCodesAdmin' : ActorMethod<[Array<SpecialCode>], Result>,
  'loadTokensData' : ActorMethod<[TokensData], undefined>,
  'loadTokensDataVolt' : ActorMethod<[TokensDataVolt], undefined>,
  'notifyDistribution' : ActorMethod<[bigint, TransferResult], undefined>,
  'registerUser' : ActorMethod<[string, Principal, string], Result>,
  'removeAdmin' : ActorMethod<[Principal], Result__1>,
  'removeCronJobsAdmin' : ActorMethod<[], Result>,
  'removeDuplicatePrizes' : ActorMethod<[], undefined>,
  'removeJobAdmin' : ActorMethod<[bigint], Result>,
  'reportSentEmails' : ActorMethod<[Array<bigint>], Result>,
  'setCronJobsAdmin' : ActorMethod<[], Result>,
  'setDockerAdmin' : ActorMethod<[Principal], undefined>,
  'setMaxMessagesCount' : ActorMethod<[bigint], undefined>,
  'submitCode' : ActorMethod<[string, string], Result_1>,
  'transferAlien' : ActorMethod<[AccountIdentifier], Result>,
  'verifyUser' : ActorMethod<[Code], Result>,
  'whitelistAdmin' : ActorMethod<[Principal], undefined>,
}
export interface AirdropMetadata {
  'id' : bigint,
  'twitter' : string,
  'chat' : string,
  'name' : string,
  'description' : string,
  'learnMore' : string,
}
export type AirdropStatus = { 'Open' : null } |
  { 'EntryClosed' : null } |
  { 'RaffleCompleted' : null } |
  { 'PrizesDelivered' : null } |
  { 'PrizesAssigned' : null } |
  { 'Pending' : null };
export interface AirdropTiming {
  'startTime' : [] | [Time],
  'endTime' : [] | [Time],
  'maxDuration' : Time,
}
export type CanisterCyclesAggregatedData = BigUint64Array | bigint[];
export type CanisterHeapMemoryAggregatedData = BigUint64Array | bigint[];
export type CanisterLogFeature = { 'filterMessageByContains' : null } |
  { 'filterMessageByRegex' : null };
export interface CanisterLogMessages {
  'data' : Array<LogMessagesData>,
  'lastAnalyzedMessageTimeNanos' : [] | [Nanos],
}
export interface CanisterLogMessagesInfo {
  'features' : Array<[] | [CanisterLogFeature]>,
  'lastTimeNanos' : [] | [Nanos],
  'count' : number,
  'firstTimeNanos' : [] | [Nanos],
}
export type CanisterLogRequest = { 'getMessagesInfo' : null } |
  { 'getMessages' : GetLogMessagesParameters } |
  { 'getLatestMessages' : GetLatestLogMessagesParameters };
export type CanisterLogResponse = { 'messagesInfo' : CanisterLogMessagesInfo } |
  { 'messages' : CanisterLogMessages };
export type CanisterMemoryAggregatedData = BigUint64Array | bigint[];
export interface CanisterMetrics { 'data' : CanisterMetricsData }
export type CanisterMetricsData = { 'hourly' : Array<HourlyMetricsData> } |
  { 'daily' : Array<DailyMetricsData> };
export type Code = string;
export type Code__1 = string;
export interface DailyMetricsData {
  'updateCalls' : bigint,
  'canisterHeapMemorySize' : NumericEntity,
  'canisterCycles' : NumericEntity,
  'canisterMemorySize' : NumericEntity,
  'timeMillis' : bigint,
}
export type DistributionStatus = { 'Distributed' : bigint } |
  { 'Failed' : TransferError } |
  { 'NotDistributed' : null };
export type DistributionStatus__1 = { 'Distributed' : bigint } |
  { 'Failed' : TransferError } |
  { 'NotDistributed' : null };
export interface Email { 'id' : bigint, 'code' : string, 'email' : string }
export interface GetLatestLogMessagesParameters {
  'upToTimeNanos' : [] | [Nanos],
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
}
export interface GetLogMessagesFilter {
  'analyzeCount' : number,
  'messageRegex' : [] | [string],
  'messageContains' : [] | [string],
}
export interface GetLogMessagesParameters {
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
  'fromTimeNanos' : [] | [Nanos],
}
export interface GetMetricsParameters {
  'dateToMillis' : bigint,
  'granularity' : MetricsGranularity,
  'dateFromMillis' : bigint,
}
export interface HourlyMetricsData {
  'updateCalls' : UpdateCallsAggregatedData,
  'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
  'canisterCycles' : CanisterCyclesAggregatedData,
  'canisterMemorySize' : CanisterMemoryAggregatedData,
  'timeMillis' : bigint,
}
export interface LogMessagesData { 'timeNanos' : Nanos, 'message' : string }
export type MetricsGranularity = { 'hourly' : null } |
  { 'daily' : null };
export type Nanos = bigint;
export interface NumericEntity {
  'avg' : bigint,
  'max' : bigint,
  'min' : bigint,
  'first' : bigint,
  'last' : bigint,
}
export interface Prize {
  'decimals' : bigint,
  'ledgerId' : Principal,
  'distributionStatus' : DistributionStatus,
  'airdropId' : bigint,
  'amount' : bigint,
  'symbol' : string,
}
export interface Prize__1 {
  'decimals' : bigint,
  'ledgerId' : Principal,
  'distributionStatus' : DistributionStatus__1,
  'airdropId' : bigint,
  'amount' : bigint,
  'symbol' : string,
}
export interface RaffleData { 'output' : RaffleOutput, 'input' : RaffleInput }
export interface RaffleInput {
  'fee' : bigint,
  'decimals' : bigint,
  'ledgerId' : Principal,
  'distributionPrizes' : [number, number, number],
  'airdropId' : bigint,
  'amount' : bigint,
  'qualified' : Array<Principal>,
  'distributionTiers' : [number, number, number],
  'symbol' : string,
}
export type RaffleOutput = Array<[Principal, Prize__1]>;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : User } |
  { 'err' : string };
export type Result_3 = { 'ok' : TransferData } |
  { 'err' : string };
export type Result__1 = { 'ok' : null } |
  { 'err' : string };
export interface SpecialCode {
  'numberOfPoints' : bigint,
  'code' : string,
  'usageCount' : bigint,
  'maxUsage' : bigint,
}
export interface Stats {
  'numberOfSubmissions' : bigint,
  'numberUsers' : bigint,
  'numberAliens' : Array<[bigint, bigint]>,
  'numberConf' : bigint,
  'numberMeetups' : Array<[string, bigint]>,
  'numberBlacklisted' : bigint,
  'numberVerifiedUsers' : bigint,
}
export type Time = bigint;
export type Time__1 = bigint;
export type TimerId = bigint;
export type Timestamp = bigint;
export interface TokenDetails {
  'fee' : bigint,
  'decimals' : bigint,
  'ledgerId' : Principal,
  'amount' : bigint,
  'symbol' : string,
}
export type TokenIndex = number;
export type TokensData = Array<[number, string]>;
export type TokensDataVolt = Array<[number, number]>;
export type TransferData = Array<[Principal, Principal, bigint]>;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TransferResult = Array<[Principal, Principal, DistributionStatus]>;
export type UpdateCallsAggregatedData = BigUint64Array | bigint[];
export interface User {
  'numberOfPoints' : bigint,
  'verificationTime' : [] | [Time__1],
  'email' : string,
  'alienId' : [] | [TokenIndex],
  'prizes' : Array<Prize>,
  'wallet' : Principal,
  'alienLevel' : bigint,
  'registrationTime' : Time__1,
  'numberOfSubmission' : bigint,
}
export interface _SERVICE extends AirdropManager {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
