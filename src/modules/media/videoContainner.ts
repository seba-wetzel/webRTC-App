export const createVideoContainer = (
  el: HTMLVideoElement & { controlsList?: string },
  stream: MediaStream
) => {
  if (el) {
    el.srcObject = stream
    el.autoplay = true
    el.muted = true
    el.controls = false
    // el.controlsList = ''
  }
}
