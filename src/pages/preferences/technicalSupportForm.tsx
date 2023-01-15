import { zodResolver } from '@hookform/resolvers/zod';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import {
  contactUsSchema,
  type ContactUs,
} from '../../common/validation/contactUs';
import Input from '../../layouts/Input';
import SettingsLayout from '../../layouts/SettingsLayout';
import { redirectIfSession } from '../../utils/redirectIfSession';
import clsx from 'clsx';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return redirectIfSession(session, false, '/', ctx);
};

const TechnicalSupportForm: NextPage = () => {
  const { data: userData } = useSession();
  const [isEmailSending, setIsEmailSending] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ContactUs>({
    defaultValues: { email: '', title: '', mailMessage: '' },
    mode: 'onTouched',
    resolver: zodResolver(contactUsSchema),
  });

  useEffect(() => {
    reset({ email: userData?.user.email, title: '', mailMessage: '' });
  }, [userData, reset]);

  const onSubmit = (data: ContactUs) => {
    setIsEmailSending(true);

    emailjs
      .send(
        process.env.EMAILJS_SERVICE_ID ?? '',
        'template_atlzr4h',
        data,
        process.env.EMAILJS_PUBLIC_KEY ?? '',
      )
      .then((res) => {
        if (process.env.NODE_ENV === 'development') console.log(res);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsEmailSending(false);
      });
  };

  return (
    <SettingsLayout>
      <h2>Technical Support Form</h2>

      <div className="divider" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Title" errorMessage={errors.title?.message}>
          <input
            className="input w-3/5 bg-base-300"
            type="text"
            {...register('title')}
            placeholder="Write the title here!"
          />
        </Input>

        <Input
          label="Message content"
          errorMessage={errors.mailMessage?.message}
        >
          <textarea
            className="textarea bg-base-300"
            {...register('mailMessage')}
            placeholder="Write a question for us!"
          />
        </Input>

        <button
          className={clsx(
            'btn-success btn-sm btn',
            isEmailSending ? 'loading' : '',
          )}
          disabled={isEmailSending}
          type="submit"
        >
          Send a ticket
        </button>
      </form>
    </SettingsLayout>
  );
};

export default TechnicalSupportForm;
