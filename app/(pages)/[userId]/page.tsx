import prisma from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserHomePage({ params }: Props) {
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
      stories: true,
      image: true,
    },
  });

  if (!user) {
    notFound();
  } else {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.id !== user.id) {
      redirect("/");
    }
  }

  return (
    <div className="profile-page">
      <h1>Hello {user.userName}!</h1>
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
      <div className="profile-page--main-content">
        <div>
          {user.stories.length ? (
            user.stories.map((story) => (
              <div key={story.id}>{story.title} </div>
            ))
          ) : (
            <div>Time to begin a story</div>
          )}
        </div>
      </div>
    </div>
  );
}
