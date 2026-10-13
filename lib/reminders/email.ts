import { REMINDER_DAYS } from "./schedule";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Trim plain text to a teaser, keeping the author's line breaks. */
function toTeaser(text: string, maxLength = 3000): string {
  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trimEnd() + "…" : cleaned;
}

/** Escape FIRST, then convert newlines, or the <br> tags get escaped too. */
function textToEmailHtml(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

export type ReminderEmailInput = {
  userName: string;
  storyTitle: string;
  storyUrl: string;
  profileUrl: string;
  stage: number;          // 1, 2, or 3
  isFirstTurn: boolean;   // no segments yet, so it's the creator's turn
  reveal: string | null;
};

export function buildReminderEmail(input: ReminderEmailInput) {
  const days = REMINDER_DAYS[input.stage - 1];
  const dayWord = days === 1 ? "day" : "days";
  const title = input.storyTitle;

  const subject =
    input.stage === 3
      ? `Last reminder: "${title}" is waiting on you`
      : input.isFirstTurn
        ? `Your story "${title}" is waiting to begin`
        : `It's your turn in "${title}"`;

  const intro = input.isFirstTurn
    ? `Your story <strong>${escapeHtml(title)}</strong> was created ${days} ${dayWord} ago, and the first segment is yours to write.`
    : `It's been ${days} ${dayWord} since <strong>${escapeHtml(title)}</strong> was passed to you.`;

  const teaserSource = input.isFirstTurn ? false : input.reveal;
  const teaser = teaserSource ? toTeaser(teaserSource) : false;
  const teaserLabel = input.isFirstTurn ? false : "Here's what they left you";
  const closing = input.stage === 3 ? "This is the last reminder we'll send for this turn." : "";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; line-height: 1.5;">
      <p>Hi ${escapeHtml(input.userName)},</p>
      <p>${intro}</p>
      ${teaser ? `
        <p style="margin-bottom: 4px;"><em>${teaserLabel}:</em></p>
        <blockquote style="margin: 0 0 16px; padding-left: 12px; border-left: 3px solid #ccc;">
          ${textToEmailHtml(teaser)}
        </blockquote>` : ""}
      <p>
        <a href="${input.storyUrl}"
           style="display: inline-block; padding: 10px 18px; background: #222; color: #fff; text-decoration: none; border-radius: 4px;">
          Write your segment
        </a>
      </p>
      ${closing ? `<p>${closing}</p>` : ""}
      <p style="font-size: 12px; color: #888; margin-top: 32px;">
        You can turn off turn reminders on your <a href="${input.profileUrl}" style="color: #888;">profile page</a>.
      </p>
    </div>`;

  const text = [
    `Hi ${input.userName},`,
    "",
    input.isFirstTurn
      ? `Your story "${title}" is waiting for its first segment.`
      : `It's your turn in "${title}".`,
    teaser ? `\n${teaserLabel}:\n${teaser}\n` : "",
    `Write your segment: ${input.storyUrl}`,
    closing,
    "",
    `Turn off reminders on your profile page: ${input.profileUrl}`,
  ].join("\n");

  return { subject, html, text };
}