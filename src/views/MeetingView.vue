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
  <div class="h-full min-h-[80lvh] flex flex-col p-4">
    <div class="flex flex-col md:flex-row justify-evenly gap-4 relative flex-grow">
      <div
        class="rounded-md md:border-2 md:pb-2 md:px-2 flex flex-col items-center absolute size-48 md:size-auto md:static inset-y-3/4 inset-x-1/2 bg-black md:bg-transparent"
      >
        <label class="hidden md:block m-1 text-lg" for="local-video">Local</label>
        <video
          :ref="(e) => (localVideo = e as HTMLVideoElement)"
          class="w-96 rounded-md border-2 h-full"
          id="local-video"
          autoplay
          playsinline
          controls
        ></video>
      </div>
      <div
        class="rounded-md border-2 md:pb-2 md:px-2 flex flex-grow md:flex-grow-0 flex-col items-center min-h-full md:size-auto"
      >
        <label class="m-1 text-lg" for="remote-video">Remote</label>
        <video
          :ref="(e) => (remoteVideo = e as HTMLVideoElement)"
          class="w-96 flex-grow rounded-md border-2 h-full"
          id="remote-video"
          autoplay
          playsinline
          controls
        ></video>
      </div>
    </div>
  </div>
</template>
