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
            narcotic: false,
            property: false,
            violent: false,
            north: false,
            east: false,
            central: false,
            west: false,
            start_date: "2014-08-14",
            end_date: "2022-05-31",
            max_result: 1000,

            selected1: 'select a year',
            options1: [
                { text: 'Year', value: 'select a year'},
                { text: '2014', value: '2014' },
                { text: '2015', value: '2015' },
                { text: '2016', value: '2016' },
                { text: '2015', value: '2017' },
                { text: '2016', value: '2018' }
            ],

            selected2: 'select a month',
            options2: [
                { text: 'Month', value: 'select a month'},
                { text: '2014', value: '2014' },
                { text: '2015', value: '2015' },
                { text: '2016', value: '2016' },
                { text: '2015', value: '2017' },
                { text: '2016', value: '2018' }
            ],

            selected3: 'select a day',
            options3: [
                { text: 'Day', value: 'select a day'},
                { text: '2014', value: '2014' },
                { text: '2015', value: '2015' },
                { text: '2016', value: '2016' },
                { text: '2015', value: '2017' },
                { text: '2016', value: '2018' }
            ],
            codes: [],
            neighborhoods: [],
            incidents: [],
            args: [], //Dont know if we will need this to be global but i figured it wouldn't hurt. Currently just stores what neighborhoods numbers to include in table.
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

        FilterList(){
            let newList = [];
            if (this.violent || this.property || this.narcotic || this.east || this.west || this.central) {
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
                    else if(this.east && element.neighborhood_number > 0 && element.neighborhood_number < 6){
                        newList.push(element);
                    }
                    else if (this.central && element.neighborhood_number > 5 && element.neighborhood_number < 10 || this.central && element.neighborhood_number === 17) {
                        newList.push(element);
                    }
                    else if (this.west && element.neighborhood_number > 9 && element.neighborhood_number < 17){
                        newList.push(element);
                    }
                })
            }
            else {
                newList = this.incidents;
            }
            return newList;
        },
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
            console.log(this.start_date);
            let url = 'http://localhost:8888/incidents?start_date='+this.start_date+"&end_date="+this.end_date+"&limit="+this.max_result;
            if (this.args != []){
                url = url + '&neighborhood='
                this.args.forEach(element=>{
                    url = url + element + ',';
                })
            }
            console.log(url);
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
        },

        onSubmit(submitData) {
            // this method will store the new incident data from the NewIncident child component for use in uploadJSON
            this.NewIncidentData = submitData;
            alert(JSON.stringify(this.NewIncidentData));
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

                <div class = "cell 12">
                    <input type="checkbox" id="Violent Crimes" v-model="violent" />
                    <label for="Violent Crimes">Violent Crimes</label>
                    {{violent}}
                    <input type="checkbox" id="Property Crimes" v-model="property" />
                    <label for="Property Crimes">Property Crimes</label>
                    {{property}}
                    <input type="checkbox" id="Narcotics Crimes" v-model="narcotic" />
                    <label for="Narcotics Crimes">Narcotics Crimes</label>
                    {{narcotic}}
                </div>

                <div class = "cell 12">
                    <input type="checkbox" id="East" value=false v-model="east" />
                    <label for="East">East</label>
                    {{east}}
                    <input type="checkbox" id="Central" value=false v-model="central" />
                    <label for="Central">Central</label>
                    {{central}}
                    <input type="checkbox" id="West" value=false v-model="west" />
                    <label for="West">West</label>
                    {{west}}
                </div>
                
                    <input v-model="max_result" placeholder="Max Number of Results">
                    <input class="cell small-4" type="date" name="Start-Date" v-model="start_date" min="2014-08-14" max="2022-05-31">
                    <input class="cell small-4" type="date" name="End-Date" v-model="end_date" min="2014-08-14" max="2022-05-31">
                    <button class="button cell small-4" @click="PopulateTable">Apply Filters</button>
                
                <!--<select v-model="selected1">
                    <option v-for="option in options1" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
                <select v-model="selected2">
                    <option v-for="option in options2" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
                <select v-model="selected3">
                    <option v-for="option in options3" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>-->

	            <div>Selected: {{ selected }}</div>
                
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
                    </tr>
                    <tr v-for="incident in FilterList()">
                        <td>{{incident.case_number}}</td>
                        <td>{{incident.date}}</td>
                        <td>{{incident.incident}}</td>
                        <td>{{neighborhoods[incident.neighborhood_number-1].neighborhood_name}}</td>
                        <td>{{incident.neighborhood_number}}</td>
                        <td>{{incident.code}}</td>
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
</style>



