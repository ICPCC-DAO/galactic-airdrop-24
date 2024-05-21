import { Principal } from '@dfinity/principal';
import type { DistributionStatus } from '$declarations/backend/backend.did';

export type PrizeFrontend = {
    symbol: string,
    amount: bigint,
    decimals: bigint,
    ledgerId: Principal
    distributionStatus: DistributionStatus
}