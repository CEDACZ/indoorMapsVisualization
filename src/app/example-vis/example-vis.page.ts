import { Component } from "@angular/core";
import * as mapboxgl from 'mapbox-gl';

import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "example-vis.page.html",
  styleUrls: ["example-vis.page.scss"]
})
export class ExampleVisPage {
  map: any;
  //style = 'mapbox://styles/mapbox/streets-v11'
  style = '../../assets/ceda-style.json';
  dataBoundaries = '../../assets/vankovka/Indoor_boundary.geojson';
  dataFloor = '../../assets/vankovka/Indoor_floor.geojson';
  dataSpace = '../../assets/vankovka/Indoor_space.geojson';


  lat = 16.614;
  lon = 49.1877;


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
   
    if (this.map.getLayer("vankovka-selected-floor")) this.map.removeLayer("vankovka-selected-floor");
    if (this.map.getLayer("vankovka-selected-floor-boundary")) this.map.removeLayer("vankovka-selected-floor-boundary");
    if (this.map.getLayer("vankovka-floor-polygon")) this.map.removeLayer("vankovka-floor-polygon");
    if (this.map.getLayer("vankovka-door-layer")) this.map.removeLayer("vankovka-door-layer");
  }

  showFloorOnly(floor) {
    this.hideVankovka();

    if (!this.map.getSource("indoor-space")) {
      this.map.addSource('indoor-space', {
        'type': 'geojson',
        'data': this.dataSpace
      });
    }
    if (!this.map.getSource("indoor-floor")) {
      this.map.addSource('indoor-floor', {
        'type': 'geojson',
        'data': this.dataFloor
      });
    }
    if (!this.map.getSource("indoor-boundaries")) {
      this.map.addSource('indoor-boundaries', {
        'type': 'geojson',
        'data': this.dataBoundaries
      });
    }
    /** 
     * FLOOR LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-floor-polygon',
      'source': 'indoor-floor',
      "type": "fill",
      "paint": {
        "fill-color": "#828282",
      },
      'filter': ['==', 'Level_M', floor]
    });


    /**
     * SPACE LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-selected-floor',
      'type': 'fill',
      'source': 'indoor-space',
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
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ]
      },
      'filter': ['==', 'Level_M', floor]
    });

    /**
     * BOUNDARY LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-selected-floor-boundary',
      'source': 'indoor-boundaries',
      "type": "line",
      "line-join": "miter",
      "line-cap": "square",
      "paint": {
        "line-color": ["case",
          ['==', ["get", 'Bound_t'], 1], ["rgb", 245, 162, 122], // DOOR
          ['==', ["get", 'Bound_t'], 4], ["rgb", 130, 130, 130], //WALLS
          ['==', ["get", 'Bound_t'], 5], ["rgb", 215, 194, 158], // COUNTER
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ]
      },
      'filter': 
        ['==', 'Level_M', floor]
      
    });


  }



}
