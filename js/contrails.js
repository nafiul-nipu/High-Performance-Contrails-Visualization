
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

const Contrails = function(options){
    let self = {
        scene: null,
        camera: null,
        renderer: null,
        points: null,
        data: []
    }

    //create the scene 
    function createScene(){
        const width = window.innerWidth - 100;
        const topHeight = d3.select(".top").node().clientHeight
        const height = window.innerHeight - topHeight - 50

        const can = document.querySelector("#scene");
        
        self.renderer = new THREE.WebGLRenderer({canvas: can, alpha:true});
        self.renderer.setClearColor('hsl(0, 0%, 0%)', 0)
        self.renderer.setSize(width, height)
        self.renderer.setPixelRatio(window.devicePixelRatio)        

        //camera
        const fieldOfView = 4;
        const aspect = width / height;
        const near = 1;
        const far = 1000;

        self.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
        self.camera.position.x = 20;
        self.camera.position.y = 10
        self.camera.position.z = 30;

        self.camera.lookAt (new THREE.Vector3(-5,0,0));

        //scene
        self.scene = new THREE.Scene();
        // console.log(self.scene.position)
        // self.scene.position.x = 2;

        let controls = new THREE.OrbitControls(self.camera, self.renderer.domElement);
        controls.addEventListener('change', render)
        controls.target.set(-5,0,0)
        controls.update()

        // directional light
        // Lights
        let ambient = new THREE.AmbientLight('hsl(0, 0%, 100%)', 0.25);
        let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.6);
        let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 60%, 85%)'), 0.6);
        let backLight = new THREE.DirectionalLight('hsl(0, 0%, 100%)', 0.4);

        keyLight.position.set(-1, 0, 1);
        fillLight.position.set(1, 0, 1);
        backLight.position.set(1, 0, -1).normalize();

        self.scene.add(ambient)
        self.scene.add(keyLight)
        self.scene.add(fillLight)
        self.scene.add(backLight)

        window.addEventListener("resize", function(){
            resize();
        })
        
    }

    // resize the scene when resize the window
    function resize(){
        const width = window.innerWidth - 100;
        const topHeight = d3.select(".top").node().clientHeight
        const height = window.innerHeight - topHeight - 50
        console.log(width, height)
        
        self.camera.aspect = width / height;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize(width, height);
        render()

    }

    // render
    function render(){
        // requestAnimationFrame( render );
        // controls.update();
        self.renderer.render(self.scene, self.camera);
    }

    // load the nozzle model
    function createNozzle(){
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
                self.scene.add(obj);
                render();
            });
        });

    }

     // creates the particle system
    function addParticles() {
        self.scene.position.set(-5,0,0);
        // console.log(self.data)
        let particles = new THREE.Geometry();
        self.data.forEach(function(d){
            particles.vertices.push(new THREE.Vector3(d.x, d.y, d.z));
        })
        if(self.points){
            self.scene.remove(self.points)
        }
        let materials = new THREE.PointsMaterial({ size: 0.2, color: 'hsl(50, 65%, 75%)' });
        self.points = new THREE.Points(particles, materials);
        self.scene.add(self.points);
        render();
    };

    // data loading function
    function loadData(file){
        self.data = []
        d3.csv(file, data => {
            self.data.push({
                // Position
                x: parseFloat(data['Points:0']),
                y: parseFloat(data['Points:1']),
                z: parseFloat(data['Points:2'])

            });
        }).then(function() {
            addParticles();
            
        });
    };


    return{
        createScene,
        resize,
        render,
        createNozzle,
        loadData
    }
}
