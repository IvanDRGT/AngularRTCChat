import { SafeUrl } from '@angular/platform-browser';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-image-preview',
  templateUrl: './chat-image-preview.component.html',
  styleUrls: ['./chat-image-preview.component.scss']
})
export class ChatImagePreviewComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SafeUrl
  ) { }

  ngOnInit(): void {
  }

}
