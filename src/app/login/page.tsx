'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { LoginFormType } from '@/types/form';

import { showErrorToast } from '@/components/Toast';
import Image from 'next/image';

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormType>();
    const router = useRouter();

    const onSubmit = async (data: LoginFormType) => {
        const res = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
        });
        if (!res?.ok) {
            showErrorToast(String(res?.error));
        } else {
            router.push('/admin/sales');
        }
    };

    return (
        <div className="h-dvh flex flex-col md:flex-row bg-main text-secondary">
            <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden bg-accent">
                <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm z-10"></div>
                <Image
                    src="/login-image.svg"
                    alt="Decoración login"
                    width={20}
                    height={20}
                    priority
                    className="w-3/4 max-w-md z-20 animate-fade-in-up"
                />
            </div>

            <div className="min-h-screen md:min-h-full w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 animate-fade-in bg-surface">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-2 text-center text-accent">Iniciar sesión</h1>
                    <p className="text-sm mb-6 text-center text-muted">Ingresá tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Usuario
                            </label>
                            <input
                                {...register('username', {
                                    required: 'El usuario es obligatorio',
                                })}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="usuario01"
                                className={`mt-1 w-full px-4 py-2 rounded-xl shadow-sm bg-main border ${
                                    errors.username ? 'border-red-500' : 'border-border'
                                } text-secondary focus:outline-none focus:border-accent transition-all`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Contraseña
                            </label>
                            <input
                                {...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: {
                                        value: 8,
                                        message: 'La contraseña debe tener al menos 8 caracteres',
                                    },
                                })}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`mt-1 w-full px-4 py-2 rounded-xl shadow-sm bg-main border ${
                                    errors.password ? 'border-red-500' : 'border-border'
                                } text-secondary focus:outline-none focus:border-accent transition-all`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-xl font-semibold bg-accent text-secondary hover:bg-accent-hover transition-colors cursor-pointer mt-2"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
