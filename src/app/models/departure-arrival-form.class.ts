import mapboxgl, {IControl} from "mapbox-gl";

export class DepartureArrivalFormClass implements IControl {
  private map!: unknown;
  private container!: HTMLElement;

  constructor() {
  }

  onAdd(map: mapboxgl.Map): HTMLElement {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'my-custom-control';
    this.container.textContent = 'My custom control';
    this.container.style.backgroundColor = "#FFFFFF";
    return this.container;
  }

  onRemove() {
    if (this.container.parentNode !== null) {
      this.container?.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }

}
