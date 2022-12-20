import { type NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { type Login, loginSchema } from '../common/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useCallback } from 'react';
import Head from 'next/head';
import MainLayout from '../components/MainLayout';

const Admin: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(async (data: Login) => {
    try {
      await signIn('credentials', { ...data, callbackUrl: '/' });
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
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Login Page</h2>

              <div>
                <input
                  type="text"
                  placeholder="Type your username..."
                  className="input-bordered input w-full max-w-xs"
                  {...register('username')}
                />

                {!!errors.username ? <p>{errors.username.message}</p> : null}
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

export default Admin;
