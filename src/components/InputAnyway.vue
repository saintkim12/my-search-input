<script setup lang="ts">
import { findBestMatch } from 'kor-string-similarity'
import { PropType, onMounted, ref } from 'vue'
import { Item } from '../App.vue'

const { size, items, modelValue } = defineProps({
  size: { type: Number, default: 3 },
  // keySet: { type: Array<String>, default: ['0', '1', '2'] },
  items: { type: Array<any>, default: [] },
  modelValue: { type: Object as PropType<Item | null> },
})
const emit = defineEmits(['update:modelValue', 'add:data'])
const delim = ';'
const innerValue = ref('')

const emitAndClear = () => {
  const arrayValue = innerValue.value.split(delim)
  // const combinedValue = keySet.reduce((o, key, idx) => ({ ...o, [key as string]: arrayValue[idx] }), {})
  const combinedValue = [...arrayValue]
  emit('update:modelValue', combinedValue)
  innerValue.value = ''
}
const inputValue = () => {
  // if (innerValue.value.split(delim).filter((v) => v?.trim?.()).length >= size) {
  if (innerValue.value.split(delim).length >= size) {
    emitAndClear()
    return true
  }
  return false
}
const onKeypress = (e: KeyboardEvent) => {
  console.log('onKeypress', e)
  if (e.key === 'Enter' || e.key === delim) {
    //   emitAndClear()
    // } else if (e.key === delim) {
    e.preventDefault()
    if (!inputValue()) {
      innerValue.value = innerValue.value + delim
    }
  }
}
const onPaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text/plain') ?? ''
  console.log('onPaste', text)
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
      items.map((s) => s.name)
    )
    if (maybeTarget?._text && maybeTarget?.similarity >= 0.5) {
      const target = items.find((o) => o.name === maybeTarget._text)
      if (target.type === 'blue') targetIndex++
      innerValue.value = [target?.type, ...Array(size - 2).keys()].reduce((str, txt) => (str += delim + `${txt ?? ''}`), maybeTarget?._text)
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

onMounted(() => {
  console.log('items', items)
  console.log('modelValue', modelValue)

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
    <input :value="innerValue" @keypress="onKeypress" @paste.prevent="onPaste" />
    <!-- data area -->
  </div>
</template>
