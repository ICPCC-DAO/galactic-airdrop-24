import T "types";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Option "mo:base/Option";
import { nhash; phash } "mo:map/Map";
import Map "mo:map/Map";
import Fuzz "mo:fuzz";

module {

  public type AirdropInit = T.AirdropInit;
  public type Airdrop = T.Airdrop;
  public type AirdropDashboard = T.AirdropDashboard;
  public type AirdropId = T.AirdropId;
  public type AirdropDataCustom = T.AirdropDataCustom;
  public type LogsModule = T.LogsModule;
  public type ModuleData = T.ModuleData;
  public type RaffleInput = T.RaffleInput;
  public type RaffleOutput = T.RaffleOutput;
  public type RaffleData = T.RaffleData;
  public type Prize = T.Prize;

  // Returns a new Airdrop object with the given AirdropInit object
  public func initAirdrop(
    airdropInit : AirdropInit
  ) : Airdrop {
    return ({
      metadata = airdropInit.metadata;
      tokenDetails = airdropInit.tokenDetails;
      timing = airdropInit.timing;
      distribution = airdropInit.distribution;
      limits = airdropInit.limits;
      status = #Pending;
      qualified = [];
      raffle = null;
      code = airdropInit.code;
    });
  };

  // Returs a new AirdropInit object and pre-qualified users
  public func initAirdropWithQualified(
    init : AirdropInit,
    qualified : [Principal],
  ) : Airdrop {
    return ({
      metadata = init.metadata;
      tokenDetails = init.tokenDetails;
      timing = init.timing;
      distribution = init.distribution;
      limits = init.limits;
      status = #Pending;
      qualified = qualified;
      raffle = null;
      code = init.code;
    });
  };

  // Helper function that takes a pair (Airdrop, userId) and returns the associated AirdropDashboard object (containing the user's qualified status in the airdrop and potential prize)
  public func airdropToAirdropDashboard(
    moduleData : ModuleData,
    logs : LogsModule,
    airdrop : Airdrop,
    userId : Principal,
  ) : AirdropDashboard {
    return ({
      metadata = airdrop.metadata;
      tokenDetails = airdrop.tokenDetails;
      limits = airdrop.limits;
      numberOfQualified = airdrop.qualified.size();
      status = airdrop.status;
    });
  };

  public func airdropToAirdropData(
    airdrop : Airdrop
  ) : AirdropDataCustom {
    return ({
      metadata = airdrop.metadata;
      tokenDetails = airdrop.tokenDetails;
      timing = airdrop.timing;
      distribution = airdrop.distribution;
      limits = airdrop.limits;
      status = airdrop.status;
      numberOfQualified = airdrop.qualified.size();
    });
  };

  // Helper function that returns a Bool indicating if the user is qualified for the airdrop
  public func isUserQualified(
    data : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    userId : Principal,
  ) : Bool {
    switch (Map.get(data.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return false;
      };
      case (?airdrop) {
        for (user in airdrop.qualified.vals()) {
          if (user == userId) {
            return true;
          };
        };
        return false;
      };
    };
  };

  // Helper function that returns a Bool indicating if the code is valid for the airdrop
  public func isCodeValid(
    data : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    code : Text,
  ) : Bool {
    switch (Map.get(data.airdrops, nhash, airdropId)) {
      case (null) {
        return false;
      };
      case (?airdrop) {
        return (airdrop.code == code);
      };
    };
  };

  // Helper function that returns a Bool indicating if the airdrop has reached its time limit
  public func isAirdropTimeLimitReached(
    airdrop : Airdrop
  ) : Bool {
    switch (airdrop.timing.startTime) {
      case (null) {
        return false; // The airdrop has not started yet
      };
      case (?time) {
        return (Time.now() >= (time + airdrop.timing.maxDuration));
      };
    };
  };

  // Helper function that returns a Bool indicating if the airdrop has reached its max participants limit
  public func isAirdropMaxParticipantsReached(
    airdrop : Airdrop
  ) : Bool {
    return (airdrop.qualified.size() >= airdrop.limits.maxParticipants);
  };

  // Helper functions that returns a Bool indicating if the airdrop has expired
  // Returns true if the time limit is reached
  // Returns true if the max participants is reached
  // Returns true if the airdrop is not in the #Open or #Pending state
  public func isAirdropExpired(
    data : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : Bool {
    switch (Map.get(data.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return false;
      };
      case (?airdrop) {
        switch (airdrop.status) {
          case (#Pending) {
            return false;
          };
          case (#Open) {
            return (isAirdropTimeLimitReached(airdrop) or isAirdropMaxParticipantsReached(airdrop));
          };
          case (_) {
            return true;
          };
        };
      };
    };
  };

  public func isAirdropPendingId(
    data : ModuleData,
    airdropId : Nat,
  ) : Bool {
    switch (Map.get(data.airdrops, nhash, airdropId)) {
      case (null) {
        return false;
      };
      case (?airdrop) {
        return airdrop.status == #Pending;
      };
    };
  };

  public func isAirdropPending(
    airdrop : Airdrop
  ) : Bool {
    return airdrop.status == #Pending;
  };

  public func isAirdropReadyForRaffle(
    airdrop : Airdrop
  ) : Bool {
    return airdrop.status == #EntryClosed and Option.isNull(airdrop.raffle);
  };

  // Helper functions that changes the status of the airdrop to #Open and records the startTime
  public func startAirdrop(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : () {
    switch (Map.get(moduleData.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return;
      };
      case (?airdrop) {
        let newTiming = {
          airdrop.timing with
          startTime = ?Time.now();
        };
        let newAirdrop = {
          airdrop with
          status = #Open;
          timing = newTiming;
        };
        Map.set<AirdropId, Airdrop>(moduleData.airdrops, nhash, airdrop.metadata.id, newAirdrop);
        logs.logMessage("ACTION :: " # " airdrop started " # Nat.toText(airdrop.metadata.id));
        return;
      };
    };
  };

  public func prizeDistributedAirdrop(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : () {
    switch (Map.get(moduleData.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return;
      };
      case (?airdrop) {
        let newAirdrop = {
          airdrop with
          status = #PrizesDelivered;
        };
        Map.set<AirdropId, Airdrop>(moduleData.airdrops, nhash, airdrop.metadata.id, newAirdrop);
        logs.logMessage("ACTION :: " # " prizes distributed for airdrop " # Nat.toText(airdrop.metadata.id));
        return;
      };
    };
  };

  // Helper functions that changes the status of the airdrop to #Ended and records the endTime
  // @logs if the airdrop is already #Ended, it will log a warning message
  // It will also perform the raffle and allocate the prizes for the airdrop
  public func stopAirdrop(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : () {
    switch (Map.get(moduleData.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return;
      };
      case (?airdrop) {
        switch (airdrop.status) {
          case (#Open) {
            let newAirdrop = {
              airdrop with
              status = #EntryClosed;
              endTime = ?Time.now();
            };
            Map.set<AirdropId, Airdrop>(moduleData.airdrops, nhash, airdrop.metadata.id, newAirdrop);
            logs.logMessage("ACTION :: " # " airdrop ended " # Nat.toText(airdrop.metadata.id));
            return;
          };
          case (_) {
            logs.logMessage("ERROR :: stopping an airdrop that is not in the #Open state " # Nat.toText(airdrop.metadata.id));
            return;
          };
        };

      };
    };

  };

  // Helper function that perform the raffle for the airdrop
  // If the airdrop already has a raffle performed, it will log an error message and return
  // If the airdrop is not in the #Ended state, it will log an error message and return
  // If the raffle data cannot be extracted, it will log an error message and return
  public func performRaffleAirdrop(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
  ) : () {
    switch (Map.get(moduleData.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return;
      };
      case (?airdrop) {
        switch (airdrop.status) {
          case (#EntryClosed) {
            let input : RaffleInput = {
              airdropId = airdropId;
              symbol = airdrop.tokenDetails.symbol;
              ledgerId = airdrop.tokenDetails.ledgerId;
              qualified = airdrop.qualified;
              amount = airdrop.tokenDetails.amount;
              fee = airdrop.tokenDetails.fee;
              decimals = airdrop.tokenDetails.decimals;
              distributionTiers = airdrop.distribution.distributionTiers;
              distributionPrizes = airdrop.distribution.distributionPrizes;
            };
            switch (performRaffle(input, logs)) {
              case (#err(e)) {
                logs.logMessage("ERROR :: raffle failed for airdrop " # Nat.toText(airdrop.metadata.id) # " with error " # e);
                return;
              };
              case (#ok(output)) {
                let raffleData : RaffleData = {
                  input;
                  output;
                };
                let newAirdrop = {
                  airdrop with
                  raffle = ?raffleData;
                  status = #RaffleCompleted;
                };
                Map.set<AirdropId, Airdrop>(moduleData.airdrops, nhash, airdrop.metadata.id, newAirdrop);
                logs.logMessage("ACTION :: " # " raffle performed for airdrop " # Nat.toText(airdrop.metadata.id));
                return;
              };
            };
          };
          case (_) {
            logs.logMessage("ERROR :: Attempt to perform raffle for an Airdrop that is not in the #EntryClosed state : " # Nat.toText(airdrop.metadata.id));
            return;
          };
        };
      };
    };
  };

  // Helper function that qualifies a user for an airdrop by adding the user to the qualified list
  public func qualifyUser(
    moduleData : ModuleData,
    logs : LogsModule,
    airdropId : Nat,
    userId : Principal,
  ) : () {
    switch (Map.get(moduleData.airdrops, nhash, airdropId)) {
      case (null) {
        logs.logMessage("ERROR :: airdrop not found in the map " # Nat.toText(airdropId));
        return;
      };
      case (?airdrop) {
        if (isAirdropExpired(moduleData, logs, airdropId)) {
          logs.logMessage("ERROR :: airdrop is expired " # Nat.toText(airdrop.metadata.id));
          return;
        };
        if (isUserQualified(moduleData, logs, airdropId, userId)) {
          logs.logMessage("ERROR :: user already qualified for airdrop " # Nat.toText(airdrop.metadata.id));
          return;
        };
        let newQualified = Buffer.fromArray<Principal>(airdrop.qualified);
        newQualified.add(userId);
        let newAirdrop = {
          airdrop with
          qualified = Buffer.toArray<Principal>(newQualified);
        };
        Map.set<AirdropId, Airdrop>(moduleData.airdrops, nhash, airdrop.metadata.id, newAirdrop);
        return;
      };
    };
  };

  // Shuffles an array using the Fisher-Yates algorithm.
  func shuffleArray<T>(array : [T]) : [T] {
    let fuzz = Fuzz.Fuzz();
    let n = array.size();
    if (n == 0 or n == 1) {
      return array;
    };
    let shuffled = Array.thaw<T>(array);
    for (index in Iter.revRange(0, n - 1)) {
      let j = fuzz.nat.randomRange(0, Int.abs(index));
      let tmp = shuffled[Int.abs(index)];
      shuffled[Int.abs(index)] := shuffled[j];
      shuffled[j] := tmp;
    };
    return Array.freeze<T>(shuffled);
  };

  public func performRaffle(
    input : RaffleInput,
    logs : LogsModule,
  ) : Result.Result<RaffleOutput, Text> {

    let participants = input.qualified;
    let fee = input.fee;
    let decimals = input.decimals;

    let distributionTiers = input.distributionTiers;
    let distributionPrizes = input.distributionPrizes;
    let totalAmount = input.amount;
    let totalFee = fee * participants.size();

    // Verify inputs
    // We check that we have at least one participant
    if (participants.size() == 0) {
      return #err("No participants in the airdrop");
    };
    // We check that the total amount is greater than the fee
    if (totalAmount <= totalFee) {
      return #err("Total amount in is less than the fee");
    };
    // We check that each distribution tier sums up to 1
    if (distributionTiers.0 + distributionTiers.1 + distributionTiers.2 != 1) {
      return #err("Invalid distribution tiers - must sum up to 1.0.");
    };
    if (distributionPrizes.0 + distributionPrizes.1 + distributionPrizes.2 != 1) {
      return #err("Invalid distribution prizes - must sum up to 1.0.");
    };

    // This is the minimum amount that can be distributed to a participant as a prize (1 if the fee is 0, 10 times the fee otherwise)
    let unitPrize : Nat = switch (fee) {
      case (0) { 1 };
      case (_) { fee * 10 };
    };

    let realAmount : Nat = totalAmount - totalFee;
    let totalUnits : Nat = realAmount / unitPrize;
    let reminder : Nat = realAmount % unitPrize;

    // Check that the totalUnits and the reminder are correct
    if (totalUnits * unitPrize + reminder != realAmount) {
      logs.logMessage("totalUnits: " # Int.toText(totalUnits) # " reminder: " # Int.toText(reminder) # " realAmount: " # Int.toText(realAmount));
      return #err("Error when calculating the total units and the reminder");
    };

    // Calculate the amount of units to be distributed for each tier.
    let tier1UnitsFloat : Float = Float.fromInt(totalUnits) * distributionTiers.0;
    let tier1UnitsTrunc : Float = Float.trunc(tier1UnitsFloat);
    let tier1UnitsInt : Int = Float.toInt(tier1UnitsTrunc);
    let tier1Units : Nat = Int.abs(tier1UnitsInt);

    let tier2UnitsFloat : Float = Float.fromInt(totalUnits) * distributionTiers.1;
    let tier2UnitsTrunc : Float = Float.trunc(tier2UnitsFloat);
    let tier2UnitsInt : Int = Float.toInt(tier2UnitsTrunc);
    let tier2Units : Nat = Int.abs(tier2UnitsInt);

    let tier3UnitsInt : Int = totalUnits - (tier1Units + tier2Units);
    let tier3Units : Nat = Int.abs(tier3UnitsInt);

    // Check that the sum of the units to be distributed (+ the reminder) is equal to the realAmount
    if (tier1Units + tier2Units + tier3Units != totalUnits) {
      logs.logMessage("tier1Units: " # Int.toText(tier1Units) # " tier2Units: " # Int.toText(tier2Units) # " tier3Units: " # Int.toText(tier3Units) # " totalUnits: " # Int.toText(totalUnits));
      return #err("Error when calculating the number of units for each tier");
    };

    // Calculate the number of winners for each tier.
    let tier1WinnersFloat : Float = Float.fromInt(participants.size()) * distributionTiers.0;
    let tier1WinnersTrunc : Float = Float.trunc(tier1WinnersFloat);
    let tier1WinnersInt : Int = Float.toInt(tier1WinnersTrunc);
    let tier1Winners : Nat = Int.abs(tier1WinnersInt);

    let tier2WinnersFloat : Float = Float.fromInt(participants.size()) * distributionTiers.1;
    let tier2WinnersTrunc : Float = Float.trunc(tier2WinnersFloat);
    let tier2WinnersInt : Int = Float.toInt(tier2WinnersTrunc);
    let tier2Winners : Nat = Int.abs(tier2WinnersInt);

    let tier3WinnersInt : Int = participants.size() - (tier1Winners + tier2Winners);
    let tier3Winners : Nat = Int.abs(tier3WinnersInt);

    // Check that the sum of the winners is equal to the total number of participants
    if (tier1Winners + tier2Winners + tier3Winners != participants.size()) {
      logs.logMessage("tier1Winners: " # Int.toText(tier1Winners) # " tier2Winners: " # Int.toText(tier2Winners) # " tier3Winners: " # Int.toText(tier3Winners) # " participants: " # Int.toText(participants.size()));
      return #err("Error when calculating the number of winners for each tier");
    };

    // Calculate the amount of units to be distributed for each tier.
    let tier1AmountUnitsPerWinner : Nat = switch (tier1Winners) {
      case (0) { 0 };
      case (_) { tier1Units / tier1Winners };
    };
    let tier1AmountPerWinner = tier1AmountUnitsPerWinner * unitPrize;
    let reminderTier1Units = switch (tier1Winners) {
      case (0) { tier1Units };
      case (_) { Nat.rem(tier1Units, tier1Winners) };
    };

    let tier2AmountUnitsPerWinner : Nat = switch (tier2Winners) {
      case (0) { 0 };
      case (_) { tier2Units / tier2Winners };
    };
    let tier2AmountPerWinner = tier2AmountUnitsPerWinner * unitPrize;
    let reminderTier2Units = switch (tier2Winners) {
      case (0) { tier2Units };
      case (_) { Nat.rem(tier2Units, tier2Winners) };
    };

    // Put the remaining amount in the third tier
    let tier3AmountUnitsPerWinner : Nat = switch (tier3Winners) {
      case (0) { 0 };
      case (_) { tier3Units / tier3Winners };
    };
    let tier3AmountPerWinner = tier3AmountUnitsPerWinner * unitPrize;
    let reminderTier3Units = switch (tier3Winners) {
      case (0) { tier3Units };
      case (_) { Nat.rem(tier3Units, tier3Winners) };
    };

    let finalReminder = (reminderTier1Units + reminderTier2Units + reminderTier3Units) * unitPrize + reminder;

    // Final checks that all prizes will be distributed

    // Shuffle the participants
    let shuffledArray = shuffleArray<Principal>(participants);

    // Create the result array
    let resultBuffer : Buffer.Buffer<(Principal, Prize)> = Buffer.Buffer<(Principal, Prize)>(0);
    let prize : Prize = {
      airdropId = input.airdropId;
      symbol = input.symbol;
      decimals = input.decimals;
      amount = 0;
      ledgerId = input.ledgerId;
      distributionStatus = #NotDistributed;
    };

    var index : Nat = 0;
    for (p in shuffledArray.vals()) {
      if (index < tier1Winners) {
        resultBuffer.add((p, { prize with amount = tier1AmountPerWinner }));
      } else if (index < tier1Winners + tier2Winners) {
        resultBuffer.add((p, { prize with amount = tier2AmountPerWinner }));
      } else {
        resultBuffer.add((p, { prize with amount = tier3AmountPerWinner }));
      };
      index := index + 1;
    };

    // Add the reminder to the first winner
    if (finalReminder > 0) {
      let (userId, prize) = resultBuffer.get(0);
      resultBuffer.put(0, (userId, { prize with amount = prize.amount + finalReminder }));
    };

    // Final verification that the total amount is correct

    let result = Buffer.toArray(resultBuffer);
    var totalAmountCheck : Nat = 0;
    for ((_, prize) in result.vals()) {
      totalAmountCheck := totalAmountCheck + prize.amount;
    };

    if (totalAmountCheck != realAmount or result.size() != participants.size()) {
      logs.logMessage("totalAmountCheck: " # Int.toText(totalAmountCheck) # " realAmount: " # Int.toText(realAmount));
      return #err("Error when checking the total amount and number of winners");
    };

    return #ok(result);
  };

};
