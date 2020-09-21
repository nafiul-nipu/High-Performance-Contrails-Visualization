
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
        conDomain:{},
        tempLegend:null,
        conLegend:null,
        tempColor:["#fff5f0","#67000d"],
        conColor: ["#fcfbfd", "#3f007d"],
        tempLegendText:[],
        conLegendText:[]
        // tempLegendSvg:null,
        // conLegendSvg: null
    }

    //create the scales
    function init(){
        self.tempScale = d3.scaleLinear(/*d3.schemeReds[9]*/)
                            .domain([self.tempDomain.min, self.tempDomain.max])
                            .range(self.tempColor);
        // console.log(self.tempScale(self.tempDomain.min))
        // console.log(self.tempDomain.min)

        self.conScale = d3.scaleLinear(d3.schemePurples[9])
                        .domain([self.conDomain.min, self.conDomain.max])
                        .range(self.conColor);

        self.tempLegendText = [self.tempDomain.max, "Temperature", self.tempDomain.min];
        self.conLegendText = [self.conDomain.max.toString(), "Concentration", self.conDomain.min.toString()]
        console.log(self.conDomain.max.toString())
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
            let color = self.tempScale(d.temp)
            particles.colors.push(new THREE.Color(color));
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
            setColor(value);
            createTempLegendText();
            createConLegendText();
            
        });
    }

    function createTempLegend(){
        const width = window.innerWidth - 100;
        const topHeight = d3.select(".top").node().clientHeight
        const height = window.innerHeight - topHeight - 50

        self.tempLegend = d3.select("#tempLegend").append("svg")
                            .attr("width", 100)
                            .attr("height", (height/2 - 20))

        let legend = self.tempLegend.append("defs")
                    .append("svg:linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "0%")
                    .attr("y2", "0%")
                    // .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", self.tempColor[0])
            // .attr("stop-opacity", 0.75);
        
        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", self.tempColor[1])
            // .attr("stop-opacity", 0.75);

        self.tempLegend.append("rect")
            .attr("width", 20)
            .attr("height", height)
            .style("fill", "url(#gradient)")
            // .style("opacity", 0.75)
            // .attr("transform", "translate(0,0)");

    }

    function createTempLegendText(){
        d3.selectAll('#temp-legend').remove();
        for (let i = 0; i < 3; i++) {
            self.tempLegend.append("text")
                .attr('id', 'temp-legend')
                .attr("x", 30)
                .attr("y", 10 + 118 * i)
                .attr("fill", "#F5F1F0")
                .style("font-size", "11px")
                .style("font-weight", "bold")
                .text(self.tempLegendText[i]);
        }

    }

    function createConLegend(){
        const width = window.innerWidth - 100;
        const topHeight = d3.select(".top").node().clientHeight
        const height = window.innerHeight - topHeight - 50

        self.conLegend = d3.select("#conLegend").append("svg")
                            .attr("width", 200)
                            .attr("height", (height/2 - 20))

        let legend = self.conLegend.append("defs")
                    .append("svg:linearGradient")
                    .attr("id", "congradient")
                    .attr("x1", "0%")
                    .attr("y1", "100%")
                    .attr("x2", "0%")
                    .attr("y2", "0%")
                    // .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", self.conColor[0])
            // .attr("stop-opacity", 0.75);
        
        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", self.conColor[1])
            // .attr("stop-opacity", 0.75);

        self.conLegend.append("rect")
            .attr("width", 20)
            .attr("height", height)
            .style("fill", "url(#congradient)")
            // .style("opacity", 0.75)
            // .attr("transform", "translate(0,0)");

    }

    function createConLegendText(){
        console.log(self.conLegendText)
        d3.selectAll('#con-legend').remove();
        for (let i = 0; i < 3; i++) {
            self.conLegend.append("text")
                .attr('id', 'con-legend')
                .attr("x", 30)
                .attr("y", 10 + 118 * i)
                .attr("fill", "#F5F1F0")
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .text(self.conLegendText[i]);
        }

    }

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
        setColor,
        createTempLegend,
        createConLegend

    }

};