import {
  createRemoteStream as _createRemoteStream,
  createUserStream
} from '@/modules/media/mediaStream'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStreamStore = defineStore('streams', () => {
  const localStream = ref<MediaStream>()
  const remoteStream = ref<MediaStream>()

  const createLocalStream = async (config: MediaStreamConstraints | undefined) => {
    try {
      const _config = config ? config : { video: true, audio: true }
      const stream = await createUserStream(_config)
      localStream.value = stream
    } catch (err) {
      console.log(err)
      throw new Error(`${err}`)
    }
  }

  const createRemoteStream = () => {
    remoteStream.value = _createRemoteStream()
  }

  const createStreams = async (config: MediaStreamConstraints | undefined) => {
    await createLocalStream(config)
    createRemoteStream()
  }

  const clearStreams = () => {
    localStream.value = undefined
    remoteStream.value = undefined
  }

  return {
    localStream,
    remoteStream,
    createLocalStream,
    createRemoteStream,
    createStreams,
    clearStreams
  }
})
