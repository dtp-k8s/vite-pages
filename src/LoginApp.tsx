import {
	Button,
	Card,
	Center,
	MantineProvider,
	PasswordInput,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Cookies from "js-cookie";
import { useState } from "react";

// const LOGIN_API_ENDPOINT = "http://localhost:30080/api/auth/login";
const LOGIN_API_ENDPOINT = "https://yc.ngrok.dev/api/auth/login";

/* ***************** LAYOUT ***************** */
function LoginApp() {
	return (
		<MantineProvider>
			{/* Center in viewport (both horizontally and vertically) */}
			<Center h="100vh">
				<LoginCard />
			</Center>
		</MantineProvider>
	);
}

function LoginCard() {
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			password: "",
		},
	});

	const [errMsg, setErrMsg] = useState<string | null>(null);

	return (
		<Card shadow="sm" padding="lg" style={{ width: 400 }}>
			{/* Card content */}
			<h1>DT Platform Demo</h1>
			<h2>Login</h2>
			<form
				onSubmit={form.onSubmit((values) => handleLogin(values, setErrMsg))}
			>
				<Stack gap="md">
					<TextInput
						{...form.getInputProps("username")}
						key={form.key("username")}
						size="md"
						label="Username"
						placeholder="Your username"
						required
					/>
					<PasswordInput
						{...form.getInputProps("password")}
						key={form.key("password")}
						size="md"
						label="Password"
						error={errMsg}
						placeholder="Your password"
						required
					/>
					<Button type="submit" size="md" fullWidth>
						Login
					</Button>
				</Stack>
			</form>
		</Card>
	);
}

/* ***************** CALLBACKS ***************** */
async function handleLogin(
	values: { username: string; password: string },
	setErrMsg: (msg: string | null) => void,
): Promise<void> {
	console.log(
		`Login with username: ${values.username}, password: ${values.password}`,
	);
	try {
		// Send login credentials as form data
		const myFormData = new FormData();
		myFormData.append("username", values.username);
		myFormData.append("password", values.password);
		const resp = await fetch(LOGIN_API_ENDPOINT, {
			mode: "cors",
			method: "POST",
			body: myFormData,
		});
		if (resp.ok) {
			const data = await resp.json();
			console.log("Login success:", data);
			Cookies.set("session_token", data.token, {
				expires: 1,
				sameSite: "None",
				secure: true,
			});
			setErrMsg(null);
			// Redirect to home page
			console.log(window.location.href);
			window.location.href = "/";
		} else {
			const data = await resp.json();
			const errMsg = data.detail || "Unknown error";
			setErrMsg(errMsg);
		}
	} catch {
		const errMsg = "Could not query login API";
		setErrMsg(errMsg);
	}
}

/* ***************** EXPORT ***************** */
export default LoginApp;
