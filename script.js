const correctPassword = "admin123";

function openAuthModal() {
	document.getElementById("auth-modal").style.display = "flex";
}

function authenticateAccess() {
	let inputPassword = document.getElementById("auth-password").value;
	let errorMessage = document.getElementById("auth-error");

	if (inputPassword === correctPassword) {
		document.getElementById("auth-modal").style.display = "none";
		document.getElementById("advanced-panel").style.display = "block";
		document.getElementById("auth-password").value = "";
	} else {
		errorMessage.style.display = "block";
		document.getElementById("auth-password").value = "";
		errorMessage.innerText = "Incorrect password!";
	}
}
function closeAuthModal() {
	document.getElementById("auth-modal").style.display = "none";
}
function closeAdvancedPanel() {
	document.getElementById("advanced-panel").style.display = "none";
}

function toggleSecurity() {
	let statusText = document.getElementById("status-text");
	let statusIndicator = document.getElementById("status-indicator");

	if (statusText.innerText === "Not Armed") {
		statusText.innerText = "Armed";
		statusIndicator.classList.remove("red");
		statusIndicator.classList.add("green");

		statusIndicator.style.animation = "blip-green 1.5s infinite alternate";
	} else {
		statusText.innerText = "Not Armed";
		statusIndicator.classList.remove("green");
		statusIndicator.classList.add("red");

		statusIndicator.style.animation = "blip-red 1.5s infinite alternate";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	if (localStorage.getItem("dark-mode") === "enabled") {
		document.body.classList.add("dark-mode");
	}
});

function toggleDarkMode() {
	document.body.classList.toggle("dark-mode");

	if (document.body.classList.contains("dark-mode")) {
		localStorage.setItem("dark-mode", "enabled");
	} else {
		localStorage.setItem("dark-mode", "disabled");
	}
}

function openDeviceModal() {
	document.getElementById("device-modal").style.display = "flex";
}

function closeDeviceModal() {
	document.getElementById("device-modal").style.display = "none";
}

function registerDevice() {
	let name = document.getElementById("device-name").value.trim();
	let type = document.getElementById("device-type").value;
	let id = document.getElementById("device-id").value.trim();
	let errorMsg = document.getElementById("device-error");

	if (name === "" || id === "") {
		errorMsg.innerText = "Please fill in all fields.";
		errorMsg.style.display = "block";
		return;
	}

	let device = {
		name: name,
		type: type,
		id: id,
	};

	let devices = JSON.parse(localStorage.getItem("devices")) || [];
	devices.push(device);
	localStorage.setItem("devices", JSON.stringify(devices));

	updateDeviceList();
	closeDeviceModal();

	document.getElementById("device-name").value = "";
	document.getElementById("device-id").value = "";
}

function updateDeviceList() {
	let deviceList = document.getElementById("device-list");
	deviceList.innerHTML = "";

	let devices = JSON.parse(localStorage.getItem("devices")) || [];
	devices.forEach((device) => {
		let li = document.createElement("li");
		li.innerHTML = `<strong>${device.name}</strong> (${device.type}) - ID: ${device.id} <button class="close-auth" onclick="removeDevice('${device.id}')">Remove</button>`;
		deviceList.appendChild(li);
	});
}

function removeDevice(id) {
	let devices = JSON.parse(localStorage.getItem("devices")) || [];
	devices = devices.filter((device) => device.id !== id);
	localStorage.setItem("devices", JSON.stringify(devices));
	updateDeviceList();
}

document.addEventListener("DOMContentLoaded", updateDeviceList);

function openLightsModal() {
	document.getElementById("lights-modal").style.display = "flex";
}

function closeLightsModal() {
	document.getElementById("lights-modal").style.display = "none";
}

function toggleRoomLight(room) {
	let lightIndicator = document.getElementById(`${room}-light`);
	let lightsState = JSON.parse(localStorage.getItem("lightsState")) || {};

	if (lightsState[room]) {
		lightsState[room] = false;
		lightIndicator.classList.remove("light-on");
	} else {
		lightsState[room] = true;
		lightIndicator.classList.add("light-on");
	}

	localStorage.setItem("lightsState", JSON.stringify(lightsState));
}

document.addEventListener("DOMContentLoaded", function () {
	let lightsState = JSON.parse(localStorage.getItem("lightsState")) || {};
	Object.keys(lightsState).forEach((room) => {
		if (lightsState[room]) {
			document.getElementById(`${room}-light`).classList.add("light-on");
		}
	});
});

let selectedRoom = null;

function openThermostatModal() {
	document.getElementById("thermostat-modal").style.display = "flex";
}

function closeThermostatModal() {
	document.getElementById("thermostat-modal").style.display = "none";
}

function openTempControl(room) {
	selectedRoom = room;
	let slider = document.getElementById("temp-slider");
	let tempData = JSON.parse(localStorage.getItem("roomTemperatures")) || {};

	slider.value = tempData[room] || 22;

	document.getElementById("temp-slider-container").classList.remove("hidden");

	updateTemp();
}

function updateTemp() {
	if (!selectedRoom) return;

	let slider = document.getElementById("temp-slider");
	let temp = slider.value;
	let display = document.getElementById(`${selectedRoom}-display`);
	let bar = document.getElementById(`${selectedRoom}-bar`);

	display.innerText = `${temp}°C`;
	bar.style.width = `${(temp - 16) * 5}%`;
	bar.style.background = `linear-gradient(90deg, #3498db ${
		100 - (temp - 16) * 5
	}%, #e74c3c)`;

	let tempData = JSON.parse(localStorage.getItem("roomTemperatures")) || {};
	tempData[selectedRoom] = temp;
	localStorage.setItem("roomTemperatures", JSON.stringify(tempData));
}

document.addEventListener("DOMContentLoaded", function () {
	let tempData = JSON.parse(localStorage.getItem("roomTemperatures")) || {};
	Object.keys(tempData).forEach((room) => {
		let display = document.getElementById(`${room}-display`);
		let bar = document.getElementById(`${room}-bar`);

		if (display && bar) {
			display.innerText = `${tempData[room]}°C`;
			bar.style.width = `${(tempData[room] - 16) * 5}%`;
			bar.style.background = `linear-gradient(90deg, #3498db ${
				100 - (tempData[room] - 16) * 5
			}%, #e74c3c)`;
		}
	});
});
