import { type NextPage } from 'next';
import Head from 'next/head';
import { clsx } from 'clsx';

import PersonalDataCard from '../components/PersonalDataCard';
import { trpc } from '../utils/trpc';
import NavBar from '../components/NavBar';

const Home: NextPage = () => {
  const { data } = trpc.personalData.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Personal Data DBMS</title>
        <meta name="description" content="Project I've made" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <NavBar />
      </nav>

      <main className="min-h-screen">
        <div
          className={clsx(
            !!data
              ? 'gird-cols-1 container mx-auto inline-grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex items-center justify-center',
            'container min-h-full min-w-full',
          )}
        >
          {data?.map((personalData) => (
            <PersonalDataCard key={personalData.id} {...personalData} />
          )) ?? <progress className="progress progress-primary w-56" />}
        </div>
      </main>
    </>
  );
};

export default Home;
