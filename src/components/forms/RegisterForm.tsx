import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type RegisterUser,
  registerUserSchema,
} from '~/common/validation/user';
import Input from '~/layouts/Input';
import { api } from '~/utils/api';

export default function RegisterForm() {
  const { mutate: addNewUser, isLoading } =
    api.user.createNewUser.useMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

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

  const onSubmit = useCallback((registerData: RegisterUser) => {
    addNewUser(registerData, {
      onSuccess: () => {
        void router.push('/');
      },
      onError: ({ message }) => {
        setErrorMessage(message);
      },
    });
  }, [addNewUser, router])

  return (
    <form
      className="prose mt-5 flex flex-auto flex-col justify-center gap-7 md:w-1/2 xl:w-1/3"
      onSubmit={() => {
        handleSubmit(onSubmit);
      }}
    >
      <div className="card w-full bg-primary xl:mb-24">
        <div className="card-body">
          <h1 className="card-title text-primary-content">Register Page</h1>

          <Input label="Email" errorMessage={errors.email?.message}>
            <input
              type="email"
              className={clsx(
                'input',
                !!errors.email ? 'input-bordered input-error' : '',
              )}
              {...register('email')}
            />
          </Input>

          <Input label="Password" errorMessage={errors.password?.message}>
            <input
              type="text"
              className={clsx(
                'input',
                !!errors.password ? 'input-bordered input-error' : '',
              )}
              {...register('password')}
            />
          </Input>

          <Input
            label="Confirm Password"
            errorMessage={errors.confirmPassword?.message}
          >
            <input
              type="text"
              className={clsx(
                'input',
                !!errors.confirmPassword ? 'input-bordered input-error' : '',
              )}
              {...register('confirmPassword')}
            />
          </Input>

          <div className="form-control flex-row">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                {...register('isPrivacyPolicyAccepted')}
                className={clsx(
                  'checkbox mr-2',
                  !!errors.isPrivacyPolicyAccepted
                    ? 'checkbox-error'
                    : 'checkbox-success',
                )}
              />

              <span className="label-text">
                <Link href="/privacyPolicy">Accept Privacy Policy?</Link>{' '}
              </span>
            </label>

            <label className="label">
              {!!errors.isPrivacyPolicyAccepted ? (
                <span className="label-text-alt">
                  {errors.isPrivacyPolicyAccepted.message}
                </span>
              ) : null}
            </label>
          </div>

          <div className="card-actions flex justify-between">
            <Link href="/" className="pb-4 pt-3">
              Already have an account?
            </Link>

            <button
              className="btn-error btn"
              type="button"
              onClick={() => {
                setErrorMessage('');
                reset();
              }}
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

          {!!errorMessage && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
