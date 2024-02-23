<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import MySearchInput from './components/MySearchInput.vue'
import InputAnyway from './components/InputAnyway.vue'
import { data } from './data.json'
const myData: any[] = data ?? []

export type Item = { id: number; name: string; data: Array<any> }
const myValue = ref<Item | null>(null)
const myValues = ref<Array<Array<string>>>([])
const allData = ref<Array<any>>([])

const onFocused = (item: any) => {
  console.log('onFocused', item)
  myValue.value = item
  console.log('myValue', myValue.value)
}
const updateItem = (item: any) => {
  console.log('updateItem', item)
  
}
const loadData = () => {
  try {
    // allData.value = JSON.parse(localStorage.getItem('data')!) as any[]
    allData.value = [[{ data: [{ id: 1, name: 'hello', level: 0 }] }, { data: [] }, { data: [] }]] as any[]
    console.log('data is loaded')
  } catch (e) {
    console.error(e)
  }
}
const saveData = () => {
  localStorage.setItem('data', JSON.stringify(allData.value))
  console.log('data is saved')
}
onMounted(() => {
  loadData()
  myValue.value = null /** @FIXME 임시 */
})
</script>

<template>
  <div>
    <div v-for="[me, parent1, parent2] in allData" class="box">
      <div>
        <label>me</label>
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ id, type, name, level }, idx) in me.data">
            <div class="control" :tabindex="1 + idx" @focus="onFocused({ id, type, name, level })">
              <div class="tags has-addons mr-1">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete"></a>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div>
        <label>parent1</label>
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ type, name, level }, idx) in parent1.data">
            <div class="control" :tabindex="1 + me.data.length + idx">
              <div class="tags has-addons mr-1">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete"></a>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div>
        <label>parent2</label>
        <div class="field is-grouped is-grouped-multiline">
          <template v-for="({ type, name, level }, idx) in parent2.data">
            <div class="control" :tabindex="1 + me.data.length + parent1.data.length + idx">
              <div class="tags has-addons mr-1">
                <span :class="['tag', 'mr-0', 'pr-0', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ name }}</span>
                <span :class="['tag', { blue: 'is-info', red: 'is-danger', white: 'is-light', green: 'is-success' }[type as string]]">{{ level }}</span>
                <a class="tag is-delete"></a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <InputAnyway :model-value="myValue" :items="myData.map((o, id) => ({ id, ...o }))" @update:modelValue="updateItem" @add:dataList="myValues.push($event)" @add:data="allData.push($event)" @unselect="myValue = null" />

    <button class="button is-button" @click="saveData">저장</button>
  </div>
</template>

<style lang="scss" scoped></style>
