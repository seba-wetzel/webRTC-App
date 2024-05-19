export const createVideoContainer = (el: HTMLVideoElement, stream: MediaStream) => {
  console.log('createVideoContainer', el, stream)
  if (el) {
    el.srcObject = stream
    el.autoplay = true
    el.muted = true
    el.controls = false
  }
}
