import React, { JSX, useEffect } from "react";
import { setBackground } from "./BackgroundFrame";
import Backgrounds from "./Backgrounds";
import { Link } from "react-router";
import { Inventory } from "./GameInventory";
  // connect the helper function to this state setter

const MainMenu = (): JSX.Element => {
	Inventory.money = 0;
	Inventory.oxen = 8;
	Inventory.foodPounds = 0;
	Inventory.clothingSets = 0;
	Inventory.ammoRounds = 0;
	Inventory.spareWheels = 0;
	Inventory.spareAxles = 0;
	Inventory.spareTongues = 0;

	useEffect(() => {
    // Array of backgrounds to cycle through
    const slides = [Backgrounds.FORT, Backgrounds.SUCCESS, Backgrounds.TOWN, Backgrounds.MOUNTAIN];
    let index = 0;
	setBackground(slides[index]); // set the background immediately on loading in case of return from failure

    // Change background every 3 seconds
    const intervalId = setInterval(() => {
      index = (index + 1) % slides.length;
      setBackground(slides[index]);
    }, 3000);

    // Cleanup when component unmounts
    return () => clearInterval(intervalId);
  }, []);

	return (
		<>
			{/* Main menu */}
			<Link id="startButton" className="btn btn-outline-dark btn-light"
			style={{
				fontSize: '1.25vw',
				padding: '.5rem',
				borderWidth: '2px',
				fontFamily: 'OregonBound'
			}} to={"init-form"}>
				Start Game
			</Link>
		</>
	);
}

export default MainMenu;