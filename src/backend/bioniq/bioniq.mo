import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Account "./util/AccountIdentifier";
module {

  public type AccountIdentifier = Text;
  public type TokenIndex = Nat32;

  public type GalacticAlienActor = actor {
    bioniq_mint : (accountIdentifier : AccountIdentifier) -> async Result.Result<TokenIndex, Text>;
    bioniq_levelup : (tokenIndex : TokenIndex) -> async Result.Result<Text, Text>;
  };

  public type Balance = Nat;
  public type User = { #principal : Principal; #address : AccountIdentifier };
  public type Memo = [Nat8];
  public type SubAccount = [Nat8];
  public type TokenIdentifier = Text;

  public type TransferRequest = {
    amount : Balance;
    from : User;
    memo : Memo;
    notify : Bool;
    subaccount : ?SubAccount;
    to : User;
    token : TokenIdentifier;
  };

  public type TransferResponse = {
    #ok : Balance;
    #err : {
      #CannotNotify : AccountIdentifier;
      #InsufficientBalance;
      #InvalidToken : TokenIdentifier;
      #Rejected;
      #Unauthorized : AccountIdentifier;
      #Other : Text;
    };
  };

  public type ExtActor = actor {
    transfer : (request : TransferRequest) -> async TransferResponse;
  };

  public func transferErrorToText(t : TransferResponse) : Text {
    switch (t) {
      case (#ok(id)) {
        return "ok";
      };
      case (#err(#CannotNotify(_))) {
        return "CannotNotify";
      };
      case (#err(#InsufficientBalance(_))) {
        return "InsufficientBalance";
      };
      case (#err(#InvalidToken(_))) {
        return "InvalidToken";
      };
      case (#err(#Rejected(_))) {
        return "Rejected";
      };
      case (#err(#Unauthorized(_))) {
        return "Unauthorized";
      };
      case (#err(#Other(_))) {
        return "Other";
      };
    };
  };

  public func getAccountIdentifier(p : Principal) : AccountIdentifier {
    return Account.fromPrincipal(p, null);
  };

  public type VoltActor = actor {
    user_transfer : (request : TransferRequestVolt) -> async Result.Result<TransferResponseVolt, Text>;
  };

  public type TransferRequestVolt = {
    amount : Nat;
    canister : Text;
    id : ?Nat;
    fee : ?Nat;
    memo : ?Blob;
    notify : ?Bool;
    other : ?Blob;
    standard : Text;
    to : Text;
  };

  public type TransferResponseVolt = {
    data : ?Blob;
    error : ?Text;
    success : Bool;
  };

  public func responseNull() : TransferResponseVolt {
    return { data = null; error = ?"responseNull"; success = false };
  };
};
