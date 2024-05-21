export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const AirdropId = IDL.Nat;
  const AirdropStatus = IDL.Variant({
    'Open' : IDL.Null,
    'EntryClosed' : IDL.Null,
    'RaffleCompleted' : IDL.Null,
    'PrizesDelivered' : IDL.Null,
    'PrizesAssigned' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Time = IDL.Int;
  const AirdropTiming = IDL.Record({
    'startTime' : IDL.Opt(Time),
    'endTime' : IDL.Opt(Time),
    'maxDuration' : Time,
  });
  const AirdropMetadata = IDL.Record({
    'id' : IDL.Nat,
    'twitter' : IDL.Text,
    'chat' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'learnMore' : IDL.Text,
  });
  const Code__1 = IDL.Text;
  const TokenDetails = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'amount' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Timestamp = IDL.Nat64;
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const DistributionStatus__1 = IDL.Variant({
    'Distributed' : IDL.Nat,
    'Failed' : TransferError,
    'NotDistributed' : IDL.Null,
  });
  const Prize__1 = IDL.Record({
    'decimals' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'distributionStatus' : DistributionStatus__1,
    'airdropId' : IDL.Nat,
    'amount' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const RaffleOutput = IDL.Vec(IDL.Tuple(IDL.Principal, Prize__1));
  const RaffleInput = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'distributionPrizes' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
    'airdropId' : IDL.Nat,
    'amount' : IDL.Nat,
    'qualified' : IDL.Vec(IDL.Principal),
    'distributionTiers' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
    'symbol' : IDL.Text,
  });
  const RaffleData = IDL.Record({
    'output' : RaffleOutput,
    'input' : RaffleInput,
  });
  const AirdropDistribution = IDL.Record({
    'distributionPrizes' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
    'distributionTiers' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
  });
  const AirdropLimits = IDL.Record({ 'maxParticipants' : IDL.Nat });
  const Airdrop = IDL.Record({
    'status' : AirdropStatus,
    'timing' : AirdropTiming,
    'metadata' : AirdropMetadata,
    'code' : Code__1,
    'tokenDetails' : TokenDetails,
    'raffle' : IDL.Opt(RaffleData),
    'distribution' : AirdropDistribution,
    'qualified' : IDL.Vec(IDL.Principal),
    'limits' : AirdropLimits,
  });
  const AirdropDashboard = IDL.Record({
    'status' : AirdropStatus,
    'metadata' : AirdropMetadata,
    'tokenDetails' : TokenDetails,
    'limits' : AirdropLimits,
    'numberOfQualified' : IDL.Nat,
  });
  const GetLogMessagesFilter = IDL.Record({
    'analyzeCount' : IDL.Nat32,
    'messageRegex' : IDL.Opt(IDL.Text),
    'messageContains' : IDL.Opt(IDL.Text),
  });
  const Nanos = IDL.Nat64;
  const GetLogMessagesParameters = IDL.Record({
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
    'fromTimeNanos' : IDL.Opt(Nanos),
  });
  const GetLatestLogMessagesParameters = IDL.Record({
    'upToTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
  });
  const CanisterLogRequest = IDL.Variant({
    'getMessagesInfo' : IDL.Null,
    'getMessages' : GetLogMessagesParameters,
    'getLatestMessages' : GetLatestLogMessagesParameters,
  });
  const CanisterLogFeature = IDL.Variant({
    'filterMessageByContains' : IDL.Null,
    'filterMessageByRegex' : IDL.Null,
  });
  const CanisterLogMessagesInfo = IDL.Record({
    'features' : IDL.Vec(IDL.Opt(CanisterLogFeature)),
    'lastTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'firstTimeNanos' : IDL.Opt(Nanos),
  });
  const LogMessagesData = IDL.Record({
    'timeNanos' : Nanos,
    'message' : IDL.Text,
  });
  const CanisterLogMessages = IDL.Record({
    'data' : IDL.Vec(LogMessagesData),
    'lastAnalyzedMessageTimeNanos' : IDL.Opt(Nanos),
  });
  const CanisterLogResponse = IDL.Variant({
    'messagesInfo' : CanisterLogMessagesInfo,
    'messages' : CanisterLogMessages,
  });
  const MetricsGranularity = IDL.Variant({
    'hourly' : IDL.Null,
    'daily' : IDL.Null,
  });
  const GetMetricsParameters = IDL.Record({
    'dateToMillis' : IDL.Nat,
    'granularity' : MetricsGranularity,
    'dateFromMillis' : IDL.Nat,
  });
  const UpdateCallsAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterHeapMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterCyclesAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const HourlyMetricsData = IDL.Record({
    'updateCalls' : UpdateCallsAggregatedData,
    'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
    'canisterCycles' : CanisterCyclesAggregatedData,
    'canisterMemorySize' : CanisterMemoryAggregatedData,
    'timeMillis' : IDL.Int,
  });
  const NumericEntity = IDL.Record({
    'avg' : IDL.Nat64,
    'max' : IDL.Nat64,
    'min' : IDL.Nat64,
    'first' : IDL.Nat64,
    'last' : IDL.Nat64,
  });
  const DailyMetricsData = IDL.Record({
    'updateCalls' : IDL.Nat64,
    'canisterHeapMemorySize' : NumericEntity,
    'canisterCycles' : NumericEntity,
    'canisterMemorySize' : NumericEntity,
    'timeMillis' : IDL.Int,
  });
  const CanisterMetricsData = IDL.Variant({
    'hourly' : IDL.Vec(HourlyMetricsData),
    'daily' : IDL.Vec(DailyMetricsData),
  });
  const CanisterMetrics = IDL.Record({ 'data' : CanisterMetricsData });
  const Email = IDL.Record({
    'id' : IDL.Nat,
    'code' : IDL.Text,
    'email' : IDL.Text,
  });
  const TimerId = IDL.Nat;
  const Stats = IDL.Record({
    'numberOfSubmissions' : IDL.Nat,
    'numberUsers' : IDL.Nat,
    'numberAliens' : IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat)),
    'numberConf' : IDL.Nat,
    'numberMeetups' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'numberBlacklisted' : IDL.Nat,
    'numberVerifiedUsers' : IDL.Nat,
  });
  const TransferData = IDL.Vec(
    IDL.Tuple(IDL.Principal, IDL.Principal, IDL.Nat)
  );
  const Result_3 = IDL.Variant({ 'ok' : TransferData, 'err' : IDL.Text });
  const Time__1 = IDL.Int;
  const TokenIndex = IDL.Nat32;
  const DistributionStatus = IDL.Variant({
    'Distributed' : IDL.Nat,
    'Failed' : TransferError,
    'NotDistributed' : IDL.Null,
  });
  const Prize = IDL.Record({
    'decimals' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'distributionStatus' : DistributionStatus,
    'airdropId' : IDL.Nat,
    'amount' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const User = IDL.Record({
    'numberOfPoints' : IDL.Nat,
    'verificationTime' : IDL.Opt(Time__1),
    'email' : IDL.Text,
    'alienId' : IDL.Opt(TokenIndex),
    'prizes' : IDL.Vec(Prize),
    'wallet' : IDL.Principal,
    'alienLevel' : IDL.Nat,
    'registrationTime' : Time__1,
    'numberOfSubmission' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const AirdropInit = IDL.Record({
    'timing' : AirdropTiming,
    'metadata' : AirdropMetadata,
    'code' : Code__1,
    'tokenDetails' : TokenDetails,
    'distribution' : AirdropDistribution,
    'limits' : AirdropLimits,
  });
  const SpecialCode = IDL.Record({
    'numberOfPoints' : IDL.Nat,
    'code' : IDL.Text,
    'usageCount' : IDL.Nat,
    'maxUsage' : IDL.Nat,
  });
  const TokensData = IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text));
  const TokensDataVolt = IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Nat32));
  const TransferResult = IDL.Vec(
    IDL.Tuple(IDL.Principal, IDL.Principal, DistributionStatus)
  );
  const Result__1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const AccountIdentifier = IDL.Text;
  const Code = IDL.Text;
  const AirdropManager = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [Result], []),
    'allocatePrizes' : IDL.Func([], [], []),
    'blacklistAdmin' : IDL.Func([IDL.Principal], [], []),
    'collectCanisterMetrics' : IDL.Func([], [], []),
    'exportDataAirdrop' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat))],
        [],
      ),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getAirdrop' : IDL.Func([AirdropId], [IDL.Opt(Airdrop)], ['query']),
    'getAlienId' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat32)], []),
    'getAllAirdropsDashboard' : IDL.Func(
        [],
        [IDL.Vec(AirdropDashboard)],
        ['query'],
      ),
    'getBlacklist' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getCanisterLog' : IDL.Func(
        [IDL.Opt(CanisterLogRequest)],
        [IDL.Opt(CanisterLogResponse)],
        ['query'],
      ),
    'getCanisterMetrics' : IDL.Func(
        [GetMetricsParameters],
        [IDL.Opt(CanisterMetrics)],
        ['query'],
      ),
    'getEmails' : IDL.Func([], [IDL.Vec(Email)], ['query']),
    'getNumberOfPoints' : IDL.Func([IDL.Principal], [IDL.Nat], []),
    'getQualifiedAirdrops' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'getRunningJobsAdmin' : IDL.Func([], [IDL.Vec(TimerId)], ['query']),
    'getStats' : IDL.Func([], [Stats], []),
    'getTransfersDataAirdrop' : IDL.Func([IDL.Nat], [Result_3], ['query']),
    'getUser' : IDL.Func([], [Result_2], ['query']),
    'getUserAdmin' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'isMissingData' : IDL.Func([], [IDL.Vec(IDL.Nat32)], []),
    'loadAirdropAdmin' : IDL.Func([AirdropInit], [Result], []),
    'loadSpecialCodesAdmin' : IDL.Func([IDL.Vec(SpecialCode)], [Result], []),
    'loadTokensData' : IDL.Func([TokensData], [], []),
    'loadTokensDataVolt' : IDL.Func([TokensDataVolt], [], []),
    'notifyDistribution' : IDL.Func([IDL.Nat, TransferResult], [], []),
    'registerUser' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Text],
        [Result],
        [],
      ),
    'removeAdmin' : IDL.Func([IDL.Principal], [Result__1], []),
    'removeCronJobsAdmin' : IDL.Func([], [Result], []),
    'removeDuplicatePrizes' : IDL.Func([], [], []),
    'removeJobAdmin' : IDL.Func([IDL.Nat], [Result], []),
    'reportSentEmails' : IDL.Func([IDL.Vec(IDL.Nat)], [Result], []),
    'setCronJobsAdmin' : IDL.Func([], [Result], []),
    'setDockerAdmin' : IDL.Func([IDL.Principal], [], []),
    'setMaxMessagesCount' : IDL.Func([IDL.Nat], [], []),
    'submitCode' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'transferAlien' : IDL.Func([AccountIdentifier], [Result], []),
    'verifyUser' : IDL.Func([Code], [Result], []),
    'whitelistAdmin' : IDL.Func([IDL.Principal], [], []),
  });
  return AirdropManager;
};
export const init = ({ IDL }) => { return []; };
