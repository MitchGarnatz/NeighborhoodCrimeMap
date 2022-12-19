<script>

export default {
  name: "ToggleDiv",
  data: function () {
    return {
      isShowMitch: false,
      isShowMichael: false,
      isShowDavid: false,
    };
  },

  props: {
    msg: String,
  },
};

</script>


<template>

<div class="grid-container">
        <div class="grid-x">
            <div class="cell 12">
                <div class="headerBackground"><h1>About the Project!</h1></div>
                <img src="./images/st.paul.jpg" alt="no image" width="1500"/>  
            </div>
            

            <div class="cell 12">
                <h2 class="sectionBlue">Meet the team!</h2>
            </div>

            <div class="cell 12" style="background-color: #E0FFFF">
                
                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowMichael">
                            <a href="https://github.com/MFrancomb1/" target="_blank">Michael's GitHub</a>
                            <br>
                            <a href="https://www.linkedin.com/in/michael-francomb-18abb9238" target="_blank">Michael's Linkedin</a>
                        </div>
                    </div>
                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="isShowMichael">
                            A computer Science student at the University of St. Thomas. I have a background in education and a passion for learning. In my free time you can find me outdoors hiking, camping and enjoying nature.
                        </div>
                    </div>
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowMichael">
                            <button style="background: white; cursor: pointer;" @click="isShowMichael = !isShowMichael">Close Michael's Information</button>
                        </div>
                    </div>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowMichael">
                            <img src="./images/Francomb.jpg" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowMichael">
                            <li><p>R. Michael Francomb</p></li>
                            <li><p>Senior Graduating May 2023</p></li>
                            <li><p>Major: Computer Science</p></li>
                        </div>
                    </div>
                    
                    <div style="text-align: center;" class="small-12 large-3 cell"> 
                        <div v-if="!isShowMichael">
                        <button style="background: white; cursor: pointer;" @click="isShowMichael = !isShowMichael">Get to know Michael</button>
                        </div>
                    </div>
                </div>
            </div>
                
                
                
               
            <div class="cell 12" style="background-color: whitesmoke">
                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowDavid">
                            <a href="https://github.com/MFrancomb1/" target="_blank">Michael's GitHub</a>
                            <br>
                            <a href="https://www.linkedin.com/in/michael-francomb-18abb9238" target="_blank">Michael's Linkedin</a>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="isShowDavid">
                            Enter short bio here
                        </div>
                    </div>
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowDavid">
                            <button style="background: white; cursor: pointer;" @click="isShowDavid = !isShowDavid">Close David's Information</button>
                        </div>
                    </div>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowDavid">
                            <img src="./images/David.jpg" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowDavid">
                            <li><p>David Braun</p></li>
                            <li><p>Senior Graduating May 2023</p></li>
                            <li><p>Major: Computer Science</p></li>
                        </div>
                    </div>
                    
                    <div style="text-align: center;" class="small-12 large-3 cell"> 
                        <div v-if="!isShowDavid">
                        <button style="background: white; cursor: pointer;" @click="isShowDavid = !isShowDavid">Get to know David</button>
                        </div>
                    </div>
                </div>
            </div>



            <div class="cell 12" style="background-color: #caedca">
                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowMitch">
                            <a href="https://github.com/MitchGarnatz/" target="_blank">Mitch's GitHub</a>
                            <br>
                            <a href="https://www.linkedin.com/in/mitchell-garnatz/" target="_blank">Mitch's Linkedin</a>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="isShowMitch">
                            As a computer science student at St. Thomas I have developmed a great interest in the tech field. My plans for post graduation are still in the works, both hope to be in some development field. Outside of school I enjoy spending time with my family and friends, coaching wrestling, weightlifting, and snowboarding. My dream trip would be going to the mountains somewhere in the west to snowboard.
                        </div>
                    </div>
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="isShowMitch">
                            <button style="background: white; cursor: pointer;" @click="isShowMitch = !isShowMitch">Close Mitch's Information</button>
                        </div>
                    </div>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowMitch">
                            <img src="./images/DS2A6312.jpg" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowMitch">
                            <li><p>Mitchell R. Garnatz</p></li>
                            <li><p>Senior Graduating May 2023</p></li>
                            <li><p>Major: Computer Science</p></li>
                        </div>
                    </div>
                    
                    <div style="text-align: center;" class="small-12 large-3 cell"> 
                        <div v-if="!isShowMitch">
                        <button style="background: white; cursor: pointer;" @click="isShowMitch = !isShowMitch">Get to know Mitch</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <br><br/>

        <div style="background: #E0FFFF;" class="grid-x grid-padding-x">
            
            <div class="small-12 large-6 cell">
                <div class="sectionGreen">
                    <h1 style="text-align: center;">Incorporated Tools</h1>
                </div>
            </div>

            <!--Vue-->
            <div class="small-12 large-3 cell">
                <br><br/>
                <h2>Vue</h2>
                <img src="./images/vueimage.jpeg" alt="no image" width="150"/>
            </div>
            <div class="small-12 large-3 cell">
                <br><br/>
                <p>Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications. </p>
            </div>


            <!--Nominatim-->
            <div class="small-12 large-3 cell">
                <br><br/>
                <h2>Nominatim</h2>
            </div>
            <div class="small-12 large-3 cell">
                <br><br/>
                <img src="./images/nominatim.png" alt="no image" width="150"/>
            </div>
            
            <!--Leaflet-->
            <div class="small-12 large-3 cell">
                <br><br/>
                <h2>Leaflet</h2>
            </div>
            <div class="small-12 large-3 cell">
                <br><br/>
                <img src="./images/leafletimage.png" alt="no image" width="150"/>
            </div>

            <!--Descriptions-->
            <div class="small-12 large-6 cell">
                <p>Nominatim (from the Latin, 'by name') is a tool to search OSM data by name and address (geocoding) and to generate synthetic addresses of OSM points (reverse geocoding).</p>
            </div>
            <div class="small-12 large-6 cell">
                <p>Leaflet is an open source JavaScript library used to build web mapping applications.</p>
            </div>

            <!--jQuery-->
            <div class="small-12 large-3 cell">
                <h2>jQuery</h2>
            </div>
            <div class="small-12 large-3 cell">
                <img src="./images/jquery.png" alt="no image" width="150"/>
            </div>
            <!--Foundation-->
            <div class="small-12 large-3 cell">
                <h2>Foundation</h2>
            </div>
            <div class="small-12 large-3 cell">
                <img src="./images/foundation.png" alt="no image" width="150"/>
            </div>
            <!--Descriptions-->
            <div class="small-12 large-6 cell">
                <p>jQuery is a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, and Ajax.</p>
            </div>
            <div class="small-12 large-6 cell">
                <p>Foundation is a free and open-source responsive front-end framework, providing a responsive grid and HTML and CSS UI components, templates, and code snippets, including typography, forms, buttons, navigation and other interface elements, as well as optional functionality provided by JavaScript extensions.</p>
            </div>



            
            <!-- <ul>
            <li>Vue</li>
            <li>Foundation</li>
            <li>JQuery</li>
            <li>Leaflet</li>
            <li>Nomanatim</li>
            </ul> -->

        </div>
        <br><br/>
        <div style="background: teal;" class="grid-x grid-padding-x">

            <div class="small-12 large-12 cell">
                <div class="sectionBlue">
                    <h1>Check Out Our Project!</h1>
                </div>
            </div>

            <div class="small-12 large-6 cell">
                <br><br/>
                <iframe width="550rem" height="300rem" src="https://www.youtube.com/embed/y881t8ilMyc" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="small-12 large-6 cell">
                <div class="sectionBlue">
                    <p>Here is where our delevopment process will go. Development began with working to understand how leaflet, nominatim, and vue.js would be able to show an updating map when a placeholder was put on the default map. </p>
                </div>

                <br><br/>

                <div class="grid-x">
                    <div class="small-12 large-4 cell">
                        <img src="./images/leafletimage.png" alt="no image" width="150"/>
                    </div>
                    <div class="small-12 large-4 cell">
                        <img src="./images/nominatim.png" alt="no image" width="150"/>
                    </div>
                    <div class="small-12 large-4 cell">
                        <img src="./images/vueimage.jpeg" alt="no image" width="150"/>
                    </div>
                </div>
            </div>
        </div>


        <div class="grid-x grid-padding-x">

            <div class="grid-x">
                <div class= "sectionGreen">
                    <h1 style="padding: .5rem; margin: 1rem;">Here are a few interesting findings from our project.</h1>
                    <ol>
                    <li style="padding: .5rem; margin: 1rem;"> <p>When focusing a search on all crimes that took place on May 31, 2022 there was a total of 100 crimes in the St. Paul neighboorhoods listed in the map. What is daunting to think about is that this day is not an outlier in the table. A crimerate of 100 per day is near average when comparing the previous days to May 31st. There is more crime happening than the common citizen often takes notice to.</p></li>
                    <li style="padding: .5rem; margin: 1rem;"> <p>From 12-13-2020 to 05-23-2022 there has been record of 10,000 violent crimes in the Neighborhood border that includes Union Park and Macalester/Groveland. Violent crime being defined as crimes similar or including assault, rape, robbery, murder, and homicide.</p></li>
                    <li style="padding: .5rem; margin: 1rem;"><p>By a large margin, Theft and Proactive Police Visits are the most common crimes that takes place throughout the neighborhoods of St. Paul. In 2014 they were the most common and still remain the most common by the results of 2022.</p></li>
                    <li style="padding: .5rem; margin: 1rem;"><p>Of the 17 neighborhoods listed in our map, Capitol River seems to have the highest crime rate. Captiol river being in the central zone of downtown St. Paul most likely correlates to its high crime rate. </p></li>
                    <li style="padding: .5rem; margin: 1rem;"><p>From the first date in the database 08-14-2014 spanning to the last date 05-31-2022, there has been a recorded total of 391,690 incidents of crime in the neighborhood boundaries listed on the map.</p></li>
                    <li style="padding: .5rem; margin: 1rem;"><p>Following the tragedy that took place in May of 2020 involving the death of George P. Floyd Jr. crime rates spiked greatly in the 5 day period from 05-26-2020 to 02-30-2020. Much of these incidents were recorded as Theft, Vandalism, and Discharge.</p></li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

</template>

<style>

</style>