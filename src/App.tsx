import React, { useLayoutEffect, useState, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import logo from './logo.svg';
import './App.css';

import { Canvas, useFrame } from 'react-three-fiber';
import type { Mesh } from 'three';

import { ThemeProvider, theme, CSSReset,Button } from '@chakra-ui/core';

function Box(props: { position: [number, number, number] }) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(
    () =>
      ((mesh.current as Mesh).rotation.x = (mesh.current as Mesh).rotation.y += 0.01),
  );

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

interface AppProps {}


function App({}: AppProps) {
  const [count, setCount] = useState(0);
  const viewerRef = useRef<Cesium.Viewer>();
  const containerRef = useRef<HTMLDivElement>(null);
  const creditContainerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (
      !!containerRef.current &&
      !!creditContainerRef.current &&
      !viewerRef.current
    ) {
      const container = containerRef.current;
      const viewer = new Cesium.Viewer(container, {
        terrainProvider: Cesium.createWorldTerrain(),
        imageryProvider: new Cesium.OpenStreetMapImageryProvider({
          // url: 'https://a.tile.openstreetmap.org/',
          // url: 'https://a.tile.opentopomap.org/',
          url: 'http://a.tile.stamen.com/toner/',
        }),
        homeButton: false,
        fullscreenButton: false,
        skyAtmosphere: false,
        skyBox: false,
        timeline: false,
        geocoder: false,
        projectionPicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        animation: false,
        creditContainer: creditContainerRef.current,
        // shadows: true,
        // terrainShadows:Cesium.ShadowMode.ENABLED,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });
      viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);

      viewer.shadowMap.size = 4096;
      viewer.postProcessStages.fxaa.enabled = true;
      viewer.resolutionScale = 1.0;

      var osmBuildings = Cesium.createOsmBuildings({
        defaultColor: new Cesium.Color(0xffffff),
        style: new Cesium.Cesium3DTileStyle({}),
      });
      osmBuildings.maximumScreenSpaceError = 4;
      viewer.scene.primitives.add(osmBuildings);
      // Remove outline
      // https://github.com/CesiumGS/cesium/issues/8959#issuecomment-706048376
      // Cesium.ModelOutlineLoader.hasExtension = function () {
      //   return false;
      // };

      viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
        '2020-10-08T16:00:00Z',
      );

      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-9.14, 38.711, 300),
        orientation: {
          heading: Cesium.Math.toRadians(20),
          pitch: Cesium.Math.toRadians(-20),
        },
      });

      viewerRef.current = viewer;
    }
  });
  setTimeout(() => setCount(count + 1), 1000);
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <div className="App">
        <header className="App-header">
          <div ref={containerRef} style={{ width: 640, height: 480 }}></div>
          <div ref={creditContainerRef} style={{ display: 'none' }}></div>
          <Canvas style={{ width: 640, height: 480 }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
          </Canvas>
          <p>
            Page has been open for <code>{count}</code> seconds.
          </p>
          <Button>Ok</Button>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
