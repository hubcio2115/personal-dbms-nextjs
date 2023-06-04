import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { clsx } from 'clsx';

import PersonalDataCard from '../components/PersonalDataCard';
import { api } from '../utils/api';
import MainLayout from '../layouts/MainLayout';
import { getSession } from 'next-auth/react';
import { redirectIfSession } from '../utils/redirectIfSession';
import { type ChangeEvent, useState, useRef, useMemo } from 'react';
import { useDebounce } from '../common/hooks/useDebounce';
import { v5 as uuidv5 } from 'uuid';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, false, '/', ctx);
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (page: number) => {
    if (currentPage !== page) setCurrentPage(page);
  };

  const handleSearchParamsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
  };

  const debounceValue = useDebounce(searchParams, 300);

  const { data, isLoading } = api.personalData.getFiltered.useQuery({
    searchParams: debounceValue,
  });

  const numberPerPage = useRef(12);

  const slicedData = useMemo(
    () =>
      !!data && !!data.length
        ? data.slice(
            currentPage * numberPerPage.current,
            (currentPage + 1) * numberPerPage.current,
          )
        : [],
    [currentPage, numberPerPage, data],
  );

  return (
    <>
      <Head>
        <title>Personal Data DBMS</title>
        <meta name="description" content="Project I've made" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout className="flex-col gap-8 pt-8">
        <input
          type="text"
          onChange={handleSearchParamsChange}
          placeholder="Search by first name..."
          className="input w-96 place-self-center bg-base-300"
        />

        <div
          className={clsx(
            !!data && !!data.length && !isLoading
              ? 'grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-auto items-center justify-center',
          )}
        >
          {!isLoading ? (
            !!data && !!data.length ? (
              slicedData.map((personalData) => (
                <PersonalDataCard key={personalData.id} {...personalData} />
              ))
            ) : (
              <h2>There is no data to show :&#40;</h2>
            )
          ) : (
            <div
              className="radial-progress animate-spin self-center justify-self-center text-primary"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              style={{ '--value': 25 }}
            />
          )}
        </div>

        {!!data && data.length > numberPerPage.current && (
          <div className="btn-group flex h-20 flex-auto items-end self-center">
            {Array.from(
              Array(Math.ceil(data.length / numberPerPage.current)).keys(),
            ).map((pageNumber) => (
              <button
                key={uuidv5(
                  pageNumber.toString(),
                  'bc4912ed-67a8-4e39-bb85-a26bb60f20fa',
                )}
                className={clsx(
                  'btn',
                  currentPage === pageNumber ? 'btn-active' : '',
                )}
                onClick={() => handleChangePage(pageNumber)}
              >
                {pageNumber + 1}
              </button>
            ))}
          </div>
        )}
      </MainLayout>
    </>
  );
}
