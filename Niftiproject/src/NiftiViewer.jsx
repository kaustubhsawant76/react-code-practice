import React, { useState, useRef, useEffect } from 'react';
import nifti from 'nifti-reader-js';
import * as THREE from 'three';

const NiftiViewer = () => {
    const [imageData, setImageData] = useState(null);
    const [currentSlice, setCurrentSlice] = useState(0);
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (imageData) {
            render3DImage();
        }
    }, [imageData, currentSlice, rotation]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            let buffer = reader.result;
            if (nifti.isCompressed(buffer)) {
                buffer = nifti.decompress(buffer);
            }
            if (nifti.isNIFTI(buffer)) {
                const niftiHeader = nifti.readHeader(buffer);
                const niftiImage = nifti.readImage(niftiHeader, buffer);
                setImageData({ header: niftiHeader, image: niftiImage });
                setCurrentSlice(0);
                setRotation(0);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const render3DImage = () => {
        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 2;

        const width = imageData.header.dims[1];
        const height = imageData.header.dims[2];
        const depth = imageData.header.dims[3];

        const volume = new THREE.DataTexture3D(new Uint8Array(imageData.image), width, height, depth);
        volume.format = THREE.RedFormat;
        volume.type = THREE.UnsignedByteType;
        volume.needsUpdate = true;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: volume, side: THREE.BackSide });
        const cube = new THREE.Mesh(geometry, material);

        cube.rotation.x = rotation * (Math.PI / 180);
        cube.rotation.y = rotation * (Math.PI / 180);
        cube.rotation.z = rotation * (Math.PI / 180);

        scene.add(cube);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    };

    const handleSliderChange = (event) => {
        setRotation(parseInt(event.target.value));
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {imageData && (
                <div>
                    <canvas ref={canvasRef} width={600} height={600} />
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={handleSliderChange}
                    />
                </div>
            )}
        </div>
    );
};

export default NiftiViewer;
