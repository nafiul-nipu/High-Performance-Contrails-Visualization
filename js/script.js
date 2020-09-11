var camera, renderer, scene, slider, points, blur, focus, anim_play,nodeDiagram,
    steps = [2.305, 2.3075, 2.31, 2.3135, 2.315, 2.3175, 2.32,
        2.3225, 2.325, 2.3275, 2.33, 2.3325, 2.335, 2.3375,
        2.34, 2.3425, 2.345, 2.3475, 2.35, 2.355, 2.36,
        2.365, 2.37, 2.375, 2.38, 2.385, 2.39, 2.395, 2.4],
    timeouts = []

init();

function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(1, (window.innerWidth * 1.6) / (window.innerHeight * 1.6), 1, 1000);
    camera.position.set(71, 71, 71);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor('hsl(0, 0%, 0%)', 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 1.6, window.innerHeight * 1.6);
    document.getElementById('container').appendChild(renderer.domElement);
    console.log(document.getElementById('container').appendChild(renderer.domElement))
    cursors(renderer.domElement);

    // Controls
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);

    // Lights
    let ambient = new THREE.AmbientLight('hsl(0, 0%, 100%)', 0.25);
    let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 0.6);
    let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 60%, 85%)'), 0.6);
    let backLight = new THREE.DirectionalLight('hsl(0, 0%, 100%)', 0.4);

    keyLight.position.set(-1, 0, 1);
    fillLight.position.set(1, 0, 1);
    backLight.position.set(1, 0, -1).normalize();

    // Scene
    scene = new THREE.Scene();
    scene.add(ambient);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    // node-link graph
    nodeDiagram = new nodeLink();
    nodeDiagram.createView();

    // Slider
    let width = (window.innerWidth < 960) ? 480 : (window.innerWidth / 2)
    slider = d3.sliderBottom()
        .width(width - 60)
        .min(d3.min(steps))
        .max(d3.max(steps))
        // .step(0.25)
        .default(steps[0])
        .tickFormat(d3.format('.2f'))
        .on('onchange', value => changeSlider(d3.format('.2f')(value)));

    d3.select('#slider')
        .append('svg')
        .attr('width', width)
        .attr('height', 70)
        .append('g')
        .attr('transform', 'translate(30, 30)')
        .call(slider);

    // Model
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
            scene.add(obj);
        });
    });

    // Particles
    addParticles(d3.format('.2f')(slider.value()), true);
    play();

    // Events
    window.addEventListener('resize', resize, false);
    window.addEventListener('blur', blur, false);
    window.addEventListener('focus', focus, false);
    document.getElementById('play-pause-btn').addEventListener('click', playOrPause, false);
}

function addParticles(step, startup) {
    if (!steps.includes(parseFloat(step))) return;

    d3.csv('particles/' + step + '.csv', data => {
        return {
            x: parseFloat(data['Points:0']),
            y: parseFloat(data['Points:1']),
            z: parseFloat(data['Points:2'])
        };
    }).then(data => {
        let particles = new THREE.Geometry();
        data.forEach(d => particles.vertices.push(new THREE.Vector3(d.x, d.y, d.z)));
        if (points) scene.remove(points);
        points = new THREE.Points(particles, new THREE.PointsMaterial({ size: 0.2, color: 'hsl(50, 65%, 75%)' }));
        scene.add(points);

        setTimeout((pass => {
            if (pass < 3) {
                if (startup) {
                    document.body.style.cursor = 'default';
                    document.body.style.visibility = 'visible';
                }
                render();
                setTimeout(arguments.callee, 500, pass + 1);
            }
        }), 500, 0);
    });
}

function changeSlider(step) {
    addParticles(step, false);

    if (anim_play) {
        pause();
        play();
    }
}

function currentStep() {
    let step = d3.format('.2f')(slider.value());

    while (!steps.includes(parseFloat(step)))
        step = d3.format('.2f')(slider.value() + 0.01);

    return step;
}

function play() {
    if (anim_play) return;

    anim_play = true;
    document.getElementById('play-pause glyphicon').className = 'glyphicon glyphicon-pause';
    _play(steps.indexOf(parseFloat(currentStep())));

    function _play(step) {
        if (!anim_play) return;
        if (step < steps.length) {
            slider.value(steps[step]);
            timeouts.push(setTimeout(() => {
                step = currentStep();
                if (d3.format('.2f')(slider.value()) != step)
                    _play(steps.indexOf(parseFloat(step)));
                else
                    _play(steps.indexOf(parseFloat(step)) + 1);
            }, 2500));
        } else if (step === steps.length) {
            slider.value(steps[0]);
            timeouts.push(setTimeout(() => {
                step = currentStep();
                if (d3.format('.2f')(slider.value()) != step)
                    _play(steps.indexOf(parseFloat(step)));
                else
                    _play(steps.indexOf(parseFloat(step)) + 1);
            }, 2500));
        }
    }
}

function pause() {
    if (!anim_play) return;

    anim_play = false;
    timeouts.forEach(clearTimeout);
    timeouts = [];
    document.getElementById('play-pause glyphicon').className = 'glyphicon glyphicon-play';
}

function playOrPause() {
    if (anim_play)
        pause();
    else
        play();
}

function cursors(elem) {
    elem.onmousedown = e => {
        if (e.button === 0) elem.style.cursor = 'move';
        else if (e.button === 2) elem.style.cursor = 'ew-resize';
    };

    elem.onmouseup = () => {
        elem.style.cursor = 'default';
    };
}

function render() {
    renderer.render(scene, camera);
}

function resize() {
    camera.aspect = (window.innerWidth * 1.6) / (window.innerHeight * 1.6);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 1.6, window.innerHeight * 1.6);
    render();
}

function blur() {
    if (!focus) return;

    focus = false;
    if (anim_play) {
        blur = true;
        pause();
    }
}

function focus() {
    if (focus) return;

    focus = true;
    if (!anim_play && blur) {
        blur = false;
        play();
    }
}