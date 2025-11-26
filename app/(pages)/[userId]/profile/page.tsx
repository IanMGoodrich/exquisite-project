import prisma from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import ProfileForm from "../../../components/profileform/profileform";
import Image from "next/image";
import { auth } from '../../../../lib/auth';
import { headers } from 'next/headers';
import { redirect  } from 'next/navigation'

type Props = {
  params: Promise<{ userId: string; }>
};


export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nameFirst: true,
      nameLast: true,
      userName: true,
      phone: true,
      image: true,
    },
  });
  
  if (!user) {
    notFound();
  } else {
    // verify session/user
     const session = await auth.api.getSession({
          headers: await headers()
        })
    
        if (!session || !session.user || session.user.id !== user.id) {
          redirect('/')
        }
  }


  return (
    <div className="profile-page">
      <h1>{user.userName ?? `${user.nameFirst} ${user.nameLast}`}</h1>
      <div className="profile-page--main-content">
        <div>
          <ProfileForm variant="update" user={user} />
        </div>
        <div>
          {user.image && (
            <Image
              width={250}
              height={250}
              src={user.image}
              alt={`image for ${user.userName}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
