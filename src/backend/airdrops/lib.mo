import T "types";
import U "utils";
import Map "mo:map/Map";
import { nhash; thash; phash } "mo:map/Map";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Fuzz "mo:fuzz";
module {

  public type Result<Ok, Err> = Result.Result<Ok, Err>;
  public type ModuleData = T.ModuleData;
  public type LogsModule = T.LogsModule;
  public type AirdropId = T.AirdropId;
  public type AirdropInit = T.AirdropInit;
  public type AirdropDashboard = T.AirdropDashboard;
  public type Airdrop = T.Airdrop;
  public type AirdropDataCustom = T.AirdropDataCustom;
  public type AirdropDistribution = T.AirdropDistribution;
  public type DistributionStatus = T.DistributionStatus;
  public type TokenDetails = T.TokenDetails;
  public type Code = T.Code;
  public type CodeError = T.CodeError;
  public type UserError = T.UserError;
  public type AirdropError = T.AirdropError;
  public type CodeSubmissionResult = T.CodeSubmissionResult;
  public type RaffleData = T.RaffleData;
  public type RaffleOutput = T.RaffleOutput;
  public type RaffleInput = T.RaffleInput;

  // Initializes the ModuleData struct
  // The ModuleData struct contains one Map:
  // - airdrops : AirdropId -> Airdrop (contains all the airdrops)
  public func init() : ModuleData {
    return ({
      airdrops = Map.new<AirdropId, Airdrop>();
    });
  };

  public func getAirdrop(
    data : ModuleData,
    logs : LogsModule,
    airdropId : AirdropId,
  ) : ?Airdrop {
    return Map.get<Nat, Airdrop>(data.airdrops, nhash, airdropId);
  };

  public func getQualifiedAirdrops(
    data : ModuleData,
    logs : LogsModule,
    userId : Principal,
  ) : [AirdropId] {
    let ids = Buffer.Buffer<AirdropId>(0);
    for ((airdropId, airdrop) in Map.entries(data.airdrops)) {
      let qualified = airdrop.qualified;
      for (qualifiedUserId in qualified.vals()) {
        if (userId == qualifiedUserId) {
          ids.add(airdropId);
        };
      };
    };
    return Buffer.toArray(ids);
  };

  // Creates a new airdrop based on the provided AirdropInit struct and saves it in the Map
  // If the airdrop already exists, the function will return an error
  // If the distribution tiers or prizes do not sum up to 1.0, the function will return an error
  // If the airdrop is successfully created, the function will return #ok
  // The airdrop will be in the #Upcoming state
  public func loadAirdrop(
    data : ModuleData,
    logs : LogsModule,
    airdropInit : AirdropInit,
  ) : Result<(), Text> {
    // Validate distribution tiers and prizes to ensure they sum up to 1.0.
    let { distributionTiers; distributionPrizes } = airdropInit.distribution;
    let { maxParticipants } = airdropInit.limits;
    let { id; name; description; learnMore } = airdropInit.metadata;

    if (distributionTiers.0 + distributionTiers.1 + distributionTiers.2 != 1.0) {
      logs.logMessage("ERROR :: " # "Invalid distribution tiers - must sum up to 1.0.");
      return #err("Invalid distribution tiers - must sum up to 1.0.");
    };
    // Validate distribution tiers and prizes to ensure they sum up to 1.0.
    if (distributionPrizes.0 + distributionPrizes.1 + distributionPrizes.2 != 1.0) {
      logs.logMessage("ERROR :: " # "Invalid distribution prizes - must sum up to 1.0.");
      return #err("Invalid distribution prizes - must sum up to 1.0.");
    };
    // Initialize the airdrop and save it in the Map (if it does not already exist)
    switch (Map.get<Nat, Airdrop>(data.airdrops, nhash, id)) {
      case (null) {
        Map.set<Nat, Airdrop>(
          data.airdrops,
          nhash,
          id,
          U.initAirdrop(airdropInit),
        );
        return #ok();
      };
      case (?some) {
        logs.logMessage("ERROR :: " # "Airdrop with ID : " # Nat.toText(id) # " already exists");
        return #err("Airdrop with ID : " # Nat.toText(id) # " already exists");
      };
    };
  };

  // Submits a code for the specified airdrop and user and returns the result of the submission
  // If the user is already qualified for the airdrop, the submission will fail
  // If the airdrop is not valid (maxParticipants or maxDuration reached), the submission will fail
  // If the code is not valid, the submission will fail
  // If the submission is successful, the user will be qualified for the airdrop and the result will be #ok
  public func submitCode(
    data : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    userId : Principal,
    code : Text,
  ) : Result<(), Text> {
    // We check that the user is not already qualified for this airdrop
    if (U.isUserQualified(data, logs, airdropId, userId)) {
      return #err("You are already qualified for this airdrop");
    };
    // We check if the airdrop is valid (maxParticipants or maxDuration reached)
    // If the airdrop is not valid, we end it
    if (U.isAirdropExpired(data, logs, airdropId)) {
      return #err("Airdrop has ended or is invalid");
    };
    // We check if the code is valid
    if (not U.isCodeValid(data, logs, airdropId, code)) {
      return #err("Invalid code");
    };
    // We start the airdrop if it is pending
    if (U.isAirdropPendingId(data, airdropId)) {
      U.startAirdrop(data, logs, airdropId);
    };
    U.qualifyUser(data, logs, airdropId, userId);
    return #ok();
  };

  // Returns a list of all airdrops as AirdropDashboard structs
  // This is used by the client to display the airdrops in the dashboard (with the user's status/opt prizes for each airdrop)
  // Warning: This function might not be the most efficient but we currently don't pay for queries
  public func getAllAirdropsDashboard(
    data : ModuleData,
    logs : LogsModule,
    userId : Principal,
  ) : [AirdropDashboard] {
    return Array.map<Airdrop, AirdropDashboard>(
      Iter.toArray(Map.vals(data.airdrops)),
      func(airdrop : Airdrop) {
        return U.airdropToAirdropDashboard(data, logs, airdrop, userId);
      },
    );
  };

  // Check all airdrops and stop the ones that have expired
  public func cronStopAirdrops(
    data : ModuleData,
    logs : LogsModule,
  ) : () {
    for ((airdropId, airdrop) in Map.entries(data.airdrops)) {
      if (U.isAirdropExpired(data, logs, airdropId)) {
        switch (airdrop.status) {
          case (#Open) {
            logs.logMessage("CRON :: " # "Airdrop with ID : " # Nat.toText(airdropId) # " is stopped");
            U.stopAirdrop(data, logs, airdropId);
          };
          case (_) {};
        };
      };
    };
  };

  // Check all airdrops and returns the ones that are ready to be raffled
  public func cronRaffleAirdrops(
    data : ModuleData,
    logs : LogsModule,
  ) : ?Airdrop {
    var airdrops : Buffer.Buffer<Airdrop> = Buffer.Buffer<Airdrop>(0);
    for ((airdrop) in Map.vals(data.airdrops)) {
      if (U.isAirdropReadyForRaffle(airdrop)) {
        return ?airdrop;
      };
    };
    return null;
  };

  // Returns the RaffleOutput of the specified airdrop (used by the distributePrizes script)
  public func getTransfersDataAirdrop(
    data : ModuleData,
    airdropId : Nat,
  ) : ?RaffleOutput {
    switch (Map.get<Nat, Airdrop>(data.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        switch (airdrop.raffle) {
          case (?raffle) {
            return ?raffle.output;
          };
          case (null) {
            return null;
          };
        };
      };
      case (null) {
        return null;
      };
    };
  };

  // TODO: Implement the notifyTransfersResult function
  public func notifyDistribution(
    data : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    transfersData : [(Principal, DistributionStatus)],
  ) : Result<(), Text> {
    return #ok();
  };

  public func getAirdropIdByCode(
    data : ModuleData,
    code : Text,
  ) : ?Nat {
    for ((airdropId, airdrop) in Map.entries(data.airdrops)) {
      if (airdrop.code == code) {
        return ?airdropId;
      };
    };
    return null;
  };

  ////////////
  // TEST ///
  ///////////

  public func createAirdropForTest(
    init : AirdropInit,
    qualified : [Principal],
  ) : Airdrop {
    return U.initAirdropWithQualified(init, qualified);
  };

  // Starts the specified airdrop (for testing purposes)
  public func startAirdropTest(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : Result<(), Text> {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        U.startAirdrop(moduleData, logs, airdropId);
        return #ok();
      };
      case (null) {
        return #err("Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
      };
    };
  };
  // Qualifies a specific user for an airdrop (for testing purposes)
  public func qualifyUserForAirdropTest(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    userId : Principal,
  ) : Result<(), Text> {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        if (U.isUserQualified(moduleData, logs, airdropId, userId)) {
          logs.logMessage("ERROR :: " # "User is already qualified for this airdrop");
          return #err("User is already qualified for this airdrop");
        };
        if (U.isAirdropExpired(moduleData, logs, airdropId)) {
          U.stopAirdrop(moduleData, logs, airdropId);
          logs.logMessage("ERROR :: " # "Airdrop has ended or is invalid");
          return #err("Airdrop has ended or is invalid");
        };
        U.qualifyUser(moduleData, logs, airdropId, userId);
        return #ok();
      };
      case (null) {
        logs.logMessage("ERROR :: " # "Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
        return #err("Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
      };
    };
  };

  // Stop the specified airdrop (for testing purposes)
  public func stopAirdropTest(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : () {
    U.stopAirdrop(moduleData, logs, airdropId);
  };

  public func getOutput(
    moduleData : ModuleData,
    airdropId : Nat,
  ) : ?RaffleOutput {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        switch (airdrop.raffle) {
          case (?raffle) {
            return ?raffle.output;
          };
          case (null) {
            return null;
          };
        };
      };
      case (null) {
        return null;
      };
    };
  };

  // Perform the raffle for the specified airdrop (for testing purposes)
  public func performRaffle(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : Result<RaffleOutput, Text> {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        let qualified = airdrop.qualified;
        let fee = airdrop.tokenDetails.fee;
        let symbol = airdrop.tokenDetails.symbol;
        let amount = airdrop.tokenDetails.amount;
        let decimals = airdrop.tokenDetails.decimals;
        let ledgerId = airdrop.tokenDetails.ledgerId;
        let distributionTiers = airdrop.distribution.distributionTiers;
        let distributionPrizes = airdrop.distribution.distributionPrizes;
        let input : RaffleInput = {
          airdropId;
          symbol;
          decimals;
          qualified;
          fee;
          ledgerId;
          distributionTiers;
          distributionPrizes;
          amount;
        };
        let result = U.performRaffle(input, logs);
        switch (result) {
          case (#ok(output)) {
            let raffle = {
              input;
              output;
            };
            let newAirdrop = {
              airdrop with
              raffle = ?raffle;
              status = #RaffleCompleted;
            };
            Map.set<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId, newAirdrop);
            return #ok(output);
          };
          case (#err(e)) {
            logs.logMessage("ERROR :: " # e);
            return #err(e);
          };
        };
      };
      case (null) {
        logs.logMessage("ERROR :: " # "Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
        return #err("Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
      };
    };
  };

  // Returns the airdrop with the specified ID (for testing purposes)
  public func getAirdropAdmin(
    moduleData : ModuleData,
    airdropId : Nat,
  ) : ?Airdrop {
    return Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId);
  };

  public func setAirdropStatus(
    moduleData : ModuleData,
    airdropId : Nat,
    status : T.AirdropStatus,
  ) : () {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        let newAirdrop = {
          airdrop with
          status = status;
        };
        Map.set<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId, newAirdrop);
      };
      case (null) {
        return;
      };
    };
  };

  public func resetAirdropAndChangePrice(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    newPrice : Nat,
  ) : Result.Result<(), Text> {
    switch (Map.get<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId)) {
      case (?airdrop) {
        let newTokenDetails : TokenDetails = {
          airdrop.tokenDetails with
          amount = newPrice * 10 ** airdrop.tokenDetails.decimals;
        };

        let newAirdrop : Airdrop = {
          metadata = airdrop.metadata;
          distribution = airdrop.distribution;
          limits = airdrop.limits;
          tokenDetails = newTokenDetails;
          timing = airdrop.timing;
          qualified = airdrop.qualified;
          code = airdrop.code;
          status = #EntryClosed;
          raffle = null;
        };

        Map.set<Nat, Airdrop>(moduleData.airdrops, nhash, airdropId, newAirdrop);
        return #ok();
      };
      case (null) {
        return #err("Airdrop with ID : " # Nat.toText(airdropId) # " does not exist");
      };
    };
  };

};
