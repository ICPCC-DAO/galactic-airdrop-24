import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Map "mo:map/Map";
import Canistergeek "../canistergeek/canistergeek";
import Vector "mo:vector";
import Nat "mo:itertools/Utils/Nat";
import ICRC1 "mo:icrc1-types";

module {

  public type Map<K, V> = Map.Map<K, V>;
  public type Result<Ok, Err> = Result.Result<Ok, Err>;
  public type Vector<T> = Vector.Vector<T>;
  public type Time = Time.Time;
  public type Code = Text;

  public type TokenIndex = Nat32;

  public type LogsModule = Canistergeek.Logger;

  public type ModuleData = {
    users : Map<Principal, User>; // The users of the system (principal -> user)
    codes : Map<Principal, Verification>; // The verification codes of the users (principal -> verification)
    specialCodes : Map<Text, SpecialCode>; // The special codes (inPerson + organizer) of (code -> SpecialCode)
    whitelist : Vector<Principal>; // A list of whitelisted principals
    blacklist : Vector<Principal>; // A list of blacklisted principals
  };

  public type Submission = {
    code : Text;
    time : Time;
  };

  public type SpecialCodeCategory = {
    #InPerson : Nat; // The in-person id associated with the code
    #Organizer : Nat; // The organizer id associated with the code
  };

  public type SpecialCode = {
    code : Text;
    usageCount : Nat;
    maxUsage : Nat;
    numberOfPoints : Nat;
  };

  public type User = {
    email : Text; // The email of the user
    wallet : Principal; // The wallet of the user
    registrationTime : Time; // The time of registration
    verificationTime : ?Time; // The time of verification (empty if not verified)
    alienId : ?TokenIndex; // The token index of the alien belonging to the user (if any)
    alienLevel : Nat; // The level of the alien belonging to the user (if any)
    numberOfSubmission : Nat; // The number of submissions the user has made
    numberOfPoints : Nat; // The number of points the user has (related to $CONF Airdrop)
    prizes : [Prize];
  };

  // The user data type (used for the User.csv and getUsers script) - not stored as if but constructed from the User type and Airdrops module
  public type UserStats = {
    email : Text; // The email of the user
    wallet : Principal; // The wallet of the user
    numberOfPoints : Nat; // The number of points the user has (related to $CONF Airdrop)
  };

  public type Verification = {
    status : VerificationStatus; // The status of the verification
    attempts : Nat; // The number of attempts to verify the email (max 5)
    code : Code; // The actual code to verify the user
  };

  public type VerificationStatus = {
    #Pending;
    #Failed;
    #Verified;
  };

  public type DistributionStatus = {
    #NotDistributed; // Prize has not been distributed yet
    #Distributed : Nat; // Transfer ID
    #Failed : ICRC1.TransferError; // Error
  };

  public type Prize = {
    airdropId : Nat;
    symbol : Text;
    amount : Nat;
    decimals : Nat;
    ledgerId : Principal;
    distributionStatus : DistributionStatus;
  };

  public type TransferData = [(Principal, Principal, Nat)]; // (UserId, WalletId, Amount)
  public type TransferResult = [(Principal, Principal, DistributionStatus)]; // (UserId, WalletId, Status)]

};
