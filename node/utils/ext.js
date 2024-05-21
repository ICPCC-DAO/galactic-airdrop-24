import { Principal } from "@dfinity/principal";
import { principalToAccountIdentifier } from "@dfinity/ledger-icp";

const toHexString = (byteArray) => {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };
  
  const fromHexString = (hex) => {
    if (hex.startsWith("0x")) hex = hex.slice(2);
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  };
  
  const getHexFromPrincipal = (principal) => {
    return toHexString(principal.toUint8Array());
  };
  
  const getSubaccountFromHex = (hex) => {
    const dec = fromHexString(hex);
    return Array(32 - dec.length)
      .fill(0)
      .concat(dec);
  };
  
  const getSubaccountFromPrincipal = (principal) => {
    return getSubaccountFromHex(getHexFromPrincipal(principal));
  };
  
  const getSubaccountFromPrincipalText = (principal) => {
    console.log("Principal Text:", principal);
    return getSubaccountFromPrincipal(Principal.fromText(principal));
  };


  
  const cleanAddress = (a) => {
    let aa = a.toLowerCase();
    console.log("Lowercase address:", aa);
    
    try { 
      const subaccount = getSubaccountFromPrincipalText(aa);

      console.log("Subaccount:", subaccount);
      const accountIdentifier = principalToAccountIdentifier(Principal.fromText("aclt4-uaaaa-aaaak-qb4zq-cai"), subaccount);
      console.log("Account Identifier:", accountIdentifier);
      return accountIdentifier;
    } catch (e) { 
      console.error("Error in cleanAddress:", e);
      return "";
    }
  };  
  
  let answer = cleanAddress("44ybk-jmvib-gljhx-ttzhh-gx3t2-bsvys-tdsmc-6czgd-nukrl-phaqy-jqe");
  console.log("Answer:", answer);
  