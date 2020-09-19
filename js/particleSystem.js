
"use strict";

/* Get or create the application global variable */
var App = App || {};

const ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    const self = {
        data : [], //data container
        sceneObject : new THREE.Group(), //scene graph group for the particle system
        points : null
    }

    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    function drawNozzle() {
        let mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('models/');
        mtlLoader.load('nozzle.mtl', mtls => {
            mtls.preload();
            let objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(mtls);
            objLoader.setPath('models/');
            objLoader.load('nozzle.obj', obj => {
                obj.scale.set(20, 20, 20);
                obj.position.set(-0.001, -0.0905, 0);
                self.sceneObject.add(obj);
                App.scene.render();
            });
        });
        
    }

    // creates the particle system
    function createParticleSystem () {
        // console.log(self.data)
        let particles = new THREE.Geometry();
        self.data.forEach(function(d){
            particles.vertices.push(new THREE.Vector3(d.x, d.y, d.z));
        })
        if(self.points){
            self.sceneObject.remove(self.points)
        }
        let materials = new THREE.PointsMaterial({ size: 0.2, color: 'hsl(50, 65%, 75%)' });
        self.points = new THREE.Points(particles, materials);
        self.sceneObject.add(self.points);
        App.scene.render();
    };

    // data loading function
    function loadData(file){
        self.data = []
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