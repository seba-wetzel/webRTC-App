<script setup lang="ts">
import { createVideoContainer } from '@/modules/media/videoContainner'
import { useStreamStore } from '@/stores/streams'
import { ref, watchEffect } from 'vue'
const streams = useStreamStore()
const localVideo = ref<null | HTMLVideoElement>(null)
const remoteVideo = ref<null | HTMLVideoElement>(null)

watchEffect(() => {
  if (localVideo.value && streams.localStream) {
    createVideoContainer(localVideo.value, streams.localStream)
  }
  if (remoteVideo.value && streams.remoteStream) {
    createVideoContainer(remoteVideo.value, streams.remoteStream)
  }
})
</script>
<template>
  <p>Meeting</p>
  <div class="flex flex-col md:flex-row justify-evenly">
    <div class="rounded-md border-2 flex flex-col items-center">
      <label class="m-1 text-lg" for="local-video">Local</label>
      <video
        :ref="(e) => (localVideo = e as HTMLVideoElement)"
        class="w-96 rounded-md border-2 m-2 h-full"
        id="local-video"
        autoplay
        playsinline
        controls
      ></video>
    </div>
    <div class="rounded-md border-2 flex flex-col items-center">
      <label class="m-1 text-lg" for="remote-video">Remote</label>
      <video
        :ref="(e) => (remoteVideo = e as HTMLVideoElement)"
        class="w-96 rounded-md border-2 m-2 h-full"
        id="remote-video"
        autoplay
        playsinline
        controls
      ></video>
    </div>
  </div>
</template>
