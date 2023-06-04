import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import RegisterForm from '../components/forms/RegisterForm';
import MainLayout from '../layouts/MainLayout';
import { redirectIfSession } from '../utils/redirectIfSession';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, true, '/dashboard', ctx);
}

export default function Register() {
  return (
    <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
      <Head>
        <title>Register</title>
      </Head>

      <RegisterForm />
    </MainLayout>
  );
}
