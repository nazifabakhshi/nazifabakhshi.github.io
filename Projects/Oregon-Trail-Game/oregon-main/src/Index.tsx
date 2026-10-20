import { createRoot, Root } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root: Root = createRoot(document.getElementById("main")!);
root.render(<App />);