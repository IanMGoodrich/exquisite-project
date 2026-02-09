import { getAuthenticatedUserWithStories } from "../../../lib/auth-utils";
import ImageWrapper from "@/app/components/image/image";
import Button from "@/app/components/button/button";
import Link from "next/link";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserHomePage({ params }: Props) {
  const { userId } = await params;
  const user = await getAuthenticatedUserWithStories(userId);

  return (
    <div className="profile-homepage">
      <h1>Hello {user.userName}!</h1>
      <div>
        {user.image && (
          <ImageWrapper
            loading="lazy"
            width={250}
            height={250}
            variant="circle"
            src={user.image}
            alt={`image for ${user.userName}`}
            placeholder="blur"
            blurDataURL="../../../public/images/placeholder.webp"
          />
        )}
      </div>
      <div className="profile-homepage--main-content">
        <div className="profile-homepage--stories-wrapper">
          {user.stories.length ? (
            <>
            <div>
              <span className="label">Completed stories</span>
              <ul className="profile-homepage--stories-list completed">
                {user.stories.filter((story) => story.completed).map((story) => (
                  <li key={story.id}>
                    <Link
                      className="button as-link"
                      href={`${userId}/stories/${story.id}`}
                      >
                      {story.title}
                    </Link>
                  </li>
                ))
              }
              </ul>
            </div>
            <div>
            <span className="label">Stories in progress</span>
              <ul className="profile-homepage--stories-list in-progress">
              {user.stories.filter((story) => !story.completed).map((story) => (
                <li key={story.id}>
                  <Link
                    className="button as-link"
                    href={`${userId}/stories/${story.id}`}
                  >
                    {story.title}
                  </Link>
                </li>
              ))
            }
            </ul>
            </div>
            </>
          ) : (
            <p>Time to begin a story</p>
          )}
        </div>
        <div>
            <Button el="link" as="button" href={`${userId}/stories/create`}>
              Create New Story
            </Button>
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
