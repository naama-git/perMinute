// Entity

import type { Hostname } from "./hostname";

 export interface Work {
    id: string;
    name: string;
    websiteDomains: Hostname[];
    createdAt: number;
    updatedAt: number;
    archivedAt: number | null;
    }