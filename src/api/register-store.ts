import { api } from "@/lib/axios";

export interface RegisterStoreBody {
    storeName: string
    managerName: string
    email: string
    phone: string
}

export async function registerStore({ storeName, managerName, email, phone }: RegisterStoreBody) {
    await api.post('/stores', { storeName, managerName, email, phone })
}