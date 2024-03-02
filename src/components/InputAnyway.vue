<script setup lang="ts">
import { arrangeBySimilarity } from 'kor-string-similarity'
import { getRegExp, korToEng } from 'korean-regexp'
import { PropType, computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  size: { type: Number, default: 3 },
  // keySet: { type: Array<String>, default: ['0', '1', '2'] },
  items: { type: Array<any>, default: [] },
  modelValue: { type: Object as PropType<any | null> },
})
const emit = defineEmits(['update:modelValue', 'unselect'])
const delim = ';'
const innerValue = ref('')

const isSearching = ref(true)
const searchKeyword = computed(() => innerValue.value.split(delim)[0])
const searchResults = ref<typeof props.items>([])
const selectValue = ref<typeof props.items[number] | null>(null)

const onKeydown = (e: KeyboardEvent) => {
  // console.log('onKeydown', e)
  // if (e.key === 'Enter' || e.key === delim) {
  //   //   emitAndClear()
  //   // } else if (e.key === delim) {
  //   e.preventDefault()
  //   if (!inputValue()) {
  //     innerValue.value = innerValue.value + delim
  //   }
  // }
  if (!(['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key) || e.ctrlKey || e.metaKey || e.altKey)) isSearching.value = true
  else isSearching.value = false
  if (props.modelValue) {
    if (e.key === 'Enter') {
      const [name, level] = innerValue.value.split(delim)
      const item = { ...props.modelValue, name, level: Number(level) || 0 }
      emit('update:modelValue', item)
      // emit('unselect')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const [name, oldLevel] = innerValue.value.split(delim)
      innerValue.value = [name, Math.min(3, (Number(oldLevel) || 0) + 1)].join(delim)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const [name, oldLevel] = innerValue.value.split(delim)
      innerValue.value = [name, Math.max(0, (Number(oldLevel) || 0) - 1)].join(delim)
    }
  } else {
    if (e.key === 'Enter') {
      const [name, level] = innerValue.value.split(delim)
      const item = { name, level: Number(level) || 0, parentId: 2 /** @FIXME 임시 */ }
      console.log('onKeydown', item)
      emit('update:modelValue', item)
      // emit('unselect')
    }
  }
}
const onSearchResultSelect = (id: string) => {
  isSearching.value = false
  console.log('onSearchResultSelect', id)
  const target = props.items.find(o => o.id === id)
  const [name, level] = innerValue.value.split(delim)
  if (name === target.name) return;
  const item = { ...props.modelValue, itemId: target.id, name: target.name, level: Number(level) || 0 }
  emit('update:modelValue', item)
  innerValue.value = [item.name, item.level].join(delim)
}

watch(
  () => searchKeyword.value,
  (keyword) => {
    if (!isSearching.value) return
    if (props.items.length && keyword) {
      // const targets = getRegExp
      const targets = arrangeBySimilarity(keyword, props.items.map((s) => s.name)).flatMap(({ _text, similarity }) => {
        if (!(similarity >= 0.5)) return []
        const item = props.items.find(o => o.name === _text)
        if (!item) return []
        return [({ similarity, ...item })]
      })
      console.log('targets', targets)
      searchResults.value = targets.slice()
    }
  }
)
watch(
  () => props.modelValue?.id,
  (id, beforeId) => {
    if (id) {
      if (id !== beforeId) {
        console.log('modelValue', 'changed', props.modelValue)
        const { name, level } = props.modelValue!
        innerValue.value = [name, level].join(delim)
      }
    } else {
      innerValue.value = '' // clear
    }
  }
)

// onMounted(() => {
//   console.log('items', props.items)
//   console.log('modelValue', props.modelValue)

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
// })
</script>

<template>
  <div>
    <!-- input area -->
    <input v-model="innerValue" @keydown="onKeydown" />
    <!-- data area -->
    <select multiple :value="selectValue" @input="onSearchResultSelect(($event.target as HTMLSelectElement).value)">
      <option v-for="item in searchResults" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>
