
"use strict";

/* Get or create the application global variable */
var App = App || {};

const ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    const self = {
        data : [], //data container
        sceneObject : new THREE.Group(), //scene graph group for the particle system
        points : null,
        tempScale:null,
        conScale:null,
        tempDomain:{},
        conDomain:{}
    }

    //create the scales
    function init(){
        self.tempScale = d3.scaleLinear(d3.schemeReds[9])
                            .domain([self.tempDomain.min, self.tempDomain.max])
                            .range(["#fff5f0","#67000d"]);
        // console.log(self.tempScale(self.tempDomain.min))
        // console.log(self.tempDomain.min)

        self.conScale = d3.scaleLinear(d3.schemePurples[9])
                        .domain([self.conDomain.min, self.conDomain.max])
                        .range(["#fcfbfd", "#3f007d"])
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
            // let color = self.tempScale(d.temp)
            particles.colors.push(new THREE.Color('rgb(255, 247, 236)'));
        })
        if(self.points){
            self.sceneObject.remove(self.points)
        }
        let materials = new THREE.PointsMaterial({ size: 0.2, vertexColors:true});
        self.points = new THREE.Points(particles, materials);
        self.sceneObject.add(self.points);
        App.scene.render();
    };

    function setColor(value){
        // console.log(self.points.materials[ 0 ].color.setHex( 0xff0000 );)
        // console.log(self.points.material)
        if(value == "Temperature"){
            self.data.forEach(function(d,i){
                // console.log(d.temp)
                let color = self.tempScale(d.temp)
                // console.log(color)
                self.points.geometry.colors[i].set(color);
            })
            self.points.geometry.colorsNeedUpdate=true;
            App.scene.render();

        }else if(value == "Concentration"){
            self.data.forEach(function(d,i){
                // console.log(d.temp)
                let color = self.conScale(d.con)
                // console.log(color)
                self.points.geometry.colors[i].set(color);
            })
            self.points.geometry.colorsNeedUpdate=true;
            App.scene.render();            
        }
        

    }

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
                z: parseFloat(data['Points:2']),
                temp: parseFloat(data['T']),
                con: parseFloat(data['mass0'])/parseFloat(data['nParticle'])
            });

             // get temperature domain
             self.tempDomain.min = Math.min(self.tempDomain.min || Infinity, parseFloat(data['T']));
             self.tempDomain.max = Math.max(self.tempDomain.max || -Infinity, parseFloat(data['T']));

             // get the concentration domain
             self.conDomain.min = Math.min(self.conDomain.min || Infinity, parseFloat(data['mass0'])/parseFloat(data['nParticle']));
             self.conDomain.max = Math.max(self.conDomain.max || -Infinity, parseFloat(data['mass0'])/parseFloat(data['nParticle']));
        }).then(function() {
            // console.log(self.conDomain);
            // console.log(self.tempDomain)
            init()
            createParticleSystem();
            let value = $("#colorSelect").val()
            setColor(value)
            
        });
    };

    // load the data and setup the system
    function initialize(file){
        return Promise.resolve(loadData(file));
        // loadData(file);
    }

    // accessor for the particle system
    function getParticleSystems() {
        return self.sceneObject;
    }

    return{
        init,
        drawNozzle,
        createParticleSystem,
        initialize,
        getParticleSystems,
        setColor

    }

};