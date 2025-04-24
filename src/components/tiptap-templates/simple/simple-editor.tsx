import * as React from "react";
import { EditorContent, useEditor, EditorContext } from "@tiptap/react";

// Tiptap Extensions
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ImageResize from "tiptap-extension-resize-image";

import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

import {
  Toolbar,
  ToolbarGroup,
} from "@/components/tiptap-ui-primitive/toolbar";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { HighlightPopover } from "@/components/tiptap-ui/highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";

import "@/components/tiptap-templates/simple/simple-editor.scss";

// Nova função de upload adaptada para Cloudinary
export const uploadImage = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dtqj09md");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpegpgjpr/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
  } catch (error) {
    console.error("Falha no upload", error);
  }
};

interface SimpleEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

export function SimpleEditor({ content, onUpdate }: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      ImageResize,
      Typography,
      Superscript,
      Subscript,
      Selection,
      TrailingNode,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 1024 * 1024 * 5,
        limit: 3,
        upload: uploadImage,
        onError: (err) => console.error("Erro ao subir imagem", err),
      }),
    ],
    content,
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Editor de texto",
        class: "outline-none min-h-[200px] p-3 text-base",
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="rounded-md border border-gray-300 bg-white ">
        <Toolbar className="flex flex-wrap gap-2 rounded-t-md border-b border-gray-200 bg-gray-50 px-2 py-1">
          <ToolbarGroup>
            <UndoRedoButton action="undo" />
            <UndoRedoButton action="redo" />
            <HeadingDropdownMenu levels={[1, 2, 3]} />
            <ListDropdownMenu types={["bulletList", "orderedList"]} />
            <TextAlignButton align="left" />
            <TextAlignButton align="center" />
            <TextAlignButton align="right" />
            <ImageUploadButton text="Imagem" />
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="underline" />
            <MarkButton type="strike" />
            <MarkButton type="superscript" />
            <MarkButton type="subscript" />
            <HighlightPopover />
            <LinkPopover />
            <input
              type="color"
              title="Cor do texto"
              onChange={(e) =>
                editor?.chain().focus().setColor(e.target.value).run()
              }
              className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
            />
          </ToolbarGroup>
        </Toolbar>

        <EditorContent editor={editor} />
      </div>
    </EditorContext.Provider>
  );
}
