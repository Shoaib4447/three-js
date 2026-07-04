'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import rusty from '../public/textures/rusty.jpg';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Home() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);
    const clock = new THREE.Clock();





    // RGBE Loader
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/german_town_street_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    const loader = new GLTFLoader();

    loader.load('/models/2015_mercedes-benz_s65.glb', function (gltf) {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scaleFactor = 20 / maxDimension;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Recompute box after scaling, then place on ground
      box.setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= box.min.y; // lift so bottom sits at y=0
      scene.add(model);

    }, undefined, function (error) {

      console.error(error);

    });
    // Cube Geometry
    const cubegeometry = new THREE.BoxGeometry(3, 4, 4);
    const texture = new THREE.TextureLoader().load(rusty.src);
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5, metalness: 5, emissive: 'red', emissiveIntensity: 1 });
    const cube = new THREE.Mesh(cubegeometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    // Directional Light, Ambient Light, Point Light, Spot Light, Hemisphere Light, RectArea Light
    // const light = new THREE.PointLight(0xffffff, 2, 20, 1);
    // light.position.set(1, 4, 6);
    // light.castShadow = true;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;



    // Plane Geometry (floor)
    // const planeGeometry = new THREE.PlaneGeometry(100, 100);
    // const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -Math.PI / 2;
    // plane.position.y = -3;
    // plane.receiveShadow = true;

    // const helperDirectionalLight = new THREE.PointLightHelper(light, 5, 0xff0000);
    scene.add();


    // Capsule Geometry
    const capsuleGeometry = new THREE.CapsuleGeometry(1, 4, 0, 10);
    const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);

    // Circle Geometry
    const circleGeometry = new THREE.CircleGeometry(5, 100);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    // Line Geometry
    const geometry = new THREE.BoxGeometry(6, 3, 4, 5, 6);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges);

    // sphere Geometry
    const sphereGeometry = new THREE.SphereGeometry(2, 100, 40, 0, Math.PI * 2, 0, Math.PI);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Scene
    // scene.add(cube,light);

    camera.position.z = 15;
    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    controls.autoRotateSpeed = 5.0;

    controls.cursorStyle = 'grab';
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;



    function animate(time: number) {
      // window.requestAnimationFrame(animate);
      // cube.rotation.x = time / 2000;
      // cube.rotation.y = time / 1000;
      // cube.rotation.y = clock.getElapsedTime();
      controls.update();
      renderer.render(scene, camera);
    }

    return () => {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
}