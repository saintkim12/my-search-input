<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import MySearchInput from './components/MySearchInput.vue'
import InputAnyway from './components/InputAnyway.vue'
import PasteAnyway from './components/PasteAnyway.vue'
import { data } from './data.json'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const myData: any[] = (data ?? []).filter(o => o.name).map((o, id) => ({ id: `${id}`, ...o }))

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
    const newItem = Object.assign({ id: uuidv4() }, { ...(item as MyTag), parentId: /** @FIXME 임시 */allTreeData.value?.[0]?.[0]?.id })
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
const addData = (data: [{ data: Array<Partial<MyTag>> }, { data: Array<Partial<MyTag>> }, { data: Array<Partial<MyTag>> }]) => {
  const [meData, parent1Data, parent2Data] = data.map(o => o.data)
  const me = { id: uuidv4(), name: 'me', data: meData.map(({ ...o }) => ({ id: uuidv4(), ...o }) as MyTag) }
  const parent1 = { id: uuidv4(), name: 'parent1', data: parent1Data.map(({ ...o }) => ({ id: uuidv4(), ...o }) as MyTag) }
  const parent2 = { id: uuidv4(), name: 'parent2', data: parent2Data.map(({ ...o }) => ({ id: uuidv4(), ...o }) as MyTag) }

  const treeData: Array<Item> = []
    ;[me, parent1, parent2].forEach((item) => {
      treeData.push({ id: item.id, name: item.id })
      item.data.forEach(tag => {
        allTags.value.push({ ...tag, parentId: item.id } as MyTag)
      })
    })
  allTreeData.value.push(treeData)
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
        <label>me</label>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in me.data">
            <div class="control mr-1 mb-1" :class="[currentTag?.id === id && 'focused']" :tabindex="1 + idx" @focus="onFocused({ id, parentId, itemId, type, name, level })">
              <div class="tags has-addons">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete" @click.prevent="removeTag({ id })"></a>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div>
        <label>parent1</label>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in parent1.data">
            <div class="control mr-1 mb-1" :class="[currentTag?.id === id && 'focused']" :tabindex="1 + me.data.length + idx" @focus="onFocused({ id, parentId, itemId, type, name, level })">
              <div class="tags has-addons">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete" @click.prevent="removeTag({ id })"></a>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div>
        <label>parent2</label>
        <div class="field is-grouped is-grouped-multiline mb-0">
          <template v-for="({ id, parentId, itemId, type, name, level }, idx) in parent2.data">
            <div class="control mr-1 mb-1" :class="[currentTag?.id === id && 'focused']" :tabindex="1 + me.data.length + parent1.data.length + idx" @focus="onFocused({ id, parentId, itemId, type, name, level })">
              <div class="tags has-addons">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete" @click.prevent="removeTag({ id })"></a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div>
      <label>InputAnyway</label>
      <InputAnyway :model-value="currentTag" :items="myData" @update:modelValue="upsertTag" @unselect="currentTag = null" />
    </div>
    <div>
      <label>PasteAnyway</label>
      <PasteAnyway :items="myData" @add:data="addData" />
    </div>

    <button class="button is-button" @click="saveData">저장</button>
  </div>
</template>

<style lang="scss" scoped>
.focused {
  outline: 2px dashed #888;
}
</style>
