import { type NextPage } from 'next';
import Head from 'next/head';
import { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type Login } from '../server/common/auth';
import MainLayout from '../components/MainLayout';

const admin: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { register, handleSubmit } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onSubmit = useCallback(async (data: Login) => {
    await signIn('credentials', { ...data, callbackUrl: '/' });
  }, []);

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>

      <MainLayout>
        <form
          className="flex w-full flex-auto items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="card w-96 bg-neutral shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Login:</h2>

              <input
                type="text"
                placeholder="Type your username..."
                className="input-bordered input mt-2 w-full max-w-xs"
                {...register('username')}
              />

              <input
                type="password"
                placeholder="Type your password..."
                className="input-bordered input my-2 w-full max-w-xs"
                {...register('password')}
              />

              <div className="card-actions items-center justify-between">
                <button className="btn-secondary btn" type="submit">
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </MainLayout>
    </>
  );
};

export default admin;
