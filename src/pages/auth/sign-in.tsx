import { Helmet } from 'react-helmet-async'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const signInForm = z.object({
    email: z.string().email()
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
    const [searchParams] = useSearchParams()
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>({
        defaultValues: {email: searchParams.get('email') ?? ''}
    })

    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn,
    })

    async function handleSignIn(data: SignInForm) {

        try {
            

            await authenticate({ email: data.email})

            toast.success('Enviamos um link de autenticação para seu e-mail.', {
                action: {
                    label: 'Reenviar',
                    onClick: () => handleSignIn(data)
                }
            })
        } catch {
            toast.error('Há algo errado.')
        }

    }

    return (
        <>
            <Helmet title="Login" />

            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-in" className="">
                        Novo estabelecimento
                    </Link>

                </Button>
                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acessar painel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Acompanhe suas vendas pelo painel do parceiro!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Seu e-mail</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">
                            Acessar painel
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}