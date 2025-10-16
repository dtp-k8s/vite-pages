import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import LoginApp from "./LoginApp.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LoginApp />
	</StrictMode>,
);
