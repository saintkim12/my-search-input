<script setup lang="ts">
import { findBestMatch } from 'kor-string-similarity'
import { PropType, ref, watch } from 'vue'

const props = defineProps({
  size: { type: Number, default: 3 },
  // keySet: { type: Array<String>, default: ['0', '1', '2'] },
  items: { type: Array<any>, default: [] },
})
const emit = defineEmits(['add:data'])
const delim = ';'
const innerValue = ref('')

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
      props.items.map((s) => s.name)
    )
    if (maybeTarget?._text && maybeTarget?.similarity >= 0.5) {
      const target = props.items.find((o) => o.name === maybeTarget._text)
      if (target.type === 'blue') targetIndex++
      innerValue.value = [target?.type, ...Array(props.size - 2).keys()].reduce((str, txt) => (str += delim + `${txt ?? ''}`), maybeTarget?._text)
      results[targetIndex].data.push({ itemId: target.id, name: target.name, type: target.type, level: 0 })
      // inputValue()
      console.log(new Date().toISOString(), 'success', value, '>', maybeTarget?._text, target?.type, maybeTarget?.similarity)
    } else {
      console.log(new Date().toISOString(), 'failed', value)
    }
  })
  console.log('results', results)
  emit('add:data', results)
  innerValue.value = ""
}

</script>

<template>
  <div>
    <!-- input area -->
    <input v-model="innerValue" @paste.prevent="onPaste" />
  </div>
</template>
