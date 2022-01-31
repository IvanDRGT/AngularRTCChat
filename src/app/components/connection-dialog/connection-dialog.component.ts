import { ChatStatus } from './../../services/interfaces/chat-data';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConnectionHandlerService } from './../../services/connection-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.scss']
})
export class ConnectionDialogComponent implements OnInit {

  constructor(
    private connHandler: ConnectionHandlerService
  ) { }
  target: FormControl = new FormControl('', [
    Validators.required
  ]);
  ready: Observable<boolean>;
  get machineId(): string{
    return this.connHandler.getMachineId();
  }
  get displayName(): string{
    return this.connHandler.getDisplayName();
  }

  ngOnInit(): void {
    this.ready = this.connHandler.statusObs.pipe(
      map((status: ChatStatus) => {
        if(status === 'open'){
          return true;
        }
        else{
          return false;
        }
      })
    );
    this.target.patchValue('');
  }
  submit(): void {
    if(this.connHandler.getDisplayName()){
      this.connHandler.connect(this.target.value).subscribe(() => this.target.patchValue(''));
    }
    else{
      this.connHandler.setDisplayName(this.target.value).subscribe(() => this.target.patchValue(''));

    }
  }
  clearDisplayName(): void {
    this.connHandler.clearDisplayName();
    this.target.patchValue('');
  }
}
