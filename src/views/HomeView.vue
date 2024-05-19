<script setup lang="ts">
import { createRemoteStream, createUserStream } from '@/modules/media/mediaStream'
import { createVideoContainer } from '@/modules/media/videoContainner'
import { createPeerConnection } from '@/modules/webRTC/createConnection'

import { ref, watchEffect } from 'vue'
const iceCandidate = ref(null)
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
      iceCandidate.value = data
    }
  })
  offer.value = await connection.createOffer()
  connection.setLocalDescription(offer.value)

  callData.value = encodedCallData({ offer: offer.value, iceCandidate: iceCandidate.value })
}

const createAnAnswer = async () => {
  const connection = await createPeerConnection({
    localStream,
    remoteStream,
    emit: (event, data) => {
      iceCandidate.value = data
    }
  })
  const answer = await connection.createAnswer()
  connection.setLocalDescription(answer)
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
    <div class="flex flex-col items-center justify-center">
      <p class="text-balance text-lg">CallData: {{ callData }}</p>
      <button @click="copyToClipboard(callData)" class="ring-4">Copy to clipboard</button>
    </div>
    <div class="flex justify-center space-x-4">
      <button @click="createACall" class="ring-4">Create a call</button>
      <button @click="createAnAnswer" class="ring-4">Create an answer</button>
    </div>
    <div id="videos">
      <div id="video-wrapper">
        <div id="waiting" class="btn btn-warning">Waiting for answer...</div>
        <video
          :ref="(e) => (localVideo = e as HTMLVideoElement)"
          class="video-player"
          id="local-video"
          autoplay
          playsinline
          controls
        ></video>
      </div>
      <video
        :ref="(e) => (remoteVideo = e as HTMLVideoElement)"
        class="video-player"
        id="remote-video"
        autoplay
        playsinline
        controls
      ></video>
    </div>
  </main>
</template>
