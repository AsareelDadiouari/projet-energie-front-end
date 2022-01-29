import {Injectable} from "@angular/core";
import { Socket } from 'ngx-socket-io';
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService{

  constructor(private socket: Socket) {
  }

  onConnect(){
    return this.socket.fromEvent('connect').pipe(map((value: (unknown | any)) => value));
  }

  onReceivingMessage(){
    return this.socket.fromEvent('receive_message');
  }

  onEvent() {
    return this.socket.fromEvent('event');
  }

  sendData(){
    this.socket.emit('send_message', "Salut")
  }
}
