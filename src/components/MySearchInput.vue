<script setup lang="ts">
import { Ref, computed, ref } from 'vue'
import { getRegExp } from 'korean-regexp'
import { arrangeBySimilarity } from 'kor-string-similarity'


// defineProps({
//   modelValue: {
//     type: String
//   }
// })
const emit = defineEmits(['update:modelValue'])
const innerValue = ref('')
const items: Ref<Array<string | { text: string }>> = ref([
  'apple',
  'banana',
  'orange',
  'grape',
  'strawberry',
  'melon',
  'pineapple',
  'kiwi',
  'peach',
  'pear',
  'blueberry',
  'raspberry',
  'cherry',
  'mango',
  'plum',
  'apricot',
  'blackberry',
  'cantaloupe',
  'coconut',
  'fig',
  'grapefruit',
  'lemon',
  'lime',
  'nectarine',
  'papaya',
  'watermelon',
  'avocado',
  'guava',
  'persimmon',
  'tangerine',
  'pomegranate',
  'kiwifruit',
  'lychee',
  'passion fruit',
  'dragon fruit',
  'boysenberry',
  'elderberry',
  'mulberry',
  'cranberry',
  'gooseberry',
  'lingonberry',
  'star fruit',
  'kumquat',
  'quince',
  'pawpaw',
  'barberry',
  'bilberry',
  'cloudberry',
  'rowanberry',
  'saskatoon berry',
  'breadfruit',
  'cherimoya',
  'custard apple',
  'date',
  'durian',
  'feijoa',
  'longan',
  'loquat',
  'mangosteen',
  'rambutan',
  'salak',
  'soursop',
  'ugli fruit',
  'yuzu',
  'ackee',
  'currant',
  'goji berry',
  'goldenberry',
  'honeyberry',
  'elderberry',
  'lingonberry',
  'passion fruit',
  'star fruit',
  'surinam cherry',
  'cherry plum',
  'yellow passion fruit',
  'bignay',
  'bilimbi',
  'carissa',
  'chayote',
  'citron',
  'feijoa',
  'horned melon',
  'jabuticaba',
  'jambul',
  'medlar',
  'noni',
  '근성',
  'ugli fruit',
  'rambutan',
  'surinam cherry',
])
const filteredItems = computed(() => {
  const keyword = innerValue.value?.trim?.()

  if (keyword) {
    console.log(keyword, arrangeBySimilarity(keyword, items.value.map((s) => typeof s === 'string' ? s : s.text)).filter((o) => o.similarity > 0))
  }
  return keyword
    ? items.value.filter((s) => {
        const text = typeof s === 'string' ? s : s.text
        return new RegExp(
          getRegExp(keyword, {
            initialSearch: true,
            // startsWith: true,
            // endsWith: true,
            ignoreSpace: true,
            // ignoreCase: false,
            global: true,
          }),
          'ig'
        ).test(text)
      })
    : items.value
})

const delim = ';'
const itemSize = 2
const emitAndClear = () => {
  emit('update:modelValue', innerValue.value)
  innerValue.value = ''
}
const inputValue = () => {
  if (innerValue.value.split(delim).filter((v) => v?.trim?.()).length >= itemSize) {
    emitAndClear()
    return true
  }
  return false
}
const onKeypress = (e: KeyboardEvent) => {
  console.log('onKeypress', e)
  if (e.key === 'Enter') {
    emitAndClear()
  } else if (e.key === delim) {
    e.preventDefault()
    if (!inputValue()) {
      innerValue.value = innerValue.value + delim
    }
  }
}
// const attachValue = (value: string) => {
//   innerValue.value = innerValue.value + delim + value
//   inputValue()
// }
</script>
<template>
  <div>
    <!-- input area -->
    <!-- <input type="text" v-model="innerValue" @keypress="onKeypress" /> -->
    <textarea :value="innerValue" @input="innerValue = ($event.target as HTMLTextAreaElement).value" @keypress="onKeypress"></textarea>
    <!-- data area -->
    <select multiple>
      <option v-for="(item, key) in filteredItems" :key="key" :value="item">{{ item }}</option>
    </select>
  </div>
</template>
<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;
}
</style>
