import { renderAsync } from 'docx-preview';
import type { Editor } from '@tiptap/vue-3';
import { message } from 'ant-design-vue';
import { Trans } from '@/i18n';
import { useModel } from '@/hooks';

let locale: any = {};
let i18nHandler: Function;
let t: (path?: string) => string = () => '';
useModel.on('locale', (value) => {
  locale = value;
  i18nHandler = Trans.buildI18nHandler(locale);
  t = (...args: any[]): string => {
    return i18nHandler.apply(Trans, args);
  };
});

export function handleImportWordChange2(editor: Editor) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.docx';
  input.click();
  input.onchange = async(e) => {
    // @ts-ignore
    const files = [...(e.target?.files || [])];
    const file = files[0];
    const tempDOM = document.createElement('div');
    let loading = () => {
    };
    try {
      // 等待word解析成dom
      // eslint-disable-next-line no-void
      await renderAsync(file, tempDOM, void 0, {
        breakPages: false,
      });
      const imgs = tempDOM.querySelectorAll('img');
      if (imgs.length > 0) {
        const uploadRequest = editor.extensionManager.extensions.find(ext => ext.name === 'image')?.options?.uploadRequest;
        if (uploadRequest) {
          for (const img of imgs) {
            const src = img.getAttribute('src');
            if (src) {
              const newSrc = await uploadRequest(src);
              img.setAttribute('src', newSrc);
            }
          }
        }
      }

      loading = message.loading(t('editor.extensions.ImportWord.loading'), 0);
      editor.commands.setContent(tempDOM.querySelector('article')?.innerHTML || '');
      // 插入空行用于视图更新
      editor.commands.insertContent('<p></p>');
      message.success(t('editor.extensions.ImportWord.success'));
    } catch (error) {
      message.error(t('editor.extensions.ImportWord.fail'));
    } finally {
      loading();
    }
  };
}
