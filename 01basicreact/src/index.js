import React, { useState, useRef } from 'react';
import nifti from 'nifti-reader-js';

const NiftiViewer = () => {
    const [imageData, setImageData] = useState(null);
    const [currentSlice, setCurrentSlice] = useState(0);
    const canvasRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result;
            if (nifti.isCompressed(buffer)) {
                buffer = nifti.decompress(buffer);
            }
            if (nifti.isNIFTI(buffer)) {
                const niftiHeader = nifti.readHeader(buffer);
                const niftiImage = nifti.readImage(niftiHeader, buffer);
                setImageData({ header: niftiHeader, image: niftiImage });
                setCurrentSlice(0);
                drawSlice(niftiImage, niftiHeader.dims[1], niftiHeader.dims[2], 0);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const drawSlice = (image, width, height, slice) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        const sliceSize = width * height;
        const start = slice * sliceSize;

        for (let i = 0; i < sliceSize; i++) {
            const value = image[start + i];
            imageData.data[i * 4] = value;
            imageData.data[i * 4 + 1] = value;
            imageData.data[i * 4 + 2] = value;
            imageData.data[i * 4 + 3] = 255; // Alpha channel
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const handleSliderChange = (event) => {
        const slice = parseInt(event.target.value);
        setCurrentSlice(slice);
        drawSlice(imageData.image, imageData.header.dims[1], imageData.header.dims[2], slice);
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {imageData && (
                <div>
                    <canvas ref={canvasRef} width={imageData.header.dims[1]} height={imageData.header.dims[2]} />
                    <input
                        type="range"
                        min="0"
                        max={imageData.header.dims[3] - 1}
                        value={currentSlice}
                        onChange={handleSliderChange}
                    />
                </div>
            )}
        </div>
    );
};

export default index;
