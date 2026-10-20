import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import BackgroundMusic, { changeMusic } from "./Music";
import { BackgroundFrame, attachSetBackground } from "./BackgroundFrame";
import PageController from "./PageController";


const INITIAL_BG = "/images/BGFort.bmp";

function App() {
    React.useEffect(() => {
      document.body.style.color = "white";
      document.body.style.fontFamily = "OregonBound, monospace";
    }, []);
  
    const [imgSrc, setImgSrc] = useState<string>(INITIAL_BG);
    useEffect(() => {
        attachSetBackground(setImgSrc);
    }, []);

  return (
    <BrowserRouter>
      <style>{`
        html, body {
          width: 100vw;
          height: 100vh;
          margin: 0;
        }
                
        body {
          color: white;
          font-family: "OregonBound", monospace;
        } 

        @font-face {
          font-family: "OregonBound";
          src: url("/fonts/oregon-bound.otf") format("opentype");
          font-weight: normal;
          font-style: normal;
        }

        input, select, button, label {
          font-family: inherit;
        }
      `}</style>
      <BackgroundFrame imgSrc={imgSrc}>
        <PageController />
        <BackgroundMusic initial="/music/Menu.mp3" />
      </BackgroundFrame>
    </BrowserRouter>
  );
}
export default App;