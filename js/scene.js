
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

const Scene = function(options){
    let self = {
        scene: null,
        camera: null,
        renderer: null
    }

    function init(){
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

        self.camera.lookAt (new THREE.Vector3(-2,0,0));

        //scene
        self.scene = new THREE.Scene();
        // console.log(self.scene.position)
        // self.scene.position.x = 2;

        let controls = new THREE.OrbitControls(self.camera, self.renderer.domElement);
        controls.addEventListener('change', render)
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

    function addObject(obj){
        self.scene.add(obj)
    }

    function render(){
        self.renderer.render(self.scene, self.camera);
    }

    function getScene(){
        return self.scene;
    }
    return{
        init,
        resize,
        addObject,
        render,
        getScene
    }
}
