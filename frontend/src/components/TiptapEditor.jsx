import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Heading2Icon,
  Heading3Icon,
  QuoteIcon,
  UndoIcon,
  RedoIcon
} from 'lucide-react'

function TiptapEditor({ content, onChange, placeholder = "Start typing..." }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 bg-base-200 rounded-lg',
      },
    },
    immediatelyRender: false,
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-base-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-base-300/50 border-b border-base-300 items-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBold().run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('bold') ? 'btn-active' : ''}`}
          title="Bold"
        >
          <BoldIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('italic') ? 'btn-active' : ''}`}
          title="Italic"
        >
          <ItalicIcon className="size-4" />
        </button>

        <div className="divider divider-horizontal mx-0"></div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}`}
          title="Heading 2"
        >
          <Heading2Icon className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('heading', { level: 3 }) ? 'btn-active' : ''}`}
          title="Heading 3"
        >
          <Heading3Icon className="size-4" />
        </button>

        <div className="divider divider-horizontal mx-0"></div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBulletList().run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
          title="Bullet List"
        >
          <ListIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
          title="Ordered List"
        >
          <ListOrderedIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBlockquote().run()
          }}
          className={`btn btn-xs btn-ghost ${editor.isActive('blockquote') ? 'btn-active' : ''}`}
          title="Quote"
        >
          <QuoteIcon className="size-4" />
        </button>

        <div className="divider divider-horizontal mx-0"></div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().undo().run()
          }}
          disabled={!editor.can().undo()}
          className="btn btn-xs btn-ghost"
          title="Undo"
        >
          <UndoIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            editor.chain().focus().redo().run()
          }}
          disabled={!editor.can().redo()}
          className="btn btn-xs btn-ghost"
          title="Redo"
        >
          <RedoIcon className="size-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
