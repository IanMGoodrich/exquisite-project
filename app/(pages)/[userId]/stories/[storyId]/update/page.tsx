
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getStorySegments,  checkForLastSegment, getStoryPromptInfo} from '@/lib/utilities';
import SegmentForm from '@/components/segmentForm/segmentForm';
import Image from '@/components/image/image';
type Props = {
  params: Promise<{ userId: string; storyId: string }>;
};

export default async function UpdateStoryPage({params} : Props) {
  const { userId, storyId } = await params;

  const user = await getAuthenticatedUser(userId); 
  const segments = await getStorySegments(storyId);
  const promptInfo = await getStoryPromptInfo(storyId);
  const lastReveal = segments.length > 0 ? segments[segments.length - 1].reveal : null;
  const isLast = await checkForLastSegment(storyId);
  const sharePrompt = () => promptInfo && promptInfo.sharePrompt !== 'FALSE' && promptInfo.sharePrompt !== 'AT_COMPLETION';
  
  return (
    <main className="story-update-page">
     <h1>It&apos;s your turn {user?.userName}</h1>
      {lastReveal && lastReveal.length > 0 && (
        <div className="last-reveal--wrapper">
          <span>Here&apos;s what you&apos;ve got to work with:</span>
          <p>{lastReveal}...</p>
        </div>
      )}
      {sharePrompt() && promptInfo?.promptImageUrl &&(
        <div className='image-prompt--wrapper'>
          <Image className='image-prompt--image' src={promptInfo.promptImageUrl} alt='random prompt image' />
        </div>
      )}
      {sharePrompt() && promptInfo?.promptText &&(
        <div className='text-prompt--wrapper'>
          <p>{promptInfo.promptText}</p>
        </div>
      )}
      <SegmentForm promptText={lastReveal ? lastReveal : undefined} userId={userId} storyId={storyId} isLast={isLast}/>
    </main>
  );
}
