<script>
import $ from 'jquery'
import About from './components/About.vue';
import NewIncident from './components/NewIncident.vue';

//npm run dev -- --port 8000    <-to run the server
//npm run build                 <-to make the actual files we will turn in
//------------------------TODO-------------------------------------------------------
//Clamp input values if lat/long is outside of St. Paul's bounding box
//Incident upload and Bio stuff idk how far yall got
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
            narcotic: false,
            property: false,
            violent: false,
            start_date: "2014-08-14",
            end_date: "2022-05-31",
            max_result: 1000,
            currentHoodMarkers: null,
            greenIcon: null,
            NeighborhoodLayer: null,
            codes: [],
            neighborhoods: [],
            neighborhood_popups: [],
            neighborhood_stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            incidents: [],
            args: [], //Dont know if we will need this to be global but i figured it wouldn't hurt.
            NewIncidentData: null,
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
                    {location: [44.942068, -93.020521], include: true, number: 1, marker: "Conway/Battlecreek/Highwood"},
                    {location: [44.977413, -93.025156], include: true, number: 2, marker: "Greater East Side"},
                    {location: [44.931244, -93.079578], include: true, number: 3, marker: "West Side"},
                    {location: [44.956192, -93.060189], include: true, number: 4, marker: "Dayton's Bluff"},
                    {location: [44.978883, -93.068163], include: true, number: 5, marker: "Payne/Phalen"},
                    {location: [44.975766, -93.113887], include: true, number: 6, marker: "North End"},
                    {location: [44.959639, -93.121271], include: true, number: 7, marker: "Thomas/Dale(Frogtown)"},
                    {location: [44.947700, -93.128505], include: true, number: 8, marker: "Summit/University"},
                    {location: [44.930276, -93.119911], include: true, number: 9, marker: "West Seventh"},
                    {location: [44.982752, -93.147910], include: true, number: 10, marker: "Como"},
                    {location: [44.963631, -93.167548], include: true, number: 11, marker: "Hamline/Midway"},
                    {location: [44.973971, -93.197965], include: true, number: 12, marker: "St. Anthony"},
                    {location: [44.949043, -93.178261], include: true, number: 13, marker: "Union Park"},
                    {location: [44.934848, -93.176736], include: true, number: 14, marker: "Macalester-Groveland"},
                    {location: [44.913106, -93.170779], include: true, number: 15, marker: "Highland"},
                    {location: [44.937705, -93.136997], include: true, number: 16, marker: "Summit Hill"},
                    {location: [44.949203, -93.093739], include: true, number: 17, marker: "Capitol River"}
                ]
            }
        };
    },
    components: {
        About,
        NewIncident
    },
    methods: {
        statusColor(codeNumber){
            if(codeNumber > 99 && codeNumber < 454){ 
                return '#FFCCCB'; 
            } 
            if(codeNumber > 499 && codeNumber < 1437){ 
                return '#FFD580'; 
            } 
            if(codeNumber > 1799 && codeNumber < 9987){ 
                return '#FFFF99'; 
            } else { 
                return 'white'; 
            }
        },

        FilterList(){
            let newList = [];
            if (this.violent || this.property || this.narcotic ) {
                this.incidents.forEach(element => {
                    if(this.violent && element.code > 99 && element.code < 454){
                        newList.push(element);
                    }
                    else if (this.property && element.code > 499 && element.code < 1437){
                        newList.push(element);
                    }
                    else if (this.narcotic && element.code > 1799 && element.code < 9987){
                        newList.push(element);
                    }
                    
                })
            }
            else {
                newList = this.incidents;
            }
            return newList;
        },
        CheckHoodBounds(){
            let bounds = this.leaflet.map.getBounds();
            this.leaflet.neighborhood_markers.forEach(element =>{
                if( element.location[0] > bounds._southWest.lat &&
                    element.location[0] < bounds._northEast.lat &&
                    element.location[1] > bounds._southWest.lng &&
                    element.location[1] < bounds._northEast.lng){
                        element.include = true;
                    } else {
                        element.include = false;
                    }
            })
        },
        PopulateTable(){ //Makes request to server to get incidents. Checks bounds of map to see what neighborhoods to include. 
            
            console.log("start date: ", this.start_date);
            let url = 'http://localhost:8888/incidents?start_date='+this.start_date+"&end_date="+this.end_date+"&limit="+this.max_result;
                url = url + '&neighborhood='
                this.leaflet.neighborhood_markers.forEach(element=>{
                    if(element.include){url = url + element.number + ',';}
                })
            
            console.log("API GET request:", url);
            this.getJSON(url)
            .then((data)=>{
                this.incidents = data;
                this.neighborhood_stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                data.forEach(element=>{
                    let n = element.neighborhood_number-1;
                    this.neighborhood_stats[n] += 1;
                });
                this.UpdateNeighborhoodPopups();
                console.log('incidents: ', data);
            }).catch((err)=>{
                console.log(err);
            })
            this.args = [];
        },
        Locate(){ //Takes the center of the current map view and tries to place marker as close as possible.
            let url = 'https://nominatim.openstreetmap.org/search?q=' + this.lookup +
              '&format=json&limit=25&accept-language=en';
              this.getJSON(url)
              .then((data)=>{
                if(data[0].lat > 45.008206 || data[0].lat < 44.883658 || data[0].lon < -93.217977 || data[0].lon > -92.993787){
                    console.log("NONONONNONONO");
                    window.alert("Outside of St.Paul");
                } else {
                    this.current_marker = new L.Marker([data[0].lat,data[0].lon]).addTo(this.leaflet.map);
                    this.leaflet.map.setView([data[0].lat, data[0].lon], 15);
                }
                console.log("DATA", data);
              })
            this.lookup = '';
        },
        DeleteInc(inc){
            console.log("DELETE: "+'http://localhost:8888/remove-incident?case_number=' + inc);
            this.uploadJSON('DELETE','http://localhost:8888/remove-incident?case_number=' + inc, { case_number:inc })
            .then(()=>{
                this.PopulateTable();
            })
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
        },
        onSubmit(submitData) {
            // this method will store the new incident data from the NewIncident child component for use in uploadJSON
            this.NewIncidentData = submitData;
            this.uploadJSON('PUT', 'http://localhost:8888/new-incident', this.NewIncidentData)
                .then( (data) => {
                    console.log('DATA: ', data);
                    this.PopulateTable();
                }).catch( (reason) => {
                    console.log(reason);
                });
        },
        UpdateNeighborhoodPopups(){
            console.log("update");
            this.leaflet.neighborhood_markers.forEach(element =>{
                this.neighborhood_popups[element.number-1]._popup.setContent(element.marker+ ": " + this.neighborhood_stats[element.number-1]+" crimes reported.");
            });
        },
        PlaceMarkers(){ //Places markers on all of the neighborhoods. Called ONCE now.
            this.leaflet.neighborhood_markers.forEach(element =>{
                let mark = new L.Marker(element.location,{title: element.marker, clickable: true});
                let label = element.marker+ ": " + this.neighborhood_stats[element.number-1]+" crimes reported.";
                mark.bindPopup(label);
                this.neighborhood_popups.push(mark);
            });
            this.currentHoodMarkers = L.layerGroup(this.neighborhood_popups);
            var BaseMap = {};
            var OverlayMap = {
                'NeighborhoodMarkers' : this.currentHoodMarkers
            };
            this.NeighborhoodLayer = L.control.layers(BaseMap,OverlayMap).addTo(this.leaflet.map);
            this.currentHoodMarkers.addTo(this.leaflet.map);
        },
        CreateIncidentMarker(inc){
            let greenIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
                });
                
            let url = 'https://nominatim.openstreetmap.org/search?q=';
            let string = inc.block.split(' ');

            if( /[0-9]/.test(string[0][0] )){
                let NewBlock = '';
                for(let i = 0; i<string[0].length; i++){
                    if(string[0][i] == 'X'){NewBlock = NewBlock + '0';}
                    else{NewBlock = NewBlock + string[0][i]}
                }
                string[0] = NewBlock;
                string.forEach(element => {
                    url = url + element + ' '
                })
                url = url + '&format=json&limit=25&accept-language=en';
            } else {
                url = 'https://nominatim.openstreetmap.org/search?q=' + inc.block +
                      '&format=json&limit=25&accept-language=en';
            }
            console.log('Creating marker at:' + url);
            this.getJSON(url)
            .then((data)=>{
                let IncMarker = new L.Marker([data[0].lat,data[0].lon],{icon: greenIcon}).addTo(this.leaflet.map);
                IncMarker.bindPopup('Date: ' + inc.date + '\nTime: '+ inc.time+ '\nIncident' + inc.incident);
                //'<button class="button" @click="DeleteInc(' + inc.case_number + ')">DELETE</button>'
            })
        }
    },
    mounted() {
        
        this.leaflet.map = L.map('leafletmap').setView([this.leaflet.center.lat, this.leaflet.center.lng], this.leaflet.zoom,);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 11,
            maxZoom: 18
        }).addTo(this.leaflet.map);
        this.leaflet.map.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

        let district_boundary = new L.geoJson();
        district_boundary.addTo(this.leaflet.map);
        this.PlaceMarkers();
        this.getJSON('/data/StPaulDistrictCouncil.geojson').then((result) => {
            // St. Paul GeoJSON
            $(result.features).each((key, value) => {
                district_boundary.addData(value);
            });
        }).catch((error) => {
            console.log('Error:', error);
        });
        this.leaflet.map.on('dragend', ()=> { //Updtaes map with center address and what neighborhoods to include in the table
            console.log("Center: ", this.leaflet.map.getCenter());
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            let templat = this.leaflet.map.getCenter().lat;
            let templng = this.leaflet.map.getCenter().lng;
            if(templat > 45.008206 || templat < 44.883658 || templng < -93.217977 || templng > -92.993787){
                    console.log("NONONONNONONO");
                    window.alert("Outside of St.Paul");
            } else {
                let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + templat + '&lon=' + templng+"&format=json";
              this.getJSON(url)
              .then((data)=>{
                console.log("nominatim data: ", data);
                this.current_marker = new L.Marker([data.lat,data.lon]);
                this.current_marker.addTo(this.leaflet.map);
                this.leaflet.map.setView([data.lat, data.lon]);
                this.lookup = data.display_name;
              })
              .catch((error) => {
                console.log('Error:', error);
            });
        }
            
            this.CheckHoodBounds();
            this.PopulateTable();
            

            console.log("crime stats: ", this.neighborhood_stats);
            
        });

        this.leaflet.map.on('zoomend', ()=> { //Updtaes map with center address and what neighborhoods to include in the table
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            console.log("Center: ", this.leaflet.map.getCenter());
            if(this.current_marker != null){
                this.leaflet.map.removeLayer(this.current_marker)
            }
            let templat = this.leaflet.map.getCenter().lat;
            let templng = this.leaflet.map.getCenter().lng;
            if(templat > 45.008206 || templat < 44.883658 || templng < -93.217977 || templng > -92.993787){
                    console.log("NONONONNONONO");
                    window.alert("Outside of St.Paul");
            } else {
                let url = 'https://nominatim.openstreetmap.org/reverse?lat=' + templat + '&lon=' + templng+"&format=json";
              this.getJSON(url)
              .then((data)=>{
                console.log("nominatim data: ", data);
                this.current_marker = new L.Marker([data.lat,data.lon]);
                this.current_marker.addTo(this.leaflet.map);
                this.leaflet.map.setView([data.lat, data.lon]);
                this.lookup = data.display_name;
              })
              .catch((error) => {
                console.log('Error:', error);
            });
        }
            this.CheckHoodBounds();
            this.PopulateTable();
        });

        this.getJSON('http://localhost:8888/neighborhoods').then((data)=>{ //Populates neighborhoods list. Should only need to do this once.
            this.neighborhoods = data;
            this.PopulateTable();
            console.log("neighborhoods: ", data);
        }).catch((err)=>{
            console.log(err);
        })
        //this.PlaceMarkers();
        //this.UpdateNeighborhoodPopups();
        //this.currentHoodMarkers.addTo(this.leaflet.map);
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


                
                <input class="cell small-3" v-model="max_result" placeholder="Max Number of Results">
                <input class="cell small-3" type="date" name="Start-Date" v-model="start_date" min="2014-08-14" max="2022-05-31">
                <input class="cell small-3" type="date" name="End-Date" v-model="end_date" min="2014-08-14" max="2022-05-31">
                <button class="button cell small-3" @click="PopulateTable">Apply Filters</button>
                    
                    <!--Creates a box for every neighborhood-->
                <ul style="list-style: none">
                    <li  class="cell small-3" v-for="neighborhood in leaflet.neighborhood_markers" >
                        <input type="checkbox" v-model="neighborhood.include">
                        {{neighborhood.marker}}
                    </li>
                </ul>

                <div class = "cell small-12">
                    <input type="checkbox" id="Violent Crimes" v-model="violent" />
                    <label for="Violent Crimes">Violent Crimes</label>
                    <input type="checkbox" id="Property Crimes" v-model="property" />
                    <label for="Property Crimes">Property Crimes</label>
                    <input type="checkbox" id="Narcotics Crimes" v-model="narcotic" />
                    <label for="Narcotics Crimes">Narcotics/Other Crimes</label>
                </div>


                <table class="cell small-12" style = "border:2px solid">
                    <th>Legend</th>
                    <tr style = "border:2px solid">
                        <td>
                            <dl>
                                <dt class="red"></dt>
                                <dd>Violent Crimes</dd>

                                <dt class="orange"></dt>
                                <dd>Proterty Crimes</dd>

                                <dt class="yellow"></dt>
                                <dd>Narcotic/Other Crimes</dd>
                            </dl>
                        </td>
                    </tr>
                </table>

                    <!--The table of incidents. No idea what data he wants in it this is the bare minimum. 
                    Remove 2nd neighbohood when all done, just shows neighborhood number for now-->

                <table class="cell small-12" style = "border:2px solid">
                    <tr style = "border:2px solid">
                        <td>Case Number</td>
                        <td>Date</td>
                        <td>Type Of Incident</td>
                        <td>Neighborhood</td>
                        <td>Neighborhood</td>
                        <td>Code</td>
                        <td>Show On Map</td>
                        <td>Delete</td>
                    </tr>
                    <tr v-for="incident in FilterList()" v-bind:style="{ 'background-color': statusColor(incident.code) }">
                        <td>{{incident.case_number}}</td>
                        <td>{{incident.date}}</td>
                        <td>{{incident.incident}}</td>
                        <td>{{neighborhoods[incident.neighborhood_number-1].neighborhood_name}}</td>
                        <td>{{incident.neighborhood_number}}</td>
                        <td>{{incident.code}}</td>
                        <td><button class="button" @click="CreateIncidentMarker(incident)">Show On Map</button></td>
                        <td><button class="button" @click="DeleteInc(incident.case_number)">DELETE</button></td>
                    </tr>
                </table>   
            </div>
        </div>
    </div>
    <div v-if="view === 'new_incident'">
        <NewIncident @submitted="onSubmit"/>
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
ul li{
    display: inline;
}
</style>



