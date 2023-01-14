import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import emailjs from '@emailjs/browser';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContactUs, contactUsSchema } from '../common/validation/contactUs';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../layouts/Input';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

const ContactUs: NextPage = () => {
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

  const onSubmit = (data: ContactUs) => {
    setIsEmailSending(true);

    emailjs
      .send(
        process.env.EMAILJS_SERVICE_ID ?? '',
        'template_d700ypv',
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

  useEffect(() => {
    if (!!userData?.user.email)
      reset({ email: userData.user.email, mailMessage: '', title: '' });
  }, [userData, reset]);

  return (
    <MainLayout className="prose flex-col pt-10">
      <Head>
        <title>Contact Us</title>
      </Head>

      <h2>Contact Us</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" errorMessage={errors.email?.message}>
          <input
            className="input w-3/5 bg-base-300"
            type="email"
            {...register('email')}
            placeholder="Put your address here"
          />
        </Input>

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
          Send a question
        </button>
      </form>
    </MainLayout>
  );
};

export default ContactUs;
