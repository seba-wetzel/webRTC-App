<script setup lang="ts">
import { createRemoteStream, createUserStream } from '@/modules/media/mediaStream'
import { createVideoContainer } from '@/modules/media/videoContainner'
import { createPeerConnection } from '@/modules/webRTC/createConnection'

import { ref, watch, watchEffect } from 'vue'
const iceCandidate = ref<any>([])
const offer = ref<RTCSessionDescriptionInit | null>(null)

const localVideo = ref<null | HTMLVideoElement>(null)
const remoteVideo = ref<null | HTMLVideoElement>(null)

const callData = ref('')

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
const remoteStream = await createRemoteStream()

const createACall = async () => {
  const connection = await createPeerConnection({
    localStream,
    remoteStream,
    emit: (event, data) => {
      iceCandidate.value = [...iceCandidate.value, data]
    }
  })
  offer.value = await connection.createOffer()
  connection.setLocalDescription(offer.value)

  // callData.value = encodedCallData({ offer: offer.value, iceCandidate: iceCandidate.value })
}

const createAnAnswer = async () => {
  const callDataValue = decodedCallData(callData.value)
  console.log(callDataValue)
  const offerObj = callDataValue.offer
  const remoteIceCandidate = callDataValue.iceCandidate
  const connection = await createPeerConnection({
    offerObj,
    localStream,
    remoteStream,
    emit: (event, data) => {
      iceCandidate.value = data
    }
  })
  const answer = await connection.createAnswer()
  connection.setLocalDescription(answer)
  console.log(remoteIceCandidate)
  remoteIceCandidate.forEach(({ candidate }: { candidate: RTCIceCandidate }) => {
    console.log(candidate)
    connection.addIceCandidate(candidate)
  })
}

watchEffect(() => {
  if (localVideo.value) {
    createVideoContainer(localVideo.value, localStream)
  }
  if (remoteVideo.value) {
    createVideoContainer(remoteVideo.value, remoteStream)
  }
})

watch(iceCandidate, () => {
  callData.value = encodedCallData({ offer: offer.value, iceCandidate: iceCandidate.value })
})
</script>

<template>
  <main>
    <div class="flex flex-col items-center justify-center gap-4 m-4">
      <p class="text-balance text-lg overflow-hidden">CallData: {{ callData }}</p>
      <textarea
        v-model="callData"
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
