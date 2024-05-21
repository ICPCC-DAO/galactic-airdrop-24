import Map "mo:map/Map";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Vector "mo:vector";

module {

  public type Map<K, V> = Map.Map<K, V>;
  public type Vector<T> = Vector.Vector<T>;
  public type Time = Time.Time;
  public type ModuleData = {
    calls : Map<Principal, [Time]>;
  };
};
