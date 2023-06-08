import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type UpdateEmail,
  type UpdatePassword,
  updateEmailSchema,
  updatePasswordSchema,
} from '~/common/validation/user';
import Input from '~/layouts/Input';
import SettingsLayout from '~/layouts/SettingsLayout';
import { api } from '~/utils/api';
import { redirectIfSession } from '~/utils/redirectIfSession';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, false, '/', ctx);
}

export default function Preferences() {
  const { data: userData } = useSession();
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const { mutate: deleteUser } = api.user.deleteUser.useMutation();

  const handleDeleteAccount = () => {
    if (
      confirm("Are you sure you want to delete this account and it's data?")
    ) {
      deleteUser({ id: userData?.user.id ?? '' });
    }
  };

  // email form
  const { mutate: updateEmail, isLoading: isUpdateEmailLoading } =
    api.user.updateEmail.useMutation();

  const {
    register: emailFormRegister,
    handleSubmit: emailFormSubmit,
    formState: { errors: emailErrors, isValid: isEmailFormValid },
    reset: emailFormReset,
  } = useForm<UpdateEmail>({
    defaultValues: {
      id: '',
      email: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(updateEmailSchema),
  });

  useEffect(() => {
    emailFormReset({ id: userData?.user.id, email: userData?.user.email ?? "" });
  }, [userData, emailFormReset]);

  const onEmailFormSubmit = (data: UpdateEmail) => {
    updateEmail(data, {
      onSuccess: () => {
        setEmailErrorMessage('');
      },
      onError: ({ message }) => {
        setEmailErrorMessage(message);
      },
    });
  };

  // password form

  const { mutate: updatePassword, isLoading: isUpdatePasswordLoading } =
    api.user.updatePassword.useMutation();

  const {
    register: passwordFormRegister,
    handleSubmit: passwordFormSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordFormValid },
    reset: passwordFormReset,
  } = useForm<UpdatePassword>({
    defaultValues: {
      id: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    passwordFormReset({
      id: userData?.user.id,
      password: '',
    });
  }, [userData, passwordFormReset]);

  const onPasswordFormSubmit = (data: UpdatePassword) => {
    updatePassword(data);
  };

  return (
    <SettingsLayout>
      <h2>General</h2>

      <div className="divider">Email</div>

      <form
        onSubmit={() => {
          emailFormSubmit(onEmailFormSubmit);
        }}
        className="flex flex-col"
      >
        <Input label="User mail" errorMessage={emailErrors.email?.message}>
          <input
            type="email"
            className="input w-3/5 bg-base-300"
            {...emailFormRegister('email')}
          />
        </Input>

        <button
          className={clsx(
            'btn-success btn-sm btn w-52',
            isUpdateEmailLoading ? 'loading' : '',
          )}
          disabled={!isEmailFormValid || isUpdateEmailLoading}
          type="submit"
        >
          update email
        </button>

        {!!emailErrorMessage && (
          <div className="alert alert-error mt-5 shadow-lg">
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
              <span>{emailErrorMessage}</span>
            </div>
          </div>
        )}
      </form>

      <div className="divider">Security</div>

      <form
        onSubmit={() => {
          passwordFormSubmit(onPasswordFormSubmit);
        }}
      >
        <Input
          label="New password"
          errorMessage={passwordErrors.password?.message}
        >
          <input
            type="text"
            className="input w-3/5 bg-base-300"
            {...passwordFormRegister('password')}
          />
        </Input>

        <Input
          label="Confirm password"
          errorMessage={passwordErrors.confirmPassword?.message}
        >
          <input
            type="text"
            className="input w-3/5 bg-base-300"
            {...passwordFormRegister('confirmPassword')}
          />
        </Input>

        <button
          className={clsx(
            'btn-success btn-sm btn w-52',
            isUpdateEmailLoading ? 'loading' : '',
          )}
          disabled={!isPasswordFormValid || isUpdatePasswordLoading}
          type="submit"
        >
          change password
        </button>
      </form>

      <div className="divider">Danger Zone</div>

      <button className="btn-error btn-sm btn" onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </SettingsLayout>
  );
}
