import { Helmet } from 'react-helmet-async'

import { registerStore } from '@/api/register-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const signUpForm = z.object({
    storeName: z.string(),
    managerName: z.string(),
    phone: z.string(),
    email: z.string().email()
})

type SignUpForm = z.infer<typeof signUpForm>



export function SignUp() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>()

    const { mutateAsync: registerStoreFn } = useMutation({
        mutationFn: registerStore,
    })

    async function handleSignUp(data: SignUpForm) {

        try {
            console.log(data, 'estou aqui')

            await registerStoreFn({
                storeName: data.storeName,
                managerName: data.managerName,
                email: data.email,
                phone: data.phone
            })

            toast.success('Loja cadastrada com sucesso!.', {
                action: {
                    label: 'Login',
                    onClick: () => navigate(`/sign-in?email=${data.email}`),
                },
            })
        } catch {
            toast.error('Erro ao cadastrar loja.')
        }

    }

    return (
        <>
            <Helmet title="Cadastro" />

            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/sign-up" className="">
                        Fazer login
                    </Link>

                </Button>

                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Criar conta grátis
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Seja um parceiro e comece suas vendas!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Nome da Loja:</Label>
                            <Input id="storeName" type="text" {...register("storeName")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="managerName">Seu nome:</Label>
                            <Input id="managerName" type="text" {...register("managerName")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Seu e-mail:</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Seu celular:</Label>
                            <Input id="phone" type="el" {...register("phone")} />
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">
                            Finalizar cadastro
                        </Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos <br /><a className="underline underline-offset-4" href="">Termos de Serviço</a> e <a className="underline underline-offset-4" href="">Políticas de Privacidade</a>.
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}