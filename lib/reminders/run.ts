import type { PrismaClient } from "../../app/generated/prisma/client";
import type { Resend } from "resend";
import { dueStage, DAY_MS, MAX_STAGE, REMINDER_DAYS } from "./schedule";
import { buildReminderEmail } from "./email";

type RunOptions = {
  prisma: PrismaClient;
  resend: Resend;
  from: string;
  appUrl: string;
  dryRun: boolean;
  now?: Date;
};

export async function runReminders({
  prisma, resend, from, appUrl, dryRun, now = new Date(),
}: RunOptions) {
  const summary = { checked: 0, sent: 0, skipped: 0, failed: 0, dryRun };

  // Nobody is due anything until the first threshold has passed.
  const earliestDue = new Date(now.getTime() - REMINDER_DAYS[0] * DAY_MS);

  const stories = await prisma.story.findMany({
    where: {
      completed: false,
      remindersSent: { lt: MAX_STAGE },
      turnStartedAt: { lte: earliestDue },
    },
    select: {
      id: true,
      title: true,
      promptText: true,
      turnStartedAt: true,
      remindersSent: true,
      nextContributorId: true,
      content: {                       // Story -> Segment[]; newest only
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { reveal: true },
      },
      _count: { select: { content: true } },
    },
  });
  summary.checked = stories.length;

  // nextContributorId isn't a relation, so load the users in one query.
  const userIds = [...new Set(stories.map((s) => s.nextContributorId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, emailReminders: true },
  });
  const usersById = new Map(users.map((u) => [u.id, u]));

  for (const story of stories) {
    const stage = dueStage(story.turnStartedAt, now, story.remindersSent);
    const user = usersById.get(story.nextContributorId);

    if (stage === null || !user || !user.emailReminders) {
      summary.skipped++;
      continue;
    }

    const email = buildReminderEmail({
      userName: user.name,
      storyTitle: story.title,
      storyUrl: `${appUrl}/${user.id}/stories/${story.id}`, 
      profileUrl: `${appUrl}/${user.id}/profile`,          
      stage,
      isFirstTurn: story._count.content === 0,
      reveal: story.content[0]?.reveal ?? null,
    });

    // 1. DRY RUN: log only. Don't claim, or the real run would skip these.
    if (dryRun) {
      console.log(`[reminders][dry run] stage ${stage} -> ${user.email} | ${email.subject}`);
      summary.sent++;
      continue;
    }

    // 2. CLAIM: advance remindersSent only if this is still the fetched turn.
    const claim = await prisma.story.updateMany({
      where: {
        id: story.id,
        completed: false,
        turnStartedAt: story.turnStartedAt,
        nextContributorId: story.nextContributorId,
        remindersSent: story.remindersSent,
      },
      data: { remindersSent: stage },
    });
    if (claim.count === 0) {
      summary.skipped++;
      continue;
    }

    // 3. SEND with an idempotency key, so a retried request can't duplicate.
    try {
      const { error } = await resend.emails.send(
        { from, to: user.email, subject: email.subject, html: email.html, text: email.text },
        { idempotencyKey: `turn-reminder/${story.id}/${story.turnStartedAt.getTime()}/${stage}` },
      );
      if (error) throw new Error(`${error.name}: ${error.message}`);
      console.log(`[reminders] sent stage ${stage} -> ${user.email} (story ${story.id})`);
      summary.sent++;
    } catch (err) {
      console.error(`[reminders] FAILED story ${story.id}:`, err);
      summary.failed++;
      // 4. RELEASE the claim so the next hourly run retries.
      await prisma.story.updateMany({
        where: {
          id: story.id,
          completed: false,
          turnStartedAt: story.turnStartedAt,
          nextContributorId: story.nextContributorId,
          remindersSent: stage,
        },
        data: { remindersSent: story.remindersSent },
      });
    }
  }

  return summary;
}