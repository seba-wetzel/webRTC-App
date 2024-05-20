import { decodedCallData, encodedCallData } from '@/modules/dataEncoding'
import {
  addNewDescriptionCandidate,
  addNewIceCandidate,
  createPeerConnection
} from '@/modules/webRTC/createConnection'
import { useStreamStore } from '@/stores/streams'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

export const useCallStore = defineStore('call', () => {
  const callState = ref<
    'idle' | 'calling' | 'waiting' | 'receiving' | 'joining' | 'onCall' | 'end'
  >('idle')
  const iceCandidate = ref<any>([])
  const offer = ref<RTCSessionDescriptionInit | null>(null)
  const answer = ref<RTCSessionDescriptionInit | null>(null)

  const connection = ref<RTCPeerConnection | null>(null)
  const store = useStreamStore()
  const { localStream, remoteStream } = storeToRefs(store)

  const callData = computed(() => {
    return encodedCallData({ offer: offer.value, iceCandidate: iceCandidate.value })
  })

  const addIceCandidate = (candidate: RTCIceCandidate) => {
    iceCandidate.value = [...iceCandidate.value, candidate]
  }

  const createACall = async () => {
    console.log('Creando llamada...')
    callState.value = 'calling'
    connection.value = await createPeerConnection({
      localStream: localStream.value,
      remoteStream: remoteStream.value,
      emit: (_event: string, data: any) => {
        if (_event === 'sendIceCandidateToSignalingServer') addIceCandidate(data)
      }
    })
    if (connection.value) {
      offer.value = await connection.value.createOffer()
      connection.value.setLocalDescription(offer.value)
      callState.value = 'waiting'
    }
  }

  const createAnAnswer = async (inComingCallData: string) => {
    const callDataValue = decodedCallData(inComingCallData)
    const offerObj = callDataValue.offer
    const remoteIceCandidate = callDataValue.iceCandidate
    connection.value = await createPeerConnection({
      offerObj,
      localStream: localStream.value,
      remoteStream: remoteStream.value,
      emit: (_event: string, data: any) => {
        if (_event === 'sendIceCandidateToSignalingServer') addIceCandidate(data)
        if (_event === 'connectRemoteStreamToVideo') callState.value = 'onCall'
      }
    })
    const answer = await connection.value.createAnswer()
    offer.value = answer
    connection.value.setLocalDescription(answer)
    remoteIceCandidate.forEach(({ candidate }: { candidate: RTCIceCandidate }) => {
      if (connection.value) connection.value.addIceCandidate(candidate)
    })
    callState.value = 'joining'
  }

  const acceptIncomingInvitation = (incommingInvitationReply: string) => {
    const answerDataValue = decodedCallData(incommingInvitationReply)
    addNewIceCandidate(answerDataValue.iceCandidate, connection.value)
    addNewDescriptionCandidate(answerDataValue.offer, connection.value)
    callState.value = 'onCall'
  }

  return {
    callState,
    iceCandidate,
    offer,
    answer,
    connection,
    callData,
    addIceCandidate,
    createACall,
    createAnAnswer,
    acceptIncomingInvitation
  }
})
