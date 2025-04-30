import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import ImageResize from "tiptap-extension-resize-image";
import { useEffect } from "react";
import "@/components/tiptap-templates/simple/simple-editor.scss";
import { FontFamily } from "@/components/tiptap-extension/font-family";

interface SimpleViewerProps {
  html: string;
}

export function SimpleViewer({ html }: SimpleViewerProps) {
  const editor = useEditor({
    editable: false,
    content: html,
    extensions: [
      StarterKit,
      Image,
      ImageResize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontFamily,
    ],
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== html) {
      editor.commands.setContent(html);
    }
  }, [html]);

  return <EditorContent editor={editor} />;
}
