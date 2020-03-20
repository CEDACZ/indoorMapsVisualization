import { Component } from "@angular/core";
import * as mapboxgl from 'mapbox-gl';

import { LoadingController } from "@ionic/angular";

@Component({
  selector: 'app-metro-vis',
  templateUrl: './metro-vis.page.html',
  styleUrls: ['./metro-vis.page.scss'],
})
export class MetroVisPage {

  map: any;
  //style = 'mapbox://styles/mapbox/streets-v11'
  style = '../../assets/ceda-style.json';
  dataFlorenc = '../../assets/metro/florenc.geojson';


  lat = 14.437697;
  lon = 50.090487;


  constructor(public loadingController: LoadingController) {


  }


  async ngOnInit() {
    await this.buildMap();
    console.log("Mapa zbuildena")
    const loading = await this.loadingController.create({
      message: "Nahrávám mapu..."
    });
    await loading.present();
    this.map.on("load", () => {
      loading.dismiss();
    });
  }



  async buildMap() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: 15,
          center: [this.lat, this.lon]
        });
        console.log("MAPA", this.map);
        resolve('resolved');
      }, 100);
    });

  }



  hideVankovka() {

    if (this.map.getLayer("florenc-selected-floor")) this.map.removeLayer("florenc-selected-floor");
  }

  showAll() {
    this.hideVankovka();
    if (!this.map.getSource("florenc")) {
      this.map.addSource('florenc', {
        'type': 'geojson',
        'data': this.dataFlorenc
      });
    }
    /**
   * SPACE LAYER
   */
    this.map.addLayer({
      'id': 'florenc-selected-floor',
      'type': 'fill',
      'source': 'florenc',
      'paint': {
        "fill-color": ["case",
          ['==', ["get", 'Space_t'], 1], ["rgb", 235, 235, 235], //  general
          ['==', ["get", 'Space_t'], 2], ["rgb", 255, 255, 255], // transitionHorizontal
          ['==', ["get", 'Space_t'], 3], ["rgb", 255, 235, 190], // transitionVertical
          ['==', ["get", 'Space_t'], 4], ["rgb", 215, 194, 158], // anchor
          ['==', ["get", 'Space_t'], 5], ["rgb", 255, 255, 255], // parking
          ['==', ["get", 'Space_t'], 6], ["rgb", 255, 255, 255], // roadMarking
          ['==', ["get", 'Space_t'], 7], ["rgb", 108, 219, 44], // greenery
          ['==', ["get", 'Space_t'], 8], ["rgb", 156, 156, 156], // impassable
          ['==', ["get", 'Space_t'], 9], ["rgb", 255, 255, 255], // platform
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
        "fill-outline-color": ["case",
          ['==', ["get", 'Space_t'], 8], ["rgb", 43, 43, 43], // impassable
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
      }
    });

  }

  showFloorOnly(floor) {
    this.hideVankovka();
    if (!this.map.getSource("florenc")) {
      this.map.addSource('florenc', {
        'type': 'geojson',
        'data': this.dataFlorenc
      });
    }
    /**
   * SPACE LAYER
   */
    this.map.addLayer({
      'id': 'florenc-selected-floor',
      'type': 'fill',
      'source': 'florenc',
      'paint': {
        "fill-color": ["case",
          ['==', ["get", 'Space_t'], 1], ["rgb", 235, 235, 235], //  general
          ['==', ["get", 'Space_t'], 2], ["rgb", 255, 255, 255], // transitionHorizontal
          ['==', ["get", 'Space_t'], 3], ["rgb", 255, 235, 190], // transitionVertical
          ['==', ["get", 'Space_t'], 4], ["rgb", 215, 194, 158], // anchor
          ['==', ["get", 'Space_t'], 5], ["rgb", 255, 255, 255], // parking
          ['==', ["get", 'Space_t'], 6], ["rgb", 255, 255, 255], // roadMarking
          ['==', ["get", 'Space_t'], 7], ["rgb", 108, 219, 44], // greenery
          ['==', ["get", 'Space_t'], 8], ["rgb", 156, 156, 156], // impassable
          ['==', ["get", 'Space_t'], 9], ["rgb", 255, 255, 255], // platform
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
        "fill-outline-color": ["case",
          ['==', ["get", 'Space_t'], 8], ["rgb", 43, 43, 43], // impassable
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
      },
      'filter': ['==', 'Level_M', floor]
    });


  }


}
