/* author: Andrew Burks */
"use strict";

/* Get or create the application global variable */
var App = App || {};

const ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    const self = {
        data : [], //data container
        sceneObject : new THREE.Group(), //scene graph group for the particle system
        bounds : {} //bounds of the data
    }

    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    function drawNozzle() {
        
    }

    // creates the particle system
    function createParticleSystem () {
        // console.log(self.data)
        let particles = new THREE.Geometry();
        self.data.forEach(d => particles.vertices.push(new THREE.Vector3(d.x, d.y, d.z)));
        // if (points) scene.remove(points);
        let points = new THREE.Points(particles, new THREE.PointsMaterial({ size: 0.2, color: 'hsl(50, 65%, 75%)' }));
        // console.log(points)
        self.sceneObject.add(points);    
        
        setTimeout((pass => {
            if (pass < 3) {
                if (true) {
                    document.body.style.cursor = 'default';
                    document.body.style.visibility = 'visible';
                }
                App.scene.render();
                setTimeout(arguments.callee, 500, pass + 1);
            }
        }), 500, 0);
    };

    // data loading function
    function loadData(file){


        d3.csv(file, data => {
            self.data.push({
                // concentration density
                // concentration: Number(d.concentration),
                // Position
                x: parseFloat(data['Points:0']),
                y: parseFloat(data['Points:1']),
                z: parseFloat(data['Points:2'])

            });
        }).then(function() {
            createParticleSystem();
            
        });
    };

    // load the data and setup the system
    function initialize(file){
        loadData(file);
    }

    // accessor for the particle system
    function getParticleSystems() {
        return self.sceneObject;
    }

    return{
        drawNozzle,
        createParticleSystem,
        initialize,
        getParticleSystems

    }

};