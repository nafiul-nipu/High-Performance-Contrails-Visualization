
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

        d3.select("#previous").on("click", previous);
        d3.select("#next").on("click", next);
    }

    function previous(){
        console.log("previous")
        // let file ; 
        // let value = d3.format('.2f')($("#timesteps").val());
        // console.log(value)
        // for(let i = 0; i < self.steps.length ; i++){
        //     if(value == self.steps[i]){
        //         if(i == self.steps.length - 1){ // last step
        //             file = d3.format('.2f')(self.steps[0])
        //             $("#timesteps").val(self.steps[0]);
        //         }else if(i == 0){ // first step
        //             file = d3.format('.2f')(self.steps[self.steps.length - 1]);
        //             $("#timesteps").val(self.steps[self.steps.length - 1]);
        //         }else{
        //             file = d3.format('.2f')(self.steps[i - 1])
        //             $("#timesteps").val(self.steps[i - 1]);
        //         }
        //     }
        // }
        // console.log(file)
        
    }
    function next(){
        console.log("next")
    }

    function selectChange(){
        // console.log(App.particleSystem)
        // console.log("hello")
        let file = d3.format('.2f')($("#timesteps").val());
        App.particleSystem.initialize('particles/'+ file +'.csv'); 
        // App.contrails.loadData('particles/'+ file +'.csv')
    }
    return{
        init
    }
}
