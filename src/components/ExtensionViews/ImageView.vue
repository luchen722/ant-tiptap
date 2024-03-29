<template>
  <node-view-wrapper as="span" :class="imageViewClass" >
    <span :style="display === 'block' ? 'display: block;width: max-content;' + Align[align]:''">
      <div
        :class="{
          'image-view__body--focused': selected,
          'image-view__body--resizing': resizing,
        }"
        class="image-view__body"
      >
        <img
          :src="src"
          :title="node!.attrs.title"
          :alt="node!.attrs.alt"
          :width="width"
          :height="height"
          @click="selectImage"
          class="image-view__body__image"
        />

        <div
          v-if="editor?.isEditable && (selected || resizing)"
          v-show="selected || resizing"
          class="image-resizer"
        >
          <span
            v-for="direction in resizeDirections"
            :key="direction"
            :class="`image-resizer__handler--${direction}`"
            class="image-resizer__handler"
            @mousedown="onMouseDown($event, direction)"
          />
        </div>

        <!-- when image is break text or float
        bubble menu's position is miscalculated
        use el-popover instead bubble menu -->
        <a-popover
          :open="selected"
          placement="top"
          overlayClassName="el-tiptap-image-popper"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
        >
          <template #content>
            <image-bubble-menu
              :node="node"
              :editor="editor"
              :update-attrs="updateAttributes"
            />
          </template>
          <div class="image-view__body__placeholder" />
        </a-popover>
        <div class="image-view__body__description" v-if="description">{{ description }}</div>
      </div>
    </span>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { Popover } from 'ant-design-vue';
import { ResizeObserver } from '@juggle/resize-observer';
import { resolveImg, ImageDisplay, ImageAlign, Align } from '@/utils/image';
import { clamp } from '@/utils/shared';
import ImageBubbleMenu from '../MenuBubble/ImageBubbleMenu.vue';

const enum ResizeDirection {
  TOP_LEFT = 'tl',
  TOP_RIGHT = 'tr',
  BOTTOM_LEFT = 'bl',
  BOTTOM_RIGHT = 'br',
}

const MIN_SIZE = 20;
const MAX_SIZE = 100000;

export default defineComponent({
  name: 'ImageView',

  components: {
    APopover: Popover,
    NodeViewWrapper,
    ImageBubbleMenu,
  },

  props: nodeViewProps,

  data() {
    return {
      maxSize: {
        width: MAX_SIZE,
        height: MAX_SIZE,
      },

      originalSize: {
        width: 0,
        height: 0,
      },
      Align,
      resizeDirections: [
        ResizeDirection.TOP_LEFT,
        ResizeDirection.TOP_RIGHT,
        ResizeDirection.BOTTOM_LEFT,
        ResizeDirection.BOTTOM_RIGHT,
      ],

      resizing: false,

      resizerState: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: '',
      },
    };
  },

  computed: {
    src(): string {
      return this.node!.attrs.src;
    },

    width(): number {
      return this.node!.attrs.width;
    },

    height(): number {
      return this.node!.attrs.height;
    },

    description(): string {
      return this.node!.attrs.description;
    },
    align(): ImageAlign {
      return this.node!.attrs.align;
    },
    display(): ImageDisplay {
      return this.node!.attrs.display;
    },

    imageViewClass() {
      return ['image-view', `image-view--${this.display}`];
    },
  },

  async created() {
    const result = await resolveImg(this.src);

    if (!result.complete) {
      result.width = MIN_SIZE;
      result.height = MIN_SIZE;
    }

    this.originalSize = {
      width: result.width,
      height: result.height,
    };
  },

  mounted() {
    this.resizeOb = new ResizeObserver(() => {
      this.getMaxSize();
    });
    this.resizeOb.observe(this.editor!.view.dom);
  },

  beforeUnmount() {
    this.resizeOb.disconnect();
  },

  methods: {
    // https://github.com/scrumpy/tiptap/issues/361#issuecomment-540299541
    selectImage() {
      // eslint-disable-next-line no-unused-expressions
      this.editor?.commands.setNodeSelection(this.getPos!());
    },

    /* invoked when window or editor resize */
    getMaxSize() {
      const { width } = getComputedStyle(this.editor!.view.dom);
      this.maxSize.width = parseInt(width, 10);
    },

    /* on resizer handler mousedown
     * record the position where the event is triggered and resize direction
     * calculate the initial width and height of the image
     */
    onMouseDown(e: MouseEvent, dir: ResizeDirection): void {
      e.preventDefault();
      e.stopPropagation();

      this.resizerState.x = e.clientX;
      this.resizerState.y = e.clientY;

      const originalWidth = this.originalSize.width;
      const originalHeight = this.originalSize.height;
      const aspectRatio = originalWidth / originalHeight;

      let { width, height } = this.node!.attrs;
      const maxWidth = this.maxSize.width;

      if (width && !height) {
        width = width > maxWidth ? maxWidth : width;
        height = Math.round(width / aspectRatio);
      } else if (height && !width) {
        width = Math.round(height * aspectRatio);
        width = width > maxWidth ? maxWidth : width;
      } else if (!width && !height) {
        width = originalWidth > maxWidth ? maxWidth : originalWidth;
        height = Math.round(width / aspectRatio);
      } else {
        width = width > maxWidth ? maxWidth : width;
      }

      this.resizerState.w = width;
      this.resizerState.h = height;
      this.resizerState.dir = dir;

      this.resizing = true;

      this.onEvents();
    },

    onMouseMove(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      if (!this.resizing) return;

      const { x, y, w, h, dir } = this.resizerState;

      const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1);
      const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1);

      // eslint-disable-next-line no-unused-expressions
      this.updateAttributes?.({
        width: clamp(w + dx, MIN_SIZE, this.maxSize.width),
        height: Math.max(h + dy, MIN_SIZE),
      });
    },

    onMouseUp(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      if (!this.resizing) return;

      this.resizing = false;

      this.resizerState = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: '',
      };

      this.offEvents();
      this.selectImage();
    },

    onEvents(): void {
      document.addEventListener('mousemove', this.onMouseMove, true);
      document.addEventListener('mouseup', this.onMouseUp, true);
    },

    offEvents(): void {
      document.removeEventListener('mousemove', this.onMouseMove, true);
      document.removeEventListener('mouseup', this.onMouseUp, true);
    },
  },
});
</script>
