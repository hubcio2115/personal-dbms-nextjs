import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  type RegisterUser,
  registerUserSchema,
} from '../../common/validation/user';
import { trpc } from '../../utils/trpc';

const RegisterForm: FC = () => {
  const { mutate: addNewUser, isLoading } =
    trpc.user.createNewUser.useMutation();
  const router = useRouter();

  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm<RegisterUser>({
    defaultValues: { confirmPassword: '', email: '', password: '' },
    mode: 'onTouched',
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = (registerData: RegisterUser) => {
    addNewUser(registerData, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };
  return (
    <form
      className="mt-5 flex flex-auto flex-col justify-center gap-6 md:w-1/2 xl:w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card w-full bg-primary xl:mb-24">
        <div className="card-body">
          <h2 className="card-title text-primary-content">Register Page</h2>

          <div className="form-control">
            <label className="label text-primary-content">
              <span className="label-text">Email:</span>
            </label>

            <input
              type="text"
              className={clsx(
                'input',
                !!errors.confirmPassword ? 'input-bordered input-error' : '',
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
              type="text"
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

          <div className="form-control">
            <label className="label text-primary-content">
              <span className="label-text">Confirm Password:</span>
            </label>

            <input
              type="text"
              className={clsx(
                'input',
                !!errors.confirmPassword ? 'input-bordered input-error' : '',
              )}
              {...register('confirmPassword')}
            />

            <label className="label">
              {!!errors.confirmPassword ? (
                <span className="label-text-alt">
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </label>
          </div>

          <Link href="/">Already have an account?</Link>

          <div className="card-actions flex justify-between">
            <button
              className="btn-error btn"
              type="button"
              onClick={() => reset()}
            >
              Reset
            </button>

            <button
              className={clsx('btn-success btn', isLoading ? 'loading' : '')}
              type="submit"
              disabled={isLoading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
