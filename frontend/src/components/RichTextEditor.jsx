import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';

const ToolbarBtn = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-slate-400 hover:text-white hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px bg-white/10 mx-1 self-stretch" />;

const RichTextEditor = ({ value, onChange, placeholder = 'Scrivi il contenuto...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-400 underline' } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = prompt('Inserisci URL del link:');
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-white/10 bg-white/[0.03]">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Grassetto">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Corsivo">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Sottolineato">
          <u>U</u>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Titolo H2">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Titolo H3">H3</ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista puntata">• Lista</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista numerata">1. Lista</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citazione">" Cita</ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={addLink} isActive={editor.isActive('link')} title="Inserisci link">Link</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} isActive={false} title="Rimuovi link">No Link</ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} isActive={false} title="Cancella formattazione">Clear</ToolbarBtn>
      </div>

      {/* Editor area */}
      <div className="tiptap-editor p-4 min-h-[220px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
