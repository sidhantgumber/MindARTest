const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/sidhant.mind',
    });
    // mind AR ne apne aap sab bana diya when we instantiated the mindarthree object
    const {renderer, scene, camera} = mindarThree;

    // create AR object
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 'red', transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

    // create anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    // start AR
    await mindarThree.start(); // await is only used in asynchronus functions hence had to wrap the whole thing in async function to wait for AR to start
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
