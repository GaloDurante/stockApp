'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { showErrorToast } from '@/components/Toast';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { username?: string; password?: string } = {};
        if (!data.username.trim()) newErrors.username = 'El usuario es obligatorio';
        if (!data.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (data.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const res = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
        });
        if (!res?.ok) {
            showErrorToast(String(res?.error));
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="h-dvh flex flex-col md:flex-row bg-main text-text">
            <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden bg-accent">
                <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm z-10"></div>
                <Image
                    src="/login-image.svg"
                    alt="Decoración login"
                    width={20}
                    height={20}
                    className="w-3/4 max-w-md z-20 animate-fade-in-up"
                />
            </div>

            <div className="min-h-screen md:min-h-full w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 animate-fade-in bg-surface">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-2 text-center text-accent">Iniciar sesión</h1>
                    <p className="text-sm mb-6 text-center text-muted">Ingresá tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Usuario
                            </label>
                            <input
                                onChange={(e) => {
                                    setData({ ...data, username: e.target.value });
                                    if (errors.username) setErrors({ ...errors, username: undefined });
                                }}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="usuario01"
                                className={`mt-1 w-full px-4 py-2 rounded-xl shadow-sm bg-main border ${
                                    errors.username ? 'border-red-500' : 'border-border'
                                } text-text focus:outline-none focus:border-accent transition-all`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Contraseña
                            </label>
                            <input
                                onChange={(e) => {
                                    setData({ ...data, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`mt-1 w-full px-4 py-2 rounded-xl shadow-sm bg-main border ${
                                    errors.password ? 'border-red-500' : 'border-border'
                                } text-text focus:outline-none focus:border-accent transition-all`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-xl font-semibold bg-accent text-text hover:bg-accent-hover transition-colors cursor-pointer mt-2"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
