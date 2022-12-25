import { type NextPage } from 'next';
import Head from 'next/head';
import { clsx } from 'clsx';

import PersonalDataCard from '../components/PersonalDataCard';
import { trpc } from '../utils/trpc';
import MainLayout from '../components/MainLayout';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data } = trpc.personalData.getAll.useQuery();
  const user = useSession().data?.user;

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
              email={user?.email}
            />
          )) ?? <progress className="progress progress-primary w-56" />}
        </div>
      </MainLayout>
    </>
  );
};

export default Home;
