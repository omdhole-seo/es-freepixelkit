"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useEffect } from "react";

const editorExtensions = [
  StarterKit.configure({ link: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: { class: "editor-link" },
  }),
  Image.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: { class: "editor-image" },
  }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
];

function getEditorButtonClass(active?: boolean) {
  return [
    "editor-toolbar__button",
    active ? "editor-toolbar__button--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function BlogEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (nextValue: string) => void;
  label: string;
}) {
  const editor = useEditor({
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": "blog-content-label",
      },
    },
    content: value || "<p></p>",
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const insertImage = () => {
    const url = window.prompt("Image URL:", "https://");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  return (
    <div className="editor-shell">
      <span className="field-label" id="blog-content-label">{label}</span>
      <div className="editor-toolbar" aria-label="Editor toolbar">
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading H2"
        >
          <Heading2 size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading H3"
        >
          <Heading3 size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <Strikethrough size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bulleted list"
        >
          <List size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={getEditorButtonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Blockquote"
        >
          <Quote size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={getEditorButtonClass(editor.isActive("link"))}
          aria-label="Link"
        >
          <LinkIcon size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={insertImage} aria-label="Insert image">
          <ImageIcon size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} aria-label="Align left">
          <AlignLeft size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} aria-label="Align center">
          <AlignCenter size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} aria-label="Align right">
          <AlignRight size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">
          <Undo size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">
          <Redo size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="editor-surface">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
