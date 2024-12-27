import { api } from "@/lib/axios";

export interface GetManagedStoreResponse {
    id: string;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    description: string | null;
    managerId: string | null;
}

export async function getManagedSore() {
    const response = await api.get<GetManagedStoreResponse>('/managed-store')

    return response.data
}