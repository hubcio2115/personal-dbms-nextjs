import { type NextPage } from 'next';
import Head from 'next/head';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data } = trpc.personalData.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Personal Data CMS</title>
        <meta name="description" content="Project I've made" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <ol>
            {data?.map((personalData) => (
              <li key={personalData.id}>
                <p>{personalData.firstName}</p>
              </li>
            )) ?? <li>Loading...</li>}
          </ol>
        </div>
      </main>
    </>
  );
};

export default Home;
