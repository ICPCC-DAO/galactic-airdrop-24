import Vector "mo:vector";
import Map "mo:map/Map";

import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

module Emails {

  public type Vector<T> = Vector.Vector<T>;
  public type Map<K, V> = Map.Map<K, V>;

  public type Email = {
    id : Nat; // The id of the email
    email : Text;
    code : Text;
  };

  public type ModuleData = {
    emailsToSend : Vector<Email>;
  };

  public type Interface = {

    init : () -> ModuleData;
    getEmails : () -> [Email];
    reportSentEmails : (ids : [Nat]) -> ();

  };
};
