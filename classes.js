class GameObject extends THREE.Object3D{

	constructor(x,y,z,speedx,speedz,raio,mesh){
		super();
		this.speedx = speedx;    //definir atributos speed e aceleracao
		this.speedz = speedz;
		this.acelerationx = 0;
		this.acelerationz = 0;

		this.auxPosX = x;
		this.auxPosZ = z;
 		this.raio = raio;
 		this.dead = false;

		this.position.x = x;
	  	this.position.y = y;
	  	this.position.z = z;

	  	var boundingVolume = new THREE.Object3D();  //para ao carregarmos no espaco mostrarmos a bounding esfera
	  	var material = new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true})
	  	var geometry = new THREE.SphereGeometry(raio,20,20)
	  	var mesh = new THREE.Mesh(geometry,material);
	  	boundingVolume.add(mesh);
	  	boundingVolume.visible = false;
	  	boundingVolume.position.set(0,0,0);
	  	this.add(boundingVolume);
	  	this.boundingVolume = boundingVolume;
	}
	//------------------------ Funcoes para colisoes ----------------------
	update(timePassed){
		this.speedz = this.speedz + this.acelerationz*timePassed;
		this.speedx = this.speedx + this.acelerationx*timePassed;
		this.auxPosX = this.position.x + this.speedx*timePassed;
		this.auxPosZ = this.position.z + this.speedz*timePassed;
	}
	setPosition(){
		this.position.x = this.auxPosX;
		this.position.z = this.auxPosZ;
	}

	colidesWith(string){
		if(string == "width"){
			return ((this.auxPosX + this.raio > widthPlan/2)||(this.auxPosX-this.raio < -widthPlan/2))
		}
		else if(string == "height"){
			return ((this.auxPosZ-this.raio < -heightPlan/2 ) || (this.auxPosZ +this.raio > heightPlan/2))
		}
	}
	hasColision(object){
		if(Math.pow(this.raio+object.raio,2) >= (Math.pow(this.auxPosX-object.auxPosX,2)+
			Math.pow(this.auxPosZ-object.auxPosZ,2))){
			return true;
		}
		return false;
	}
	treatColision(object){}

	newPos(){}
	//-----------------------------------------------------------------------

}


/*----------------------------------- ALIEN -----------------------------------*/

class Alien extends GameObject{

	constructor(x, y, z,basicMaterial,phongMaterial,lambertMaterial,basicEyeMaterial,phongEyeMaterial,lambertEyeMaterial){
	  'use strict';

		var angle = Math.random() * (2*Math.PI);

	  super(x,y,z, 100*(Math.sin(angle)),100*(Math.cos(angle)),50);   //(x,y,z,speedx,speedz,raio)
		this.modulSpeed = 100;
	  this.addLegs(basicMaterial,phongMaterial,lambertMaterial);
	  this.addFeet(basicMaterial,phongMaterial,lambertMaterial);
	  this.addArms(basicMaterial,phongMaterial,lambertMaterial);
	  this.addTorus(basicMaterial,phongMaterial,lambertMaterial);
	  this.addEyes(basicEyeMaterial,phongEyeMaterial,lambertEyeMaterial);

	}

	addLegs(basicMaterial,phongMaterial,lambertMaterial){
	  'use strict';

	  var geometry = new THREE.CubeGeometry(15, 30, 10,5,5); //(width,height,depth,heightSegments,widthSegments)
	  var leg1 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
	  var leg2 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
	  leg1.position.set(-15, -45, 0);
	  leg2.position.set(15,-45, 0);
	  this.add(leg1);
	  this.add(leg2);
	}

	addFeet(basicMaterial,phongMaterial,lambertMaterial){
	  'use strict';

	  var geometry = new THREE.CubeGeometry(30,10,10,5);//(width,height,depth,heightSegments,widthSegments)
	  var foot1 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
	  var foot2 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
	  foot1.position.set(-20, -60, 0);
	  foot2.position.set(20,-60,0);
	  this.add(foot1);
	  this.add(foot2);
	}

	addEyes(basicMaterial,phongMaterial,lambertMaterial){ //cria os dois olhos do alien
		var geometry = new THREE.SphereGeometry(10,5,5);  //(radius, with segments,heigth segments)
		var eye1 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
		var eye2 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
		eye1.position.set(20,45,0);
		eye2.position.set(-20,45,0);
		this.add(eye1);
		this.add(eye2);
	}

	addArms(basicMaterial,phongMaterial,lambertMaterial){
		var geometry = new THREE.CylinderGeometry( 5, 5, 35, 5,7);   //(radiusTop, radiusBottom,height, radiusSegments,heightSegments)
		var arm1 = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
		var arm2 =  new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
	  	arm1.position.set(45, -15, 0); // -15 pois 15 é metade da altura e o inicio do braço é para ficar alinhado com o centro do alien em y
	  	arm2.position.set(-45, -15 ,0);
	  	this.add(arm1);
	 	this.add(arm2);
	}

	addTorus(basicMaterial,phongMaterial,lambertMaterial){
	  'use strict';

	  //var geometry = new THREE.TorusGeometry(30,15,15,30); //(radius, tube, radialSegments, tubularSegments)
	  var geometry = new THREE.SphereGeometry(40,15,15);
	  var mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);        //tube = diametro do tubo
	  mesh.position.set(0,0, 0);

	  this.add(mesh);
	}

   //------------------------- Funcoes para Colisoes ---------------------------
	treatColision(object){
		if(object instanceof Bullet || object instanceof Ship){
			this.dead = true;
		}
		else{
			this.speedx = -this.speedx;
			this.speedz = -this.speedz;
			this.auxPosX = this.position.x;
			this.auxPosZ = this.position.z;
		}

	}
	newPos(){
		if(this.colidesWith("width")){//limite direito do movimento
			this.speedx = -this.speedx;
		}
		else if (this.colidesWith("height")){ //limite em baixo do movimento dos aliens
			this.speedz = - this.speedz;
		}
		else{
			this.setPosition()
		}
	}
	//-----------------------------------------------------------------------

}
/*------------------------------------------------------------------------------*/


//----------------------------------- Ship -------------------------------------

class Ship extends GameObject{

	constructor(basicMaterial,phongMaterial,lambertMaterial){
	 	super(0,0,350,0,0,60);  //(x,y,z,speedx,speedz,raio)
	 	this.down = false
		//this.add(new THREE.AxisHelper(100))
		this.basicMaterial = basicMaterial
		this.addBase(basicMaterial,phongMaterial,lambertMaterial)
		this.addWings(basicMaterial,phongMaterial,lambertMaterial)
		this.addGun(basicMaterial,phongMaterial,lambertMaterial)

	}

	Set6Faces(geometry){
		geometry.faces.push(new THREE.Face3(2, 1, 0));
		geometry.faces.push(new THREE.Face3(3, 2, 0));

		geometry.faces.push(new THREE.Face3(4, 5, 6));
		geometry.faces.push(new THREE.Face3(4, 6, 7));

		geometry.faces.push(new THREE.Face3(3, 7, 6));
		geometry.faces.push(new THREE.Face3(6, 2, 3));

		geometry.faces.push(new THREE.Face3(5, 4, 0));
		geometry.faces.push(new THREE.Face3(5, 0, 1));

		geometry.faces.push(new THREE.Face3(6, 5, 1));
		geometry.faces.push(new THREE.Face3(6, 1, 2));

		geometry.faces.push(new THREE.Face3(0, 4, 7));
		geometry.faces.push(new THREE.Face3(0, 7, 3));

		geometry.computeFaceNormals ()
	}

	addWings(basicMaterial,phongMaterial,lambertMaterial){
		var wing1 = new THREE.Geometry()
		//cria uma piramide retangular
		wing1.vertices.push(new THREE.Vector3(30.0, 20.0, -5.0))
		wing1.vertices.push(new THREE.Vector3(30.0,  -20.0, -5.0))
		wing1.vertices.push(new THREE.Vector3(-30.0,  0.0, -5.0))
		wing1.vertices.push(new THREE.Vector3(30.0, 20.0, 5.0))
		wing1.vertices.push(new THREE.Vector3(30.0,  -20.0, 5.0))
		wing1.faces.push(new THREE.Face3(0, 1, 2));
		wing1.faces.push(new THREE.Face3(4, 1, 3));
		wing1.faces.push(new THREE.Face3(3, 2, 4));
		wing1.faces.push(new THREE.Face3(0, 3, 1));
		wing1.faces.push(new THREE.Face3(0, 2, 3));
		wing1.faces.push(new THREE.Face3(1, 4, 2));
		wing1.computeFaceNormals ()
		var mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,wing1);
		mesh.position.set(-30, 0, 0);
		this.add(mesh);

		var wing2 = new THREE.Geometry()
		wing2.vertices.push(new THREE.Vector3(-30.0, 20.0, -5.0))
		wing2.vertices.push(new THREE.Vector3(-30.0,  -20.0, -5.0))
		wing2.vertices.push(new THREE.Vector3(30.0,  0.0, -5.0))
		wing2.vertices.push(new THREE.Vector3(-30.0, 20.0, 5.0))
		wing2.vertices.push(new THREE.Vector3(-30.0,  -20.0, 5.0))
		wing2.faces.push(new THREE.Face3(0, 2, 1));
		wing2.faces.push(new THREE.Face3(4, 3, 1));
		wing2.faces.push(new THREE.Face3(3, 4, 2));
		wing2.faces.push(new THREE.Face3(0, 1, 3));
		wing2.faces.push(new THREE.Face3(0, 3, 2));
		wing2.faces.push(new THREE.Face3(1, 2, 4));
		wing2.computeFaceNormals ()
		mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,wing2);
		mesh.position.set(30, 0, 0);
		this.add(mesh);
	}
	addBase(basicMaterial,phongMaterial,lambertMaterial){
		var baseGeometry = new THREE.Geometry()
		//cria um paralelipipedo
		baseGeometry.vertices.push(new THREE.Vector3(10.0, -30.0, -10.0))
		baseGeometry.vertices.push(new THREE.Vector3(-10.0,  -30.0, -10.0))
		baseGeometry.vertices.push(new THREE.Vector3(-10.0,  -30.0, 10.0))
		baseGeometry.vertices.push(new THREE.Vector3(10.0, -30.0, 10.0))
		baseGeometry.vertices.push(new THREE.Vector3(10.0,  30.0, -10.0))
		baseGeometry.vertices.push(new THREE.Vector3(-10.0,  30.0, -10.0))
		baseGeometry.vertices.push(new THREE.Vector3(-10.0,  30.0, 10.0))
		baseGeometry.vertices.push(new THREE.Vector3(10.0,  30.0, 10.0))

		//cria as 6 faces do paralelipipedo
		this.Set6Faces(baseGeometry)

		var mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,baseGeometry);
		mesh.position.set(0, 0, 0);
		this.add(mesh);
	}

	addGun(basicMaterial,phongMaterial,lambertMaterial){
		var gunGeometry = new THREE.Geometry()
		gunGeometry.vertices.push(new THREE.Vector3(5.0, -15.0, -5.0))
		gunGeometry.vertices.push(new THREE.Vector3(-5.0,  -15.0, -5.0))
		gunGeometry.vertices.push(new THREE.Vector3(-5.0,  -15.0, 5.0))
		gunGeometry.vertices.push(new THREE.Vector3(5.0, -15.0, 5.0))
		gunGeometry.vertices.push(new THREE.Vector3(5.0,  25.0, -5.0)) //vertice topo
		gunGeometry.vertices.push(new THREE.Vector3(-5.0,  25.0, -5.0)) //vertice topo
		gunGeometry.vertices.push(new THREE.Vector3(-5.0,  15.0, 5.0))
		gunGeometry.vertices.push(new THREE.Vector3(5.0,  15.0, 5.0))

		//cria as 6 faces do prisma
		this.Set6Faces(gunGeometry)

		var mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,gunGeometry);
		mesh.position.set(0, 45, 0);
		this.add(mesh);
	}


	//-------------------------- Funcoes para colisoes -------------------------
	newPos(){
		if(this.colidesWith("width")){//limite direito do movimento
			this.acelerationx = 0;
			this.speedx = 0;
			if(this.auxPosX > 0){
				this.position.x = widthPlan/2-60; //50 vem da largura da nave
			}
			else{
				this.position.x = -widthPlan/2+60;
			}
		}
		else if ((this.acelerationx == acelerationx2 && this.speedx > 0) ||
			(this.acelerationx == -acelerationx2 && this.speedx < 0)){
				this.acelerationx = 0;
				this.acelerationz = 0;
				this.speedx = 0;
		}
		else{
			this.setPosition()
		}
	}
	treatColision(object){
		if(object instanceof Alien){
			this.down = true
		}
	}
	//-------------------------------------------------------------------------

	setLife(x,y,z){
		console.log(this.geometry)
		var geom = this.geometry.clone()
		var life = new THREE.Mesh(geom,this.basicMaterial)
		life.position.set(x,y,z);
		return life
	}
}

//-------------------------------------------------------------------------------------

//------------------------------------ BULLET -----------------------------------------
class Bullet extends GameObject{
	constructor(x,y,z,basicMaterial,phongMaterial,lambertMaterial){
		var geometry = new THREE.SphereGeometry(5,20,20)
		var mesh = new GameMesh(basicMaterial,phongMaterial,lambertMaterial,geometry);
		super(x,y,z,0,-500,5); //(x,y,z,speedx,speedz,raio)
		this.add(mesh);
	}
	//-------------------------- Funcoes para colisoes ----------------------

	treatColision(object){
		this.dead = true;
	}

	newPos(){
		if(this.colidesWith("height")){
			this.dead = true;
		}
		else{
			this.setPosition()
		}
	}
}
//-------------------------------------------------------------------------------------

//----------------------------- GameMesh ---------------------------------------------
class GameMesh extends THREE.Mesh{
	constructor(basicMaterial,phongMaterial,lambertMaterial,geometry){
		super(geometry,basicMaterial)
		this.basicMaterial = basicMaterial;
		this.phongMaterial = phongMaterial
		this.lambertMaterial = lambertMaterial
	}
}

//---------------------------- Message Plan -------------
class MessagePlan extends THREE.Mesh{
	constructor(){
		var geometry = new THREE.PlaneGeometry(200,200);
		var texturePause = new THREE.TextureLoader().load( "paus.bmp" )
		var material = new THREE.MeshBasicMaterial({map:texturePause});
		super(geometry,material);
		this.texturePause = texturePause;
		this.textureEndGame = new THREE.TextureLoader().load( "GameOver.bmp" );
	}
}