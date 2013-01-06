var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);  
var renderer = new THREE.WebGLRenderer(); 

renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

var uSegments = 64;
var vSegments = 46;

var parent = new THREE.Object3D();
parent.rotation.x += Math.PI / 4
scene.add( parent );

for (var i = 0; i < vSegments; i++) { 
	var geometry = new THREE.LawsonGeometry(1, uSegments, 1, 0, 2 * Math.PI, i / vSegments * 2 * Math.PI, 2 * Math.PI / vSegments);

	var geometryFlip = new THREE.LawsonGeometry(1, uSegments, 1, 0, 2 * Math.PI, i / vSegments * 2 * Math.PI, 2 * Math.PI / vSegments);

	for(var j = 0; j < geometryFlip.faces.length; j++) {
		var tmp = geometryFlip.faces[j].b
	    geometryFlip.faces[j].b = geometryFlip.faces[j].d;
	    geometryFlip.faces[j].d = tmp;
	}

	var fillMaterial = new THREE.MeshLambertMaterial( { 
		color: new THREE.Color().setHSV(i / vSegments, 0.8, 0.8),
		opacity: 1,
		transparent: true,
		side: THREE.DoubleSide,
		depthTest: true 
	} );

	var wireframeMaterial = new THREE.MeshBasicMaterial( { 
		color: new THREE.Color().setHSV(i / vSegments, 0.8, 0.8), 
		wireframe: true,  
		opacity: 0.5, 
		side: THREE.DoubleSide 
	} );
	
	var materials = i % 2 == 0 ? [fillMaterial] : [wireframeMaterial];

	var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
	parent.add(mesh);  
	mesh = THREE.SceneUtils.createMultiMaterialObject( geometryFlip, materials );
	parent.add(mesh);  
}


var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 );
scene.add( light );

light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, -1 );
scene.add( light );

camera.position.z = 5;

function render() { 
	parent.rotation.y += 0.002;
	requestAnimationFrame(render); 
	renderer.render(scene, camera);
} 
render();