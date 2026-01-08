import prisma from "../../../lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/app/components/button/button";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
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
            loading="eager"
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
              <div key={story.id}>
                <Link
                  className="button as-link"
                  href={`${userId}/stories/${story.id}`}
                >
                  {story.title}
                </Link>
              </div>
            ))
          ) : (
            <p>Time to begin a story</p>
          )}
          <span style={{ margin: '0.75rem 0', display: 'inline-block' }}>
            <Button el="link" as="button" href={`${userId}/stories/create`}>
              Create New Story
            </Button>
          </span>
        </div>
        <div>
          <p>
            Curabitur at felis non libero suscipit fermentum. Duis volutpat,
            ante et scelerisque luctus, sem nulla placerat leo, at aliquet
            libero justo id nulla. Integer at dui nec magna posuere fringilla.
            Nunc euismod bibendum augue. Cras nec ligula velit. Donec in laoreet
            leo. Sed at risus vel nulla consequat fermentum. Donec et orci
            mauris. Nullam tempor velit id mi luctus, a scelerisque libero
            accumsan. In hac habitasse platea dictumst. Cras ac nunc nec massa
            tristique fringilla. Nam tempor finibus lorem, nec varius arcu
            convallis sed. Nunc id orci a neque vehicula malesuada. Donec
            vehicula libero vel leo convallis, nec tincidunt felis tincidunt.
            Maecenas euismod tristique leo, vel malesuada ligula malesuada sed.
            Donec eget libero id leo congue venenatis.
          </p>
          <p>
            Curabitur at felis non libero suscipit fermentum. Duis volutpat,
            ante et scelerisque luctus, sem nulla placerat leo, at aliquet
            libero justo id nulla. Integer at dui nec magna posuere fringilla.
            Nunc euismod bibendum augue. Cras nec ligula velit. Donec in laoreet
            leo. Sed at risus vel nulla consequat fermentum. Donec et orci
            mauris. Nullam tempor velit id mi luctus, a scelerisque libero
            accumsan. In hac habitasse platea dictumst. Cras ac nunc nec massa
            tristique fringilla. Nam tempor finibus lorem, nec varius arcu
            convallis sed. Nunc id orci a neque vehicula malesuada. Donec
            vehicula libero vel leo convallis, nec tincidunt felis tincidunt.
            Maecenas euismod tristique leo, vel malesuada ligula malesuada sed.
            Donec eget libero id leo congue venenatis.
          </p>
        </div>
      </div>
    </div>
  );
}
