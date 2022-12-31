import { type PersonalData } from '@prisma/client';
import Link from 'next/link';
import { type FC } from 'react';

interface PersonalDataProps extends PersonalData {
  email?: string;
}

const PersonalDataCard: FC<PersonalDataProps> = ({
  id,
  firstName,
  lastName,
  email,
}) => (
  <div className="card w-80 justify-self-center bg-primary-content text-primary shadow-xl hover:cursor-pointer">
    <Link href={id}>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>

        <p>{email ?? 'mail'}</p>
      </div>
    </Link>
  </div>
);

export default PersonalDataCard;
