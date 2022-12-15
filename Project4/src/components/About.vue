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
        <div class="grid-x grid-padding-x">
            <h1 class="cell auto">About the Project!</h1>
            <div class="cell 12" style="background-color: #211999;">
                <h2>Meet the team!</h2>
            </div>

            <div class="cell 12" style="background-color: #229999">
                
                <div v-if="isShowMichael">
                    <p>Hello Michael</p>

                    <button @click="isShowMichael = !isShowMichael">Close Michael's Information</button>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowMichael">
                            <img src="./images/download.png" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowMichael">
                            <li><p>Mitchell R. Garnatz</p></li>
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
                
                
                
               
            <div class="cell 12" style="background-color: #992299">
                
                <div v-if="isShowDavid">
                    <p>Hello David</p>

                    <button @click="isShowDavid = !isShowDavid">Close David's Information</button>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowDavid">
                            <img src="./images/download.png" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowDavid">
                            <li><p>Mitchell R. Garnatz</p></li>
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



            <div class="cell 12" style="background-color: #999922">
                <div v-if="isShowMitch">
                    <p>Hello Mitch</p>

                    <button @click="isShowMitch = !isShowMitch">Close Mitch's Information</button>
                </div>

                <div class="grid-x">
                    <div style="text-align: center;" class="small-12 large-3 cell">
                        <div v-if="!isShowMitch">
                            <img src="./images/DS2A6312.jpg" alt="no image" width="200"/>
                        </div>
                    </div>

                    <div style="text-align: center;" class="small-12 large-6 cell">
                        <div v-if="!isShowMitch">
                            <ul>
                                <li><p>Mitchell R. Garnatz</p></li>
                                <li><p>Senior Graduating May 2023</p></li>
                                <li><p>Major: Computer Science</p></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center;" class="small-12 large-3 cell"> 
                        <div v-if="!isShowMitch">
                        <button style="background: white; cursor: pointer;" @click="isShowMitch = !isShowMitch">Get to know Mitch</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cell 12" style="background-color: #dddddd">
                <p>Tools used</p>
                <ul>
                    <li>Vue</li>
                    <li>Foundation</li>
                    <li>JQuery</li>
                    <li>Leaflet</li>
                    <li>Nomanatim</li>
                </ul>
            </div>

            <div class="cell 12">
                <h1>Check Out Our Project!</h1>
            </div>


            <div class="grid-x">

                <div style="text-align: left;" class="small-12 large-6 cell">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/y881t8ilMyc" frameborder="0" allowfullscreen></iframe>
                </div>
                
                <div style="text-align: left;" class="small-12 large-6 cell"> 
                    <p>Here is where our delevopment process will go. Development began with working to understand how leaflet, nominatim, and vue.js would be able to show an updating map when a placeholder was put on the default map. </p>
                </div>
            </div>

            <div class="cell 12">
                <h1>Here are a few interesting findings from our project.</h1>

                    <ol>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>Milk</li>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>Milk</li>
                    </ol>
            </div>

        </div>
    </div>

</template>

<style>

</style>