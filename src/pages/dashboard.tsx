import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { clsx } from 'clsx';

import PersonalDataCard from '../components/PersonalDataCard';
import { trpc } from '../utils/trpc';
import MainLayout from '../layouts/MainLayout';
import { getSession, useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return !session
    ? {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    : {
        props: {
          session,
          query: ctx.query,
        },
      };
};

const Dashboard: NextPage = () => {
  const { data } = trpc.personalData.getAll.useQuery();
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Personal Data DBMS</title>
        <meta name="description" content="Project I've made" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div
          className={clsx(
            !!data
              ? 'gird-cols-1 grid gap-4 py-8  md:grid-cols-2 md:py-16 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex items-center justify-center',
            'flex-auto',
          )}
        >
          {data?.map((personalData) => (
            <PersonalDataCard
              key={personalData.id}
              {...personalData}
              email={sessionData?.user.email}
            />
          )) ?? <progress className="progress progress-primary w-56" />}
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
