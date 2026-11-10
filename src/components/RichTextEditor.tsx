import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Divider, Input, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import type { TipTapContent } from "@/api/types";
import { emptyTipTapDoc } from "@/lib/tiptapContent";

interface RichTextEditorProps {
  value: TipTapContent;
  onChange: (doc: TipTapContent) => void;
  disabled?: boolean;
  placeholder?: string;
}

function ToolbarButton({
  active,
  disabled,
  title,
  onClick,
  icon,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}) {
  return (
    <Tooltip title={title}>
      <Button
        type={active ? "primary" : "text"}
        size="small"
        disabled={disabled}
        onClick={onClick}
        className="!min-w-8"
        icon={icon}
      >
        {label}
      </Button>
    </Tooltip>
  );
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder = "Начните писать текст новости…",
}: RichTextEditorProps) {
  const [linkModal, setLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Image.configure({ allowBase64: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value?.type === "doc" ? value : emptyTipTapDoc(),
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON() as TipTapContent);
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose prose-slate max-w-none min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = value?.type === "doc" ? value : emptyTipTapDoc();
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="editor-shell min-h-[320px] animate-pulse bg-slate-50" />
    );
  }

  const openLinkModal = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(previous ?? "https://");
    setLinkModal(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setLinkModal(false);
  };

  const applyImage = () => {
    const url = imageUrl.trim();
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setImageModal(false);
    setImageUrl("");
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        <ToolbarButton
          title="Жирный"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<BoldOutlined />}
        />
        <ToolbarButton
          title="Курсив"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<ItalicOutlined />}
        />
        <ToolbarButton
          title="Подчёркивание"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<UnderlineOutlined />}
        />
        <ToolbarButton
          title="Зачёркнутый"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<StrikethroughOutlined />}
        />

        <Divider type="vertical" className="!h-6" />

        <ToolbarButton
          title="Заголовок 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label="H2"
        />
        <ToolbarButton
          title="Заголовок 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          label="H3"
        />

        <Divider type="vertical" className="!h-6" />

        <ToolbarButton
          title="Маркированный список"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<UnorderedListOutlined />}
        />
        <ToolbarButton
          title="Нумерованный список"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<OrderedListOutlined />}
        />

        <Divider type="vertical" className="!h-6" />

        <ToolbarButton
          title="По левому краю"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<AlignLeftOutlined />}
        />
        <ToolbarButton
          title="По центру"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<AlignCenterOutlined />}
        />
        <ToolbarButton
          title="По правому краю"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<AlignRightOutlined />}
        />
        <ToolbarButton
          title="По ширине"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          label="≡"
        />

        <Divider type="vertical" className="!h-6" />

        <ToolbarButton
          title="Ссылка"
          active={editor.isActive("link")}
          onClick={openLinkModal}
          icon={<LinkOutlined />}
        />
        <ToolbarButton
          title="Изображение по URL"
          onClick={() => {
            setImageUrl("");
            setImageModal(true);
          }}
          icon={<PictureOutlined />}
        />
      </div>

      <EditorContent editor={editor} />

      <Modal
        title="Вставить ссылку"
        open={linkModal}
        onCancel={() => setLinkModal(false)}
        onOk={applyLink}
        okText="Применить"
        cancelText="Отмена"
        destroyOnHidden
      >
        <Input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://"
        />
      </Modal>

      <Modal
        title="Вставить изображение"
        open={imageModal}
        onCancel={() => setImageModal(false)}
        onOk={applyImage}
        okText="Вставить"
        cancelText="Отмена"
        destroyOnHidden
      >
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL изображения"
        />
      </Modal>
    </div>
  );
}
