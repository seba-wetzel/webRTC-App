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
  //RTCPeerConnection is the thing that creates the connection
  //we can pass a config object, and that config object can contain stun servers
  //which will fetch us ICE candidates
  const peerConnection = await new RTCPeerConnection(peerConfiguration)

  // remoteVideoEl.srcObject = remoteStream;
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      //add localtracks so that they can be sent once the connection is established
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
    e.streams[0].getTracks().forEach((track) => {
      if (remoteStream) remoteStream.addTrack(track)
    })
  })

  if (offerObj) {
    //this won't be set when called from call();
    //will be set when we call from answerOffer()
    // console.log(peerConnection.signalingState) //should be stable because no setDesc has been run yet
    await peerConnection.setRemoteDescription(offerObj)
    // console.log(peerConnection.signalingState) //should be have-remote-offer, because client2 has setRemoteDesc on the offer
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
  answer: RTCSessionDescriptionInit,
  peerConnection: RTCPeerConnection | null
) => {
  if (peerConnection) await peerConnection.setRemoteDescription(answer)
}
