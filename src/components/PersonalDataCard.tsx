import { type PersonalData } from '@prisma/client';
import Link from 'next/link';
import { type FC } from 'react';

type PersonalDataProps = PersonalData;

const PersonalDataCard: FC<PersonalDataProps> = ({
  id,
  firstName,
  lastName,
  email,
}: PersonalDataProps) => (
  <div className="card w-80 justify-self-center bg-primary-content text-primary shadow-xl hover:cursor-pointer">
    <Link href={id}>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>

        <p>{email}</p>
      </div>
    </Link>
  </div>
);

export default PersonalDataCard;
