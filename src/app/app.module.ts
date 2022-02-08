import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';


import {AppComponent} from './app.component';
import {MapComponent} from './map/map.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StationInfoComponent} from './station-info/station-info.component';
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {environment} from "../environments/environment";
import {MatTabsModule} from "@angular/material/tabs";
import { CarInfoComponent } from './car-info/car-info.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";

const config: SocketIoConfig = {url: environment.server.url, options: {}};

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StationInfoComponent,
    CarInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    MatTabsModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
