//load gltf is a pre created function jo threejs ke gltf loader se model load kara deta
import {loadGLTF, loadAudio, loadVideo} from "../../libs/loader.js";  // add type = 'module' in index.html to import


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/sidhantImageTargets.mind',
      maxTrack : 4
    });
    // mind AR ne apne aap sab bana diya when we instantiated the mindarthree object
    const {renderer, scene, camera} = mindarThree;
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(.1, .1, .1);
    raccoon.scene.position.set(0, -0.4, 0);
    raccoon.scene.userData.clickable = true

    // create anchor

    const raccoonAnchor = mindarThree.addAnchor(0);

    const songCaravan = await loadAudio('../../assets/sounds/caravan.mp3');
    const violinSolo = await loadAudio('../../assets/sounds/violin.mp3');

    const listener = new THREE.AudioListener();

    // positional audio for spatial audio
    const audio = new THREE.PositionalAudio(listener);

    raccoonAnchor.group.add(audio);
    camera.add(listener);

    // reference distance of audio source I have no idea how this scale works 500 seemed to be good after plugging 20 different values
    audio.setRefDistance(500);
   
    audio.setLoop(true);

    raccoonAnchor.group.add(raccoon.scene);

    // document.body.addEventListener('click', (e) => {
    //   // normalize to -1 to 1
    //   const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    //   const mouse = new THREE.Vector2(mouseX, mouseY);
    //   const raycaster = new THREE.Raycaster();
    //   raycaster.setFromCamera(mouse, camera);
    //   const intersects = raycaster.intersectObjects(scene.children, true);

    //   if (intersects.length > 0) 
    //   {
    //       let o = intersects[0].object; 
    //       while (o.parent && !o.userData.clickable) 
    //       {
    //         o = o.parent;
    //       }
    //       if (o.userData.clickable) 
    //       {
    //         if (o === raccoon.scene) 
    //         {

    //           //if(!audio.isPlaying)
    //           //{
    //             audio.play();
    //           //}
    //         //  else audio.pause();
              
    //         }
    //       }
    //   }
    // });

    raccoonAnchor.onTargetFound = () => {

      audio.setBuffer(songCaravan);
      audio.play();
      console.log("I see Raccoon");
    }
    raccoonAnchor.onTargetLost = () => {

      audio.pause();
      console.log("I don't see Raccoon");
    }

    const raccoonMixer = new THREE.AnimationMixer(raccoon.scene);
    const raccoonAction = raccoonMixer.clipAction(raccoon.animations[0]);
    raccoonAction.play();

   

    const bear = await loadGLTF('../../assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    const bearAnchor = mindarThree.addAnchor(1);
    bearAnchor.group.add(bear.scene);

    bearAnchor.onTargetFound = () => {

      audio.setBuffer(violinSolo);
      audio.play();
      console.log("I see bear");
    }
    bearAnchor.onTargetLost = () => {

      audio.pause();
      console.log("I don't see bear");
    }

    


 
  
    const dog = await loadGLTF('../../assets/models/dog.glb');
    dog.scene.scale.set(1,1,1);
    dog.scene.position.set(0, 0, 0);

    const dogAnchor = mindarThree.addAnchor(2);
    dogAnchor.group.add(dog.scene);

    // LOAD ROBOT

    const robot = await loadGLTF('../../assets/models/robot/RobotExpressive.glb');
    robot.scene.scale.set(0.2, 0.2, 0.2);
    robot.scene.position.set(0, -0.2, 0);

    const robotAnchor = mindarThree.addAnchor(3);
    robotAnchor.group.add(robot.scene);

    const robotmixer = new THREE.AnimationMixer(robot.scene);
    const idleAction = robotmixer.clipAction(robot.animations[2]);
    const jumpAction = robotmixer.clipAction(robot.animations[3]);
    const dieAction = robotmixer.clipAction(robot.animations[1]);
    const thumbsUpAction = robotmixer.clipAction(robot.animations[9]);
    const waveAction = robotmixer.clipAction(robot.animations[12]);

    // inko sabko ek baar chalaana tha but idle ko repeat karaana tha isliye baaki animations sirf ek baar loop karaayi
    thumbsUpAction.loop = THREE.LoopOnce;
    waveAction.loop = THREE.LoopOnce;
    jumpAction.loop = THREE.LoopOnce;
    dieAction.loop = THREE.LoopOnce;
 

    const model = await handpose.load();

    const waveGesture = new fp.GestureDescription('wave');
    for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      waveGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
      waveGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    }

    const dieGesture = new fp.GestureDescription('die');
    for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      dieGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
      dieGesture.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
      dieGesture.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
    }
    const jumpGesture = new fp.GestureDescription('jump');
    jumpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
    jumpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    jumpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
    jumpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
    for(let finger of [fp.Finger.Thumb, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
      jumpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
      jumpGesture.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
      jumpGesture.addDirection(finger, fp.FingerDirection.VerticalDown, 1.0);
    }

    const GE = new fp.GestureEstimator([
      fp.Gestures.ThumbsUpGesture,
      waveGesture,
      jumpGesture,
      dieGesture,
    ]);

     // start AR
     const clock = new THREE.Clock();
     await mindarThree.start(); // await is only used in asynchronus functions hence had to wrap the whole thing in async function to wait for AR to start
     renderer.setAnimationLoop(() => {
       const delta = clock.getDelta();
       raccoonMixer.update(delta);
       robotmixer.update(delta);
       renderer.render(scene, camera);
     });

    // await mindarThree.start();
    // renderer.setAnimationLoop(() => {
    //   renderer.render(scene, camera);
    // });

    let activeAction = idleAction;
    activeAction.play();
    const fadeToAction = (action, duration) => {
      if (activeAction === action) return;
      activeAction = action;
      activeAction.reset().fadeIn(duration).play();
    }
    robotmixer.addEventListener('finished', () => {
      fadeToAction(idleAction, 0.2);
    });

    const videoFeed = mindarThree.video;
    let skipCount = 0;
    const detect = async () => {
      if (activeAction !== idleAction) {
	window.requestAnimationFrame(detect);
	return;
      }
      if (skipCount < 10) {
	skipCount += 1;
	window.requestAnimationFrame(detect);
	return;
      }
      skipCount = 0;

      const predictions = await model.estimateHands(videoFeed);
      if (predictions.length > 0) {
	const estimatedGestures = GE.estimate(predictions[0].landmarks, 7.5);
	if (estimatedGestures.gestures.length > 0) {
	  const best = estimatedGestures.gestures.sort((g1, g2) => g2.confidence - g1.confidence)[0];
	  if (best.name === 'thumbs_up') {
      console.log("thumbs up");
	    fadeToAction(thumbsUpAction, 0.5);
	  } else if (best.name === 'wave') {
	    fadeToAction(waveAction, 0.5);
	  } else if (best.name === 'jump') {
	    fadeToAction(jumpAction, 0.5);
	  } else if (best.name === 'die') {
	    fadeToAction(dieAction, 0.5);
	  }
	}
      }
      window.requestAnimationFrame(detect);
    };
    window.requestAnimationFrame(detect);


    const sidhantvideo = await loadVideo("../../assets/videos/sidhantvideo.mp4");
    const texture = new THREE.VideoTexture(sidhantvideo);

    const geometry = new THREE.PlaneGeometry(1,1);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    const videoAnchor = mindarThree.addAnchor(4);
    videoAnchor.group.add(plane);

    videoAnchor.onTargetFound = () => {
      console.log("playing video");
      sidhantvideo.play();
    }
    videoAnchor.onTargetLost = () => {
      sidhantvideo.pause();
    }
    sidhantvideo.addEventListener( 'play', () => {
      sidhantvideo.currentTime = 0;
    });


   
  }
  start();
});
