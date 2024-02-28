<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import MySearchInput from './components/MySearchInput.vue'
import InputAnyway from './components/InputAnyway.vue'
import { data } from './data.json'
const myData: any[] = data ?? []

type MyTag = { id: number; parentId: number; type?: string; name: string; level: number }
export type Item = { id: number; name: string }
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
const updateTag = (item: Partial<MyTag>) => {
  console.log('updateTag', item)
  const idx = allTags.value.findIndex((o: MyTag) => o.id === item.id)
  console.log('idx', idx)
  if (idx !== -1) {
    allTags.value[idx] = { ...allTags.value[idx], ...item }
  } else {
    const newItem = { ...(item as MyTag), id: Date.now() }
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
const loadData = () => {
  try {
    // allTreeData.value = JSON.parse(localStorage.getItem('data')!) as any[]
    const savedData = {
      allTags: [{ id: 1, parentId: 2, name: 'hello', level: 3 }],
      allTreeData: [
        [
          { id: 2, name: 'myname' },
          { id: 3, name: 'myname2' },
          { id: 4, name: 'myname3' },
        ],
      ],
    }
    allTags.value = savedData.allTags
    allTreeData.value = savedData.allTreeData
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
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ id, parentId, type, name, level }, idx) in me.data">
            <div class="control" :tabindex="1 + idx" @focus="onFocused({ id, parentId, type, name, level })">
              <div class="tags has-addons mr-1">
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
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ id, parentId, type, name, level }, idx) in parent1.data">
            <div class="control" :tabindex="1 + me.data.length + idx" @focus="onFocused({ id, parentId, type, name, level })">
              <div class="tags has-addons mr-1">
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
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ id, parentId, type, name, level }, idx) in parent2.data">
            <div class="control" :tabindex="1 + me.data.length + parent1.data.length + idx" @focus="onFocused({ id, parentId, type, name, level })">
              <div class="tags has-addons mr-1">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete" @click.prevent="removeTag({ id })"></a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <InputAnyway :model-value="currentTag" :items="myData.map((o, id) => ({ id, ...o }))" @update:modelValue="updateTag" @add:dataList="1" @add:data="allTreeData.push($event)" @unselect="currentTag = null" />

    <button class="button is-button" @click="saveData">저장</button>
  </div>
</template>

<style lang="scss" scoped></style>
