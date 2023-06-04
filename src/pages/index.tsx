import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import MainLayout from '~/layouts/MainLayout';
import LoginForm from '~/components/forms/LoginForm';
import { redirectIfSession } from '~/utils/redirectIfSession';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return redirectIfSession(session, true, '/dashboard', ctx);
};

const Home: NextPage = () => (
  <MainLayout>
    <Head>
      <title>Login Page</title>
    </Head>

    <LoginForm />
  </MainLayout>
);

export default Home;
