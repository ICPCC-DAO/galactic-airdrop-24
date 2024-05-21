import Time "mo:base/Time";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Map "mo:map/Map";
import Canistergeek "../canistergeek/canistergeek";
import ICRC1 "mo:icrc1-types";

module Airdrops {
  type Time = Time.Time;
  type Map<K, V> = Map.Map<K, V>;

  public type AirdropId = Nat;
  public type LogsModule = Canistergeek.Logger;
  public type Code = Text;

  public type ModuleData = {
    airdrops : Map<AirdropId, Airdrop>; // AirdropId -> Airdrop
  };

  public type TokenDetails = {
    ledgerId : Principal; // Ledger ID of the Token
    symbol : Text; // Symbol of the token (icrc1_symbol)
    decimals : Nat; // Number of decimals of the token (icrc1_decimals)
    amount : Nat; // Total amount of token or NFT to be distributed (as in icrc1_transfer)
    fee : Nat; // Fee to be paid for the transfer (icrc1_fee)
  };

  public type AirdropTiming = {
    maxDuration : Time; // Maximum duration of the airdrop
    startTime : ?Time; // Start time of the airdrop (null if not started yet)
    endTime : ?Time; // Actual end time of the airdrop (null if not ended yet)
  };

  public type AirdropDistribution = {
    distributionTiers : (Float, Float, Float); // Decides the repartition of users into 3 tiers (tier1%, tier2%, tier3%)
    distributionPrizes : (Float, Float, Float); // Decides the repartition of the prize into 3 tiers (tier1%, tier2%, tier3%)
  };

  public type AirdropLimits = {
    maxParticipants : Nat; // Maximum number of participants that can qualify for the airdrop
  };

  public type AirdropMetadata = {
    id : Nat; // Unique identifier of the airdrop
    name : Text; // Name of the project
    description : Text; // A short description of the project
    learnMore : Text; // A link to learn more about the project
    twitter : Text; // Twitter handle of the project
    chat : Text; // Chat link of the project
  };

  // All information needed to define an airdrop (only for admins)
  public type AirdropInit = {
    metadata : AirdropMetadata;
    tokenDetails : TokenDetails;
    timing : AirdropTiming;
    distribution : AirdropDistribution;
    limits : AirdropLimits;
    code : Code;
  };

  public type Airdrop = {
    metadata : AirdropMetadata;
    tokenDetails : TokenDetails;
    timing : AirdropTiming;
    distribution : AirdropDistribution;
    limits : AirdropLimits;
    status : AirdropStatus; // Status of the airdrop
    qualified : [Principal]; // List of users that have qualified for this airdrop
    raffle : ?RaffleData; // Raffle data if the airdrop has been raffled
    code : Code; // Code to be submitted by the user (SHOULDN'T BE DISPLAYED IN THE DASHBOARD
  };

  public type AirdropDashboard = {
    metadata : AirdropMetadata; // Contains basic info like ID, name, description, and learn more link.
    tokenDetails : TokenDetails; // Groups all token-related details.
    limits : AirdropLimits; // Contains limitations like max participants.
    numberOfQualified : Nat; // Number of participants that have submitted a valid code
    status : AirdropStatus; // Status of the airdrop
  };

  // This is a custom type that is used for scripts and tests
  public type AirdropDataCustom = {
    metadata : AirdropMetadata;
    tokenDetails : TokenDetails;
    timing : AirdropTiming;
    distribution : AirdropDistribution;
    limits : AirdropLimits;
    status : AirdropStatus;
    numberOfQualified : Nat;
  };

  public type DistributionStatus = {
    #NotDistributed; // Prize has not been distributed yet
    #Distributed : Nat; // Transfer ID
    #Failed : ICRC1.TransferError; // Error
  };

  public type AirdropStatus = {
    #Pending; // Airdrop has not started yet (startTime > now)
    #Open; // Users can submit codes (startTime <= now <= endTime)
    #EntryClosed; // No further entries accepted (endTime < now or maxParticipants reached)
    #RaffleCompleted; // Raffle has been completed but prizes not yet assigned
    #PrizesAssigned; // Prizes have been assigned to winners but not yet delivered
    #PrizesDelivered; // Prizes have been physically or digitally delivered to the winners
  };

  public type CodeError = {
    #CodeInvalid; // Invalid code
    #CodeMaxUsageReached; // If the code has a maxUsageCount field and it has been reached
    #CodeNotFound; // If the code does not exist
  };

  public type UserError = {
    #UserAlreadyQualified; // If the user has already qualified for the airdrop
  };

  public type AirdropError = {
    #AirdropNotStarted; // If the airdrop has not started yet
    #AirdropNotFound; // If the airdrop does not exist
    #AirdropEnded; // If the airdrop has ended
  };

  public type CodeSubmissionError = CodeError or UserError or AirdropError;
  public type CodeSubmissionResult = Result.Result<(), CodeSubmissionError>;

  public type RaffleData = {
    input : RaffleInput;
    output : RaffleOutput;
  };

  public type RaffleInput = {
    airdropId : Nat;
    symbol : Text;
    ledgerId : Principal;
    amount : Nat;
    decimals : Nat;
    fee : Nat;
    qualified : [Principal];
    distributionTiers : (Float, Float, Float); // (tier1, tier2, tier3) where tier1 + tier2 + tier3 = 1
    distributionPrizes : (Float, Float, Float); // (tier1, tier2, tier3) where tier1 + tier2 + tier3 = 1
  };

  public type Prize = {
    airdropId : Nat;
    symbol : Text;
    amount : Nat;
    decimals : Nat;
    ledgerId : Principal;
    distributionStatus : DistributionStatus;
  };

  public type RaffleOutput = [(Principal, Prize)];

};
