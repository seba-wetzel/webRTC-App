<script setup lang="ts">
import { useCallStore } from '@/stores/call'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const callStore = useCallStore()

const invitationData = ref<string>('')
const myCredentials = ref<string>('')

const copyToClipboard = (data: string) => {
  console.log(data)
  navigator.clipboard.writeText(data)
}

const pasteFromClipboard = async () => {
  if (invitationData.value === '') invitationData.value = await navigator.clipboard.readText()
}

watch(
  () => callStore.callState,
  (data) => {
    if (data === 'waiting') {
      myCredentials.value = callStore.callData
    }
    if (data === 'onCall') {
      router.push({ name: 'meeting' })
    }
  }
)
onMounted(() => null)
</script>
<template>
  <div class="p-4 text-white w-full wrapper">
    <div class="box">
      <p>Ingresa las credenciales de la reunion</p>
      <textarea
        class="block w-full h-96 break-words overflow-y-auto bg-transparent ring-1 ring-white"
        v-model="invitationData"
        type="text"
        placeholder="Credentiales de la reunion"
      />
      <div class="flex flex-row gap-4">
        <button
          @click="pasteFromClipboard"
          class="block p-2 h-10 bg-blue-500 text-white rounded max-w-fit"
        >
          Pegar desde el portapapeles
        </button>
        <button
          @click="callStore.createAnAnswer(invitationData)"
          class="block p-2 h-10 bg-blue-500 text-white rounded max-w-fit"
        >
          Aceptar invitacion
        </button>
      </div>
    </div>

    <div class="box">
      <p>Dale estos datos a la persona que te invito</p>

      <p
        class="block w-full h-96 break-words overflow-y-auto bg-transparent ring-1 ring-white text-left"
      >
        {{ myCredentials }}
      </p>
      <button
        @click="copyToClipboard(callStore.callData)"
        class="p-2 h-10 bg-blue-500 text-white rounded max-w-fit"
      >
        Copiar datos
      </button>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.box {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  text-align: center;
}
</style>
