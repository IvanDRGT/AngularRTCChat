export interface Message {
  id: string,
  sender: string,
  body: string,
  isCurrent:boolean
}
export interface ChatData {
  messages: Message[],
  targetName: string
}

export type ChatStatus = 'opening' | 'open' | 'connected';
