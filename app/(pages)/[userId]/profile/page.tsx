import { getAuthenticatedUser } from "../../../../lib/auth-utils";
import ProfileForm from "../../../components/profileform/profileform";
import ImageWrapper from "@/app/components/image/image";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfileUpdatePage({ params }: Props) {
  const { userId } = await params;
  const user = await getAuthenticatedUser(userId);

  return (
    <div className="profile-update-page">
      <h1>{user.userName ?? `${user.nameFirst} ${user.nameLast}`}</h1>
      <div className="profile-update-page--main-content">
        <div className="profile-image--wrapper">
          {user.image && (
            <ImageWrapper
              variant="circle"
              width={250}
              height={250}
              src={user.image}
              alt={`image for ${user.userName}`}
            />
          )}
        </div>
        <div className="profile-form--wrapper">
          <ProfileForm variant="update" user={user} />
        </div>
      </div>
    </div>
  );
}
