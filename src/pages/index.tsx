import { type GetServerSidePropsContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import MainLayout from '~/layouts/MainLayout';
import { redirectIfSession } from '~/utils/redirectIfSession';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, true, '/dashboard', ctx);
}

export default function Home() {
  return (
    <MainLayout className="items-center justify-center">
      <Head>
        <title>Personal DBMS</title>
      </Head>

      <button
        onClick={() => void signIn('keycloak', { callbackUrl: '/dashboard' })}
        className="btn-info btn w-1/12"
      >
        Login
      </button>
    </MainLayout>
  );
}
