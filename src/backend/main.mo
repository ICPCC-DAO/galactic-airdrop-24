import Admins "admins";
import Canistergeek "canistergeek/canistergeek";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Timer "mo:base/Timer";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Map "mo:map/Map";
import { nhash; thash; phash; n32hash } "mo:map/Map";
import Airdrops "airdrops";
import Users "users";
import Nat32 "mo:base/Nat32";
import Emails "emails";
import Load "load";
import Bioniq "bioniq/bioniq";
import Fuzz "mo:fuzz";
import Nat16 "mo:fuzz/Nat16";
import AccountIdentifier "bioniq/util/AccountIdentifier";

shared ({ caller = creator }) actor class AirdropManager() = this {
  ////////////
  // TYPES //
  ///////////

  public type Time = Time.Time;
  public type Result<A, B> = Result.Result<A, B>;
  public type CanisterLogRequest = Canistergeek.CanisterLogRequest;
  public type GetMetricsParameters = Canistergeek.GetMetricsParameters;
  public type User = Users.User;
  public type UserStats = Users.UserStats;
  public type SpecialCode = Users.SpecialCode;
  public type Code = Users.Code;
  public type TransferData = Users.TransferData;
  public type TransferResult = Users.TransferResult;
  public type AirdropId = Airdrops.AirdropId;
  public type Airdrop = Airdrops.Airdrop;
  public type AirdropDataCustom = Airdrops.AirdropDataCustom;
  public type AirdropDistribution = Airdrops.AirdropDistribution;
  public type DistributionStatus = Airdrops.DistributionStatus;
  public type RaffleOutput = Airdrops.RaffleOutput;
  public type Email = Emails.Email;

  ////////////
  // STATE////
  ///////////
  // A list of TimerId to keep track of the cron jobs
  var cronJobs : [Timer.TimerId] = [];
  // The principal of the Docker container running on AWS (used for delivering the emails code)
  stable var AWS_DOCKER : Principal = Principal.fromText("kqucw-f5f47-ty7p7-yjgc6-hk6n6-nxtmy-owerf-ihxhr-dd2af-hteuw-eae");
  // The original creator of the canister is defined as the master Admin
  stable var master : Principal = creator;

  // Stores the data relative to the Admin module (use old pre/post upgrade pattern)
  stable var _AdminsUD : ?Admins.UpgradeData = null;
  private let _Admins = Admins.Admins(creator);

  // Stores the data relative to the Logs module (use old pre/post upgrade pattern)
  stable var _LogsUD : ?Canistergeek.LoggerUpgradeData = null;
  private let _Logs : Canistergeek.Logger = Canistergeek.Logger();

  // Stores the data relative to the Monitor module (use old pre/post upgrade pattern)
  stable var _MonitorUD : ?Canistergeek.UpgradeData = null;
  private let _Monitor : Canistergeek.Monitor = Canistergeek.Monitor();

  // Stores the data corresponding to the rate limit of the canister (20 update calls/min per principal)
  stable let loadData = Load.init();
  // Stores the data of the users
  stable let usersData = Users.init();
  // Stores a simple queue of emails to be sent
  stable let emailsData = Emails.init();
  // Stores the data of the airdrops
  stable let airdropData = Airdrops.init();

  let bioniqActor = actor ("te62g-3iaaa-aaaal-qi43a-cai") : Bioniq.GalacticAlienActor;
  let fuzz = Fuzz.Fuzz();

  //////////////
  // USERS ////
  /////////////

  // Registers a new user (not protected by the inspect function)
  // @auth : authenticated
  // @param : email : Text, wallet : Principal
  // @return : Result<(), Text>
  public shared ({ caller }) func registerUser(
    email : Text,
    wallet : Principal,
    browserCode : Text,
  ) : async Result<(), Text> {
    _Monitor.collectMetrics();
    // Check if the code is valid (sent from the client browser - this is a fairly simple protection against scripts/devs trying to register users)
    if (browserCode != "Canister1") {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for not providing the Browser code");
      return #err("Cheating attempt has been detected. .");
    };
    // Check if the caller is above the rate limit (20 requests per minute) - if so, blacklist the caller and return an error
    if (Load.isAboveRateLimit(loadData, caller, Time.now())) {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for exceeding the rate limit");
      return #err("YOUR_IDENTITY_HAS_BEEN_LOGGED_AND_SENT_TO_THE_AUTHORITIES");
    };
    // We verify that the email is not already registered (only one user per email is allowed)
    if (Users.isEmailUsedByVerifiedUser(usersData, email)) {
      _Logs.logMessage("WARNING :: Email already registered : " # email);
      return #err("Email already registered");
    };
    // We verify that the wallet is not already registered (only one user per wallet is allowed)
    if (Users.isWalletUsedByVerifiedUser(usersData, wallet)) {
      _Logs.logMessage("ERROR :: Wallet already registered : " # Principal.toText(wallet));
      return #err("Wallet already registered");
    };
    switch (Users.registerUser(usersData, _Logs, caller, email, wallet)) {
      case (#err(msg)) {
        return #err(msg);
      };
      case (#ok(code)) {
        Emails.pushVerificationEmail(emailsData, email, code);
        return #ok();
      };
    };
  };

  public shared ({ caller }) func verifyUser(
    code : Code
  ) : async Result<(), Text> {
    _Monitor.collectMetrics();
    // Load balancing
    if (Load.isAboveRateLimit(loadData, caller, Time.now())) {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for exceeding the rate limit");
      return #err("YOUR_IDENTITY_HAS_BEEN_LOGGED_AND_SENT_TO_THE_AUTHORITIES");
    };
    switch (Users.verifyUser(usersData, _Logs, caller, code)) {
      case (#err(msg)) {
        return #err(msg);
      };
      case (#ok()) {
        Users.addToWhiteList(usersData, caller);
        return #ok();
      };
    };
  };

  // Returns the User profile associated with the caller
  // @auth : whitelisted (inspect function)
  public shared query ({ caller }) func getUser() : async Result<User, Text> {
    _Monitor.collectMetrics();
    Users.getUser(usersData, caller);
  };

  public shared query ({ caller }) func getUserAdmin(userId : Principal) : async Result<User, Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    Users.getUser(usersData, userId);
  };

  // Returns the list of all the airdrops (dashboard) for the caller
  // @auth : whitelisted (inspect function)
  public shared query ({ caller }) func getAllAirdropsDashboard() : async [AirdropDashboard] {
    Airdrops.getAllAirdropsDashboard(airdropData, _Logs, caller);
  };

  // Submits a code for a specific airdrop
  // @auth : whitelisted (inspect function)
  public shared ({ caller }) func submitCode(
    code : Text,
    browserCode : Text,
  ) : async Result<Text, Text> {
    _Monitor.collectMetrics();

    // Check if the code is valid (sent from the client browser - this is a fairly simple protection against scripts/devs trying to register users)
    if (browserCode != "Canister1") {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for not providing the Browser code");
      return #err("Cheating attempt has been detected. Your identity has been logged and you will be disqualified from the airdrop.");
    };

    // Load balancing - if the caller is above the rate limit of 10 request per s, blacklist the caller and return an error
    if (Load.isAboveRateLimit(loadData, caller, Time.now())) {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for exceeding the rate limit");
      return #err("You have exceeded the rate limit - you have been disqualified from the airdrop.");
    };

    if (not Users.isUserVerified(usersData, caller)) {
      return #err("You need to verify your email address before submitting a code");
    };

    if (_hasAlreadySubmitted(caller, code)) {
      return #err("You have already submitted this code - you can only submit a code once.");
    } else {
      _recordSubmission(caller, code);
    };

    let numberOfSubmissions = Users.incrementNumberOfSubmissions(usersData, _Logs, caller);

    if (numberOfSubmissions > 100) {
      Users.addToBlackList(usersData, caller);
      _Logs.logMessage("WARNING :: Blacklisted " # Principal.toText(caller) # " for exceeding the rate limit");
      return #err("You have made more than 100s submissions - this is not allowed.");
    };

    // If it's a special code deal with it through the users module
    if (Users.isSpecialCode(usersData, code)) {
      return Users.submitSpecialCode(usersData, _Logs, caller, code);
    };

    // Special codes for in-person meetups and organizers to prove their identity
    switch (Airdrops.getAirdropIdByCode(airdropData, code)) {
      case (?id) {
        switch (Airdrops.submitCode(airdropData, _Logs, id, caller, code)) {
          case (#err(e)) {
            return #err(e);
          };
          case (#ok()) {
            // Galactic Alien
            // Check if the user already has a alienId (if not, mint a new one)
            switch (Users.getAlienId(usersData, caller)) {
              case (null) {
                Users.setAlienId(usersData, caller, ?1_000_000);
                let accountIdentifier = Bioniq.getAccountIdentifier(caller);
                switch (await bioniqActor.bioniq_mint(accountIdentifier)) {
                  case (#ok(id)) {
                    Users.setAlienId(usersData, caller, ?id);
                    Users.levelUpAlien(usersData, caller);
                    return #ok(Nat32.toText(id));
                  };
                  case (#err(e)) {
                    _Logs.logMessage("ERROR :: Minting alien failed for " # Principal.toText(caller) # " : " # e);
                    Users.setAlienId(usersData, caller, null);
                    return #ok("42");
                  };
                };
              };
              case (?alienId) {
                if (alienId == 1_000_000) {
                  return #ok("42");
                };
                // 1/3 of chance to level up the alien
                let randomNumber = fuzz.nat.randomRange(1, 3);
                if (randomNumber == 1) {
                  let accountIdentifier = Bioniq.getAccountIdentifier(caller);
                  switch (await bioniqActor.bioniq_levelup(alienId)) {
                    case (#ok(_)) {
                      Users.levelUpAlien(usersData, caller);
                      return #ok(Nat32.toText(alienId));
                    };
                    case (#err(e)) {
                      _Logs.logMessage("ERROR :: Leveling up alien failed for " # Principal.toText(caller) # " : " # e);
                      return #ok("42");
                    };
                  };
                };
                return #ok("42");
              };
            };
          };
        };
      };
      case (null) {
        return #err("Invalid code");
      };
    };
  };

  ///////////
  // ADMIN //
  ///////////

  // Returns the list of all admins
  public query func getAdmins() : async [Principal] {
    _Monitor.collectMetrics();
    return _Admins.getAdmins();
  };

  // Adds the specified principal as an admin
  // @auth : admin
  public shared ({ caller }) func addAdmin(id : Text) : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    if (_Admins.isAdmin(Principal.fromText(id))) {
      return #err("Principal is already an admin");
    };
    _Admins.addAdmin(Principal.fromText(id), caller);
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Added admin : " # id # " by " # Principal.toText(caller));
    return #ok();
  };

  // Removes the specified principal from the list of admins
  // @auth : master (creator)
  public shared ({ caller }) func removeAdmin(p : Principal) : async Result.Result<(), Text> {
    assert (caller == master);
    _Monitor.collectMetrics();
    _Admins.removeAdmin(caller, p);
    _Logs.logMessage("ADMIN :: Removed admin : " # Principal.toText(p) # " by " # Principal.toText(caller));
    return #ok();
  };

  // Adds the specified principal to the blacklist
  // @auth : admin
  public shared ({ caller }) func blacklistAdmin(userId : Principal) : async () {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Blacklisted " # Principal.toText(userId) # " by " # Principal.toText(caller));
    Users.addToBlackList(usersData, userId);
  };

  // Sets the identity of the AWS_DOCKER principal
  // @auth : master (creator)
  public shared ({ caller }) func setDockerAdmin(p : Principal) : async () {
    assert (caller == master);
    _Monitor.collectMetrics();
    AWS_DOCKER := p;
  };

  // Adds the specified principal to the whitelist
  // @auth : admin
  public shared ({ caller }) func whitelistAdmin(userId : Principal) : async () {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Whitelisted " # Principal.toText(userId) # " by " # Principal.toText(caller));
    Users.addToBlackList(usersData, userId);
  };

  // Loads the data for an airdrop
  // @auth : admin
  public shared ({ caller }) func loadAirdropAdmin(
    init : AirdropInit
  ) : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Airdrop " # Nat.toText(init.metadata.id) # " loaded by " # Principal.toText(caller));
    Airdrops.loadAirdrop(airdropData, _Logs, init);
  };

  // Loads the data for special codes
  // @auth : admin
  public shared ({ caller }) func loadSpecialCodesAdmin(
    specialCodes : [SpecialCode]
  ) : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Special codes loaded by " # Principal.toText(caller));
    Users.loadSpecialCodes(usersData, specialCodes);
  };

  //Notify that the prizes for a specific airdrop have been distributed (called by the distributePrizesAndNotify script)
  // @auth : admin
  public shared ({ caller }) func notifyDistribution(
    airdropId : Nat,
    transferResult : TransferResult,
  ) : async () {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.logMessage("ADMIN :: Notify distribution for airdrop " # Nat.toText(airdropId) # " by " # Principal.toText(caller));
    Users.notifyTransferResults(usersData, _Logs, transferResult, airdropId);
  };

  // Returns the list of all the transfers for a specific airdrop
  // @auth : admin
  public shared query ({ caller }) func getTransfersDataAirdrop(
    airdropId : Nat
  ) : async Result<TransferData, Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    switch (Airdrops.getAirdropAdmin(airdropData, airdropId)) {
      case (?airdrop) {
        switch (airdrop.status) {
          case (#PrizesAssigned) {
            let qualified = airdrop.qualified;
            return #ok(Users.getTransfersDataAirdrop(usersData, _Logs, qualified, airdropId));
          };
          case (_) {
            return #err("Airdrop is not in the PrizesAssigned status");
          };
        };
      };
      case (null) {
        return #err("Airdrop not found");
      };
    };
  };

  // Sets a cron jobs to check airdrops (every 30 seconds)
  // @auth : admin
  public shared ({ caller }) func setCronJobsAdmin() : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    if (cronJobs.size() > 0) {
      return #err("Cron job already running");
    };
    let duration : Timer.Duration = #seconds(30);
    let id = Timer.recurringTimer(duration, cronAirdrops);
    let runningJobs = Buffer.fromArray<Timer.TimerId>(cronJobs);
    runningJobs.add(id);
    cronJobs := Buffer.toArray(runningJobs);
    _Logs.logMessage("ADMIN :: Set cron jobs by " # Principal.toText(caller));
    return #ok();
  };

  // Removes all the cron jobs (stored in the cronJobs array)
  // @auth : admin
  public shared ({ caller }) func removeCronJobsAdmin() : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    for (id in cronJobs.vals()) {
      Timer.cancelTimer(id);
    };
    _Logs.logMessage("ADMIN :: Remove cron jobs by " # Principal.toText(caller));
    return #ok();
  };

  // Removes a specific cron job
  // @auth : admin
  public shared ({ caller }) func removeJobAdmin(id : Nat) : async Result<(), Text> {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    Timer.cancelTimer(id);
    return #ok();
  };

  // Returns the list of running cron jobs (stored in the cronJobs array)
  // @auth : admin
  public shared query ({ caller }) func getRunningJobsAdmin() : async [Timer.TimerId] {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    return cronJobs;
  };

  ////////////
  // LOGS ///
  //////////

  // Returns collected log messages based on passed parameters.
  // Called from browser to get the logs.
  // @auth : admin
  public query ({ caller }) func getCanisterLog(request : ?Canistergeek.CanisterLogRequest) : async ?Canistergeek.CanisterLogResponse {
    assert (_Admins.isAdmin(caller));
    _Logs.getLog(request);
  };

  // Set the maximum number of saved log messages.
  // @auth : admin
  public shared ({ caller }) func setMaxMessagesCount(n : Nat) : async () {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    _Logs.setMaxMessagesCount(n);
  };

  ///////////////
  // METRICS ///
  /////////////

  // Returns the metrics of the canister
  // @auth : admin
  public query ({ caller }) func getCanisterMetrics(parameters : Canistergeek.GetMetricsParameters) : async ?Canistergeek.CanisterMetrics {
    assert (_Admins.isAdmin(caller));
    _Monitor.getMetrics(parameters);
  };

  // Force the collection of the metrics of the canister
  // @auth : admin
  public shared ({ caller }) func collectCanisterMetrics() : async () {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
  };

  //////////////
  // AIRDROP ///
  /////////////
  public type AirdropInit = Airdrops.AirdropInit;
  public type AirdropDashboard = Airdrops.AirdropDashboard;
  public type RaffleData = Airdrops.RaffleData;
  public type CodeSubmissionResult = Airdrops.CodeSubmissionResult;

  //////////////
  // EMAILS ///
  /////////////

  public shared query ({ caller }) func getEmails() : async [Email] {
    assert (caller == AWS_DOCKER or _Admins.isAdmin(caller));
    Emails.getEmails(emailsData);
  };

  public shared ({ caller }) func reportSentEmails(ids : [Nat]) : async Result<(), Text> {
    assert (caller == AWS_DOCKER or _Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    Emails.reportSentEmails(emailsData, ids);
  };

  ////////////
  // CRON ///
  ///////////

  // CRON job executed every 30 seconds to check the status of all the airdrops and potentially perform the raffles and allocate the prizes
  func cronAirdrops() : async () {
    _Monitor.collectMetrics();
    _Logs.logMessage("CRON :: Check status airdrops");
    // Return potential airdrops where we need to perfom the raffle
    switch (Airdrops.cronRaffleAirdrops(airdropData, _Logs)) {
      case (null) {
        return;
      };
      case (?airdrop) {
        _Logs.logMessage("CRON :: Raffle for airdrop " # Nat.toText(airdrop.metadata.id));
        switch (Airdrops.performRaffle(airdropData, _Logs, airdrop.metadata.id)) {
          case (#ok(output)) {
            for ((userId, prize) in output.vals()) {
              Users.addPrize(usersData, _Logs, userId, prize);
            };
            // Change the status of the airdrop to PrizesAssigned
            Airdrops.setAirdropStatus(airdropData, airdrop.metadata.id, #PrizesAssigned);
          };
          case (#err(e)) {
            _Logs.logMessage("ERROR :: Raffle failed for airdrop " # Nat.toText(airdrop.metadata.id) # " : " # e);
          };
        };
      };
    };
  };

  public shared ({ caller }) func allocatePrizes() : async () {
    assert (_Admins.isAdmin(caller));
    for (n in Iter.range(1, 40)) {
      switch (Airdrops.getOutput(airdropData, n)) {
        case (?output) {
          for ((userId, prize) in output.vals()) {
            Users.addPrize(usersData, _Logs, userId, prize);
          };
        };
        case (null) {
          _Logs.logMessage("ERROR :: Airdrop " # Nat.toText(n) # " not found");
        };
      };
    };
  };

  ////////////
  // NEW ///
  ///////////

  stable let usersSubmissions = Map.new<Principal, [Text]>();

  func _recordSubmission(userId : Principal, code : Text) {
    switch (Map.get<Principal, [Text]>(usersSubmissions, phash, userId)) {
      case (null) {
        Map.set<Principal, [Text]>(usersSubmissions, phash, userId, [code]);
      };
      case (?codes) {
        let newCodes = Buffer.fromArray<Text>(codes);
        newCodes.add(code);
        Map.set<Principal, [Text]>(usersSubmissions, phash, userId, Buffer.toArray(newCodes));
      };
    };

  };

  func _hasAlreadySubmitted(userId : Principal, code : Text) : Bool {
    switch (Map.get<Principal, [Text]>(usersSubmissions, phash, userId)) {
      case (null) {
        return false;
      };
      case (?codes) {
        for (c in codes.vals()) {
          if (c == code) {
            return true;
          };
        };
        return false;
      };
    };
  };

  public shared ({ caller }) func getBlacklist() : async [Principal] {
    assert (_Admins.isAdmin(caller));
    _Monitor.collectMetrics();
    return Users.getBlacklist(usersData);
  };

  ///////////
  // STATS//
  //////////

  public type Stats = {
    numberUsers : Nat;
    numberOfSubmissions : Nat;
    numberVerifiedUsers : Nat;
    numberBlacklisted : Nat;
    numberMeetups : [(Text, Nat)]; // Returns the number of submissions for each meetup (MeetupCode, numberSubmissions)
    numberAliens : [(Nat, Nat)]; // Returns the number of alien per level (AlienLevel, Nat)
    numberConf : Nat;
    numberTotalAliens : Nat;
  };

  stable let usersEmails = Map.new<Principal, Nat>();

  public shared ({ caller }) func getStats() : async Stats {

    let numberUsers = Users.getNumberOfUsers(usersData);
    let numberOfSubmissions = Users.getNumberOfSubmissions(usersData);
    let numberVerifiedUsers = Users.getNumberOfVerifiedUsers(usersData);
    let numberBlacklisted = Users.getNumberOfBlacklisted(usersData);
    let numberMeetups = Users.getMeetups(usersData);
    let numberAliens = Users.getAliens(usersData);
    let numberConf = Users.getConf(usersData);
    let numberTotalAliens = Users.getTotalAliens(usersData);

    return {
      numberUsers;
      numberOfSubmissions;
      numberVerifiedUsers;
      numberBlacklisted;
      numberMeetups;
      numberAliens;
      numberConf;
      numberTotalAliens;
    };
  };

  public shared ({ caller }) func exportDataAirdrop() : async [(Text, Principal, Principal, Nat)] {
    assert (_Admins.isAdmin(caller));
    return Users.exportDataAirdrop(usersData);
  };

  public query ({ caller }) func getQualifiedAirdrops() : async [Nat] {
    Airdrops.getQualifiedAirdrops(airdropData, _Logs, caller);
  };

  ////////////
  // EXT ////
  ///////////

  let bioniqTransfer = actor ("w2nny-fyaaa-aaaak-qce3a-cai") : Bioniq.ExtActor;
  let voltTransfer = actor ("aclt4-uaaaa-aaaak-qb4zq-cai") : Bioniq.VoltActor;

  stable let tokenIndexToIdentifiers = Map.new<Nat32, Text>();
  stable let tokenIndexToVoltTokenIndex = Map.new<Nat32, Nat32>();

  public type TokensData = [(Nat32, Text)];
  public type TokensDataVolt = [(Nat32, Nat32)];
  public type AccountIdentifier = Text;

  public shared ({ caller }) func getNumberOfPoints(userId : Principal) : async Nat {
    assert (_Admins.isAdmin(caller));
    return Users.getNumberOfPoints(usersData, userId);
  };

  public shared ({ caller }) func getAlienId(userId : Principal) : async ?Nat32 {
    assert (_Admins.isAdmin(caller));
    return Users.getAlienId(usersData, userId);
  };

  public shared ({ caller }) func loadTokensData(
    tokensData : TokensData
  ) : async () {
    assert (_Admins.isAdmin(caller));
    for ((tokenIndex, tokenIdentifiers) in tokensData.vals()) {
      Map.set<Nat32, Text>(tokenIndexToIdentifiers, n32hash, tokenIndex, tokenIdentifiers);
    };
  };

  public shared ({ caller }) func loadTokensDataVolt(
    tokensDataVolt : TokensDataVolt
  ) : async () {
    assert (_Admins.isAdmin(caller));
    for ((tokenIndex, tokenIndexVolt) in tokensDataVolt.vals()) {
      Map.set<Nat32, Nat32>(tokenIndexToVoltTokenIndex, n32hash, tokenIndex, tokenIndexVolt);
    };
  };

  public shared ({ caller }) func transferAlien(
    to : AccountIdentifier
  ) : async Result<(), Text> {
    switch (Users.getAlienId(usersData, caller)) {
      case (null) {
        #err("Alien not found");
      };
      case (?alienId) {
        switch (Map.get<Nat32, Text>(tokenIndexToIdentifiers, n32hash, alienId)) {
          case (null) {
            #err("Token index not found");
          };
          case (?tokenIdentifier) {
            let request : Bioniq.TransferRequest = {
              amount = 1;
              memo = [];
              notify = false;
              subaccount = null;
              from = #principal(Principal.fromActor(this));
              to = #address(to);
              token = tokenIdentifier;
            };
            switch (await bioniqTransfer.transfer(request)) {
              case (#ok(response)) {
                return #ok();
              };
              case (#err(e)) {
                return #err(Bioniq.transferErrorToText(#err(e)));
              };
            };
          };
        };
      };
    };
  };

  system func preupgrade() {
    _Logs.logMessage("START - PREUPGRADE");
    _AdminsUD := ?_Admins.preupgrade();
    _LogsUD := ?_Logs.preupgrade();
    _MonitorUD := ?_Monitor.preupgrade();
    _Logs.logMessage("END - PREUPGRADE");
  };

  system func postupgrade() {
    _Logs.logMessage("START - POSTUPGRADE");
    _Admins.postupgrade(_AdminsUD);
    _Logs.postupgrade(_LogsUD);
    _Monitor.postupgrade(_MonitorUD);
    _Logs.logMessage("END - POSTUPGRADE");
  };

};
