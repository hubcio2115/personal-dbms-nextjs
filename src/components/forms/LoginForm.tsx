import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { type FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { type Login, loginSchema } from '../../common/validation/auth';
import Link from 'next/link';
import clsx from 'clsx';

const LoginForm: FC = () => {
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
    mode: 'onTouched',
  });

  const onSubmit = useCallback((data: Login) => {
    try {
      signIn('credentials', { ...data, callbackUrl: '/dashboard' });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error(err);
    }
  }, []);

  return (
    <form
      className="flex w-full flex-auto items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card w-96 bg-primary shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary-content">Login Page</h2>

          <div className="form-control">
            <label className="label text-primary-content">
              <span className="label-text">Email:</span>
            </label>

            <input
              type="text"
              className={clsx(
                'input',
                !!errors.email ? 'input-bordered input-error' : '',
              )}
              {...register('email')}
            />

            <label className="label">
              {!!errors.email ? (
                <span className="label-text-alt">{errors.email.message}</span>
              ) : null}
            </label>
          </div>

          <div className="form-control">
            <label className="label text-primary-content">
              <span className="label-text">Password:</span>
            </label>

            <input
              type="password"
              className={clsx(
                'input',
                !!errors.password ? 'input-bordered input-error' : '',
              )}
              {...register('password')}
            />

            <label className="label">
              {!!errors.password ? (
                <span className="label-text-alt">
                  {errors.password.message}
                </span>
              ) : null}
            </label>
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
  );
};

export default LoginForm;
