import { ScrollLockDirective } from './directives/scroll-lock.directive';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectionDialogComponent } from './components/connection-dialog/connection-dialog.component';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { ConnectionHandlerService } from './services/connection-handler.service';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { ChatFooterComponent } from './components/chat-footer/chat-footer.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatImagePreviewComponent } from './components/chat-image-preview/chat-image-preview.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatContainerComponent,
    ConnectionDialogComponent,
    ChatHeaderComponent,
    ChatFooterComponent,
    ChatMessageComponent,
    ChatImagePreviewComponent,
    ScrollLockDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    ConnectionHandlerService,
    MatDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
