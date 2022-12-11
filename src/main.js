//load gltf is a pre created function jo threejs ke gltf loader se model load kara deta
import {loadGLTF, loadAudio, loadVideo} from "../../libs/loader.js";  // add type = 'module' in index.html to import


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/sidhantfinal.mind',
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

    const clock = new THREE.Clock();

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

    // const skull = await loadGLTF('../../assets/models/skull.glb');
    // skull.scene.scale.set(1,1,1);
    // skull.scene.position.set(0, -0.4, 0);


    // const skullAnchor = mindarThree.addAnchor(2);
    // skullAnchor.group.add(skull.scene);
  
    const dog = await loadGLTF('../../assets/models/dog.glb');
    dog.scene.scale.set(1,1,1);
    dog.scene.position.set(0, 0, 0);

    const dogAnchor = mindarThree.addAnchor(2);
    dogAnchor.group.add(dog.scene);

    const video = await loadVideo("../../assets/videos/sidhantvideo.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1,1);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    const videoAnchor = mindarThree.addAnchor(3);
    videoAnchor.group.add(plane);

    videoAnchor.onTargetFound = () => {
      video.play();
    }
    videoAnchor.onTargetLost = () => {
      video.pause();
    }
    video.addEventListener( 'play', () => {
      video.currentTime = 0;
    });


    // start AR
    await mindarThree.start(); // await is only used in asynchronus functions hence had to wrap the whole thing in async function to wait for AR to start
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      raccoonMixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
