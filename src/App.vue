<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import MySearchInput from './components/MySearchInput.vue'
import InputAnyway from './components/InputAnyway.vue'
import PasteAnyway from './components/PasteAnyway.vue'
import { data } from './data.json'
import TagItem from './components/TagItem.vue'
import NameLabel from './components/NameLabel.vue'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const myData: any[] = ((data ?? []) as any[]).filter((o) => o.name).map((o, id) => ({ id: `${id}`, ...o }))

type MyTag = { id: string; parentId: string; itemId: string; type?: string; name: string; level: number }
export type Item = { id: string; name: string }
const allTags = ref<Array<MyTag>>([])
const allTreeData = ref<Array<Item[]>>([])
const currentTag = ref<MyTag | null>(null)

const displayTreeData = computed(() => {
  console.log(
    'displayTreeData',
    allTreeData.value.map((nodes) => nodes.map((node) => ({ ...node, data: allTags.value.filter((leaf) => leaf.parentId === node.id) })))
  )
  return allTreeData.value.map((nodes) => nodes.map((node) => ({ ...node, data: allTags.value.filter((leaf) => leaf.parentId === node.id) })))
})

// const myValue = ref<Item | null>(null)
// const myValues = ref<Array<Array<string>>>([])

const onFocused = (item: MyTag | null) => {
  console.log('onFocused', item)
  currentTag.value = item ?? null
  console.log('currentTag', currentTag.value)
}
const upsertTag = (item: Partial<MyTag>) => {
  console.log('upsertTag', item)
  const idx = allTags.value.findIndex((o: MyTag) => o.id === item.id)
  console.log('idx', idx)
  if (idx !== -1) {
    allTags.value[idx] = { ...allTags.value[idx], ...item }
  } else {
    const newItem = Object.assign({ id: uuidv4() }, { ...(item as MyTag), parentId: /** @FIXME 임시 */ allTreeData.value?.[0]?.[0]?.id })
    allTags.value.push(newItem)
    currentTag.value = newItem
  }
}
const removeTag = (item: Partial<MyTag>) => {
  console.log('removeTag', item)
  const idx = allTags.value.findIndex((o: MyTag) => o.id === item.id)
  console.log('idx', idx)
  if (idx !== -1) {
    allTags.value.splice(idx, 1)

    if (currentTag.value?.id === item.id) {
      currentTag.value = null
    }
  }
}
const addData = (data?: [{ data?: Array<Partial<MyTag>> }, { data?: Array<Partial<MyTag>> }, { data?: Array<Partial<MyTag>> }]) => {
  const [meData, parent1Data, parent2Data] = [...Array(3).keys()].map((idx) => data?.[idx]?.data ?? [])
  const me = { id: uuidv4(), name: 'me', data: meData.map(({ ...o }) => ({ id: uuidv4(), ...o } as MyTag)) }
  const parent1 = { id: uuidv4(), name: 'parent1', data: parent1Data.map(({ ...o }) => ({ id: uuidv4(), ...o } as MyTag)) }
  const parent2 = { id: uuidv4(), name: 'parent2', data: parent2Data.map(({ ...o }) => ({ id: uuidv4(), ...o } as MyTag)) }

  const treeData: Array<Item> = []
  ;[me, parent1, parent2].forEach((item) => {
    treeData.push({ id: item.id, name: item.id })
    item.data.forEach((tag) => {
      allTags.value.push({ ...tag, parentId: item.id } as MyTag)
    })
  })
  allTreeData.value.push(treeData)
}
const addTagData = () => {
  /** @TODO */
}
const loadData = () => {
  try {
    // allTreeData.value = JSON.parse(localStorage.getItem('data')!) as any[]
    // const savedData = {
    //   allTags: [{ id: uuidv4(), parentId: uuidv4(), name: 'hello', level: 3 }],
    //   allTreeData: [
    //     [
    //       { id: uuidv4(), name: 'myname' },
    //       { id: uuidv4(), name: 'myname2' },
    //       { id: uuidv4(), name: 'myname3' },
    //     ],
    //   ],
    // }
    // allTags.value = savedData.allTags
    // allTreeData.value = savedData.allTreeData
    console.log('data is loaded')
  } catch (e) {
    console.error(e)
  }
}
const saveData = () => {
  localStorage.setItem('data', JSON.stringify({ allTags: allTags.value, allTreeData: allTreeData.value }))
  console.log('data is saved')
}
onMounted(() => {
  loadData()
  currentTag.value = null /** @FIXME 임시 */
})
</script>

<template>
  <div>
    <div v-for="[me, parent1, parent2] in displayTreeData" class="box">
      <div>
        <NameLabel :tabindex="1" @click="onFocused({ type: 'name', itemId: 'hi', name: 'hi' } as MyTag)" @focus="onFocused({ type: 'name', itemId: 'hi' } as MyTag)">me</NameLabel>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in me.data">
            <TagItem
              :tabindex="1 + 1 + idx"
              v-bind="{ id, parentId, itemId, type, name, level, focused: currentTag?.id === id }"
              @focus="onFocused({ id, parentId, itemId, type, name, level })"
              @remove="removeTag({ id })"
              @update:level="upsertTag({ id, level: $event })"
            />
          </template>
          <div class="control mr-1 mb-1" @click="addTagData()">
            <div class="tags has-addons"><span class="tag">+</span></div>
          </div>
        </div>
      </div>

      <div>
        <NameLabel :tabindex="1 + 1 + me.data.length">parent1</NameLabel>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in parent1.data">
            <TagItem
              :tabindex="1 + 1 + me.data.length + idx"
              v-bind="{ id, parentId, itemId, type, name, level, focused: currentTag?.id === id }"
              @focus="onFocused({ id, parentId, itemId, type, name, level })"
              @remove="removeTag({ id })"
              @update:level="upsertTag({ id, level: $event })"
            />
          </template>
        </div>
      </div>

      <div>
        <NameLabel :tabindex="1 + 1 + 1 + me.data.length + parent1.data.length">parent2</NameLabel>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in parent2.data">
            <TagItem
              :tabindex="1 + 1 + 1 + me.data.length + parent1.data.length + idx"
              v-bind="{ id, parentId, itemId, type, name, level, focused: currentTag?.id === id }"
              @focus="onFocused({ id, parentId, itemId, type, name, level })"
              @remove="removeTag({ id })"
              @update:level="upsertTag({ id, level: $event })"
            />
          </template>
        </div>
      </div>
    </div>

    <div>
      <label>InputAnyway</label>
      {{ currentTag }}
      <InputAnyway :model-value="currentTag" :items="myData" @add:data="addData" @update:modelValue="upsertTag" @unselect="currentTag = null" />
    </div>
    <div>
      <label>PasteAnyway</label>
      <PasteAnyway :items="myData" @add:data="addData" />
    </div>

    <button class="button is-button" @click="saveData">저장</button>
    <button class="button is-button" @click="addData()">추가</button>
  </div>
</template>

<style lang="scss" scoped>
.focused {
  outline: 2px dashed #888;
}
</style>
