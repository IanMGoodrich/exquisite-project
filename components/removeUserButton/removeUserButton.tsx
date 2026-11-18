"use client";
import { useState, type FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/button/button";
import "./removeUserButton.css";

type UserRemovalVariantTypes = "leave" | "remove";
type StoryListVariant = "completed" | "in-progress" | "public";

type RemoveUserButtonProps = {
  userId: string;
  storyId: string;
  userToRemoveId: string;
  variant: UserRemovalVariantTypes;
  listVariant: StoryListVariant;
};

const RemoveUserButton: FC<RemoveUserButtonProps> = ({
  userId,
  storyId,
  userToRemoveId,
  variant,
  listVariant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const queryClient = useQueryClient();

  const removeUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/${userId}/stories/${storyId}/removeUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyId,
            userToRemoveId,
            variant,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update story (${response.status})`);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [listVariant, userId],
        exact: true,
      });
      setIsOpen(false);
      setDialogueOpen(false);
    },
  });

  const loading = removeUserMutation.isPending;

  const message =
    variant === "leave"
      ? "If you click 'Leave' you will remove yourself from the rest of the story."
      : "If you click 'Remove' you will no longer be associated with this story. The story will be permanently removed from your Completed Stories list, and any segments you have written will be attributed to UNKNOWN";

  const handleDialogueOpen = () => setDialogueOpen(!dialogueOpen);

  return (
    <section className="remove-user-button">
      <dialog
        className="remove-user-button--remove-dialogue"
        id="remove-dialogue"
        open={dialogueOpen}
      >
        <div className="remove-user-button--remove-dialogue-content">
          <Button
            classes="remove-user-button--toggle-modal-open"
            variant="icon-only"
            svg="close"
            as="button"
            el="button"
            onClick={handleDialogueOpen}
          />
          <h3>Are you sure?</h3>
          <p>{message}</p>
          <Button
            classes="remove-user-button--remove"
            disabled={loading}
            hidden={!isOpen}
            as="button"
            el="button"
            onClick={() => removeUserMutation.mutate()}
          >
            {removeUserMutation.isError
              ? removeUserMutation.error.message
              : loading
                ? "..."
                : variant}
          </Button>
        </div>
      </dialog>

      <div
        className={`remove-user-button--wrapper toggle ${!isOpen ? "active" : ""} `}
      >
        <Button
          classes={"remove-user-button--toggle-open"}
          aria-label={`open ${variant} menu`}
          aria-hidden={isOpen}
          as="button"
          el="button"
          variant="icon-only"
          svg="close"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={`remove-user-button--wrapper main ${isOpen ? "active" : ""}`}
      >
        <Button
          disabled={loading}
          hidden={!isOpen}
          as="button"
          el="button"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          hidden={!isOpen}
          as="button"
          el="button"
          onClick={handleDialogueOpen}
        >
          {variant}
        </Button>
      </div>
    </section>
  );
};

export default RemoveUserButton;
