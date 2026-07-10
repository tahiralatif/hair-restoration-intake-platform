'use client';

import React, { useState } from 'react';
import { Note } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (content: string) => void;
  title: string;
}

export function NotesSection({ notes, onAddNote, title }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{title}</h3>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              rows={4}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-800">{note.content}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{note.authorName}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && !isAdding && (
        <p className="text-sm text-gray-500 text-center py-8">No notes yet</p>
      )}
    </div>
  );
}
