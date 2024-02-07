import { renderAsync } from "docx-preview";
import type { Editor } from "@tiptap/vue-3";
export async function handleImportWordChange2(editor: Editor) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.docx';
  input.click();
  input.onchange = (e) => {
    const files = [...(e.target?.files || [])];
    const file = files[0];
    const tempDOM = document.createElement('div');
    // eslint-disable-next-line no-void
    renderAsync(file, tempDOM, void 0, {
      breakPages: false
    }).then(() => {
      setTimeout(() => {
        editor.commands.setContent(tempDOM.querySelector('article')?.innerHTML || '');
      }, 1000);
    });
  };
}
