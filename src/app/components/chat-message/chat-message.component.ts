import { MatDialog } from '@angular/material/dialog';
import { Message } from './../../services/interfaces/chat-data';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatImagePreviewComponent } from '../chat-image-preview/chat-image-preview.component';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  private static readonly imageRegex: RegExp = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogService: MatDialog
  ) { }
  @Input() private message: Message;

  get sender(): string{
    return this.message.sender;
  }
  get msgBody(): string{
    return this.message.body;
  }

  image: SafeUrl;

  styleClass: string = 'message-container';

  ngOnInit(): void {
    if(this.message.isCurrent){
      this.styleClass = 'message-container-left';
    }
    else{
      this.styleClass = 'message-container-right';
    }

    if(this.message.body.match(ChatMessageComponent.imageRegex)){
      this.image = this.sanitizer.bypassSecurityTrustUrl(this.message.body);
    }
  }

  openPreview(): void{
    this.dialogService.open(ChatImagePreviewComponent, {
      data: this.image
    });
  }

}
