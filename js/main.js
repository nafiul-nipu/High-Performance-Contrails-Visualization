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
        // create a new scene, pass options as dictionary
        App.scene = new Scene({container:"scene"});
        App.scene.init()

        // initialize the particle system
        const particleSystem = new ParticleSystem();
        particleSystem.drawNozzle()
        particleSystem.initialize('particles/2.31.csv');

        //add the particle system to the scene
        App.scene.addObject( particleSystem.getParticleSystems());

        // render the scene
        App.scene.render();

    };

}) ();

// App.start();

// Using load manager to load the interface
//for now window.onload
//later swap with three js load manager??
window.onload = function(){
    App.start();
}