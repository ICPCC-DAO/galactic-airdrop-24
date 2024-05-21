import T "types";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Map "mo:map/Map";
import { phash; thash; nhash } "mo:map/Map";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Vector "mo:vector";
import Fuzz "mo:fuzz";
import NatX "mo:xtended-numbers/NatX";

module {
  public type User = T.User;
  public type UserStats = T.UserStats;
  public type Code = T.Code;
  public type TokenIndex = T.TokenIndex;
  public type Submission = T.Submission;
  public type SpecialCode = T.SpecialCode;
  public type Prize = T.Prize;
  public type DistributionStatus = T.DistributionStatus;
  public type SpecialCodeCategory = T.SpecialCodeCategory;
  public type Verification = T.Verification;
  public type ModuleData = T.ModuleData;
  public type LogsModule = T.LogsModule;
  public type TransferData = T.TransferData;
  public type TransferResult = T.TransferResult;
  public type Result<Ok, Err> = T.Result<Ok, Err>;
  public type Vector<T> = Vector.Vector<T>;

  public func init() : ModuleData {
    return {
      users = Map.new<Principal, User>();
      codes = Map.new<Principal, Verification>();
      specialCodes = Map.new<Text, SpecialCode>();
      whitelist = Vector.new<Principal>();
      blacklist = Vector.new<Principal>();
    };
  };

  public func removeDuplicatePrizes(
    moduleData : ModuleData
  ) : () {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      let newPrizes = Buffer.Buffer<Prize>(user.prizes.size());
      for (prize in user.prizes.vals()) {
        var isDuplicate = false;
        for (newPrize in newPrizes.vals()) {
          if (prize.airdropId == newPrize.airdropId) {
            isDuplicate := true;
          };
        };
        if (not isDuplicate) {
          newPrizes.add(prize);
        };
      };
      let newUser = { user with prizes = Buffer.toArray(newPrizes) };
      Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
    };
  };

  public func getNumberOfPoints(
    moduleData : ModuleData,
    userId : Principal,
  ) : Nat {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        return 0;
      };
      case (?user) {
        return user.numberOfPoints;
      };
    };
  };

  public func exportDataAirdrop(
    moduleData : ModuleData
  ) : [(Text, Principal, Principal, Nat)] {
    var data = Buffer.Buffer<(Text, Principal, Principal, Nat)>(0);
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      data.add((user.email, userId, user.wallet, user.numberOfPoints));
    };
    return Buffer.toArray(data);
  };

  public func getTotalAliens(
    moduleData : ModuleData
  ) : Nat {
    var total = 0;
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      switch (user.alienId) {
        case (null) {};
        case (?_) {
          total := total + 1;
        };
      };
    };
    return total;
  };

  public func getAliens(
    moduleData : ModuleData
  ) : [(Nat, Nat)] {
    let aliens = Map.new<Nat, Nat>();
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      switch (user.alienId) {
        case (null) {};
        case (?alienId) {
          switch (Map.get<Nat, Nat>(aliens, nhash, user.alienLevel)) {
            case (null) {
              Map.set<Nat, Nat>(aliens, nhash, user.alienLevel, 1);
            };
            case (?count) {
              Map.set<Nat, Nat>(aliens, nhash, user.alienLevel, count + 1);
            };
          };
        };
      };
    };
    return Map.toArray<Nat, Nat>(aliens);
  };

  public func getMeetups(
    moduleData : ModuleData
  ) : [(Text, Nat)] {
    var meetups = Buffer.Buffer<(Text, Nat)>(0);
    for ((code, codeData) in Map.entries(moduleData.specialCodes)) {
      // If the code is a meetup code, we add it to the list
      if (codeData.maxUsage > 0) {
        meetups.add((code, codeData.usageCount));
      };
    };
    return Buffer.toArray(meetups);
  };

  public func getConf(
    moduleData : ModuleData
  ) : Nat {
    var count : Nat = 0;
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      count += user.numberOfPoints;
    };
    return count;
  };

  public func getTokenIndexes(
    moduleData : ModuleData
  ) : [Nat32] {
    var tokenIndexes = Buffer.Buffer<Nat32>(0);
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      switch (user.alienId) {
        case (null) {};
        case (?alienId) {
          tokenIndexes.add(alienId);
        };
      };
    };
    return Buffer.toArray<Nat32>(tokenIndexes);
  };

  // Remove all prizes related to the airdropId
  public func removePrizes(
    moduleData : ModuleData,
    airdropId : Nat,
  ) : () {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      let newPrizes = Buffer.Buffer<Prize>(user.prizes.size());
      for (prize in user.prizes.vals()) {
        if (prize.airdropId != airdropId) {
          newPrizes.add(prize);
        };
      };
      let newUser = { user with prizes = Buffer.toArray(newPrizes) };
      Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
    };
  };

  public func getNumberOfBlacklisted(
    moduleData : ModuleData
  ) : Nat {
    return Vector.size<Principal>(moduleData.blacklist);
  };

  public func getEmail(
    moduleData : ModuleData,
    userId : Principal,
  ) : ?Text {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        return null;
      };
      case (?user) {
        return ?user.email;
      };
    };
  };

  // This function is used to verify all users in the system
  public func verifyAllUsers(
    moduleData : ModuleData
  ) : () {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      if (Option.isNull(user.verificationTime)) {
        let newUser = {
          user with verificationTime = ?Time.now();
        };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
      };
    };
  };

  public func getCode(
    moduleData : ModuleData,
    userId : Principal,
  ) : ?Code {
    switch (Map.get<Principal, Verification>(moduleData.codes, phash, userId)) {
      case (null) {
        return null;
      };
      case (?verification) {
        return ?verification.code;
      };
    };
  };

  public func getNumberOfUsers(
    moduleData : ModuleData
  ) : Nat {
    return Map.size<Principal, User>(moduleData.users);
  };

  public func getNumberOfVerifiedUsers(
    moduleData : ModuleData
  ) : Nat {
    var total = 0;
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      if (Option.isSome(user.verificationTime)) {
        total := total + 1;
      };
    };
    return total;
  };

  public func getNumberOfSubmissions(
    moduleData : ModuleData
  ) : Nat {
    var total = 0;
    for ((_, user) in Map.entries<Principal, User>(moduleData.users)) {
      total := total + user.numberOfSubmission;
    };
    return total;
  };

  // Returns the blacklisted users
  public func getBlacklist(
    moduleData : ModuleData
  ) : [Principal] {
    return Vector.toArray<Principal>(moduleData.blacklist);
  };

  // Remove the specified user from the blacklist
  public func removeFromBlacklist(
    moduleData : ModuleData,
    userId : Principal,
  ) : Result<(), Text> {
    var isInside = false;
    let newVector = Vector.clone<Principal>(moduleData.blacklist);
    Vector.clear<Principal>(moduleData.blacklist);
    for (user in Vector.vals<Principal>(moduleData.blacklist)) {
      if (user != userId) {
        Vector.add<Principal>(moduleData.blacklist, user);
      } else {
        isInside := true;
      };
    };
    if (not isInside) {
      return #err("User was not in the blacklist");
    } else {
      return #ok();
    };
  };

  public func removeFailedVerification(
    moduleData : ModuleData,
    userId : Principal,
  ) : Result<(), Text> {
    switch (Map.get<Principal, Verification>(moduleData.codes, phash, userId)) {
      case (null) {
        return #err("User is not registered");
      };
      case (?verification) {
        switch (verification.status) {
          case (#Failed) {
            let newVerification = {
              code = verification.code;
              status = #Pending;
              attempts = 0;
            };
            Map.set<Principal, Verification>(moduleData.codes, phash, userId, newVerification);
            return #ok();
          };
          case (#Pending) {
            return #err("User has not failed the verification");
          };
          case (#Verified) {
            return #err("User is already verified");
          };
        };
      };
    };
  };

  // Increments the number of submissions for the specified user by 1 and returns the new number of submissions
  public func incrementNumberOfSubmissions(
    moduleData : ModuleData,
    logs : LogsModule,
    userId : Principal,
  ) : Nat {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        logs.logMessage("ERROR :: Attempting to increment the number of submissions for an user which is not registered :: " # Principal.toText(userId));
        return 0;
      };
      case (?user) {
        let newNumberOfSubmissions = user.numberOfSubmission + 1;
        let newUser = {
          user with numberOfSubmission = newNumberOfSubmissions;
        };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
        return newNumberOfSubmissions;
      };
    };
  };

  // Returns a boolean indicating if the specified code is a special code or not
  public func isSpecialCode(
    moduleData : ModuleData,
    specialCode : Text,
  ) : Bool {
    Option.isSome(Map.get<Text, SpecialCode>(moduleData.specialCodes, thash, specialCode));
  };

  public func submitSpecialCode(
    moduleData : ModuleData,
    logs : LogsModule,
    userId : Principal,
    specialCode : Text,
  ) : Result<Text, Text> {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        logs.logMessage("ERROR :: Attempting to submit a special code for an user which is not registered :: " # Principal.toText(userId));
        return #err("User is not registered");
      };
      case (?user) {
        switch (Map.get<Text, SpecialCode>(moduleData.specialCodes, thash, specialCode)) {
          case (null) {
            logs.logMessage("ERROR :: Attempting to submit a special code which is not found :: " # specialCode);
            return #err("Special code not found");
          };
          case (?code) {
            let usageCount = code.usageCount;
            let maxUsage = code.maxUsage;
            if (usageCount >= maxUsage) {
              logs.logMessage("ERROR :: Attempting to submit a special code which has reached the maximum usage count :: " # specialCode);
              return #err("TOO LATE! This code is valid but no longer active. All prizes for it have been claimed.");
            };
            let newUsageCount = usageCount + 1;
            let newCode = {
              code with usageCount = newUsageCount;
            };
            Map.set<Text, SpecialCode>(moduleData.specialCodes, thash, specialCode, newCode);
            let numberOfPoints = code.numberOfPoints;
            let newUser = {
              user with numberOfPoints = user.numberOfPoints + numberOfPoints;
            };
            Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
            if (numberOfPoints == 2) {
              return #ok("Thanks for joining an ICPCC Meetup, we hope you are having fun!  🥳");
            };
            if (numberOfPoints == 6) {
              return #ok("Thanks for organizing an ICPCC Meetup, this event is possible because of you ❤️");
            };
            logs.logMessage("ERROR :: Submitting a special code and the number of points is not 2 or 6 :: " # specialCode);
            return #ok("unreacheable");
          };
        };
      };
    };
  };

  // Returns a boolean indicating if the specified user is in the whitelist or not
  public func isWhiteListed(
    moduleData : ModuleData,
    userId : Principal,
  ) : Bool {
    return Vector.contains<Principal>(moduleData.whitelist, userId, Principal.equal);
  };

  // Adds the specified user to the whitelist
  public func addToWhiteList(
    moduleData : ModuleData,
    userId : Principal,
  ) : () {
    // If the user is already in the whitelist, we don't need to add it again
    if (isWhiteListed(moduleData, userId)) {
      return;
    };
    Vector.add<Principal>(moduleData.whitelist, userId);
  };

  // Returns a boolean indicating if the specified user is in the blacklist or not
  public func isBlackListed(
    moduleData : ModuleData,
    userId : Principal,
  ) : Bool {
    return Vector.contains<Principal>(moduleData.blacklist, userId, Principal.equal);
  };

  // Adds the specified user to the blacklist
  public func addToBlackList(
    moduleData : ModuleData,
    userId : Principal,
  ) : () {
    // If the user is already in the blacklist, we don't need to add it again
    if (isBlackListed(moduleData, userId)) {
      return;
    };
    Vector.add<Principal>(moduleData.blacklist, userId);
  };

  // Returns a boolean indicating if the specified user is registered or not
  public func isUserRegistered(
    moduleData : ModuleData,
    userId : Principal,
  ) : Bool {
    return Option.isSome(Map.get<Principal, User>(moduleData.users, phash, userId));
  };

  // Returns a boolean indicating if the specified user is verified or not
  public func isUserVerified(
    moduleData : ModuleData,
    p : Principal,
  ) : Bool {
    switch (Map.get<Principal, User>(moduleData.users, phash, p)) {
      case (null) {
        return false;
      };
      case (?user) {
        // If the user is verified, the verification time should be set (not null)
        Option.isSome(user.verificationTime);
      };
    };
  };

  // Returns true if the email is already used by a verified user
  public func isEmailUsedByVerifiedUser(
    moduleData : ModuleData,
    email : Text,
  ) : Bool {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      if (user.email == email and isUserVerified(moduleData, userId)) {
        return true;
      };
    };
    return false;
  };

  // Returns true if the wallet is already used by a verified user (not pending or failed)
  public func isWalletUsedByVerifiedUser(
    moduleData : ModuleData,
    wallet : Principal,
  ) : Bool {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      if (user.wallet == wallet and isUserVerified(moduleData, userId)) {
        return true;
      };
    };
    return false;
  };

  // Register a user with the specified userId, email and wallet
  // Returns a code that should be sent to the user to verify the email
  // If the user is already registered, returns an error and logs the error
  public func registerUser(
    moduleData : ModuleData,
    logs : LogsModule,
    userId : Principal,
    email : Text,
    wallet : Principal,
  ) : Result<Code, Text> {
    // Add user to the map
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        let fuzz = Fuzz.Fuzz();
        // Generate a code an store it in the verification map
        let code = fuzz.text.randomAlphanumeric(5);
        let verification = {
          code;
          status = #Pending;
          attempts = 0;
        };
        Map.set<Principal, Verification>(moduleData.codes, phash, userId, verification);
        // Generate a new user and store it in the user map
        let newUser : User = {
          email;
          wallet;
          registrationTime = Time.now();
          verificationTime = ?Time.now();
          inPerson = null;
          organizer = null;
          alienId = null;
          alienLevel = 0;
          numberOfSubmission = 0;
          numberOfPoints = 0;
          prizes = [];
        };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
        // Returns the code to the main.mo file (to be added to the email queue and sent to the user)
        return #ok(code);
      };
      case (?user) {
        logs.logMessage("ERROR :: Attempting to register an user which is already registered :: " # Principal.toText(userId));
        return #err("User is already registered");
      };
    };
  };

  // Verify the user with the specified userId and code
  // If the user is not registered, returns an error and log
  // If the user is already verified, returns an error and log
  // If the user has failed the verification too many times, returns an error and log
  // If the code is invalid, returns an error and log
  public func verifyUser(
    moduleData : ModuleData,
    logs : LogsModule,
    userId : Principal,
    code : Code,
  ) : Result<(), Text> {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        logs.logMessage("ERROR :: Attempting to verify an user which is not registered :: " # Principal.toText(userId));
        return #err("User is not registered");
      };
      case (?user) {
        switch (user.verificationTime) {
          case (null) {
            switch (Map.get<Principal, Verification>(moduleData.codes, phash, userId)) {
              case (null) {
                logs.logMessage("ERROR :: Attempting to verify an user with a code not found :: " # Principal.toText(userId));
                return #err("Code not foiund");
              };
              case (?verification) {
                switch (verification.status) {
                  case (#Verified) {
                    logs.logMessage("ERROR :: Attempting to verify an user which is already verified :: " # Principal.toText(userId));
                    return #err("User is already verified");
                  };
                  case (#Failed) {
                    logs.logMessage("ERROR :: Attempting to verify an user which has already failed the verification :: " # Principal.toText(userId));
                    return #err("User has failed the verification");
                  };
                  case (#Pending) {
                    if (verification.code == code) {
                      let newUser = {
                        user with verificationTime = ?Time.now();
                      };
                      let newVerification = {
                        verification with status = #Verified;
                      };
                      Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
                      Map.set<Principal, Verification>(moduleData.codes, phash, userId, newVerification);
                      return #ok();
                    } else {
                      let newVerification = {
                        verification with attempts = verification.attempts + 1;
                      };
                      Map.set<Principal, Verification>(moduleData.codes, phash, userId, newVerification);
                      if (newVerification.attempts >= 7) {
                        let failedVerification = {
                          newVerification with status = #Failed;
                        };
                        Map.set<Principal, Verification>(moduleData.codes, phash, userId, failedVerification);
                        logs.logMessage("ERROR :: Attempting to verify an user and he just failed the verification :: " # Principal.toText(userId));
                        return #err("User has failed the verification");
                      } else {
                        return #err("Invalid code");
                      };
                    };
                  };
                };
              };
            };
          };
          case (?time) {
            logs.logMessage("ERROR :: Attempting to verify an user which is already verified :: " # Principal.toText(userId));
            return #err("User is already verified");
          };
        };
      };
    };
  };

  public func registerUserTest(
    moduleData : ModuleData,
    userId : Principal,
    email : Text,
    wallet : Principal,
  ) : Result<(), Text> {
    // Add user to the map
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        let newUser = {
          principal = userId;
          email = email;
          wallet = wallet;
          registrationTime = Time.now();
          verificationTime = ?Time.now();
          inPerson = null;
          organizer = null;
          alienId = null;
          alienLevel = 0;
          numberOfSubmission = 0;
          numberOfPoints = 0;
          prizes = [];
        };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
        return #ok();
      };
      case (?user) {
        return #err("User is already registered");
      };
    };
  };

  public func verifyUserTest(
    moduleData : ModuleData,
    userId : Principal,
  ) : Result<(), Text> {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        return #err("User is not registered");
      };
      case (?user) {
        let newUser = {
          user with verificationTime = ?Time.now();
        };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
        return #ok();
      };
    };
  };

  public func addPrize(
    moduleData : ModuleData,
    logs : LogsModule,
    userId : Principal,
    prize : Prize,
  ) : () {
    switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
      case (null) {
        logs.logMessage("ERROR :: Attempting to add a prize for an user which is not registered :: " # Principal.toText(userId));
      };
      case (?user) {
        let newPrizes = Buffer.fromArray<Prize>(user.prizes);
        newPrizes.add(prize);
        let newUser = { user with prizes = Buffer.toArray(newPrizes) };
        Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
      };
    };
  };

  public func loadSpecialCodes(
    moduleData : ModuleData,
    specialCodes : [SpecialCode],
  ) : Result<(), Text> {
    for (specialCode in specialCodes.vals()) {
      Map.set<Text, SpecialCode>(moduleData.specialCodes, thash, specialCode.code, specialCode);
    };
    return #ok();
  };

  public func getUser(
    moduleData : ModuleData,
    p : Principal,
  ) : Result<User, Text> {
    switch (Map.get<Principal, User>(moduleData.users, phash, p)) {
      case (null) {
        return #err("User is not registered");
      };
      case (?user) {
        return #ok(user);
      };
    };
  };

  public func getAlienId(
    moduleData : ModuleData,
    p : Principal,
  ) : ?TokenIndex {
    switch (Map.get<Principal, User>(moduleData.users, phash, p)) {
      case (null) {
        return null;
      };
      case (?user) {
        return user.alienId;
      };
    };
  };

  public func setAlienId(
    moduleData : ModuleData,
    p : Principal,
    alienId : ?TokenIndex,
  ) : () {
    switch (Map.get<Principal, User>(moduleData.users, phash, p)) {
      case (null) {};
      case (?user) {
        let newUser = { user with alienId = alienId };
        Map.set<Principal, User>(moduleData.users, phash, p, newUser);
      };
    };
  };

  public func levelUpAlien(
    moduleData : ModuleData,
    p : Principal,
  ) : () {
    switch (Map.get<Principal, User>(moduleData.users, phash, p)) {
      case (null) {
        return ();
      };
      case (?user) {
        let level = user.alienLevel;
        let newLevel = level + 1;
        let newUser = { user with alienLevel = newLevel };
        Map.set<Principal, User>(moduleData.users, phash, p, newUser);
        if (level == 5) {
          let newNumberOfPoints = user.numberOfPoints + 1;
          let newUser = { user with numberOfPoints = newNumberOfPoints };
          Map.set<Principal, User>(moduleData.users, phash, p, newUser);
        };
        return ();
      };
    };
  };

  public func getUsers(
    moduleData : ModuleData
  ) : [(Principal, User)] {
    return Iter.toArray<(Principal, User)>(Map.entries<Principal, User>(moduleData.users));
  };

  public func getTransfersDataAirdrop(
    moduleData : ModuleData,
    logs : LogsModule,
    userIds : [Principal],
    airdropId : Nat,
  ) : TransferData {
    let transferData : Buffer.Buffer<(Principal, Principal, Nat)> = Buffer.Buffer<(Principal, Principal, Nat)>(0);
    for (userId in userIds.vals()) {
      switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
        case (null) {
          logs.logMessage("ERROR :: Attempting to get transfer data for an user which is not registered :: " # Principal.toText(userId));
        };
        case (?user) {
          switch (_getPrizeFromAirdrop(airdropId, user.prizes)) {
            case (null) {
              // This should not happen because the list of users is already selected, but if it does, we log an error.
              logs.logMessage("ERROR :: Attempting to get prize for an user which has not won the airdrop :: " # Principal.toText(userId));
            };
            case (?prize) {
              transferData.add((userId, user.wallet, prize.amount));
            };
          };
        };
      };
    };
    return Buffer.toArray(transferData);
  };

  func _getPrizeFromAirdrop(
    airdropId : Nat,
    prizes : [Prize],
  ) : ?Prize {
    for (prize in prizes.vals()) {
      if (prize.airdropId == airdropId) {
        return ?prize;
      };
    };
    return null;
  };

  public func notifyTransferResultsChat(
    moduleData : ModuleData
  ) : () {
    for ((userId, user) in Map.entries<Principal, User>(moduleData.users)) {
      let newPrizes = Buffer.Buffer<Prize>(user.prizes.size());
      for (prize in user.prizes.vals()) {
        if (prize.airdropId == 24) {
          let newPrize : Prize = {
            prize with distributionStatus = #Distributed(1);
          };
          newPrizes.add(newPrize);
        } else {
          newPrizes.add(prize);
        };
      };
      let newUser = { user with prizes = Buffer.toArray(newPrizes) };
      Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
    };
  };

  public func notifyTransferResults(
    moduleData : ModuleData,
    logs : LogsModule,
    transferResults : TransferResult,
    airdropId : Nat,
  ) : () {
    for (transferResult in transferResults.vals()) {
      let userId : Principal = transferResult.0;
      let distributionStatus : DistributionStatus = transferResult.2;
      switch (Map.get<Principal, User>(moduleData.users, phash, userId)) {
        case (null) {
          logs.logMessage("ERROR :: Attempting to notify transfer results for an user which is not registered :: " # Principal.toText(userId));
        };
        case (?user) {
          let newPrizes = Buffer.Buffer<Prize>(user.prizes.size());
          label l for (prize in user.prizes.vals()) {
            if (prize.airdropId == airdropId) {
              let newPrize : Prize = {
                prize with distributionStatus = distributionStatus;
              };
              newPrizes.add(newPrize);
            } else {
              newPrizes.add(prize);
            };
          };
          let newUser = { user with prizes = Buffer.toArray(newPrizes) };
          Map.set<Principal, User>(moduleData.users, phash, userId, newUser);
        };
      };
    };
  };

  public func resetVerificationCode(
    moduleData : ModuleData,
    userId : Principal,
  ) : Result.Result<Text, Text> {
    switch (Map.get<Principal, Verification>(moduleData.codes, phash, userId)) {
      case (null) {
        return #err("User is not registered");
      };
      case (?verification) {
        let newVerification = {
          code = verification.code;
          status = #Pending;
          attempts = 0;
        };
        Map.set<Principal, Verification>(moduleData.codes, phash, userId, newVerification);
        return #ok(verification.code);
      };
    };
  };

};
