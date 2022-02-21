"use strict";

//Instantiate a map at some selector.

class LeafletMap {
    constructor() {
        this.init();
    }

    setSpeed(speed=11.176) {
        this.speed = speed;
        this.throttle = 1.0 / (this.speed * 0.001);
    }
    
    init(selector="#map") {
        this.counter = 0;
        this.lastTime;
        this.speedLimit = 11.176;
        this.penalties = {
            speed: {
                raw: 0,
                scale: 5
            },
            weave: {
                raw: [],
                avg: null,
                std: null,
                scale: 10
            },
            lane: {
                raw: [],
                avg: null,
                std: null,
                scale: 3
            },
            penalty: {
                total: null,
                scale: 5
            },
            score: null
        }

        mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuY29keW9za2kiLCJhIjoiY2s1c2s0Y2JmMHA2bzNrbzZ5djJ3bDdscyJ9.7MuHmoSKO5zAgY0IKChI8w';
const map = new mapboxgl.Map({
style: 'mapbox://styles/mapbox/satellite-v9',
center: [-83.066755, 42.356067],
zoom: 18,
pitch: 70,
bearing: -115,
container: 'map',
antialias: true
});
 
map.on('load', () => {

    map.loadImage(
        'car.png', 
        (error, image) => {
            if (error) throw error;
 
            // Add the image to the map style.
            map.addImage('carCsc', image);
        }
    );

this.loadKMLs();
});

this.map = map;
    }

    getMap() {
        return this.map;
    }

    newMap() {
        this.map.off();
        this.map.remove();
        this.init();

    }


    stepLineSegments(right, left) {
        const pathr = [];
        const pathl = [];
        const steps = 522;


        for (let i = 0; i < steps; i += 1) {
            pathr.push(turf.along(right.features[0], i/1000).geometry.coordinates);
            pathl.push(turf.along(left.features[0], i/1000).geometry.coordinates);

        }
        right.features[0].geometry.coordinates = pathr;
        left.features[0].geometry.coordinates = pathl;

    }

    loadKMLs() {

        // this.map.addSource('driving-path', {
        //     type: 'geojson',
        //     // Use a URL for the value for the `data` property.
        //     data: '/kml/driving.geojson'
        //     });

        this.leftLaneGeoJson = {
            "type": "FeatureCollection",
            "name": "Left Lane",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": [
            { "type": "Feature", "properties": { "Name": "Left Lane", "description": null, "tessellate": 1 }, "geometry": { "type": "LineString", "coordinates": [ [ -83.066798998594749, 42.356037482371711 ], [ -83.072660363971622, 42.354200985714023 ] ] } }
            ]
            }
            ;
        this.rightLaneGeoJson = {
            "type": "FeatureCollection",
            "name": "Right Lane",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": [
            { "type": "Feature", "properties": { "Name": "Right Lane", "description": null, "tessellate": 1 }, "geometry": { "type": "LineString", "coordinates": [ [ -83.066827204821223, 42.356068357747809 ], [ -83.072678168517911, 42.354225002577422 ] ] } }
            ]
            }
            ;
        this.stepLineSegments(this.rightLaneGeoJson, this.leftLaneGeoJson);

        this.map.addSource('left-lane', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: 'kml/left.geojson'
            });

        this.map.addSource('right-lane', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: 'kml/right.geojson'
            });

        const layerNames = ['left-lane', 'right-lane'];

        layerNames.forEach((name) => {
            const settings = {
                id: name, 
                type: 'line',
                source: name,
                paint: {
                    'line-color': name.includes("lane") ? '#eb4034' : '#41e82e',
                    'line-width': 3
                }

            };

            this.map.addLayer(settings);
        });

        this.drivingPath = {
            "type": "FeatureCollection",
            "name": "Driving",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": [
            { "type": "Feature", "properties": { "Name": "Driving", "description": null, "tessellate": 1 }, "geometry": { "type": "LineString", "coordinates": [ [ -83.066834003260098, 42.356055029082917 ], [ -83.066922139565861, 42.356023660742373 ], [ -83.067000826114565, 42.35599515726372 ], [ -83.067073078600089, 42.355973681395277 ], [ -83.0671480381138, 42.355945165908658 ], [ -83.06724698055659, 42.355917060857557 ], [ -83.067322731074881, 42.35589552472613 ], [ -83.067378261164592, 42.355870054124821 ], [ -83.067441084092721, 42.355855608427873 ], [ -83.06750546131066, 42.355834567215751 ], [ -83.067576232401237, 42.355810640929633 ], [ -83.067636423767738, 42.355792265990033 ], [ -83.067708136261103, 42.355769501195809 ], [ -83.067794472793651, 42.355737561917252 ], [ -83.067864770565535, 42.355718731003662 ], [ -83.067952764251928, 42.35569470111357 ], [ -83.068056523547725, 42.35566086964964 ], [ -83.068154689238796, 42.355627434221617 ], [ -83.068243069017711, 42.355601418741841 ], [ -83.06836428846654, 42.355565036979243 ], [ -83.068502600990982, 42.355522752998091 ], [ -83.068578756348401, 42.355494953434018 ], [ -83.068690555273534, 42.355466707474797 ], [ -83.068747218496242, 42.355444979734933 ], [ -83.068852426146108, 42.355413579684118 ], [ -83.06891133186339, 42.355394547457522 ], [ -83.068973930902544, 42.35537431080445 ], [ -83.069028995469978, 42.3553574205676 ], [ -83.069422394830283, 42.355233804570709 ], [ -83.069479030918842, 42.355217119806213 ], [ -83.069539697896403, 42.355198186612128 ], [ -83.069609754156659, 42.355173286522728 ], [ -83.069651911107769, 42.355161473829362 ], [ -83.069697214984572, 42.355147781996443 ], [ -83.069771652467779, 42.355124670657048 ], [ -83.06984564641057, 42.355101873268481 ], [ -83.0699201037786, 42.35507710321756 ], [ -83.069999060321905, 42.355051879859751 ], [ -83.070056536480649, 42.355030638328259 ], [ -83.070128091435066, 42.355012106482057 ], [ -83.070185688648479, 42.354991571969947 ], [ -83.070289330210599, 42.354959085796082 ], [ -83.070376705453896, 42.354933390627288 ], [ -83.070443482408123, 42.354915121794122 ], [ -83.070547102333435, 42.354879679502353 ], [ -83.070664719913594, 42.354842839302023 ], [ -83.070770063823829, 42.354810560233801 ], [ -83.070869300277721, 42.354776293198491 ], [ -83.070942548654472, 42.354759135942373 ], [ -83.071057626856714, 42.354725915281037 ], [ -83.071128389753895, 42.354699625026633 ], [ -83.071189241398898, 42.354682082153417 ], [ -83.071259582593086, 42.354658367176206 ], [ -83.07132689605686, 42.354638168840552 ], [ -83.071378652256399, 42.354622916184198 ], [ -83.07142991318085, 42.354606895983743 ], [ -83.071502673044364, 42.354584166406767 ], [ -83.071550096979479, 42.354569351501532 ], [ -83.07159219073759, 42.354554359405078 ], [ -83.071668150063402, 42.354526605867399 ], [ -83.071746401222086, 42.354506130718967 ], [ -83.071831368653363, 42.354480401409582 ], [ -83.071881677645891, 42.354460605773149 ], [ -83.071959957695071, 42.354433843756787 ], [ -83.072010029325114, 42.354419250756152 ], [ -83.07205751543205, 42.354404389955931 ], [ -83.072120624278881, 42.354383932206282 ], [ -83.072178811306998, 42.354363202828488 ], [ -83.072271848412882, 42.354335001361846 ], [ -83.072341651605228, 42.354313331051443 ], [ -83.072433614129253, 42.35428754401098 ], [ -83.072497655064026, 42.354267363479067 ], [ -83.072582929474692, 42.354242339720123 ], [ -83.072658544376196, 42.354215718029003 ] ] } }
            ]
            };

            this.map.addSource('driving-path', {
                'type': 'geojson',
                'data': this.drivingPath
                });

            this.map.addLayer({
                'id': 'driving-path',
                'source': 'driving-path',
                'type': 'line',
                'paint': {
                'line-width': 4,
                'line-color': '#41e82e'
                }
                });
                    
        // console.log(this.drivingPath);
    }

    setAnimatedMarker() {
        const begin = [ -83.066834003260098, 42.356055029082917 ];
        const end = [ -83.072658544376196, 42.354215718029003 ];
        // const d = turf.length(this.drivingPath.features[0]);

        const path = [];
        const steps = 522;

        for (let i = 0; i < steps; i += 1) {
            const segment = turf.along(this.drivingPath.features[0], i/1000);
            path.push(segment.geometry.coordinates);
        }

        this.drivingPath.features[0].geometry.coordinates = path;

         this.point = {
            'type': 'FeatureCollection',
            'features': [
            {
            'type': 'Feature',
            'properties': {},
            'geometry': {
            'type': 'Point',
            'coordinates': begin
            }
            }
            ]
            };
            const point = this.point;

            this.map.addSource('point', {
                'type': 'geojson',
                'data': point
                });

                this.map.addLayer({
                    'id': 'point',
                    'source': 'point',
                    'type': 'symbol',
                    'layout': {
                    // This icon is a part of the Mapbox Streets style.
                    // To view all images available in a Mapbox style, open
                    // the style in Mapbox Studio and click the "Images" tab.
                    // To add a new image to the style at runtime see
                    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                    'icon-image': 'carCsc',
                    'icon-rotate': ['get', 'bearing'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    'icon-size': 0.03
                    }
                    });

        // this.drivingPath.features[0].geometry.coordinates = path;
        
        this.animate();
        // this.intervalID = setInterval(() => requestAnimationFrame(() => this.animate()),this.throttle);
        for(let z = 0; z < 522; z++) {
            setTimeout(() => requestAnimationFrame(() => this.animate()), this.throttle * z);
        }

    }

    speedPenalty() {
        if(this.speed <= (this.speedLimit + 10)) {
            return 0;
        }
        return this.speed - (this.speedLimit + 10);
    }

    weavePenalty(end=true) {
        const raw = this.penalties.weave.raw;
        const new_raw = [];
        for(let i = 2; i < raw.length; i++) {
            const s2 = raw[i-2];
            const s1 = raw[i-1];
            const avg = (s1 + s2) / 2;
            const diff = raw[i] - avg;
            if(Math.abs(diff) <= 0.25) {
                new_raw.push(0);
            } else {
                new_raw.push(diff);
            }
        }

        if(!end) {
            return new_raw;
        } else {
            this.penalties.weave.raw = new_raw;
        }
        
    }

    lanePenalty(distance) {
        if(Math.abs(distance) <= 0.5) {
            return distance;
        } else if(distance > 0.5) {
            return distance + 5;
        } else if(distance < -0.5) {
            return distance - 5;
        }
    }

    scorePenalties() {
        
        var [m, s] = this.stats(this.penalties.lane.raw);
        this.penalties.lane.avg = m;
        this.penalties.lane.std = s;

        [m, s] = this.stats(this.penalties.weave.raw);
        this.penalties.weave.avg = m;
        this.penalties.weave.std = s;


        const penalty = (this.penalties.lane.scale*this.penalties.lane.avg) + (this.penalties.lane.scale*this.penalties.lane.std)
                        +(this.penalties.weave.scale*this.penalties.weave.avg) + (this.penalties.weave.scale*this.penalties.weave.std)
                        +this.penalties.speed.raw*this.penalties.speed.scale;
        this.penalties.penalty.total = penalty;

        const score = 100 * (522 / 522) * (this.penalties.penalty.scale / (this.penalties.penalty.scale + penalty));
        this.penalties.score = score;
        document.getElementById("update-me").textContent = score;
        return score;

    }

    stats(array) { // https://stackoverflow.com/questions/7343890/standard-deviation-javascript/53577159#53577159
        //Thought there was a stdlib version, but I guess not...
        const n = array.length
        const mean = array.reduce((a, b) => a + b) / n
        const std = Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
        return [mean, std]
    }



    pushPenalties(left_dist, right_dist, lane_size) {
        const center_dist = lane_size / 2;
        const left = Math.abs(left_dist - center_dist);
        const right = Math.abs(right_dist - center_dist);
        const closest = (left < right) ? left_dist - center_dist : right_dist - center_dist;

        this.penalties.speed.raw += this.speedPenalty();
        this.penalties.weave.raw.push(closest)
        this.penalties.lane.raw.push(this.lanePenalty(closest / lane_size))
    }
    
    animate(timestamp) {

        const steps = 522;
        if(this.counter > steps) { return; }
        // console.log(this.drivingPath);
        const start =
        this.drivingPath.features[0].geometry.coordinates[
        this.counter >= steps ? this.counter - 1 : this.counter
        ];
        const end =
        this.drivingPath.features[0].geometry.coordinates[
        this.counter >= steps ? this.counter : this.counter + 1
        ];
        if (!start || !end) {
            return;
        };

        
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        this.point.features[0].geometry.coordinates =
        this.drivingPath.features[0].geometry.coordinates[this.counter];
        this.point.features[0].properties.bearing = turf.bearing(
            turf.point(start),
            turf.point(end)
            );
        
        const lane_size = turf.distance(this.leftLaneGeoJson.features[0].geometry.coordinates[this.counter], this.rightLaneGeoJson.features[0].geometry.coordinates[this.counter]) * 1000;
        const [left_dist, right_dist] = [turf.pointToLineDistance(this.point.features[0].geometry.coordinates, this.leftLaneGeoJson.features[0])*1000, turf.pointToLineDistance(this.point.features[0].geometry.coordinates, this.rightLaneGeoJson.features[0])*1000];
        this.pushPenalties(left_dist, right_dist, lane_size);
        
        // Update the source with this new data
        this.map.getSource('point').setData(this.point);
        
        this.counter += 1;
        if(this.counter > 4) {
            const temp = this.weavePenalty(false);
            const old = this.penalties.weave.raw;
            this.penalties.weave.raw = temp;
            const score = this.scorePenalties();
            this.penalties.weave.raw = old;
        }
    };
}

