import type { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import MainLayout from '~/layouts/MainLayout';
import LoginForm from '~/components/forms/LoginForm';
import { redirectIfSession } from '~/utils/redirectIfSession';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, true, '/dashboard', ctx);
}

export default function Home() {
  return (
    <MainLayout>
      <Head>
        <title>Login Page</title>
      </Head>

      <LoginForm />
    </MainLayout>
  );
}
