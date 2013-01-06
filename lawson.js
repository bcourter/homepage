var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);  
var renderer = new THREE.WebGLRenderer(); 

renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

var uSegments = 64;
var vSegments = 48;

var geometry = new THREE.LawsonGeometry();
var material = new THREE.MeshBasicMaterial({color: 0x00ff00}); 

var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ 
	new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 0.2, transparent: true, side: THREE.DoubleSide, depthTest: false } ), 
//	new THREE.MeshBasicMaterial( { color: 0x444444, wireframe: false, side: THREE.DoubleSide, depthTest: false, opacity: 0.5, transparent: true } ),
	new THREE.MeshBasicMaterial( { color: 0x666666, wireframe: true,  opacity: 0.3 } ) 
] );

mesh.rotation.x += Math.PI / 4
//mesh.rotation.y += Math.PI / 2
scene.add(mesh);  
camera.position.z = 5;

function render() { 
	mesh.rotation.y += 0.002;
	requestAnimationFrame(render); 
	renderer.render(scene, camera);
} 
render();