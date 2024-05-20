export const encodedCallData = (data: any) => {
  const stringData = JSON.stringify(data)
  const encodedData = btoa(stringData)
  return encodedData
}
export const decodedCallData = (data: string) => {
  const decodedData = atob(data)
  const parsedData = JSON.parse(decodedData)
  return parsedData
}
