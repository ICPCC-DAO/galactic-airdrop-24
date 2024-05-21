import T "types";
import Vector "mo:vector";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Map "mo:map/Map";
import { phash } "mo:map/Map";
import Fuzz "mo:fuzz";

module Emails {

  public type ModuleData = T.ModuleData;
  public type Email = T.Email;
  public type Result<Ok, Err> = Result.Result<Ok, Err>;
  public type Vector<T> = Vector.Vector<T>;

  public func init() : ModuleData {
    return ({
      emailsToSend = Vector.new<Email>();
    });
  };

  public func pushVerificationEmail(
    moduleData : ModuleData,
    email : Text,
    code : Text,
  ) : () {
    let fuzz = Fuzz.Fuzz();
    Vector.add<Email>(
      moduleData.emailsToSend,
      {
        id = fuzz.nat.random();
        email;
        code;
      },
    );
  };

  public func getEmails(
    moduleData : ModuleData
  ) : [Email] {
    return Vector.toArray(moduleData.emailsToSend);
  };

  public func reportSentEmails(
    moduleData : ModuleData,
    ids : [Nat],
  ) : Result<(), Text> {

    // Clone and clear
    let localClone = Vector.clone(moduleData.emailsToSend);
    Vector.clear(moduleData.emailsToSend);

    // Add back emails that were not reported
    for (email in Vector.vals(localClone)) {
      let id = email.id;
      switch (Array.find<Nat>(ids, func(x) { return x == id })) {
        case (null) {
          Vector.add<Email>(moduleData.emailsToSend, email);
        };
        case (?_) {};
      };
    };
    return #ok();
  };

};
