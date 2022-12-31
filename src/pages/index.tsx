import type { GetServerSideProps, NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { type Login, loginSchema } from '../common/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession, signIn } from 'next-auth/react';
import { useCallback } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return !!session
    ? {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
    : {
        props: {
          session,
          query: ctx.query,
        },
      };
};

const Home: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback((data: Login) => {
    try {
      signIn('credentials', { ...data, callbackUrl: '/dashboard' });
    } catch (err) {
      console.error(err);
    }
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
          <div className="card w-96 bg-primary shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-primary-content">Login Page</h2>

              <div>
                <input
                  type="text"
                  placeholder="Type your username..."
                  className="input-bordered input w-full max-w-xs"
                  {...register('email')}
                />

                {!!errors.email ? <p>{errors.email.message}</p> : null}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Type your password..."
                  className="input-bordered input my-2 w-full max-w-xs"
                  {...register('password')}
                />

                {!!errors.password ? <p>{errors.password.message}</p> : null}
              </div>

              <div className="card-actions items-center justify-between">
                <Link href="/register">Don&apos;t have account yet?</Link>

                <button className="btn-success btn" type="submit">
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

export default Home;
