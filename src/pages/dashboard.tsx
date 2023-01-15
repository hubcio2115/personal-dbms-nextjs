import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { clsx } from 'clsx';

import PersonalDataCard from '../components/PersonalDataCard';
import { api } from '../utils/api';
import MainLayout from '../layouts/MainLayout';
import { getSession } from 'next-auth/react';
import { redirectIfSession } from '../utils/redirectIfSession';
import { type ChangeEvent, useState } from 'react';
import { useDebounce } from '../common/hooks/useDebounce';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return redirectIfSession(session, false, '/', ctx);
};

const Dashboard: NextPage = () => {
  const [searchParams, setSearchParams] = useState('');

  const handleSearchParamsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
  };

  const debounceValue = useDebounce(searchParams, 300);

  const { data } = api.personalData.getFiltered.useQuery({
    searchParams: debounceValue,
  });

  return (
    <>
      <Head>
        <title>Personal Data DBMS</title>
        <meta name="description" content="Project I've made" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="flex-col gap-8 pt-8 ">
        <input
          type="text"
          onChange={handleSearchParamsChange}
          placeholder="Search by first name..."
          className="input w-96 place-self-center bg-base-300"
        />

        <div
          className={clsx(
            !!data
              ? 'gird-cols-1 grid grid-rows-6 gap-4 md:grid-cols-2 md:grid-rows-5 lg:grid-cols-3 xl:grid-cols-4 xl:grid-rows-none'
              : 'flex items-center justify-center',
            'flex-auto',
          )}
        >
          {data?.map((personalData) => (
            <PersonalDataCard key={personalData.id} {...personalData} />
          )) ?? <progress className="progress progress-primary w-56" />}
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
