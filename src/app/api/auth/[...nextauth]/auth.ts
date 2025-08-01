import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                username: { label: 'Usuario', type: 'username' },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('Credenciales incorrectas');
                }

                const userFound = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!userFound) {
                    throw new Error('Usuario no encontrado');
                }

                const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

                if (!matchPassword) {
                    throw new Error('Contraseña incorrecta');
                }

                return {
                    id: userFound.id.toString(),
                    name: userFound.username,
                    email: userFound.username,
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
};
