import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'property'})
export class FilterPropertyPipe implements PipeTransform {
  transform(object: any, property: string){
    return object[property];
  }
}
