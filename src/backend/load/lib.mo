import T "types";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Map "mo:map/Map";
import Array "mo:base/Array";
import { phash } "mo:map/Map";

module {
  public type Map<K, V> = T.Map<K, V>;
  public type Buffer<T> = Buffer.Buffer<T>;
  public type Time = T.Time;

  public type ModuleData = T.ModuleData;

  public func init() : ModuleData {
    return ({
      calls = Map.new<Principal, [Time]>();
    });
  };

  // Returns a boolean indicating whether the caller is above the rate limit (5 update calls per minute)
  // Also records the current time as a call
  // True if the caller is above the rate limit, false otherwise
  public func isAboveRateLimit(
    moduleData : ModuleData,
    caller : Principal,
    currentTime : Time,
  ) : Bool {
    let minuteAgo = currentTime - 60_000_000_000;
    switch (Map.get<Principal, [Time]>(moduleData.calls, phash, caller)) {
      case (null) {
        let buffer = Buffer.Buffer<Time>(0);
        buffer.add(currentTime);
        Map.set<Principal, [Time]>(moduleData.calls, phash, caller, Buffer.toArray(buffer));
        return false;
      };
      case (?array) {
        let newBuffer = Buffer.Buffer<Time>(array.size() + 1);
        newBuffer.add(currentTime);
        for (t in array.vals()) {
          if (t > minuteAgo) {
            newBuffer.add(t);
          };
        };
        Map.set<Principal, [Time]>(moduleData.calls, phash, caller, Buffer.toArray(newBuffer));
        return newBuffer.size() >= 100;
      };
    };
  };

};
