import { peerConfiguration } from './config'

export type CreatePeerConnection = {
  offerObj?: RTCSessionDescriptionInit | undefined | null
  localStream?: MediaStream
  remoteStream?: MediaStream
  emit: (event: string, data: any) => void
}

export const createPeerConnection = async ({
  offerObj,
  localStream,
  remoteStream,
  emit
}: CreatePeerConnection) => {
  const peerConnection = await new RTCPeerConnection(peerConfiguration)

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })
  }

  peerConnection.addEventListener('iceconnectionstatechange', (e) => {
    console.log('iceconnectionstatechange', e)
  })

  peerConnection.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) {
      emit('sendIceCandidateToSignalingServer', {
        candidate
      })
    }
  })

  peerConnection.addEventListener('track', (e) => {
    emit('connectRemoteStreamToVideo', true)
    console.log('track', e)
    e.streams[0].getTracks().forEach((track) => {
      if (remoteStream) remoteStream.addTrack(track)
    })
  })

  peerConnection.addEventListener('datachannel', (e) => {
    console.log('connectionstatechange', e)
  })

  if (offerObj) {
    await peerConnection.setRemoteDescription(offerObj)
  }
  return peerConnection
}

export const addNewIceCandidate = (
  candidate: RTCIceCandidateInit,
  peerConnection: RTCPeerConnection | null
) => {
  if (peerConnection) peerConnection.addIceCandidate(candidate)
}

export const addNewDescriptionCandidate = async (
  offer: RTCSessionDescriptionInit,
  peerConnection: RTCPeerConnection | null
) => {
  if (peerConnection) await peerConnection.setRemoteDescription(offer)
}
