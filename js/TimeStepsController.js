
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

const TimeStepsController = function(options){
    let self = {
        steps : [2.305, 2.3075, 2.31, 2.3135, 2.315, 2.3175, 2.32,
            2.3225, 2.325, 2.3275, 2.33, 2.3325, 2.335, 2.3375,
            2.34, 2.3425, 2.345, 2.3475, 2.35, 2.355, 2.36,
            2.365, 2.37, 2.375, 2.38, 2.385, 2.39, 2.395, 2.40]
    }

    function init(){
        //create the options
        d3.select("#timesteps")
            .on("change", function(){
                selectChange()
            })
            .selectAll("option")
            .data(self.steps)
            .enter()
            .append("option")
            .attr("value", function(d){
                return d;
            })
            .text(function(d){
                return d;
            })
    }

    function changeController(){
        
    }

    function selectChange(){
        // console.log(App.particleSystem)
        console.log("hello")
        let file = d3.format('.2f')($("#timesteps").val());
        // let sceneObject = App.particleSystem.getParticleSystems();
        // let removeParticles = sceneObject.getObjectByName('particleSystem');
        // sceneObject.remove(removeParticles);
        App.particleSystem.initialize('particles/'+ file +'.csv');
        // //add the particle system to the scene
        // App.scene.addObject(sceneObject);

        // // render the scene
        // App.scene.render();
    }
    return{
        init,
        changeController
    }
}
