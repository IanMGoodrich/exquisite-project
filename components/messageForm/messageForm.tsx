"use client";

import { useEffect, useState, useRef, type FC } from "react";
import Input from "../input/input";
import Button from "../button/button";
import { type UserType } from "../../lib/types";
import "./messageForm.css";

type MessageFormProps = {
  userId: string;
};

const MessageForm: FC<MessageFormProps> = ({ userId }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [selected, setSelected] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const detailRef = useRef(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageResp = await fetch(`/api/${userId}/chat/threads/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject.trim(),
        message: message.trim(),
        participantIds: selected.map((u) => u.id),
      }),
    });
    if (messageResp.ok) {
      setSubject("");
      setMessage("");
      setSelected([]);
      setSearchTerm("");
      setResults([]);
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const resp = await fetch(
          `/api/${userId}?q=${encodeURIComponent(searchTerm)}`,
          {
            signal: controller.signal,
          },
        );
        if (resp.ok) {
          const data: UserType[] = await resp.json();
          setResults(
            data
              .filter((u) => u.id !== userId)
              .filter((u) => !selected.some((s) => s.id === u.id)),
          );
        }
      } catch (error) {
        // ignore abort errors
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchTerm, selected, userId]);

  const addContributor = (user: UserType) => {
    setSelected([...selected, user]);
    setSearchTerm("");
    setResults([]);
  };

  const removeContributor = (userIdToRemove: string) => {
    setSelected(selected.filter((u) => u.id !== userIdToRemove));
  };

  const handleRefClose = () => {
    const refExists = detailRef.current;
    if (refExists) {
      const detail = refExists as HTMLDetailsElement;
      detail.removeAttribute("open");
    }
  };
  return (
    <section className="message-form--wrapper">
      <details className="message-form--detail" ref={detailRef}>
        <summary className="button as-button">Start new conversation</summary>
        <Button
          classes="message-form--close-button"
          variant="icon-only"
          as="button"
          el="button"
          svg="close"
          aria-label="close message form"
          onClick={handleRefClose}
        ></Button>
        <form className="message-form--form">
          <Input
            type="text"
            id="subject"
            placeholder="Subject"
            className="message-input"
            labelHidden
            value={subject}
            label="subject"
            onChange={(e) => setSubject(e.target.value)}
          />
          {selected.map((user) => (
            <span key={user.id}>
              <Button
                type="button"
                onClick={() => removeContributor(user.id)}
                aria-label={`Remove ${user.userName}`}
                as="button"
                el="button"
              >
                {user.userName}
              </Button>
            </span>
          ))}
          <Input
            label="Search Users"
            classes="user-search"
            id="contributors"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search usernames..."
          />
          {isSearching && searchTerm.length > 0 && <span>Searching…</span>}
          {results.length > 0 && (
            <ul>
              {results.map((user) => (
                <li key={user.id} onClick={() => addContributor(user)}>
                  {user.userName}
                </li>
              ))}
            </ul>
          )}
          <Input
            type="textarea"
            id="message"
            placeholder="Type your message..."
            className="message-input"
            labelHidden
            label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button el="button" as="button" onClick={handleSubmit}>
            Send
          </Button>
        </form>
      </details>
    </section>
  );
};

export default MessageForm;
