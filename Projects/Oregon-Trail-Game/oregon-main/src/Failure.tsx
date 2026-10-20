import { JSX } from "react";
import { Link } from "react-router";
import Backgrounds from "./Backgrounds";
import { setBackground } from "./BackgroundFrame";



const Failure = (): JSX.Element => {
    setBackground(Backgrounds.FAILURE);
    return(
        <>
		<h1>You failed to make it to Oregon...</h1>
        <Link id="restartButton" className="btn btn-outline-dark btn-light mt-5"
			style={{
				fontSize: '1.25vw',
				padding: '.5rem',
				borderWidth: '2px',
				fontFamily: 'OregonBound'
			}} to={"../"}>
				Main Menu
		</Link>
        </>
    )
}

export default Failure;