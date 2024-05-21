import { Principal } from "@dfinity/principal";
import { principalToAccountIdentifier } from "@dfinity/ledger-icp";

const toHexString = (byteArray: Uint8Array): string => {
    return Array.from(byteArray, (byte: number) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
};

const fromHexString = (hex: string): number[] => {
    if (hex.startsWith("0x")) hex = hex.slice(2);
    let bytes: number[] = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
};

const getHexFromPrincipal = (principal: Principal): string => {
    return toHexString(principal.toUint8Array());
};

const getSubaccountFromHex = (hex: string): number[] => {
    const dec = fromHexString(hex);
    return Array(32 - dec.length)
        .fill(0)
        .concat(dec);
};

const getSubaccountFromPrincipal = (principal: Principal): number[] => {
    return getSubaccountFromHex(getHexFromPrincipal(principal));
};

const getSubaccountFromPrincipalText = (principal: string): number[] => {
    console.log("Principal Text:", principal);
    return getSubaccountFromPrincipal(Principal.fromText(principal));
};

export const cleanAddress = (a: string): string => {
    let aa = a.toLowerCase();
    console.log("Lowercase address:", aa);

    try {
        const subaccount = getSubaccountFromPrincipalText(aa);
        const subaccountUint8Array = new Uint8Array(subaccount);
        const accountIdentifier = principalToAccountIdentifier(Principal.fromText("aclt4-uaaaa-aaaak-qb4zq-cai"), subaccountUint8Array);
        return accountIdentifier;
    } catch (e) {
        console.error("Error in cleanAddress:", e);
        return "";
    }
};
