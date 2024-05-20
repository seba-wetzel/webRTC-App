import { peerConfiguration } from './config'
export type Signal =
  | 'connectRemoteStreamToVideo'
  | 'sendIceCandidateToSignalingServer'
  | 'connectRemote'

export type CreatePeerConnection = {
  offerObj?: RTCSessionDescriptionInit | undefined | null
  localStream?: MediaStream
  remoteStream?: MediaStream
  emit: (event: Signal, data: any) => void
}

export const createPeerConnection = async ({
  offerObj,
  localStream,
  remoteStream,
  emit
}: CreatePeerConnection) => {
  const peerConnection = new RTCPeerConnection(peerConfiguration)

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })
  }

  peerConnection.addEventListener('connectionstatechange', (e) => {
    console.log('connectionstatechange', e)
    const { connectionState } = e.currentTarget as RTCPeerConnection
    console.log('connectionState', connectionState)
    if (connectionState === 'connected') emit('connectRemote', true)
    if (connectionState === 'disconnected') emit('connectRemote', false)
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

    e.streams[0].getTracks().forEach((track) => {
      if (remoteStream) remoteStream.addTrack(track)
    })
  })

  peerConnection.addEventListener('datachannel', (e) => {
    console.log('datachannel', e)
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
