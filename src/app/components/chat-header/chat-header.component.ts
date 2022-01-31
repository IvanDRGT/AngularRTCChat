import { ChatData } from './../../services/interfaces/chat-data';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConnectionHandlerService } from './../../services/connection-handler.service';
import { Component, Input, OnInit } from '@angular/core';
import { Nullable } from 'src/types';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent implements OnInit {
  constructor() {}
  defaultHeader: string = 'RTC Chat';
  @Input('sender') set _sender(value: string){
    if(value){
      this.target = value;
    }
    else{
      this.target = this.defaultHeader;
    }
  }

  target: string = this.defaultHeader;

  ngOnInit(): void {}
}
