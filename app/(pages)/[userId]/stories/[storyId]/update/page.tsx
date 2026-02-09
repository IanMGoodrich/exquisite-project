
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getStorySegments } from '@/lib/utilities';
import SegmentForm from '@/app/components/segmentForm/segmentForm';

type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function UpdateStoryPage({params} : Props) {
  const { userId, storyId } = await params;

  const user = await getAuthenticatedUser(userId); 
  const segments = await getStorySegments(storyId);
  const lastReveal = segments.length > 0 ? segments[segments.length - 1].reveal : null;

  return (
    <main className="story-update-page">
     <h1>It&apos;s your turn {user?.userName}</h1>
      {lastReveal && lastReveal.length > 0 && (
        <div className="last-reveal--wrapper">
          <span>Here&apos;s what you&apos;ve got to work with:</span>
          <p>{lastReveal}...</p>
        </div>
      )}
      <SegmentForm promptText={lastReveal ? lastReveal : undefined} userId={userId} storyId={storyId} />
    </main>
  );
}
