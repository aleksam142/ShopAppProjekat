var host = "https://localhost:";
var port = "44301/";
var sellersEndpoint = "api/sellers/";
var shopsEndpoint = "api/shops/";
var statisticsEndpoint = "api/statistics/";
var loginEndpoint = "api/authentication/login";
var registerEndpoint = "api/authentication/register";
var formAction = "Create";
var editingId;
var jwt_token;

function loadPage() {
	loadSellers();
}

function showLogin() {
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("statisticsDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "block";
	document.getElementById("registerFormDiv").style.display = "none";
	document.getElementById("logout").style.display = "none";
}

function validateRegisterForm(username, email, password, confirmPassword) {
	if (username.length === 0) {
		alert("Username field can not be empty.");
		return false;
	} else if (email.length === 0) {
		alert("Email field can not be empty.");
		return false;
	} else if (password.length === 0) {
		alert("Password field can not be empty.");
		return false;
	} else if (confirmPassword.length === 0) {
		alert("Confirm password field can not be empty.");
		return false;
	} else if (password !== confirmPassword) {
		alert("Password value and confirm password value should match.");
		return false;
	}
	return true;
}

function registerUser() {
	var username = document.getElementById("usernameRegister").value;
	var email = document.getElementById("emailRegister").value;
	var password = document.getElementById("passwordRegister").value;
	var confirmPassword = document.getElementById("confirmPasswordRegister").value;

	if (validateRegisterForm(username, email, password, confirmPassword)) {
		var url = host + port + registerEndpoint;
		var sendData = { "Username": username, "Email": email, "Password": password };
		fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) })
			.then((response) => {
				if (response.status === 200) {
					document.getElementById("registerForm").reset();
					console.log("Successful registration");
					alert("Successful registration");
					showLogin();
				} else {
					console.log("Error occured with code " + response.status);
					console.log(response);
					alert("Error occured!");
					response.text().then(text => { console.log(text); })
				}
			})
			.catch(error => console.log(error));
	}
	return false;
}

function showRegistration() {
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("statisticsDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "none";
	document.getElementById("registerFormDiv").style.display = "block";
	document.getElementById("logout").style.display = "none";
}

function validateLoginForm(username, password) {
	if (username.length === 0) {
		alert("Username field can not be empty.");
		return false;
	} else if (password.length === 0) {
		alert("Password field can not be empty.");
		return false;
	}
	return true;
}

function loginUser() {
	var username = document.getElementById("usernameLogin").value;
	var password = document.getElementById("passwordLogin").value;

	if (validateLoginForm(username, password)) {
		var url = host + port + loginEndpoint;
		var sendData = { "Username": username, "Password": password };
		fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendData) })
			.then((response) => {
				if (response.status === 200) {
					document.getElementById("loginForm").reset();
					console.log("Successful login");
					alert("Successful login");
					response.json().then(function (data) {
						console.log(data);
						document.getElementById("info").innerHTML = "Currently logged in user: <i>" + data.username + "<i/>.";
						document.getElementById("logout").style.display = "block";
						setupPopper();

						document.getElementById("btnLogin").style.display = "none";
						document.getElementById("btnRegister").style.display = "none";

						jwt_token = data.token;
						loadSellers();
						loadShopsForDropdown();
					});
				} else {
					console.log("Error occured with code " + response.status);
					console.log(response);
					alert("Error occured!");
					response.text().then(text => { console.log(text); })
				}
			})
			.catch(error => console.log(error));
	}
	return false;
}


function loadSellers() {
	document.getElementById("loginFormDiv").style.display = "none";
	document.getElementById("registerFormDiv").style.display = "none";

	var requestUrl = host + port + sellersEndpoint;
	console.log("URL zahteva: " + requestUrl);
	var headers = {};
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}
	console.log(headers);
	fetch(requestUrl, { headers: headers })
		.then((response) => {
			if (response.status === 200) {
				if (jwt_token) {
					loadStatistics();
				}
				response.json().then(setSellers);
			} else {
				console.log("Error occured with code " + response.status);
				showError();
			}
		})
		.catch(error => console.log(error));
}

function showError() {
	var container = document.getElementById("data");
	container.innerHTML = "";

	var div = document.createElement("div");
	var h1 = document.createElement("h1");
	var errorText = document.createTextNode("Error occured while retrieving data!");

	h1.appendChild(errorText);
	div.appendChild(h1);
	container.append(div);
}

function setSellers(data) {
	var container = document.getElementById("data");
	container.innerHTML = "";

	console.log(data);

	var div = document.createElement("div");
	var h1 = document.createElement("h1");
	var headingText = document.createTextNode("Sellers");
	h1.appendChild(headingText);
	div.appendChild(h1);

	var table = document.createElement("table");
	table.className = "table table-hover";

	var header = createHeader();
	table.append(header);

	var tableBody = document.createElement("tbody");

	for (var i = 0; i < data.length; i++) {
		var row = document.createElement("tr");
		row.appendChild(createTableCell(data[i].id));
		row.appendChild(createTableCell(data[i].name + " " + data[i].surname));

		if (jwt_token) {
			row.appendChild(createTableCell(data[i].year));
			row.appendChild(createTableCell(data[i].shopName));
			row.appendChild(createTableCell(data[i].shopAddress));

			var stringId = data[i].id.toString();

			var buttonEdit = document.createElement("button");
			buttonEdit.name = stringId;
			buttonEdit.addEventListener("click", editSeller);
			buttonEdit.className = "btn btn-warning";
			var buttonEditText = document.createTextNode("Edit");
			buttonEdit.appendChild(buttonEditText);
			var buttonEditCell = document.createElement("td");
			buttonEditCell.appendChild(buttonEdit);
			row.appendChild(buttonEditCell);

			var buttonDelete = document.createElement("button");
			buttonDelete.name = stringId;
			buttonDelete.addEventListener("click", deleteSeller);
			buttonDelete.className = "btn btn-danger";
			var buttonDeleteText = document.createTextNode("Delete");
			buttonDelete.appendChild(buttonDeleteText);
			var buttonDeleteCell = document.createElement("td");
			buttonDeleteCell.appendChild(buttonDelete);
			row.appendChild(buttonDeleteCell);
		}
		tableBody.appendChild(row);
	}

	table.appendChild(tableBody);
	div.appendChild(table);

	if (jwt_token) {
		document.getElementById("formDiv").style.display = "block";
		document.getElementById("statisticsDiv").style.display = "block";
	}
	container.appendChild(div);
}

function createHeader() {
	var thead = document.createElement("thead");
	var row = document.createElement("tr");
	
	row.appendChild(createTableHeaderCell("Id"));
	row.appendChild(createTableHeaderCell("Seller"));

	if (jwt_token) {
		row.appendChild(createTableHeaderCell("Year of birth"));
		row.appendChild(createTableHeaderCell("Shop name"));
		row.appendChild(createTableHeaderCell("Shop address"));
		row.appendChild(createTableHeaderCell("Edit"));
		row.appendChild(createTableHeaderCell("Delete"));
	}

	thead.appendChild(row);
	return thead;
}

function createTableHeaderCell(text) {
	var cell = document.createElement("th");
	var cellText = document.createTextNode(text);
	cell.appendChild(cellText);
	return cell;
}

function createTableCell(text) {
	var cell = document.createElement("td");
	var cellText = document.createTextNode(text);
	cell.appendChild(cellText);
	return cell;
}

function loadShopsForDropdown() {
	var requestUrl = host + port + shopsEndpoint;
	console.log("URL zahteva: " + requestUrl);

	var headers = {};
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(requestUrl, {headers: headers})
		.then((response) => {
			if (response.status === 200) {
				response.json().then(setShopsInDropdown);
			} else {
				console.log("Error occured with code " + response.status);
			}
		})
		.catch(error => console.log(error));
};

function setShopsInDropdown(data) {
	var dropdown = document.getElementById("sellerShop");
	dropdown.innerHTML = "";
	for (var i = 0; i < data.length; i++) {
		var option = document.createElement("option");
		option.value = data[i].id;
		var text = document.createTextNode(data[i].name);
		option.appendChild(text);
		dropdown.appendChild(option);
	}
}

function submitSellerForm() {

	var sellerName = document.getElementById("sellerName").value;
	var sellerSurname = document.getElementById("sellerSurname").value;
	var sellerYear = document.getElementById("sellerYear").value;
	var sellerShop = document.getElementById("sellerShop").value;
	var httpAction;
	var sendData;
	var url;

	if (formAction === "Create") {
		httpAction = "POST";
		url = host + port + sellersEndpoint;
		sendData = {
			"Name": sellerName,
			"Surname": sellerSurname,
			"Year": sellerYear,
			"ShopId": sellerShop
		};
	}
	else {
		httpAction = "PUT";
		url = host + port + sellersEndpoint + editingId.toString();
		sendData = {
			"Id": editingId,
			"Name": sellerName,
			"Surname": sellerSurname,
			"Year": sellerYear,
			"ShopId": sellerShop
		};
	}

	console.log("Objekat za slanje");
	console.log(sendData);
	var headers = { 'Content-Type': 'application/json' };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}
	fetch(url, { method: httpAction, headers: headers, body: JSON.stringify(sendData) })
		.then((response) => {
			if (response.status === 200 || response.status === 201) {
				console.log("Successful action");
				formAction = "Create";
				refreshTable();
			} else {
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
	return false;
}

function deleteSeller() {
	var deleteID = this.name;
	var url = host + port + sellersEndpoint + deleteID.toString();
	var headers = { 'Content-Type': 'application/json' };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(url, { method: "DELETE", headers: headers})
		.then((response) => {
			if (response.status === 204) {
				console.log("Successful action");
				refreshTable();
			} else {
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
};

function editSeller() {
	var editId = this.name;

	var url = host + port + sellersEndpoint + editId.toString();
	var headers = { };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	fetch(url, { headers: headers})
		.then((response) => {
			if (response.status === 200) {
				console.log("Successful action");
				response.json().then(data => {
					document.getElementById("sellerName").value = data.name;
					document.getElementById("sellerSurname").value = data.surname;
					document.getElementById("sellerYear").value = data.year;
					document.getElementById("sellerShop").value = data.shopId;
					editingId = data.id;
					formAction = "Update";
				});
			} else {
				formAction = "Create";
				console.log("Error occured with code " + response.status);
				alert("Error occured!");
			}
		})
		.catch(error => console.log(error));
};


function refreshTable() {

	document.getElementById("sellerForm").reset();

	loadSellers();
};

function logout() {
	jwt_token = undefined;
	document.getElementById("info").innerHTML = "";
	document.getElementById("data").innerHTML = "";
	document.getElementById("formDiv").style.display = "none";
	document.getElementById("statisticsDiv").style.display = "none";
	document.getElementById("loginFormDiv").style.display = "block";
	document.getElementById("registerFormDiv").style.display = "none";
	document.getElementById("logout").style.display = "none";
	document.getElementById("btnLogin").style.display = "initial";
	document.getElementById("btnRegister").style.display = "initial";
	loadSellers();
}

function cancelSellerForm() {
	formAction = "Create";
}

function setupPopper() {

	const button = document.getElementById('btnLogout');
	const tooltip = document.getElementById('tooltip');

	const popperInstance = Popper.createPopper(button, tooltip, {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});

	function show() {

		tooltip.setAttribute('data-show', '');

		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: true },
			],
		}));

		popperInstance.update();
	}

	function hide() {

		tooltip.removeAttribute('data-show');


		popperInstance.setOptions((options) => ({
			...options,
			modifiers: [
				...options.modifiers,
				{ name: 'eventListeners', enabled: false },
			],
		}));
	}

	const showEvents = ['mouseenter', 'focus'];
	const hideEvents = ['mouseleave', 'blur'];

	showEvents.forEach((event) => {
		button.addEventListener(event, show);
	});

	hideEvents.forEach((event) => {
		button.addEventListener(event, hide);
	});

}

function loadStatistics() {
	var url = host + port + statisticsEndpoint;
	var headers = { };
	if (jwt_token) {
		headers.Authorization = 'Bearer ' + jwt_token;
	}

	axios.get(url, { headers: headers })
		.then(function (response) {

			console.log(response);
			setStatistics(response.data);
		}).catch (function (error) {

			console.log(error);
			showError();
		})
}

function setStatistics(data) {
	setSellersAgeChart(data.sellerAges);
	setShopsAverageAgeChart(data.averageShopAge);
	setShopTotalAgeChart(data.totalShopAge);
}

function setSellersAgeChart(statistics) {


	var chartStatus = Chart.getChart("line-chart"); 
	if (chartStatus != undefined) {
	  chartStatus.destroy();
	}

	var labels = _.map(statistics, 'seller');
	var data = _.map(statistics, 'age');

	var config = {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					axis: 'y',
					label: "Age",
					data: data,
					fill: false,
					backgroundColor: "blue",
					borderColor: "#c45850",
					borderWidth: 1
				}
			]
		}, options: {
			title: {
				display: true,
				text: "Age of all sellers"
			}
		}
	};

	new Chart(document.getElementById('line-chart'), config);
}

function setShopsAverageAgeChart(statistics) {
	
	var chartStatus = Chart.getChart("pie-chart"); 
	if (chartStatus != undefined) {
	  chartStatus.destroy();
	}

	document.getElementById('pie-chart').innerHTML = "";
	var labels = _.map(statistics, 'name');
	var data = _.map(statistics, 'averageAge');

	var backgroundColors = []
	for (var i = 0; i < data.length; i++) {
		var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        backgroundColors.push("rgb(" + r + "," + g + "," + b + ")");
	}

	var config = {
		type: 'pie',
		data: {
			labels: labels,
			datasets: [
				{
					label: "Average age for each shop",
					data: data,
					hoverOffset: 4,
					backgroundColor: backgroundColors
				}
			]
		}, options: {
			title: {
				display: true,
				text: "Average age for each shop"
			}
		}
	};

	new Chart(document.getElementById('pie-chart'), config);
}

function setShopTotalAgeChart(statistics) {
	document.getElementById('d3Div').innerHTML = "";
	var margin = { top: 30, right: 30, bottom: 70, left: 60 },
		width = 520 - margin.left - margin.right,
		height = 450 - margin.top - margin.bottom;


	var svg = d3.select("#d3Div")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");


	var x = d3.scaleBand()
		.range([0, width])
		.domain(statistics.map(function (d) { return d.name; }))
		.padding(0.2);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");


	var y = d3.scaleLinear()
		.domain([0, 1.1 * _.maxBy(statistics, 'totalAge').totalAge])
		.range([height, 0]);
	svg.append("g")
		.call(d3.axisLeft(y));


	svg.selectAll("mybar")
		.data(statistics)
		.enter()
		.append("rect")
		.attr("x", function (d) { return x(d.name); })
		.attr("y", function (d) { return y(d.totalAge); })
		.attr("width", x.bandwidth())
		.attr("height", function (d) { return height - y(d.totalAge); })
		.attr("fill", "#43A7B2");
}