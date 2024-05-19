<script setup lang="ts">
import { createRemoteStream, createUserStream } from '@/modules/media/mediaStream'
import { createVideoContainer } from '@/modules/media/videoContainner'
import {
  addNewDescriptionCandidate,
  addNewIceCandidate,
  createPeerConnection
} from '@/modules/webRTC/createConnection'

import { computed, ref, watchEffect } from 'vue'
const iceCandidate = ref<any>([])
const offer = ref<RTCSessionDescriptionInit | null>(null)

const localVideo = ref<null | HTMLVideoElement>(null)
const remoteVideo = ref<null | HTMLVideoElement>(null)
const connection = ref<RTCPeerConnection | null>(null)
const callData = computed(() => {
  return encodedCallData({ offer: offer.value, iceCandidate: iceCandidate.value })
})

const callDataInput = ref<string>('')

const answerData = ref<string>('')

const encodedCallData = (data: any) => {
  const stringData = JSON.stringify(data)
  const encodedData = btoa(stringData)
  return encodedData
}
const decodedCallData = (data: string) => {
  const decodedData = atob(data)
  const parsedData = JSON.parse(decodedData)
  return parsedData
}

const copyToClipboard = (data: string) => {
  navigator.clipboard.writeText(data)
}

const localStream = await createUserStream({
  video: true,
  audio: true
})
const remoteStream = createRemoteStream()
const emit = (_event: string, data: any) => {
  iceCandidate.value = [...iceCandidate.value, data]
}
const createACall = async () => {
  connection.value = await createPeerConnection({
    localStream,
    remoteStream,
    emit
  })
  offer.value = await connection.value.createOffer()
  connection.value.setLocalDescription(offer.value)
}

const createAnAnswer = async () => {
  const callDataValue = decodedCallData(callDataInput.value)
  const offerObj = callDataValue.offer
  const remoteIceCandidate = callDataValue.iceCandidate
  connection.value = await createPeerConnection({
    offerObj,
    localStream,
    remoteStream,
    emit
  })
  const answer = await connection.value.createAnswer()
  offer.value = answer
  connection.value.setLocalDescription(answer)
  remoteIceCandidate.forEach(({ candidate }: { candidate: RTCIceCandidate }) => {
    if (connection.value) connection.value.addIceCandidate(candidate)
  })
}

const handlerIceCandidate = () => {
  const answerDataValue = decodedCallData(answerData.value)
  addNewIceCandidate(answerDataValue.iceCandidate, connection.value)
  addNewDescriptionCandidate(answerDataValue.offer, connection.value)
}

watchEffect(() => {
  if (localVideo.value) {
    createVideoContainer(localVideo.value, localStream)
  }
  if (remoteVideo.value) {
    createVideoContainer(remoteVideo.value, remoteStream)
  }
})
</script>

<template>
  <main>
    <div class="flex flex-col items-center justify-center gap-4 m-4">
      <p class="text-balance text-lg overflow-hidden">CallData: {{ callData }}</p>
      <textarea
        v-model="callDataInput"
        type="text"
        class="w-96 bg-transparent"
        placeholder="Ingrese los datos de la reunion"
      />
      <button @click="copyToClipboard(callData)" class="ring-4">Copy to clipboard</button>
    </div>
    <div class="flex justify-center space-x-4 gap-4 m-4">
      <button @click="createACall" :disable="callData" class="ring-4">Create a call</button>
      <button @click="createAnAnswer" class="ring-4">Create an answer</button>
    </div>
    <div class="flex justify-center gap-4 m-4">
      <input
        v-model="answerData"
        type="text"
        class="w-96 bg-transparent"
        placeholder="Datos del remitente"
      />
      <button @click="handlerIceCandidate" class="ring-4">Copy to clipboard</button>
    </div>
    <div class="flex flex-row">
      <div id="video-wrapper">
        <div id="waiting" class="btn btn-warning">Waiting for answer...</div>
        <video
          :ref="(e) => (localVideo = e as HTMLVideoElement)"
          class="w-96"
          id="local-video"
          autoplay
          playsinline
          controls
        ></video>
      </div>
      <video
        :ref="(e) => (remoteVideo = e as HTMLVideoElement)"
        class="w-96"
        id="remote-video"
        autoplay
        playsinline
        controls
      ></video>
    </div>
  </main>
</template>
