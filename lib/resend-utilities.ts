import { resend, YOUR_TURN_EMAIL, NEW_STORY_EMAIL } from "./resend";
import prisma from "@/lib/prisma";

export const sendYourTurnNotification = async (userID: string) => {
  const userEmail = await prisma.user.findUnique({
    where: { id: userID },
    select: {
      email: true,
    },
  });
  if (userEmail && userEmail.email !== undefined) {
    const { data, error } = await resend.emails.send({
      from: YOUR_TURN_EMAIL!,
      to: [userEmail.email],
      subject: "It's your turn",
      html: "<p>it works!</p>",
    });
    if (error) {
      console.error("Error sending turn notification email:", error);
      throw new Error("Failed to send turn notification email");
    }
  }
};

export const sendNewStoryNotification = async (
  userID: string,
  createdByUserName: string,
  storyTitle: string,
) => {
  const userEmail = await prisma.user.findUnique({
    where: { id: userID },
    select: {
      email: true,
    },
  });

  if (userEmail && userEmail.email !== undefined) {
    const { data, error } = await resend.emails.send({
      from: NEW_STORY_EMAIL!,
      to: userEmail.email,
      subject: "A new story needs you.",
      html: `<div>
                <p>Good news! ${createdByUserName} wants you to join <a href='https://exquisite-corpse.art/${userID}'>${storyTitle}</a></p>
              </div>`,
    });
    if (error) {
      console.error("Error sending turn notification email:", error);
      throw new Error("Failed to send turn notification email");
    }
  }
};