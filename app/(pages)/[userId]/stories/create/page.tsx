"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { type UserType } from "@/lib/types";

import Input from "@/app/components/input/input";
import Button from "@/app/components/button/button";

export default function CreateStoryPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const [title, setTitle] = useState("");
  const [rounds, setRounds] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [selected, setSelected] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
          }
        );
        if (resp.ok) {
          const data: UserType[] = await resp.json();
          setResults(
            data
              .filter((u) => u.id !== userId)
              .filter((u) => !selected.some((s) => s.id === u.id))
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const resp = await fetch(`/api/${userId}/stories/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          contributorIds: selected.map((u) => u.id),
          rounds: rounds,
        }),
      });
      if (resp.ok) {
        const { id } = await resp.json();
        // redirect to story update after creation
        router.push(`/${userId}/stories/${id}/update`);
      }
    } catch (err) {
      console.error("Failed to create story:", err);
    }
  };

  return (
    <main className="page form story">
      <h1>Create a New Story</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="contributors">Added Contributors</label>

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
          label="Number of rounds"
          id="rounds"
          type="number"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          required
        />
        <Button
          classes="story-create-submit"
          el="button"
          type="submit"
          disabled={!title.trim() && !selected.length && rounds < 1}
        >
          Create Story
        </Button>
      </form>
    </main>
  );
}
