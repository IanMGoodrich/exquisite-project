import { getUserPublicInfo } from "../../../../../lib/auth-utils";
import ImageWrapper from "@/components/image/image";
// import Dropdown from "@/components/dropdown/dropdown";
import StoryList from "@/components/storyList/storyList";

type Props = {
  params: Promise<{ userId: string, privateId: string }>;
};

export default async function UserPublicPage({ params }: Props) {
  const { privateId } = await params;
  const user = await getUserPublicInfo(privateId);
  
  return (
    <div className="profile-homepage">
      <h1 className="profile-homepage--heading">Hello {user.userName}!</h1>
      <div className="profile-homepage--upper-content">
        {user.image && (
          <div className="profile-homepage--hero">
            <div className="profile-homepage--image-wrapper">
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
            </div>
            {user.profileColumnOne && (
              <div
                className="profile-homepage--profile-text upper"
                dangerouslySetInnerHTML={{ __html: user.profileColumnOne }}
              />
            )}
          </div>
        )}
      </div>
      <div className="profile-homepage--main-content">
        <div className="profile-homepage--stories-wrapper">
          <div className="profile-homepage--stories-list-wrapper">
            <span className="label">Shared stories</span>
            <StoryList
              userID={privateId}
              variant="public"
              initialUserStoryData={user.stories}
            ></StoryList>
          </div>
        </div>
      </div>
      {user.profileColumnTwo && (
        <div
          className="profile-homepage--lower-content"
          dangerouslySetInnerHTML={{ __html: user.profileColumnTwo }}
        />
      )}
    </div>
  );
}
