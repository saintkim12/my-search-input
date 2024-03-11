<script setup lang="ts">
const props = defineProps({
  id: { type: String },
  parentId: { type: String },
  itemId: { type: String },
  type: { type: String },
  name: { type: String },
  level: { type: Number },
  focused: { type: Boolean }
  // size: { type: Number, default: 3 },
  // keySet: { type: Array<String>, default: ['0', '1', '2'] },
  // items: { type: Array<any>, default: [] },
  // modelValue: { type: Object as PropType<any | null> },
})
const emit = defineEmits(['focus', 'blur', 'remove', 'update:level'])

const onKeydown = (e: KeyboardEvent) => {
  console.log('onKeydown', e)
  if (['1', '2', '3', '0'].includes(e.key)) {
    emit('update:level', e.key)
  }
}
</script>
<template>
  <div class="control mr-1 mb-1" :class="[focused && 'focused']" @focus="$emit('focus', props)" @blur="$emit('blur')" @keydown="onKeydown">
    <div class="tags has-addons">
      <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
      <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
      <a class="tag is-delete" @click.prevent="$emit('remove', { id })"></a>
    </div>
  </div>
</template>