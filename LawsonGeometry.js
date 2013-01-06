// Adapted from https://github.com/mrdoob/three.js/blob/master/src/extras/geometries/SphereGeometry.js

THREE.LawsonGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.radius = radius || 1;

	this.widthSegments = Math.max( 8, Math.floor( widthSegments ) || 64 );
	this.heightSegments = Math.max( 6, Math.floor( heightSegments ) || 48 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : 2 * Math.PI;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : 2 * Math.PI;
		
	var p = 0.5;
	var q = 1;
	var circleAngle = Math.PI / 2;
	var inverseOffset = new THREE.Vector3(0.5, 0, 0);
	
	var circle = new THREE.CircleGeometry(1, this.widthSegments, 0, 2 * Math.PI);
	var rot = new THREE.Matrix4();  
	rot.makeRotationY(circleAngle);
	circle.applyMatrix(rot);
	
	function lawson(u, v) {
		v *= 2 * Math.PI;
		var point = circle.vertices[1 + Math.floor(u * (circle.vertices.length - 2))]
		
		//From Daniel Piker
		var xa = point.x;        //getting the coordinates of the input point
		var ya = point.y;
		var za = point.z;
	
		//reverse stereographically project to Riemann hypersphere 
		var xb = 2 * xa / (1 + xa * xa + ya * ya + za * za);
		var yb = 2 * ya / (1 + xa * xa + ya * ya + za * za);
		var zb = 2 * za / (1 + xa * xa + ya * ya + za * za);
		var wb = (-1 + xa * xa + ya * ya + za * za) / (1 + xa * xa + ya * ya + za * za);
	
		//now rotate the hypersphere
		var xc = xb * Math.cos(p * v) + yb * Math.sin(p * v);
		var yc = -xb * Math.sin(p * v) + yb * Math.cos(p * v);
		var zc = zb * Math.cos(q * v) - wb * Math.sin(q * v);
		var wc = zb * Math.sin(q * v) + wb * Math.cos(q * v);
	
		//then project stereographically back to flat 3D
		var xd = xc / (1 - wc);
		var yd = yc / (1 - wc);
		var zd = zc / (1 - wc);
	
		var point = new THREE.Vector3(xd, yd, zd);
	
		//spherical inversion
		point = new THREE.Vector3().add(point, inverseOffset);
		point = point.multiplyScalar(1 / point.lengthSq());
	
		if (
			isNaN(point.x) || isNaN(point.y) || isNaN(point.z) ||
			isNaN(point.x) || isNaN(point.y) || isNaN(point.z)
			) {
			return new THREE.Vector3(0, 0, 0);
		}
	
		return point;
	}

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= this.heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= this.widthSegments; x ++ ) {

			var u = x / this.widthSegments;
			var v = y / this.heightSegments;

			var vertex = lawson(u, v);
			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < this.heightSegments; y ++ ) {

		for ( x = 0; x < this.widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.LawsonGeometry.prototype = Object.create( THREE.Geometry.prototype );