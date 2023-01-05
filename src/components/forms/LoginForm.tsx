import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { type FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { type Login, loginSchema } from '../../common/validation/auth';
import Link from 'next/link';
import clsx from 'clsx';
import Input from '../../layouts/Input';

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
          <h1 className="card-title text-primary-content">Login Page</h1>

          <Input label="Email" errorMessage={errors.email?.message}>
            <input
              type="text"
              className={clsx(
                'input',
                !!errors.email ? 'input-bordered input-error' : '',
              )}
              {...register('email')}
            />
          </Input>

          <Input label="Password" errorMessage={errors.password?.message}>
            <input
              type="password"
              className={clsx(
                'input',
                !!errors.password ? 'input-bordered input-error' : '',
              )}
              {...register('password')}
            />
          </Input>

          <div className="card-actions prose items-center justify-between">
            <Link href="/register">Don&apos;t have an account yet?</Link>

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
