"use client";

import React from "react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng } from "html-to-image";

const imageWidth = 1024;
const imageHeight = 768;

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "flow_diagram.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

export default function DownloadButton() {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.1
    );

    const viewportEl = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement | null;

    if (!viewportEl) {
      console.error("Viewport element not found");
      return;
    }

    toPng(viewportEl, {
      backgroundColor: "#ffffff",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        onClick={onClick}
        className="px-4 py-2 text-black border-1 border-solid text-sm rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Download Image
      </button>
    </Panel>
  );
}