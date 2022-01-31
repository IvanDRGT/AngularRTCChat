export interface ConnectionStore {
  [peerId: string]: RTCPeerConnection
}
