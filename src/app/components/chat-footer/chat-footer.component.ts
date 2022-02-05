import { ConnectionHandlerService } from './../../services/connection-handler.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss'],
})
export class ChatFooterComponent implements OnInit {
  readonly messageControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.min(3),
  ]);

  constructor(private connHandler: ConnectionHandlerService) {}

  ngOnInit(): void {}
  submit(): void {
    if ((this.messageControl.value as string).length > 0 && this.connHandler.sendMessage(this.messageControl.value))
      this.messageControl.patchValue('');
  }
}
