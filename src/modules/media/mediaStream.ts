export const createUserStream = async (config: MediaStreamConstraints) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(config)
    return stream
  } catch (err) {
    console.log(err)
    throw new Error(`${err}`)
  }
}

export const createScreenStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    return stream
  } catch (err) {
    console.log(err)
    throw new Error(`${err}`)
  }
}

export const createRemoteStream = () => {
  return new MediaStream()
}
