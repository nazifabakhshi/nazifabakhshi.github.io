import React from "react";
type BackgroundFrameProps = {
    children?: React.ReactNode;
    imgSrc: string;
};

let _setBg: ((path: string) => void) | null = null;
let _currentBg: string | null = null;


function attachSetBackground(setter: (path: string) => void): void {
    _setBg = (path: string ) =>{
        _currentBg = path;
        setter(path);
    }; // just store App's setState function
}

function setBackground(path: string): void {
    _currentBg = path;
    if (_setBg) _setBg(path); // directly update React state
}

const BackgroundFrame = ({ imgSrc, children }: BackgroundFrameProps) => {
    React.useEffect(() => {
        _currentBg = imgSrc;
    }, [imgSrc])
    return (
        <>
            <div className="my-auto w-100 h-100 p-0" style= {{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
                <div className="row h-100 g-0 m-0">
                    <div id="main" className="col-12 d-flex flex-column align-items-center justify-content-center text-center h-100">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
function getCurrentBackground(): string | null {
    return _currentBg;
}


export {BackgroundFrame, setBackground, attachSetBackground, getCurrentBackground};