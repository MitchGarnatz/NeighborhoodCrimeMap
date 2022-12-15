<script>
import $ from 'jquery'
import About from './components/About.vue';
import NewIncident from './components/NewIncident.vue';

//npm run dev -- --port 8000    <-to run the server
//npm run build                 <-to make the actual files we will turn in
//------------------------TODO-------------------------------------------------------
//Clamp input values if lat/long is outside of St. Paul's bounding box
//Only show crimes that occurred in neighborhoods visible on the map
//HINT: get lat/long coordinates for the NW and SE corners of the map to use as the min/max lat/long coordinates
//Draw markers on the map for each neighborhood
//Marker should have popup to show the number of crimes committed in that neighborhood
//Incident upload and Bio stuff idk how far yall got
//

export default {
    data() {
        return {
            view: 'map',
            lookup: '',
            current_lookup_marker: null,
            codes: [],
            neighborhoods: [],
            incidents: [],
            leaflet: {
                map: null,
                center: {
                    lat: 44.955139,
                    lng: -93.102222,
                    address: ""
                },
                zoom: 12,
                bounds: {
                    nw: {lat: 45.008206, lng: -93.217977},
                    se: {lat: 44.883658, lng: -92.993787}
                },
                neighborhood_markers: [
                    {location: [44.942068, -93.020521], marker: "Conway/Battlecreek/Highwood"},
                    //{location: [44.942068, -93.020521], marker: new L.Marker([44.942068,-93.020521],{ title: "MyLocation", clickable: true})},
                    {location: [44.977413, -93.025156], marker: "Greater East Side"},
                    {location: [44.931244, -93.079578], marker: "Westside"},
                    {location: [44.956192, -93.060189], marker: "Dayton's Bluff"},
                    {location: [44.978883, -93.068163], marker: "Payne/Phalen"},
                    {location: [44.975766, -93.113887], marker: "North End"},
                    {location: [44.959639, -93.121271], marker: "Thomas/Dale(Frogtown)"},
                    {location: [44.947700, -93.128505], marker: "Summit/University"},
                    {location: [44.930276, -93.119911], marker: "West Seventh"},
                    {location: [44.982752, -93.147910], marker: "Como"},
                    {location: [44.963631, -93.167548], marker: null},
                    {location: [44.973971, -93.197965], marker: null},
                    {location: [44.949043, -93.178261], marker: null},
                    {location: [44.934848, -93.176736], marker: null},
                    {location: [44.913106, -93.170779], marker: null},
                    {location: [44.937705, -93.136997], marker: null},
                    {location: [44.949203, -93.093739], marker: null}
                ]
            }
        };
    },
    components: {
        About,
        NewIncident
    },
    methods: {
        Locate(){
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            
            let url = 'https://nominatim.openstreetmap.org/search?q=' + this.lookup +
              '&format=json&limit=25&accept-language=en';
              this.getJSON(url)
              .then((data)=>{
                this.current_marker = new L.Marker([data[0].lat,data[0].lon]);
                this.current_marker.addTo(this.leaflet.map);
                this.leaflet.map.setView([data[0].lat, data[0].lon], 15);
                
                console.log(data);
              })
            this.lookup = '';
        }, 

        viewMap(event) {
            this.view = 'map';
        },

        viewNewIncident(event) {
            this.view = 'new_incident';
        },

        viewAbout(event) {
            this.view = 'about';
        },

        getJSON(url) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    dataType: 'json',
                    url: url,
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        reject({status: status.status, message: status.statusText});
                    }
                });
            });
        },

        uploadJSON(method, url, data) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: method,
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'text',
                    success: (response) => {
                        resolve(response);
                    },
                    error: (status, message) => {
                        reject({status: status.status, message: status.statusText});
                    }
                });
            });
        }
    },
    mounted() {
        this.leaflet.map = L.map('leafletmap').setView([this.leaflet.center.lat, this.leaflet.center.lng], this.leaflet.zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 11,
            maxZoom: 18
        }).addTo(this.leaflet.map);
        this.leaflet.map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);
        
        
        
        let mark = new L.Marker([44.982752, -93.147910]);
        mark.addTo(this.leaflet.map)




        let district_boundary = new L.geoJson();
        district_boundary.addTo(this.leaflet.map);

        this.getJSON('/data/StPaulDistrictCouncil.geojson').then((result) => {
            // St. Paul GeoJSON
            $(result.features).each((key, value) => {
                district_boundary.addData(value);
            });
        }).catch((error) => {
            console.log('Error:', error);
        });
        this.leaflet.map.on('dragend', ()=> {
            console.log(this.leaflet.map.getCenter());
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + this.leaflet.map.getCenter().lat + '&lon=' + this.leaflet.map.getCenter().lng+"&format=json";
              this.getJSON(url)
              .then((data)=>{
                console.log(data);
                this.current_marker = new L.Marker([data.lat,data.lon]);
                this.current_marker.addTo(this.leaflet.map);
                this.leaflet.map.setView([data.lat, data.lon]);
                this.lookup = data.display_name;
                console.log(data);
              })
              .catch((error) => {
                console.log('Error:', error);
            });
        });

        this.leaflet.map.on('zoomend', ()=> {
            console.log(this.leaflet.map.getCenter());
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + this.leaflet.map.getCenter().lat + '&lon=' + this.leaflet.map.getCenter().lng+"&format=json";
              this.getJSON(url)
              .then((data)=>{
                console.log(data);
                this.current_marker = new L.Marker([data.lat,data.lon]);
                this.current_marker.addTo(this.leaflet.map);
                this.leaflet.map.setView([data.lat, data.lon]);
                this.lookup = data.display_name;
                console.log(data);
              })
              .catch((error) => {
                console.log('Error:', error);
            });
        });

        this.getJSON('http://localhost:8888/incidents').then((data)=>{
            this.incidents = data;
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        })

        this.getJSON('http://localhost:8888/neighborhoods').then((data)=>{
            this.neighborhoods = data;
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        })

    }
}
</script>

<template>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <p :class="'cell small-4 ' + ((view === 'map') ? 'selected' : 'unselected')" @click="viewMap">Map</p>
            <p :class="'cell small-4 ' + ((view === 'new_incident') ? 'selected' : 'unselected')" @click="viewNewIncident">New Incident</p>
            <p :class="'cell small-4 ' + ((view === 'about') ? 'selected' : 'unselected')" @click="viewAbout">About</p>
        </div>
    </div>
    <div v-show="view === 'map'">
        <div class="grid-container">
            <div class="grid-x grid-padding-x">

                <div id="leafletmap" class="cell auto"></div>
                
                <div class = "cell 12">
                    
                    <form @submit.prevent="Locate">
                        <input v-model="lookup" placeholder="Hamline" style="width: 1000px">
                        
                        <input class="button" type="submit" value="GO"> 
                    </form>
                    
                    
                </div>
                
                <table class="cell small-12" style = "border:2px solid">
                    <tr style = "border:2px solid">
                        <td>Case Number</td>
                        <td>Date</td>
                        <td>Type Of Incident</td>
                        <td>Neighborhood</td>
                        <td>Neighborhood</td>
                    </tr>
                    <tr v-for="incident in incidents">
                        <td>{{incident.case_number}}</td>
                        <td>{{incident.date}}</td>
                        <td>{{incident.incident}}</td>
                        <td>{{neighborhoods[incident.neighborhood_number-1].neighborhood_name}}</td>
                        <td>{{incident.neighborhood_number}}</td>
                    </tr>
                </table>   
            </div>
            
        </div>
    </div>
    <div v-if="view === 'new_incident'">
        <NewIncident />
    </div>
    <div v-if="view === 'about'">
        <About />
    </div>


</template>

<style>
#leafletmap {
    height: 500px;
}

.selected {
    background-color: rgb(10, 100, 126);
    color: white;
    border: solid 1px white;
    text-align: center;
    cursor: pointer;
}
.unselected {
    background-color: rgb(200, 200, 200);
    color: black;
    border: solid 1px white;
    text-align: center;
    cursor: pointer;
}
</style>



