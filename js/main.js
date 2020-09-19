"use strict";

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    /* Entry point of the application */
    App.start = function()
    {
        //dropdown menu
        App.timeStep = new TimeStepsController();
        App.timeStep.timeStepSelect();
        App.timeStep.colorSelect()
        // create a new scene, pass options as dictionary
        App.scene = new Scene({container:"scene"});
        App.scene.init();

        // // initialize the particle system
        App.particleSystem = new ParticleSystem();
        App.particleSystem.drawNozzle()
        App.particleSystem.initialize('particles/timestep_0.csv');
        App.particleSystem.setColor("Temperature");

        // //add the particle system to the scene
        App.scene.addObject( App.particleSystem.getParticleSystems());

        // // render the scene
        // App.scene.render();

        // App.contrails = new Contrails({container:"scene"})
        // App.contrails.createScene();
        // App.contrails.createNozzle();
        // App.contrails.loadData('particles/2.305.csv')

    };

}) ();

// App.start();

// Using load manager to load the interface
//for now window.onload
//later swap with three js load manager??
window.onload = function(){
    App.start();
}

// window.addEventListener("resize", function(){
//     App.start();
// })