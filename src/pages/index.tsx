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
    <MainLayout>
      <Head>
        <title>Personal DBMS</title>
      </Head>

      <main className="prose flex flex-col p-10">
        <h1>Personal DBMS</h1>

        <a
          onClick={() => void signIn('keycloak', { callbackUrl: '/dashboard' })}
          className="cursor-pointer"
        >
          Login
        </a>
      </main>
    </MainLayout>
  );
}
