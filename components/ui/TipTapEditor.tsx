"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Undo, Redo, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autofocus?: boolean;
}

export function TipTapEditor({ value, onChange, placeholder = "Write something...", autofocus = false }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty cursor-text before:content-[attr(data-placeholder)] before:float-left before:text-foreground/40 before:pointer-events-none'
      })
    ],
    content: value,
    autofocus: autofocus ? 'end' : false,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] max-h-[300px] overflow-y-auto w-full rounded-2xl bg-[#18221d]/5 border border-outline/10 p-4 focus:outline-none focus:border-kinetic/50 transition-colors prose prose-invert prose-p:my-1 prose-sm',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes securely ensuring we don't trigger cyclical loops
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Small pause mapping to avoid bouncing hook callbacks
      const currentHTML = editor.getHTML()
      if (currentHTML !== value) {
         editor.commands.setContent(value)
      }
    }
  }, [value, editor])

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#18221d]/5 border border-outline/10 rounded-xl w-max">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#18221d]/20 text-foreground' : 'text-foreground/60 hover:bg-[#18221d]/10'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-[#18221d]/20 text-foreground' : 'text-foreground/60 hover:bg-[#18221d]/10'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-outline/50 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#18221d]/20 text-foreground' : 'text-foreground/60 hover:bg-[#18221d]/10'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-[#18221d]/20 text-foreground' : 'text-foreground/60 hover:bg-[#18221d]/10'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-[#18221d]/20 text-foreground' : 'text-foreground/60 hover:bg-[#18221d]/10'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-outline/50 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg transition-colors text-foreground/60 hover:bg-[#18221d]/10 disabled:opacity-30"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg transition-colors text-foreground/60 hover:bg-[#18221d]/10 disabled:opacity-30"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}



