<template>
  <div class="ptj-modal-backdrop" v-show="active">
    <div class="ptj-modal">
        <header>
            <button
          type="button"
          class="btn-close"
          @click="$emit('close');"
        >
          x
        </button>
        </header>
      <slot>
      </slot>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
    active : {
        required : true
    }
});


</script>