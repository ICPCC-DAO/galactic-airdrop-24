import type { AirdropDashboard } from '../../../../declarations/backend/backend.did.d';

export type AirdropStatusFrontend = 'All' | 'Pending' | 'Open' | 'Closed';

export function matchesStatus(airdrop: AirdropDashboard, status: AirdropStatusFrontend): boolean {
    switch (status) {
        case 'All':
            return true;
        case 'Pending':
            return isPending(airdrop);
        case 'Open':
            return isOpen(airdrop);
        case 'Closed':
            return isClosed(airdrop);
    }
}


export function isPending(airdrop: AirdropDashboard): boolean {
    return (Object.keys(airdrop.status)[0]) == 'Pending';
}
export function isOpen(airdrop: AirdropDashboard): boolean {
    return (Object.keys(airdrop.status)[0]) == 'Open';
}

export function isClosed(airdrop: AirdropDashboard): boolean {
    const firstStatusKey = Object.keys(airdrop.status)[0];
    return firstStatusKey === 'EntryClosed' || firstStatusKey === 'RaffleCompleted' || firstStatusKey === 'PrizesAssigned';
}

export function isDistributed(airdrop: AirdropDashboard): boolean {
    return (Object.keys(airdrop.status)[0]) == 'PrizesDelivered';
}


