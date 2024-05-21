export const idlFactory = ({ IDL }) => {
    const TokenIdentifier = IDL.Text;
    const AccountIdentifier = IDL.Text;
    const User = IDL.Variant({
      'principal' : IDL.Principal,
      'address' : AccountIdentifier,
    });
    const BalanceRequest = IDL.Record({
      'token' : TokenIdentifier,
      'user' : User,
    });
    const Balance = IDL.Nat;
    const CommonError__1 = IDL.Variant({
      'InvalidToken' : TokenIdentifier,
      'Other' : IDL.Text,
    });
    const BalanceResponse = IDL.Variant({
      'ok' : Balance,
      'err' : CommonError__1,
    });
    const TokenIdentifier__1 = IDL.Text;
    const AccountIdentifier__1 = IDL.Text;
    const CommonError = IDL.Variant({
      'InvalidToken' : TokenIdentifier,
      'Other' : IDL.Text,
    });
    const Result_1 = IDL.Variant({
      'ok' : AccountIdentifier__1,
      'err' : CommonError,
    });
    const SubAccount__1 = IDL.Vec(IDL.Nat8);
    const Memo = IDL.Vec(IDL.Nat8);
    const SubAccount = IDL.Vec(IDL.Nat8);
    const TransferRequest = IDL.Record({
      'to' : User,
      'token' : TokenIdentifier,
      'notify' : IDL.Bool,
      'from' : User,
      'memo' : Memo,
      'subaccount' : IDL.Opt(SubAccount),
      'amount' : Balance,
    });
    const TransferResponse = IDL.Variant({
      'ok' : Balance,
      'err' : IDL.Variant({
        'CannotNotify' : AccountIdentifier,
        'InsufficientBalance' : IDL.Null,
        'InvalidToken' : TokenIdentifier,
        'Rejected' : IDL.Null,
        'Unauthorized' : AccountIdentifier,
        'Other' : IDL.Text,
      }),
    });
    const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
    const HttpRequest = IDL.Record({
      'url' : IDL.Text,
      'method' : IDL.Text,
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(HeaderField),
    });
    const HttpStreamingCallbackToken = IDL.Record({
      'key' : IDL.Text,
      'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'index' : IDL.Nat,
      'content_encoding' : IDL.Text,
    });
    const HttpStreamingCallbackResponse = IDL.Record({
      'token' : IDL.Opt(HttpStreamingCallbackToken),
      'body' : IDL.Vec(IDL.Nat8),
    });
    const HttpStreamingStrategy = IDL.Variant({
      'Callback' : IDL.Record({
        'token' : HttpStreamingCallbackToken,
        'callback' : IDL.Func(
            [HttpStreamingCallbackToken],
            [HttpStreamingCallbackResponse],
            ['query'],
          ),
      }),
    });
    const HttpResponse = IDL.Record({
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(HeaderField),
      'upgrade' : IDL.Bool,
      'streaming_strategy' : IDL.Opt(HttpStreamingStrategy),
      'status_code' : IDL.Nat16,
    });
    const TokenIndex = IDL.Nat32;
    const ecdsa_pk = IDL.Record({
      'public_key' : IDL.Vec(IDL.Nat8),
      'chain_code' : IDL.Vec(IDL.Nat8),
    });
    const Time = IDL.Int;
    const MintingEvent = IDL.Tuple(IDL.Vec(IDL.Nat32), AccountIdentifier__1);
    const Result = IDL.Variant({
      'ok' : IDL.Vec(TokenIndex),
      'err' : CommonError,
    });
    return IDL.Service({
      'acceptCycles' : IDL.Func([], [], []),
      'addMinter' : IDL.Func([IDL.Principal], [], []),
      'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
      'balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
      'bearer' : IDL.Func([TokenIdentifier__1], [Result_1], ['query']),
      'bioniq_bulk_wrap' : IDL.Func(
          [IDL.Opt(SubAccount__1), IDL.Nat],
          [IDL.Vec(TokenIdentifier__1)],
          [],
        ),
      'bioniq_unwrap' : IDL.Func(
          [TokenIdentifier__1, IDL.Opt(SubAccount__1), IDL.Vec(IDL.Nat8)],
          [IDL.Vec(IDL.Nat8)],
          [],
        ),
      'bioniq_wrap' : IDL.Func(
          [IDL.Opt(SubAccount__1)],
          [TokenIdentifier__1],
          [],
        ),
      'ext_balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
      'ext_bearer' : IDL.Func([TokenIdentifier__1], [Result_1], ['query']),
      'ext_transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
      'getTest' : IDL.Func(
          [TokenIdentifier__1],
          [IDL.Opt(AccountIdentifier__1)],
          ['query'],
        ),
      'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
      'http_request_update' : IDL.Func([HttpRequest], [HttpResponse], []),
      'management_addAdmin' : IDL.Func([IDL.Principal], [], []),
      'management_admins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
      'management_empty' : IDL.Func([TokenIndex], [], []),
      'management_mint' : IDL.Func(
          [TokenIdentifier__1, AccountIdentifier__1],
          [IDL.Bool],
          [],
        ),
      'management_pubkey' : IDL.Func([], [ecdsa_pk], []),
      'management_recycle' : IDL.Func([TokenIndex], [], []),
      'management_recycledTokens' : IDL.Func([], [IDL.Vec(TokenIndex)], []),
      'management_removeAdmin' : IDL.Func([IDL.Principal], [], []),
      'management_settings' : IDL.Func(
          [
            IDL.Record({
              'eventTickLength' : IDL.Nat,
              'eventsPerTick' : IDL.Nat,
              'eventRestLength' : IDL.Nat,
            }),
          ],
          [],
          [],
        ),
      'management_sign' : IDL.Func(
          [TokenIndex, IDL.Vec(IDL.Nat8)],
          [IDL.Opt(IDL.Vec(IDL.Nat8))],
          [],
        ),
      'management_tokenpubkey' : IDL.Func([TokenIndex], [ecdsa_pk], []),
      'management_transfer' : IDL.Func(
          [TokenIdentifier__1, AccountIdentifier__1],
          [IDL.Bool],
          [],
        ),
      'management_unwrappedTokenIds' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, Time))],
          [],
        ),
      'mint_voucher' : IDL.Func([MintingEvent], [IDL.Bool], []),
      'mint_voucher_bulk' : IDL.Func([IDL.Vec(MintingEvent)], [IDL.Bool], []),
      'minters' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
      'queue_pending' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
          ['query'],
        ),
      'queue_start' : IDL.Func([], [], []),
      'queue_status' : IDL.Func([], [IDL.Bool], ['query']),
      'queue_stop' : IDL.Func([], [], []),
      'tokens' : IDL.Func([AccountIdentifier__1], [Result], ['query']),
      'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
    });
  };
  export const init = ({ IDL }) => { return []; };