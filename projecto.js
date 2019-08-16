var camera,cameraOrto,cameraPerspStatic,cameraPerspShip, cameraLives,directionalLight, spotLight, renderer,scene,nave,sceneLives;
var messagePlan,messageCamera,cameraAux 
var heightPlan= 900, numLives=3 , aliens = 8;
var widthPlan = 1300;
var viewSize = 1000;
var campAspect = widthPlan/heightPlan;
var keyPressed = 0;
var visible = false;
var phongOn = true;
var lightningOn = false;
var starsVisible = true;
var paused = false;
var gameOver = false;
var acelerationx = 1000;
var acelerationx2 = 2*acelerationx
var directionalLightIntensity = 1.5;
var starIntensity = 0.5
var materials = [] , bodyMaterials = [], eyeMaterials = []
var gameObjects = []
var stars = []
var lives = []
var pause = false;

function init(){
	createRenderer();
	createPerspShipCamera();
	createSpotLight();
	createClock();
	createScene();
	createOrtoCamera();
	camera = cameraOrto;
	createPerspStaticCamera();
	createCameraLives();
	createMessagesCamera(createMessagePlan())
	createDirectionalLight();
	createStars();
	render();

	window.addEventListener('resize',updateCamera);
	window.addEventListener("keydown",onKeyDown);
	window.addEventListener("keyup",onKeyUp);

}

function createRenderer(){
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.autoClear = false
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);

}

function render(){
	renderer.clear()
	renderer.setViewport( 0,0,300,200);
	renderer.render(scene,cameraLives);
	renderer.setViewport(0, 0,window.innerWidth,window.innerHeight)
	renderer.render(scene,camera);
	
	
}

//------------------------- Cameras ------------------------------------------

function createOrtoCamera(){
	var aspectRatio = window.innerWidth/window.innerHeight;
	if (aspectRatio > campAspect){
		cameraOrto = new THREE.OrthographicCamera(- (viewSize* aspectRatio)/2, (viewSize * aspectRatio)/2,
												viewSize/2, -viewSize/2,
												1,5000);
	}
	else{
		cameraOrto = new THREE.OrthographicCamera(-(viewSize*campAspect)/2, (viewSize*campAspect)/2,
												(viewSize*campAspect/aspectRatio)/2, (-viewSize*campAspect/aspectRatio)/2,
												1,5000);
	}
	cameraOrto.position.x = 0;
	cameraOrto.position.y = 500;				//manipula a posicao da camera afetando o modo com se ve a cena
	cameraOrto.position.z = 0;
	cameraOrto.up.set( 0, 0, -1 );				// manipula o vector up da camera
	cameraOrto.lookAt(scene.position);
}

function createPerspStaticCamera(){
	cameraPerspStatic = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,1,20000);
	cameraPerspStatic.position.x = 0;
	cameraPerspStatic.position.y = 200;
	cameraPerspStatic.position.z = 550;
	cameraPerspStatic.lookAt(scene.position);
}

function createPerspShipCamera(){
	cameraPerspShip = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,1,10000);
	cameraPerspShip.position.set(0,-40,60);
	cameraPerspShip.lookAt(new THREE.Vector3(0, 100,0));
	cameraPerspShip.up = new THREE.Vector3(0, 0,1);
}

function createCameraLives(){
	console.log("Camera vidas")
	cameraLives = new THREE.OrthographicCamera(- 300, 300,
												200, -200,
												1,500);
	cameraLives.position.x = 0;
	cameraLives.position.y = 0;				//manipula a posicao da camera afetando o modo com se ve a cena
	cameraLives.position.z = -1000;
	cameraLives.up.set( 0, 1, 0);				// manipula o vector up da camera
	cameraLives.lookAt(new THREE.Vector3(0,0,-1100));
}

function createMessagesCamera(){
	messageCamera = new THREE.OrthographicCamera(- 100, 100,
												100, -100,
												1,200);
	messageCamera.position.x = 0;
	messageCamera.position.y = -1000;				//manipula a posicao da camera afetando o modo com se ve a cena
	messageCamera.position.z = 0;
	messageCamera.up.set( 0, 0, -1);				// manipula o vector up da camera
	messageCamera.lookAt(messagePlan.position);
}

//------------------------- Update Cameras --------------------------------

function updateCamera(){
	if(window.innerWidth>0 && window.innerHeight>0){
		renderer.setSize(window.innerWidth,window.innerHeight);
		if (camera === cameraOrto){
			var newAspectRatio = window.innerWidth/window.innerHeight;
			if (newAspectRatio > campAspect){
				camera.left = (viewSize * newAspectRatio)/(-2);
				camera.right = (viewSize * newAspectRatio)/2;
				camera.bottom = (viewSize)/(-2);
				camera.top = (viewSize)/2;
			}
			else{
				// viewSize*campAspect é como se fosse o viewSize 2
				camera.left = (viewSize*campAspect)/(-2);  //para a camera ficar com a proporcao do campo de jogo em termos de largura
				camera.right = (viewSize*campAspect)/2;
				camera.bottom = (viewSize * campAspect/ newAspectRatio)/(-2);
				camera.top = (viewSize * campAspect/ newAspectRatio)/2;
			}
		}
		else{
			camera.aspect = window.innerWidth/window.innerHeight;
		}
		camera.updateProjectionMatrix();
	}
}
//---------------------------------------------------------------------------

//-------------------------------- LUZES ------------------------------------
function createDirectionalLight(){
	directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity); //(hex, intensity)
	directionalLight.position.set(1,10,1); //direcao
	scene.add(directionalLight);
}

function createStars(){
	var x = -widthPlan/2+ 1.5*widthPlan/5;   // 1.5 para aparecerem no meio dos aliens
 	var z = 50+heightPlan/2 - heightPlan/3;  //  construi primeiro a linha de baixo
 	var y = 150;
 	var i,j;									// por causa da rotacao
 	for( i=1;i<=2;i++){							//linhas
 		for(j=1; j<=3 ;j++){				//colunas
 			var light = new THREE.PointLight(0xecc113,starIntensity);
			light.position.set( x, y, z );
			var geometry = new THREE.SphereGeometry( 5, 12, 6 );
     		var material = new THREE.MeshBasicMaterial( { color: 0xecc113 } );
     		var sphere = new THREE.Mesh( geometry, material );
     		light.add( sphere );
			scene.add( light );
			stars.push(light)
 			x = x+ widthPlan/5;
 		}
 		z = z - heightPlan/3;
 		x = -widthPlan/2+ 1.5*widthPlan/5;
 	}
}

function createSpotLight(){
	spotLight = new THREE.SpotLight( 0xffffff,50,heightPlan/2);
	spotLight.position.set(0, 0, 100);
    spotLight.target.position.set(0,100,10);

}
//---------------------------------------------------------------------------------------

//-------------------------------------------- Funcoes Auxiliares--------------------------------------------------

function createClock(){
	clock = new THREE.Clock();
}

function createScene(){
	scene = new THREE.Scene();
	//scene.add(new THREE.AxisHelper(100));
	createBackground();
	createAlienPlan();
	createAlienMaterials()
	addAliens();
	createShip();
	createLivesPlan()
}

function createBackground(){
	var geometry = new THREE.PlaneGeometry(7000,3500);
    var texture = new THREE.TextureLoader().load( "stars2.jpg" );
	var material = new THREE.MeshBasicMaterial({map: texture});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(0,0,-450);
	mesh.rotateX(-Math.PI/4);
	scene.add(mesh);
}

function createMessagePlan(){
	console.log("Plano mensagens")
	messagePlan = new MessagePlan()
	messagePlan.position.set(0,-1100,0);
	messagePlan.rotateX(-Math.PI/2);
	scene.add(messagePlan);
}

function setMessage(){
	camera = messageCamera
	if(paused){
		messagePlan.material.map = messagePlan.texturePause
	}
	else{
		messagePlan.material.map = messagePlan.textureEndGame
	}

}

function createLivesPlan(){
	var material = new THREE.MeshBasicMaterial({color:0xff4600 , wireframe: false})
	var x = -100
	for( i=0;i<=2;i++){
		var life = new Ship(material,null,null)
		life.position.set(x,0,-1100)
		x += 130
		lives.push(life)
		scene.add(life)
	}
}

function createAlienPlan(){   //cria o plano onde vao estar os aliens
	var geometry = new THREE.PlaneGeometry(widthPlan,heightPlan);
	var material = new THREE.MeshBasicMaterial({visible:false});
	var mesh = new THREE.Mesh(geometry,material);
	mesh.position.set(0,-30,0);
	mesh.rotateX(-Math.PI/2);
	scene.add(mesh);
}

 //---------------------- Criar filas de aliens -------------------------------
 function createAlienMaterials(){
 	var color = 0xff4600
 	var basicMaterial = new THREE.MeshBasicMaterial({color: color, wireframe:true});
 	var phongMaterial = new THREE.MeshPhongMaterial({color:color, shininess:70,specular:0xd709f2})
 	var lambertMaterial = new THREE.MeshLambertMaterial({color:color})
 	materials.push(basicMaterial)
 	bodyMaterials.push(basicMaterial)
 	bodyMaterials.push(phongMaterial)
 	bodyMaterials.push(lambertMaterial)
 	var basicEyeMaterial = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});
 	var phongEyeMaterial = new THREE.MeshPhongMaterial({color:0xff0000})
 	var lambertEyeMaterial = new THREE.MeshLambertMaterial({color:0xff0000})
	materials.push(basicEyeMaterial)
	eyeMaterials.push(basicEyeMaterial)
 	eyeMaterials.push(phongEyeMaterial)
 	eyeMaterials.push(lambertEyeMaterial)
 }
 function addAliens(){ //adiciona 8 aliens a cena
 	var x = -widthPlan/2+ widthPlan/5;
 	var z = -90 + heightPlan/2 - heightPlan/3;  // o centro do sitio dos aliens esta (0,0,-90); construi primeiro a linha de baixo
 	var y = 0;									// os valores do centro em z (do 2D) correspondem aos valores em y quando pensamos na figura em 3D.
 	var i,j;									// por causa da rotacao
 	for( i=1;i<=2;i++){							//linhas
 		for(j=1; j<=4 ;j++){					//colunas
 			a = new Alien(x,y,z,bodyMaterials[0],bodyMaterials[1],bodyMaterials[2],eyeMaterials[0],eyeMaterials[1],eyeMaterials[2]);
 			scene.add(a)
			gameObjects.push(a);
 			x = x+ widthPlan/5;
 		}
 		z = z - heightPlan/3;
 		x = -widthPlan/2+ widthPlan/5;
 	}
 }


//---------------------------------------------------------------------------

function createShip(){
	var basicMaterial = new THREE.MeshBasicMaterial({color: 0x4000ff, wireframe:true});
 	var phongMaterial = new THREE.MeshPhongMaterial({color:0x4000ff, shininess:100, specular:0xffffff})
 	var lambertMaterial = new THREE.MeshLambertMaterial({color:0x4000ff})
	materials.push(basicMaterial)
	nave = new Ship(basicMaterial,phongMaterial,lambertMaterial);
	nave.add(cameraPerspShip);
	nave.add(spotLight)
    nave.add(spotLight.target)
	nave.rotateX (-Math.PI/2);
	scene.add(nave);
	gameObjects.push(nave);
}

function createBullet(){
	var basicMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
 	var phongMaterial = new THREE.MeshPhongMaterial({color:0xffffff})
 	var lambertMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
	var bullet = new Bullet(nave.position.x,nave.position.y,nave.position.z - 60,basicMaterial,phongMaterial,lambertMaterial);
	if(lightningOn){
		var bulletMesh = bullet.children[1]
		if(phongOn){
			bulletMesh.material = bulletMesh.phongMaterial
		}
		else{
			bulletMesh.material = bulletMesh.lambertMaterial
		}
	}
	gameObjects.push(bullet);
	scene.add(bullet);
}


//-----------------------Key Down-------------------------------------------
function onKeyDown(tecla){
	switch (tecla.keyCode){
		case 67://C desliga e liga as estrelas
		case 99://c
			for (e in stars){
				stars[e].visible = !stars[e].visible
			}
			break;

		case 71://G  Muda entre sombreamento Gouraud e Phong
		case 103://g
			if(lightningOn){
				for (i in gameObjects){
					var children = gameObjects[i].children //as mesh sao children do objecto
					for (e in children){
						if (children[e] instanceof GameMesh){
							if(phongOn){
								children[e].material = children[e].lambertMaterial
							}

							else{
								children[e].material = children[e].phongMaterial
							}
						}
					}
				}

				phongOn =!phongOn
			}
			break;

		case 76://L desliga e liga o calculo da iluminacao (passa para basicMaterial ou respetivamente)
		case 108://l
			if(lightningOn){
				for (i in gameObjects){
					var children = gameObjects[i].children
					for (e in children){
						if (children[e] instanceof GameMesh){
							children[e].material = children[e].basicMaterial
							console.log(children[e].material)
						}
					}
				}
			}
			else{
				for (i in gameObjects){
					var children = gameObjects[i].children
					for (e in children){
						if (children[e] instanceof GameMesh){
							children[e].material = children[e].phongMaterial
							console.log(children[e].material)
						}
					}
				}
			}
			lightningOn = !lightningOn
			break;

		case 78: //N Liga e desliga a luz direcional
		case 110: //n

			directionalLight.visible = !directionalLight.visible;
			break;

		case 32://space
			if(visible){
				visible = false;
				for (e in gameObjects){
					gameObjects[e].boundingVolume.visible = false;
				}
			}
			else{
				visible = true;
				for (e in gameObjects){
					gameObjects[e].boundingVolume.visible = true;
				}
			}
			break;
            
        case 72://H
        case 104://h
            spotLight.visible = !spotLight.visible
            break
            
		case 66:// B
		case 87:// b
			if(!paused){
				if (keyPressed != 0){
					keyPressed--;
				}
				else{
					keyPressed = 5;
					createBullet();
				}
			}
			break;

		case 49:
			if(!paused){
				camera = cameraOrto;
				updateCamera();
			}
			break;
		case 50:
			if(!paused){
				camera = cameraPerspStatic;
				updateCamera();
			}
			break;
		case 51:
			if(!paused){
				camera = cameraPerspShip;
				updateCamera();
			}
			break;
		case 65://A
		case 86://a
			for (e in materials){
				materials[e].wireframe = !materials[e].wireframe
			}
			break;
		case 37:  //seta esquerda
			if(!paused){
				if(nave.acelerationx == 0){
					nave.acelerationx = -acelerationx; //troca o sinal da aceleracao
				}
				else if(nave.acelerationx > 0){
					nave.acelerationx = -acelerationx2;
				}
			}
			break;

		case 39:  //seta direita
			if(!paused){
				if(nave.acelerationx == 0){
					nave.acelerationx = acelerationx;
				}
				else if(nave.acelerationx < 0){
					nave.acelerationx = acelerationx2;
				}
			}
			break;

		case 82://R
		case 114://r
			if(gameOver){
				aliens = 8
				numLives = 3
				for(i=0;i<numLives;i++)
					lives[i].visible = true
			
				for(e in gameObjects){
					if(!(gameObjects[e] instanceof Ship))
						scene.remove(gameObjects[e])
				}
				gameObjects = [nave]
				addAliens()
				nave.position.x = 0
				camera = cameraOrto
			}
			gameOver = false
			break;
		case 83: //S
		case 115://s
			if(!gameOver){
				paused = !paused
				if(paused){
					cameraAux = camera
					setMessage()
				}
				else{
					camera = cameraAux
				}
			}
			break;
}}

//------------------------- Key Up ------------------------------------------
function onKeyUp(tecla){
	switch(tecla.keyCode){
		case 66:
		case 87:
			keyPressed = 0;
			break;
		case 37://seta esquerda
			nave.acelerationx = acelerationx2;
			break;
		case 39://seta direita
			nave.acelerationx = -acelerationx2;
			break;
	}
}

//---------------------------------------------------------------------------

function animation(){
	var e,i;
	timePassed = clock.getDelta();
	if(paused){
		timePassed = 0
	}
	for (e in gameObjects){
		(gameObjects[e]).update(timePassed);
	}
	for(e=0; e<gameObjects.length;e++){
		for(i=e+1;i<gameObjects.length;i++){
			if (gameObjects[e].hasColision(gameObjects[i])){
				gameObjects[e].treatColision(gameObjects[i]);
				gameObjects[i].treatColision(gameObjects[e]);
			}
		}
		(gameObjects[e]).newPos();
		if(gameObjects[e].dead){
			scene.remove(gameObjects[e]);
			if( gameObjects[e] instanceof Alien){
				aliens--
			}
			gameObjects.splice(e,1)
			e--;
		}
	}
	if(nave.down){
		numLives --
		lives[numLives].visible = false
		nave.down = false
	}
	if (numLives == 0 || aliens == 0){
		gameOver = true
		setMessage()
	}
	render();
	requestAnimationFrame(animation);
}
