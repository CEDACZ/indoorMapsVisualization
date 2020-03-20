import { Component } from "@angular/core";
import * as mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  map: any;
  //style = 'mapbox://styles/mapbox/streets-v11'
  style = '../../assets/ceda-style.json';
  dataBoundaries = '../../assets/vankovka2/Indoor_boundary_polygons.geojson';
  dataFloor = '../../assets/vankovka/Indoor_floor.geojson';
  dataSpace = '../../assets/vankovka2/Indoor_space_polygons.geojson';

  routeData = '../../assets/route.geojson';

  escalatorGltf = '../../assets/models/cube.gltf';

  customLayer;

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
      // parameters to ensure the model is georeferenced correctly on the map
      var modelOrigin = new mapboxgl.LngLat(16.614396572113037, 49.18846349237286);
      var modelAltitude = 0;
      var modelRotate = [Math.PI / 2, Math.PI + 0.2, 0];

      var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      );

      // transformation parameters to position, rotate and scale the 3D model onto the map
      var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
        * applied since the CustomLayerInterface expects units in MercatorCoordinates.
        */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
      };



      // configuration of the custom layer for a 3D model per the CustomLayerInterface
      this.customLayer = {
        id: 'escalator',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
          this.camera = new THREE.Camera();
          this.scene = new THREE.Scene();

          //var light = new THREE.AmbientLight(0x404040); // soft white light
          //this.scene.add(light);

          // create two three.js lights to illuminate the model
          var directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(-50, -200, -100).normalize();
          this.scene.add(directionalLight);

          var directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(50, 200, 100).normalize();
          this.scene.add(directionalLight2);

          // use the three.js GLTF loader to add the 3D model to the three.js scene
          var loader = new GLTFLoader();
          loader.load(
            '../../assets/models/escalator.gltf',
            function (gltf) {
              this.scene.add(gltf.scene);
            }.bind(this)
          );
          this.map = map;

          // use the Mapbox GL JS map canvas for three.js
          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
          });

          this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
          var rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          var rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          var rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          var m = new THREE.Matrix4().fromArray(matrix);
          var l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          this.camera.projectionMatrix = m.multiply(l);
          this.renderer.state.reset();
          this.renderer.render(this.scene, this.camera);
          this.map.triggerRepaint();
        }
      };
      console.log(this.customLayer);
    });
  }



  async buildMap() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          pitch: 60, // pitch in degrees
          bearing: -60, // bearing in degrees
          zoom: 15,
          center: [this.lat, this.lon]
        });
        console.log("MAPA", this.map);
        resolve('resolved');
      }, 100);
    });

  }

  showAllFloors() {
    if (!this.map.getSource("indoor-space")) {
      this.map.addSource('indoor-space', {
        'type': 'geojson',
        'data': this.dataSpace
      });
    }

    this.map.addLayer({
      'id': 'vankovka-zero-floor',
      'type': 'fill-extrusion',
      'source': 'indoor-space',
      'paint': {
        'fill-extrusion-color': '#c5d5f0',
        'fill-extrusion-height': 10,
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.8

      },
      'filter': ['==', 'Level_M', 0]
    });

    this.map.addLayer({
      'id': 'vankovka-first-floor',
      'type': 'fill-extrusion',
      'source': 'indoor-space',
      'paint': {
        'fill-extrusion-color': '#f78fd0',
        'fill-extrusion-height': 20,
        'fill-extrusion-base': 10,
        'fill-extrusion-opacity': 0.8
      },
      'filter': ['==', 'Level_M', 1]
    });

    this.map.addLayer({
      'id': 'vankovka-second-floor',
      'type': 'fill-extrusion',
      'source': 'indoor-space',
      'paint': {
        'fill-extrusion-color': '#8eeda8',
        'fill-extrusion-height': 30,
        'fill-extrusion-base': 20,
        'fill-extrusion-opacity': 0.8
      },
      'filter': ['==', 'Level_M', 2]
    });

    this.map.addLayer({
      'id': 'vankovka-third-floor',
      'type': 'fill-extrusion',
      'source': 'indoor-space',
      'paint': {
        'fill-extrusion-color': '#ffc619',
        'fill-extrusion-height': 40,
        'fill-extrusion-base': 30,
        'fill-extrusion-opacity': 0.8
      },
      'filter': ['==', 'Level_M', 3]
    });



    this.map.setCenter([16.614, 49.1877]);
    this.map.setZoom(17);

  }

  hideVankovka() {
    if (this.map.getLayer("vankovka-zero-floor")) this.map.removeLayer("vankovka-zero-floor");
    if (this.map.getLayer("vankovka-first-floor")) this.map.removeLayer("vankovka-first-floor");
    if (this.map.getLayer("vankovka-second-floor")) this.map.removeLayer("vankovka-second-floor");
    if (this.map.getLayer("vankovka-third-floor")) this.map.removeLayer("vankovka-third-floor");
    if (this.map.getLayer("vankovka-selected-floor")) this.map.removeLayer("vankovka-selected-floor");
    if (this.map.getLayer("vankovka-selected-floor-boundary")) this.map.removeLayer("vankovka-selected-floor-boundary");
    if (this.map.getLayer("vankovka-floor-polygon")) this.map.removeLayer("vankovka-floor-polygon");
    if (this.map.getLayer("vankovka-door-layer")) this.map.removeLayer("vankovka-door-layer");
    if (this.map.getLayer("route-layer")) this.map.removeLayer("route-layer");
  }

  showFloorOnly(floor, is3D) {
    this.hideVankovka();
    if (!is3D) {
      this.map.setPitch(0);
    } else {
      this.map.setPitch(60);
    }
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
    if (!this.map.getSource("route")) {
      this.map.addSource('route', {
        'type': 'geojson',
        'data': this.routeData
      });
    }
    /** 
     * FLOOR LAYER
     
    this.map.addLayer({
      'id': 'vankovka-floor-polygon',
      'source': 'indoor-floor',
      "type": "fill-extrusion",
      "paint": {
        "fill-extrusion-color": "#828282",
        'fill-extrusion-height': floor * 10,
        'fill-extrusion-base': floor * 10
      },
      'filter': ['==', 'Level_M', floor]
    });
  */

    /**
     * SPACE LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-selected-floor',
      'type': 'fill-extrusion',
      'source': 'indoor-space',
      'paint': {
        "fill-extrusion-color": ["case",
          ['==', ["get", 'Space_t'], 1], ["rgb", 235, 235, 235], //  general
          ['==', ["get", 'Space_t'], 2], ["rgb", 255, 255, 255], // transitionHorizontal
          ['==', ["get", 'Space_t'], 3], ["rgb", 255, 235, 190], // transitionVertical
          ['==', ["get", 'Space_t'], 4], ["rgb", 215, 194, 158], // anchor
          ['==', ["get", 'Space_t'], 5], ["rgb", 255, 255, 255], // parking
          ['==', ["get", 'Space_t'], 6], ["rgb", 255, 255, 255], // roadMarking
          ['==', ["get", 'Space_t'], 7], ["rgb", 108, 219, 44], // greenery
          ['==', ["get", 'Space_t'], 8], ["rgb", 156, 156, 156], // impassable
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
        'fill-extrusion-height': floor * 10,
        'fill-extrusion-base': floor * 10
      },
      'filter': ['==', 'Level_M', floor]
    });

    /** 
    * ROUTE LAYER
    
    this.map.addLayer({
      'id': 'route-layer',
      'source': 'route',
      "type": "line",
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#4287f5',
        'line-width': 8
      }
    });
*/
    /**
     * BOUNDARY LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-selected-floor-boundary',
      'source': 'indoor-boundaries',
      "type": "fill-extrusion",
      "line-join": "miter",
      "line-cap": "square",
      "paint": {
        "fill-extrusion-color": ["case",
          ['==', ["get", 'Bound_t'], 1], ["rgb", 245, 162, 122], // DOOR
          ['==', ["get", 'Bound_t'], 4], ["rgb", 130, 130, 130], //WALLS
          ['==', ["get", 'Bound_t'], 5], ["rgb", 215, 194, 158], // COUNTER
          ["rgb", 130, 130, 130] // DEFAULT COLOR
        ],
        "fill-extrusion-opacity": 1,
        'fill-extrusion-height': ["case",
          ['==', ["get", 'Bound_t'], 1], floor * 10 + 8, // DOOR height
          ['==', ["get", 'Bound_t'], 4], floor * 10 + 10, //WALLS height
          ['==', ["get", 'Bound_t'], 5], floor * 10 + 3, // COUNTER height
          floor * 10 + 10 // DEFAULT height
        ],
        'fill-extrusion-base': floor * 10
      },
      'filter': ["all",
        ['==', 'Level_M', floor],
        ['!=', 'Bound_t', 1],
      ]
    });


    /**
     * DOOR LAYER
     */
    this.map.addLayer({
      'id': 'vankovka-door-layer',
      'source': 'indoor-boundaries',
      "type": "fill-extrusion",
      "line-join": "miter",
      "line-cap": "square",
      "paint": {
        "fill-extrusion-color": ["rgb", 245, 162, 122],
        "fill-extrusion-opacity": 0.7,
        'fill-extrusion-height': floor * 10 + 8,
        'fill-extrusion-base': floor * 10
      },
      'filter': ["all",
        ['==', 'Level_M', floor],
        ['==', 'Bound_t', 1],
      ]
    });


    this.map.addLayer(this.customLayer);



  }



}
