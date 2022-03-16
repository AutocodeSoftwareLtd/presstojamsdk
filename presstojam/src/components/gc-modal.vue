<template>
  <div class="ptj-modal-backdrop">
    <div class="ptj-modal">
        <header>
            <button
          type="button"
          class="btn-close"
          @click="close"
        >
          x
        </button>
        </header>
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
   import { defineComponent} from "vue"
   export default defineComponent({
    name: 'ptj-modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  });
</script>