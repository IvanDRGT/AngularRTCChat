import { map } from 'rxjs/operators';
import { ConnectionDialogComponent } from './../connection-dialog/connection-dialog.component';
import { ConnectionHandlerService } from '../../services/connection-handler.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ChatData, ChatStatus, Message } from '../../services/interfaces/chat-data';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  constructor(
    private connectionHandler: ConnectionHandlerService,
    private dialogService: MatDialog
  ) { }
  messages: Message[];
  chatTarget: string;

  get updateObs(): Observable<unknown>{
    return this.connectionHandler.chatObs;
  }

  ngOnDestroy(): void {
    for(let sub of this.subs)
      sub.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.push(...[
      this.subscribeToChatStatus(),
      this.subscribeToChat()
    ]);
  }


  private readonly subs: Subscription[] = [];

  private subscribeToChat(): Subscription{
    return this.connectionHandler.chatObs.subscribe((data: ChatData)=>{
      this.messages = data?.messages ?? [];
      this.chatTarget = data?.targetName;
    })
  }
  private constructChatTargetObs(): Observable<string>{
    return this.connectionHandler.chatObs.pipe(
      map((data: ChatData) => data.targetName)
    );
  }

  private subscribeToChatStatus(): Subscription{
    return this.connectionHandler.statusObs.subscribe((status: ChatStatus) => {
      if(status === 'connected'){
        this.dialogService.closeAll();
      }
      else{
        if(!this.dialogService.openDialogs.length){
          this.dialogService.open(ConnectionDialogComponent, {
            disableClose: true
          });
        }
      }
    });
  }

  trackMessages(index: number, item: Message): string{
    return item.id;
  }
}
