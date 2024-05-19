import { createPeerConnection, type CreatePeerConnection } from '@/modules/webRTC/createConnection'

export const responseConnection = async ({
  offerObj,
  localStream,
  remoteStream,
  emit
}: CreatePeerConnection) => {
  const connection = await createPeerConnection({
    offerObj,
    localStream,
    remoteStream,
    emit
  })
  return connection
}
