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
  maidenName,
}) => (
  <div className="card w-80 justify-self-center bg-primary-content text-primary shadow-xl hover:cursor-pointer">
    <Link href={id}>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${maidenName} ${lastName}`}</h2>
      </div>
    </Link>
  </div>
);

export default PersonalDataCard;
