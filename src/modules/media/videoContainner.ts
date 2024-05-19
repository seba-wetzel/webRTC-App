export const createVideoContainer = (el: HTMLVideoElement, stream: MediaStream) => {
  if (el) {
    el.srcObject = stream
    el.autoplay = true
    el.muted = true
    el.controls = false
  }
}
