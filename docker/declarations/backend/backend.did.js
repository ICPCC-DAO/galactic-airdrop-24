export const idlFactory = ({ IDL }) => {
  const Result__1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Code__2 = IDL.Text;
  const Token__1 = IDL.Record({
    'fee' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'name' : IDL.Text,
    'amount' : IDL.Nat,
    'decimal' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Prize__1 = IDL.Variant({ 'Token' : Token__1 });
  const AirdropInit = IDL.Record({
    'id' : IDL.Nat,
    'startTime' : Time,
    'ledgerId' : IDL.Principal,
    'code' : Code__2,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'learnMore' : IDL.Text,
    'distributionPrizes' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
    'maxDuration' : Time,
    'maxParticipants' : IDL.Nat,
    'prize' : Prize__1,
    'distributionTiers' : IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result__1_1 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Text),
    'err' : IDL.Text,
  });
  const AirdropStatus = IDL.Variant({
    'Distributed' : IDL.Null,
    'Ended' : IDL.Null,
    'Active' : IDL.Null,
    'Upcoming' : IDL.Null,
  });
  const AirdropDashboard = IDL.Record({
    'id' : IDL.Nat,
    'startTime' : IDL.Opt(Time),
    'status' : AirdropStatus,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'learnMore' : IDL.Text,
    'maxDuration' : Time,
    'maxParticipants' : IDL.Nat,
    'prize' : Prize__1,
    'qualified' : IDL.Bool,
    'numberOfParticipants' : IDL.Nat,
  });
  const Balance = IDL.Record({
    'realAmount' : IDL.Nat,
    'committedAmount' : IDL.Nat,
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
  const Token = IDL.Record({
    'fee' : IDL.Nat,
    'ledgerId' : IDL.Principal,
    'name' : IDL.Text,
    'amount' : IDL.Nat,
    'decimal' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Prize = IDL.Variant({ 'Token' : Token });
  const VerificationStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Verified' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Code__1 = IDL.Text;
  const Verification = IDL.Record({
    'status' : VerificationStatus,
    'code' : Code__1,
    'attempts' : IDL.Nat,
  });
  const User = IDL.Record({
    'numberOfSubmissions' : IDL.Nat,
    'principal' : IDL.Principal,
    'withdrawalAccount' : IDL.Principal,
    'email' : IDL.Text,
    'verification' : Verification,
  });
  const Result_2 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const WithdrawalError = IDL.Variant({
    'AlreadyPending' : IDL.Null,
    'NoPrizes' : IDL.Null,
    'WithdrawalAccountNotFound' : IDL.Null,
    'TooManyPending' : IDL.Null,
    'UserNotFound' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : WithdrawalError });
  const CodeSubmissionError = IDL.Variant({
    'CodeInvalid' : IDL.Null,
    'CodeMaxUsageReached' : IDL.Null,
    'UserAlreadyQualified' : IDL.Null,
    'AirdropNotStarted' : IDL.Null,
    'CodeNotFound' : IDL.Null,
    'AirdropEnded' : IDL.Null,
    'AirdropNotFound' : IDL.Null,
  });
  const CodeSubmissionResult = IDL.Variant({
    'ok' : IDL.Null,
    'err' : CodeSubmissionError,
  });
  const Code = IDL.Text;
  const AirdropManager = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Text], [Result__1], []),
    'collectCanisterMetrics' : IDL.Func([], [], []),
    'cronAirdrops' : IDL.Func([], [], []),
    'defineAirdrop' : IDL.Func([AirdropInit], [Result], []),
    'getAdmins' : IDL.Func([], [Result__1_1], ['query']),
    'getAllAirdropsDashboard' : IDL.Func(
        [],
        [IDL.Vec(AirdropDashboard)],
        ['query'],
      ),
    'getBalanceAdmin' : IDL.Func([], [IDL.Vec(Balance)], ['query']),
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
    'getPrizes' : IDL.Func([], [IDL.Vec(Prize)], ['query']),
    'getUser' : IDL.Func([], [Result_2], ['query']),
    'getWalletAddressAdmin' : IDL.Func([], [IDL.Text], ['query']),
    'initiateWithdrawalRequest' : IDL.Func([], [Result_1], []),
    'registerUser' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'removeAdmin' : IDL.Func([IDL.Text], [Result__1], []),
    'reportSentEmails' : IDL.Func([IDL.Vec(IDL.Nat)], [Result], []),
    'setMaxMessagesCount' : IDL.Func([IDL.Nat], [], []),
    'setWallet' : IDL.Func([IDL.Principal], [Result], []),
    'startAirdropAdmin' : IDL.Func([IDL.Nat], [Result], []),
    'submitCode' : IDL.Func([IDL.Nat, IDL.Text], [CodeSubmissionResult], []),
    'updatePrizesAdmin' : IDL.Func([], [], []),
    'verifyUser' : IDL.Func([Code], [Result], []),
  });
  return AirdropManager;
};
export const init = ({ IDL }) => { return []; };
