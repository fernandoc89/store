import { api } from "@/lib/axios";

interface GetManagedSoreResponse {
    id: string;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    description: string | null;
    managerId: string | null;
}

export async function getManagedSore() {
    const response = await api.get<GetManagedSoreResponse>('/managed-store')

    return response.data
}