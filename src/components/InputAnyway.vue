<script setup lang="ts">
import { findBestMatch } from 'kor-string-similarity'
import { PropType, onMounted, ref, watch } from 'vue'

const props = defineProps({
  size: { type: Number, default: 3 },
  // keySet: { type: Array<String>, default: ['0', '1', '2'] },
  items: { type: Array<any>, default: [] },
  modelValue: { type: Object as PropType<any | null> },
})
const emit = defineEmits(['update:modelValue', 'add:dataList', 'add:data', 'unselect'])
const delim = ';'
const innerValue = ref('')

const emitAndClear = () => {
  const arrayValue = innerValue.value.split(delim)
  // const combinedValue = keySet.reduce((o, key, idx) => ({ ...o, [key as string]: arrayValue[idx] }), {})
  const combinedValue = [...arrayValue]
  emit('add:dataList', combinedValue)
  innerValue.value = ''
}
const inputValue = () => {
  // if (innerValue.value.split(delim).filter((v) => v?.trim?.()).length >= size) {
  if (innerValue.value.split(delim).length >= props.size) {
    emitAndClear()
    return true
  }
  return false
}
const onKeydown = (e: KeyboardEvent) => {
  console.log('onKeydown', e)
  // if (e.key === 'Enter' || e.key === delim) {
  //   //   emitAndClear()
  //   // } else if (e.key === delim) {
  //   e.preventDefault()
  //   if (!inputValue()) {
  //     innerValue.value = innerValue.value + delim
  //   }
  // }
  if (props.modelValue) {
    if (e.key === 'Enter') {
      const [name, level] = innerValue.value.split(delim)
      const item = { ...props.modelValue, name, level: Number(level) || 0 }
      emit('update:modelValue', item)
      emit('unselect')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const [name, oldLevel] = innerValue.value.split(delim)
      innerValue.value = [name, Math.min(3, (Number(oldLevel) || 0) + 1)].join(delim)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const [name, oldLevel] = innerValue.value.split(delim)
      innerValue.value = [name, Math.max(0, (Number(oldLevel) || 0) - 1)].join(delim)
    }
  }
}
const onPaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text/plain') ?? ''
  console.log('onPaste', text)
  if (props.modelValue) {
    //
  } else {
    const results: { data: any[] }[] = [{ data: [] }, { data: [] }, { data: [] }]
    let isStarted = false
    let targetIndex = -1
    text.split('\n').forEach((value) => {
      if (!isStarted) {
        if (value === '육성정보') isStarted = true
        return
      }
      if (value === '닫기') {
        isStarted = false
        return
      }

      const maybeTarget = findBestMatch(
        value,
        props.items.map((s) => s.name)
      )
      if (maybeTarget?._text && maybeTarget?.similarity >= 0.5) {
        const target = props.items.find((o) => o.name === maybeTarget._text)
        if (target.type === 'blue') targetIndex++
        innerValue.value = [target?.type, ...Array(props.size - 2).keys()].reduce((str, txt) => (str += delim + `${txt ?? ''}`), maybeTarget?._text)
        results[targetIndex].data.push({ name: target.name, type: target.type, level: 0 })
        inputValue()
        console.log(new Date().toISOString(), 'success', value, '>', maybeTarget?._text, target?.type, maybeTarget?.similarity)
      } else {
        console.log(new Date().toISOString(), 'failed', value)
      }
    })
    console.log('results', results)
    emit('add:data', results)
  }
}

watch(
  () => props.modelValue?.id,
  (itemId, beforeItemId) => {
    if (itemId) {
      if (itemId !== beforeItemId) {
        console.log('modelValue', 'changed', props.modelValue)
        const { name, level } = props.modelValue!
        innerValue.value = [name, level].join(delim)
      }
    } else {
      innerValue.value = '' // clear
    }
  }
)

onMounted(() => {
  console.log('items', props.items)
  console.log('modelValue', props.modelValue)

  // if (modelValue) {
  //   const text = modelValue
  //   const results: { data: any[] }[] = [{ data: [] }, { data: [] }, { data: [] }]
  //   let isStarted = false
  //   let targetIndex = -1
  //   text.split('\n').forEach((value) => {
  //     if (!isStarted) {
  //       if (value === '육성정보') isStarted = true
  //       return
  //     }
  //     if (value === '닫기') {
  //       isStarted = false
  //       return
  //     }

  //     const maybeTarget = findBestMatch(
  //       value,
  //       items.map((s) => s.name)
  //     )
  //     if (maybeTarget?._text && maybeTarget?.similarity >= 0.5) {
  //       const target = items.find((o) => o.name === maybeTarget._text)
  //       if (target.type === 'blue') targetIndex++
  //       innerValue.value = [target?.type, ...Array(size - 2).keys()].reduce((str, txt) => (str += delim + `${txt ?? ''}`), maybeTarget?._text)
  //       results[targetIndex].data.push({ id: target.id, name: target.name, type: target.type, level: 0 })
  //       inputValue()
  //       console.log(new Date().toISOString(), 'success', value, '>', maybeTarget?._text, target?.type, maybeTarget?.similarity)
  //     } else {
  //       console.log(new Date().toISOString(), 'failed', value)
  //     }
  //   })
  //   console.log('results', results)
  //   emit('add:data', results)
  // }
})
</script>
<template>
  <div>
    <!-- input area -->
    <input :value="innerValue" @keydown="onKeydown" @paste.prevent="onPaste" />
    <!-- data area -->
  </div>
</template>
