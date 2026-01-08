

import { getUser, getStorySegments } from '@/lib/utilities';
import SegmentForm from '@/app/components/segmentForm/segmentForm';

type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function UpdateStoryPage({params} : Props) {
  const { userId, storyId } = await params;

  const user = await getUser(userId); 
  const segments = await getStorySegments(storyId);
  const lastReveal = segments.length > 0 ? segments[segments.length - 1].reveal : null;

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
     <h1>Your turn ${user?.userName}</h1>
      {lastReveal && lastReveal.length > 0 && (
        <div className="last-reveal--wrapper">
          <p>{lastReveal}...</p>
        </div>
      )}
      <SegmentForm userId={userId} storyId={storyId} />
    </main>
  );
}
