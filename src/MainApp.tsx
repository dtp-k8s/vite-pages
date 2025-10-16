import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// const VALIDATE_API_ENDPOINT = "http://127.0.0.1:8000/validate";
const VALIDATE_API_ENDPOINT = "https://yc.ngrok.dev/api/auth/validate";

async function validateSessionToken(): Promise<Response> {
	// Grab the session token from cookies (automatically included in request)
	// We do this because our frontend and backend may be on different domains,
	// e.g. localhost:5173 (local Vite development environment) and yc.ngrok.dev (ngrok domain for
	// our Kubernetes cluster) or localhost:8000 (local FastAPI router).
	const sessionToken = Cookies.get("session_token");
	console.log("Session token from cookie:", sessionToken);

	if (!sessionToken) {
		return new Response("No session token found", { status: 401 });
	}

	// Validate the session token with the backend
	const response = await fetch(VALIDATE_API_ENDPOINT, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Session-Token": sessionToken,
		},
	});
	return response;
}

function MainApp() {
	const [msg, setMsg] = useState<string | null>(null);
	const [user, setUser] = useState<string | null>(null);

	useEffect(() => {
		validateSessionToken().then((response) => {
			if (response.ok) {
				const user = response.headers.get("X-Authorized-User");
				setUser(user);
				setMsg(`Logged in as: ${user}`);
			} else {
				response.text().then((text) => {
					setMsg(`Error ${response.status}, \n${text}`);
				});
			}
		});
	}, []);

	return (
		<>
			<h1>Main Page</h1>
			{msg && <p>{msg}</p>}
			{user && (
				<button
					type="button"
					onClick={() => {
						// Clear the session token cookie
						Cookies.remove("session_token");

						// Redirect to the login page
						window.location.href = "/login/";
					}}
				>
					Logout
				</button>
			)}
		</>
	);
}

export default MainApp;
