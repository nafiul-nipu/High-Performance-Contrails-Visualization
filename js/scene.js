/* author: Andrew Burks */
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
        const canvas = document.querySelector("#scene");
        self.renderer = new THREE.WebGLRenderer({canvas});

        //camera
        const fieldOfView = 1;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1;
        const far = 1000;

        self.camera = new THREE.PerspectiveCamera(fieldOfView, aspect, near, far);
        self.camera.position.z = 2;

        //scene
        self.scene = new THREE.Scene();


        //gui control
        const gui = new dat.GUI();
        gui.add(self.camera, 'near', 1, 2);
        gui.add(self.camera, 'far', 1, 1000);
        gui.add(self.camera, 'fov', 1, 100);

        // directional light
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1,2,4);
        self.scene.add(light)

        // self.renderer.render()
        
    }

    function resize(){
        // camera.aspect = (window.innerWidth * 1.6) / (window.innerHeight * 1.6);
        // camera.updateProjectionMatrix();
        // renderer.setSize(window.innerWidth * 1.6, window.innerHeight * 1.6);
        // render();

    }

    function addObject(obj){
        self.scene.add(obj)
    }

    function render(){
        self.renderer.render(self.scene, self.camera);
    }

    return{
        init,
        resize,
        addObject,
        render
    }
}
