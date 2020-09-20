
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

const TimeStepsController = function(options){
    let self = {
        steps : [2.305,2.3075, 2.31, 2.3135, 2.315, 2.3175, 2.32,
            2.3225, 2.325, 2.3275, 2.33, 2.3325, 2.335, 2.3375,
            2.34, 2.3425, 2.345, 2.3475, 2.35, 2.355, 2.36,
            2.365, 2.37, 2.375, 2.38, 2.385, 2.39, 2.395, 2.40],
        colorControls: ["Temperature", "Concentration"]
    }

    function timeStepSelect(){
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

    function colorSelect(){
        //create the options
        d3.select("#colorSelect")
            .on("change", function(){
                colorChange()
            })
            .selectAll("option")
            .data(self.colorControls)
            .enter()
            .append("option")
            .attr("value", function(d){
                return d;
            })
            .text(function(d){
                return d;
            })

    }

    function previous(){
        let file;
        let value = +($("#timesteps").val());
        let index = self.steps.indexOf(value);
        let total = self.steps.length - 1;
        // console.log(total % index)
        if(index != 0){
            file = index - 1 ;
        }else{
            file = total;
        }
        
        $("#timesteps").val(self.steps[file]);   
        App.particleSystem.initialize('particles/timestep_'+ file +'.csv'); 

        // console.log(value, file)  
     }

    function next(){
        // console.log("next")
        let file;
        let value = +($("#timesteps").val());
        let index = self.steps.indexOf(value);
        let total = self.steps.length - 1;
        if(index != total){
            file = (index % total) + 1 ;
        }else{
            file = 0;
        }
        
        $("#timesteps").val(self.steps[file]);
        App.particleSystem.initialize('particles/timestep_'+ file +'.csv'); 

        // console.log("length", self.steps.length, "index", self.steps.indexOf(value) % (self.steps.length - 1), "now", value,"next",self.steps[file],(self.steps.indexOf(value) % (self.steps.length - 1)) + 1  )
    }

    function selectChange(){
        // console.log(App.particleSystem)
        // console.log("hello")
        let value = +($("#timesteps").val());
        // console.log(value)
        let file = self.steps.indexOf(value)
        // console.log(file)
        App.particleSystem.initialize('particles/timestep_'+ file +'.csv'); 
        // App.contrails.loadData('particles/'+ file +'.csv')
    }

    function colorChange(){
        // console.log("i am called")
        let value = $("#colorSelect").val();
        // console.log(value)
        App.particleSystem.setColor(value)

    }
    return{
        timeStepSelect,
        colorSelect
    }
}
