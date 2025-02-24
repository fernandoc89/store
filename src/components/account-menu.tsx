import { getManagedSore } from "@/api/get-managed-store";
import { getProfile } from "@/api/get-profile";
import { signOut } from "@/api/sign-out"; // Add this line to import the signOut function
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { StoreProfileDialog } from "./store-profile-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function AccountMenu() {
    const navigate = useNavigate()

    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: Infinity
    })

    const { data: managedStore, isLoading: isLoadingManagedStore } = useQuery({
        queryKey: ['managed-store'],
        queryFn: getManagedSore,
        staleTime: Infinity
    })

    const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
          navigate('/sign-in', { replace: true })
        },
      })

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger >
                    <Button variant="outline" className="flex items-center gap-2 select-none">
                        {isLoadingManagedStore ? (
                            <Skeleton className="h-4 w-40" />
                        ) : managedStore?.name}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        {isLoadingProfile ? (
                            <div className="space-y-.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        ) : (
                            <>
                                <span>{profile?.name}</span>
                                <span className="text-xs font-normal text-muted-foreground">{profile?.email}</span>
                            </>

                        )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <Building className="mr-2 w-4 h-4" />
                            <span>Perfil da loja</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400" disabled={isSigningOut}>
                        <button className="w-full" onClick={() => signOutFn()}>
                        <LogOut className="mr-2 w-4 h-4" />
                        <span>Sair</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <StoreProfileDialog />
        </Dialog>
    )
}
