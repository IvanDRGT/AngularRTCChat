import { Nullable } from './../../types';
import { Message, ChatData, ChatStatus } from './interfaces/chat-data';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { exhaust, filter, map, take } from 'rxjs/operators';
import { DataConnection, PeerJSOption } from 'peerjs';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionHandlerService {
  private machineId: string;
  private displayName: string;
  private static readonly displayNameStorageKey = 'displayName';
  private static readonly senderNameMsgtemplate = '${SE}:';
  private static readonly senderNameMsgRegex = /([$]{SE}:)/g

  private readonly peerJsOptions: PeerJSOption = {
    debug: 3,
    secure: false,
    // key: 'peerjs',
    // port: 9000,
    // host: 'localhost',
    // path: '/conn',
    config: {
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
    },
  };

  private peer: any;
  private connection: DataConnection;

  private chatSubject: BehaviorSubject<Nullable<ChatData>> =
    new BehaviorSubject<Nullable<ChatData>>(null);
  private statusSubject: BehaviorSubject<ChatStatus> =
    new BehaviorSubject<ChatStatus>('opening');

  constructor() {
    this.getDataFromStorage();
    this.ensurePeer();
  }

  ////////////////////////////////////////////
  // Public API
  ////////////////////////////////////////////

  getMachineId(): string {
    return this.machineId;
  }

  get chatObs(): Observable<ChatData> {
    return this.chatSubject.asObservable();
  }

  get statusObs(): Observable<ChatStatus> {
    return this.statusSubject.asObservable();
  }

  getDisplayName(): string {
    return this.displayName;
  }

  sendMessage(text: string): boolean{
    if(this.connection){
      this.connection.send(text);
      this.chatSubject.next({
        ...this.chatSubject.value,
        messages: this.chatSubject.value.messages.concat({
          id: UUID.UUID(),
          body: text,
          sender: `${this.displayName} (You)`,
          isCurrent: true
        })
      });
      return true;
    }
    else{
      false;
    }
  }

  setDisplayName(displayName: string): Observable<void>{
    this.displayName = displayName;
    localStorage.setItem(ConnectionHandlerService.displayNameStorageKey, displayName);
    return of(null);
  }

  clearDisplayName(): void{
    this.displayName = null;
  }

  connect(id: string): Observable<boolean> {
    return this.statusObs.pipe(
      take(1),
      map((status: ChatStatus) => {
        if (status == 'open') {
          this.openConnection(this.peer.connect(id, {
            reliable: true,
          }));
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ////////////////////////////////////////////
  // Private API
  ////////////////////////////////////////////
  private getDataFromStorage() {
    this.displayName = localStorage.getItem(ConnectionHandlerService.displayNameStorageKey);
    if(!this.displayName){
      this.displayName = this.machineId;
    }
  }
  private openConnection(connection: DataConnection) {
    this.statusSubject.next('opening');
    this.setConnectionCallbacks(connection);
    setTimeout(() => {
      this.statusObs.pipe(take(1)).subscribe((status: ChatStatus) => {
        if(status !== 'connected'){
          this.connection.close();
          this.statusSubject.next('open');
        };
      })
    }, 5000);
    this.connection = connection;
  }
  private setConnectionCallbacks(connection: DataConnection): void {
    connection.on('open', () => {
      this.statusSubject.next('connected');
      this.chatSubject.next({
        messages: [],
      } as ChatData);
      this.connection.send(ConnectionHandlerService.senderNameMsgtemplate + this.displayName);
    });
    connection.on('error', (err: any) => this.statusSubject.next('open'));
    connection.on('close', () => {
      this.getSingleChatData().subscribe((chat: ChatData) => {
        this.chatSubject.next({
          ...chat,
          messages: chat.messages.concat({
            id: UUID.UUID(),
            body: `${chat.targetName} has left the chat.`,
            sender: 'System',
            isCurrent: false
          }),
        });
        this.statusSubject.next('open');
      });

      this.connection = null;
    });
    connection.on('data', (data: string) => {
      if ((typeof data) === 'string') {
        this.getSingleChatData().subscribe((chat: ChatData) => {
          const name = this.findName(data);
          if(name){
            this.chatSubject.next({
              targetName: name,
              messages: chat.messages.map((msg: Message) => {
                msg.sender = msg.sender === this.displayName ? msg.sender : name;
                return msg;
              })
            } as ChatData);
          }
          else{
            this.chatSubject.next({
              ...chat,
              messages: chat.messages.concat({
                id: UUID.UUID(),
                sender: chat.targetName,
                body: data,
                isCurrent: false
              })
            });
          }
        });
      }
    });
  }

  private findName(data: string): string{
    const matches = data.match(ConnectionHandlerService.senderNameMsgRegex);
    if(matches){
      return data.replace(ConnectionHandlerService.senderNameMsgtemplate, "");
    }
    else null;
  }

  private ensurePeer() {
    this.peer = new Peer(this.machineId, this.peerJsOptions);
    this.peer.on('open', (id: string) => {
      this.machineId = id;
      this.statusSubject.next('open');
    });
    this.peer.on('connection', (dc: DataConnection) => {
      this.openConnection(dc);
    });
    this.peer.on('error', () => this.statusSubject.next('open'));
    this.peer.on('disconnected', () => this.statusSubject.next('open'));
  }

  private getSingleChatData(): Observable<ChatData> {
    return this.chatObs.pipe(take(1));
  }
}
