import { Underline as TiptapUnderline } from 'tiptap-extensions';
import { MenuData } from 'tiptap';
import { MenuBtnView } from '@/types';
import { t } from '@/i18n/index';
import CommandButton from '@/components/MenuCommands/CommandButton.vue';

export default class Underline extends TiptapUnderline implements MenuBtnView {
  menuBtnView ({ isActive, commands }: MenuData) {
    return {
      component: CommandButton,
      componentProps: {
        command: commands.underline,
        isActive: isActive.underline(),
        icon: 'underline',
        tooltip: t('editor.extensions.Underline.tooltip'),
      },
    };
  }
}
