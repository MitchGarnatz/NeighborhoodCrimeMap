<script>
import $ from 'jquery'
import About from './components/About.vue';
import NewIncident from './components/NewIncident.vue';

//npm run dev -- --port 8000    <-to run the server
//npm run build                 <-to make the actual files we will turn in
//------------------------TODO-------------------------------------------------------
//Clamp input values if lat/long is outside of St. Paul's bounding box
//Marker should have popup to show the number of crimes committed in that neighborhood
//Incident upload and Bio stuff idk how far yall got
//Create UI controls to filter crime data - In progress by mitch
//Style the background color of rows in the table to categorize crimes as "violent crimes" (crimes against another person),
// "property crimes" (crimes against a person's or business' property), or "other crimes" (anything else)
//Add a 'delete' button for each crime in the table
//Add a marker to the map at exact crime location when selected from the table

export default {
    data() {
        return {
            view: 'map',
            lookup: '',
            current_lookup_marker: null,
            checkedIncidents: [],
            checkedNeighborhoods: [],
            codes: [],
            neighborhoods: [],
            incidents: [],
            args: [], //Dont know if we will need this to be global but i figured it wouldn't hurt. Currently just stores what neighborhoods numbers to include in table.
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
                    //Includes number so it can be used to filter
                    {location: [44.942068, -93.020521], number: 1, marker: "Conway/Battlecreek/Highwood"},
                    {location: [44.977413, -93.025156], number: 2, marker: "Greater East Side"},
                    {location: [44.931244, -93.079578], number: 3, marker: "West Side"},
                    {location: [44.956192, -93.060189], number: 4, marker: "Dayton's Bluff"},
                    {location: [44.978883, -93.068163], number: 5, marker: "Payne/Phalen"},
                    {location: [44.975766, -93.113887], number: 6, marker: "North End"},
                    {location: [44.959639, -93.121271], number: 7, marker: "Thomas/Dale(Frogtown)"},
                    {location: [44.947700, -93.128505], number: 8, marker: "Summit/University"},
                    {location: [44.930276, -93.119911], number: 9, marker: "West Seventh"},
                    {location: [44.982752, -93.147910], number: 10, marker: "Como"},
                    {location: [44.963631, -93.167548], number: 11, marker: "Hamline/Midway"},
                    {location: [44.973971, -93.197965], number: 12, marker: "St. Anthony"},
                    {location: [44.949043, -93.178261], number: 13, marker: "Union Park"},
                    {location: [44.934848, -93.176736], number: 14, marker: "Macalester-Groveland"},
                    {location: [44.913106, -93.170779], number: 15, marker: "Highland"},
                    {location: [44.937705, -93.136997], number: 16, marker: "Summit Hill"},
                    {location: [44.949203, -93.093739], number: 17, marker: "Capitol River"}
                ]
            }
        };
    },
    components: {
        About,
        NewIncident
    },
    methods: {
        PopulateTable(){ //Makes request to server to get incidents. Checks bounds of map to see what neighborhoods to include. 
            let bounds = this.leaflet.map.getBounds();
            console.log(bounds);
            this.leaflet.neighborhood_markers.forEach(element =>{
                if(element.location[0] > bounds._southWest.lat && element.location[0] < bounds._northEast.lat){
                    if(element.location[1] > bounds._southWest.lng && element.location[1] < bounds._northEast.lng){
                        this.args.push(element.number);
                    }
                }
            })
            let url = 'http://localhost:8888/incidents?';
            if (this.args != []){
                url = url + 'neighborhood='
                this.args.forEach(element=>{
                    url = url + element + ',';
                })
            }
            this.getJSON(url).then((data)=>{
                this.incidents = data;
                console.log(data);
            }).catch((err)=>{
                console.log(err);
            })
            this.args = [];
        },
        PlaceMarkers(){ //Places markers on all of the neighborhoods
            this.leaflet.neighborhood_markers.forEach(element =>{
            let mark = new L.Marker(element.location,{title: element.marker, clickable: true}).addTo(this.leaflet.map);
            mark.bindPopup("This is the Transamerica Pyramid").openPopup();
            
        })
        },
        Locate(){ //Takes the center of the current map view and tries to place marker as close as possible.
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
        
        this.PlaceMarkers();

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
        this.leaflet.map.on('dragend', ()=> { //Updtaes map with center address and what neighborhoods to include in the table
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
            this.PopulateTable();
            
        });

        this.leaflet.map.on('zoomend', ()=> { //Updtaes map with center address and what neighborhoods to include in the table
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
            this.PopulateTable();
        });

        this.getJSON('http://localhost:8888/neighborhoods').then((data)=>{ //Populates neighborhoods list. Should only need to do this once.
            this.neighborhoods = data;
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        })
        this.PopulateTable();
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

                <div>Checked Incident Types: {{ checkedIncidents }}
                    <input type="checkbox" id="Homicide" value=100 v-model="checkedIncidents" />
                    <label for="Homicide">Homicide</label>
                
                    <input type="checkbox" id="Murder" value=120 v-model="checkedIncidents" />
                    <label for="Murder">Murder</label>

                </div>
                
                <!--The table of incidents. No idea what data he wants in it this is the bare minimum. 
                    Remove 2nd neighbohood when all done, just shows neighborhood number for now-->
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



