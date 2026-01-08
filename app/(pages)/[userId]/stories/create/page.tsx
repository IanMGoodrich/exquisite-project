'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { type User } from '@/lib/types';


export default function CreateStoryPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  const [title, setTitle] = useState('');
  const [rounds, setRounds] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
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
        const resp = await fetch(`/api/${userId}?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal,
        });
        if (resp.ok) {
          const data: User[] = await resp.json();
          setResults(data.filter((u) => u.id !== userId).filter((u) => !selected.some((s) => s.id === u.id)));
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

  const addContributor = (user: User) => {
    setSelected([...selected, user]);
    setSearchTerm('');
    setResults([]);
  };

  const removeContributor = (userIdToRemove: string) => {
    setSelected(selected.filter((u) => u.id !== userIdToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const resp = await fetch(`/api/${userId}/stories/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          contributorIds: selected.map((u) => u.id),
          rounds: rounds,
        }),
      });
      if (resp.ok) {
        const {id} = await resp.json()
        // redirect to story update after creation
        router.push(`/${userId}/stories/${id}/update`);
      }
    } catch (err) {
      console.error('Failed to create story:', err);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create a New Story</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="contributors" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Contributors
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {selected.map((user) => (
              <span
                key={user.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#e2e8f0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 12,
                }}
              >
                {user.userName}
                <button
                  type="button"
                  onClick={() => removeContributor(user.id)}
                  style={{ marginLeft: 4, border: 'none', background: 'transparent', cursor: 'pointer' }}
                  aria-label={`Remove ${user.userName}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            id="contributors"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search usernames..."
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
          {isSearching && searchTerm.length > 0 && (
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Searching…</div>
          )}
          {results.length > 0 && (
            <ul
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                maxHeight: 200,
                overflowY: 'auto',
                marginTop: '0.25rem',
                paddingLeft: 0,
                listStyle: 'none',
              }}
            >
              {results.map((user) => (
                <li
                  key={user.id}
                  onClick={() => addContributor(user)}
                  style={{
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {user.userName}
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="rounds" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Number of rounds
          </label>
          <input
            id="rounds"
            type="number"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#1d4ed8',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Create Story
        </button>
      </form>
    </main>
  );
}
