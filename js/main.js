(function($) {
	"use strict";
	var flag = true;
	var currentPage = window.location.pathname.split("/").pop();

	$(document).ready(function() {
		function toggleNavbarMethod() {
			if ($(window).width() > 992) {
				$(".navbar .dropdown")
					.on("mouseover", function() {
						$(".dropdown-toggle", this).trigger("click");
					})
					.on("mouseout", function() {
						$(".dropdown-toggle", this).trigger("click").blur();
						var myDiv = document.getElementById("#menu");
					});
			} else {
				$(".navbar .dropdown").off("mouseover").off("mouseout");
			}
		}
		toggleNavbarMethod();
		$(window).resize(toggleNavbarMethod);

		//menu.json
		$.ajax({
			url: "data/menu.json",
			method: "get",
			dataType: "json",
			success: function(data) {
				writingNavMenu(data);
				writingPages(data);
				writingFooter(data);
			},
			error: function(err) {
				console.error(err);
			},
		});


		//informations.json
		$.ajax({
			url: "data/informations.json",
			method: "get",
			dataType: "json",
			success: function(data) {
				writingInformations(data);
			},
			error: function(err) {
				console.error(err);
			},
		});

		//writing Informations
		function writingInformations(listOfInformations) {
			let html = "";
			for (let information of listOfInformations) {
				html += `<a class="btn btn-outline-primary btn-square me-2" target="_blank" href="${information.href}"><i class="bi bi-${information.title}"></i></a>`
			}
			document.getElementById("information").innerHTML = html;
		}

		//writing menu
		function writingNavMenu(listOfLinks) {
			let html = "";
			const menu = listOfLinks.slice(0, 4);

			for (let link of menu) {
				html += `<a href="${link.href}" class="nav-item nav-link listMenu">${link.text}</a>`;
			}
			document.getElementById("menu").innerHTML = html;
		}

		//writing pages
		function writingPages(listOfpages) {
			let html = "";
			const pages = listOfpages.slice(4, 8);
			for (let page of pages) {
				html += `<a href="${page.href}" class="dropdown-item">${page.text}</a>`;
			}
			document.getElementById("pages").innerHTML = html;
		}

		//Footer
		function writingFooter(listOfLinks) {
			let html = "";
			for (let link of listOfLinks) {
				html += `
				<a class="text-body mb-2" href="${link.href}"><i class="bi bi-arrow-right text-primary me-2"></i>${link.text}</a>
				`
			}
			document.getElementById("footer").innerHTML = html;
		}

		//News Letter Validation
		document.getElementById("btnMailNL").addEventListener("click", checkNewLetterEmail);

		function checkNewLetterEmail() {
			let email = document.getElementById("mailNL");
			var reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			console.log(email.value);
			if (!reEmail.test(email.value)) {
				email.style.border = "1px solid red"
			} else {
				email.style.border = "1px solid green"
			}
		}

		if (currentPage == "service.html") {
			//services.json
			$.ajax({
				url: "data/services.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingServices(data);
				},
				error: function(err) {
					console.error(err);
				},
			});

			//writing services
			function writingServices(listOfServices) {
				let html = "";
				for (let service of listOfServices) {
					html += `<div class="col-md-6">
                      			<div class="service-item bg-light d-flex p-4">
                          			<i class="flaticon-${service.icon} display-1 text-primary me-4"></i>
                          			<div>
											<h5 class="text-uppercase mb-3">${service.title}</h5>
											<p class="sibb">${service.text}</p>
											<a class="text-primary text-uppercase readMore" href="#">Read More<i class="bi bi-chevron-right"></i></a>
										</div>
								</div>
							</div>`;
				}

				document.getElementById("services").innerHTML = html;

				$(".readMore").on("click", function(event) {
					event.preventDefault();
					let dots = $(this).siblings().children(".dots");
					let moreText = $(this).siblings().children(".more");
					let btnText = $(this);
					if (dots.is(":visible")) {
						dots.hide();
						moreText.show();
						btnText.html("Read less");
					} else {
						dots.show();
						moreText.hide();
						btnText.html("Read more<i class='bi bi-chevron-right'></i>");
					}
				});
			}
		} else if (currentPage == "product.html") {
			//allProducts.json
			var products;
			$.ajax({
				url: "data/allProducts.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					products = data;
					writingAllProducts(products);
					//writingProductsOnDiscount(products);

				},
				error: function(err) {
					console.error(err);
				},
			});
			//categories.json
			$.ajax({
				url: "data/categories.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingCategoires(data);
				},
				error: function(err) {
					console.error(err);
				}
			});
			//types.json
			$.ajax({
				url: "data/types.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingTypes(data);
				},
				error: function(err) {
					console.error(err);
				},
			});

			//writing categories
			function writingCategoires(ListOfCategories) {
				let html = "<ul>";
				for (let category of ListOfCategories) {
					html += `
            <li class = 'cat'>
              <input type="checkbox" name="categories" value="${category.id}"/>
              <label>
              <span>${category.title}</span>
              </label>
            </li>`
				}
				html += `</ul>`
				document.getElementById("categories").innerHTML += html;
				const categoryCheckboxes = document.querySelectorAll('input[name="categories"]')
				categoryCheckboxes.forEach(categoryCheckbox => {
					categoryCheckbox.addEventListener('change', filterProducts)

				})
			}

			//writing types
			function writingTypes(listOfTypes) {
				let html = '<ul>'
				for (let type of listOfTypes) {
					html += `
          <li class= 'cat'>
            <input type="checkbox" name="types" value="${type.id}" />
            <label>
            <span>${type.title}</span>
            </label>
          </li>
          `
				}
				html += "</ul>"
				document.getElementById("filterByTyp").innerHTML += html;
				const categoryCheckboxes = document.querySelectorAll('input[name="types"]')
				categoryCheckboxes.forEach(categoryCheckbox => {
					categoryCheckbox.addEventListener('change', filterProducts)
				})
			}

			document.getElementById("search").addEventListener('keyup', filterProducts)

			//all filters 
			function filterProducts() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					let searchTerm = $("#search").val().toLowerCase().trim();
					let selectedCategories = getSelectedValues("categories");
					let selectedTypes = getSelectedValues("types");
					let filteredProducts = products.filter(product =>
						(product.price.previous == "") &&
						(searchTerm === "" || product.title.toLowerCase().indexOf(searchTerm) !== -1) &&
						(selectedCategories.length === 0 || selectedCategories.includes(product.katId)) &&
						(selectedTypes.length === 0 || selectedTypes.some(type => product.type.includes(type)))
					);
					writingAllProducts(filteredProducts);
				}, 300);
			}

			function getSelectedValues(name) {
				let selectedValues = [];
				let selectedInputs = document.querySelectorAll(`input[name="${name}"]:checked`);
				selectedInputs.forEach(input => {
					selectedValues.push(Number(input.value));
				});
				return selectedValues;
			}

			//reset filters
			document.getElementById("reset").addEventListener("click", clearFilters)

			function clearFilters() {
				let filterInputs = document.querySelectorAll('input[type="checkbox"]')
				filterInputs.forEach(input => {
					input.checked = false
				})
				writingAllProducts(products)
			}

			var timer;
			document.getElementById("selectedProduct").onchange = function() {
				var selected = this.value;

				console.log(selected)
				if (selected == "0") {
					products.sort(function(a, b) {
						return a.id - b.id;
					});
					filterProducts(products);
				} else if (selected == "priceAsc") {
					products.sort(function(a, b) {
						if (parseInt(a.price.current) > parseInt(b.price.current)) {
							return 1;
						} else if (parseInt(a.price.current) < parseInt(b.price.current)) {
							return -1;
						} else {
							return 0;
						}
					});
					filterProducts(products)
				} else if (selected == "priceDesc") {
					products.sort(function(a, b) {
						if (parseInt(a.price.current) > parseInt(b.price.current)) {
							return -1;
						} else if (parseInt(a.price.current) < parseInt(b.price.current)) {
							return 1;
						} else {
							return 0;
						}
					});
					filterProducts(products)
				} else if (selected == "nameAsc") {
					products.sort(function(a, b) {
						if (a.title == b.title) {
							return 0;
						} else if (a.title > b.title) {
							return 1;
						} else {
							return -1;
						}
					});
					filterProducts(products);
				} else {
					products.sort(function(a, b) {
						if (a.title == b.title) {
							return 0;
						} else if (a.title > b.title) {
							return -1;
						} else {
							return 1;
						}
					});
					filterProducts(products);
				}
			}
			//writing products
			function writingAllProducts(listOfAllProducts) {
				let html1 = "";
				let productOnDc = listOfAllProducts.filter(p => p.price.previous != "");
				for (let product of listOfAllProducts) {
					if (product.price.previous == "") {
						html1 += `<div class="productItemFlex product-item position-relative bg-light d-flex flex-column text-center flexProduct" data-id="${product.id}">
								<img src="img/allProducts/${product.img.src}.jpg" alt="Dog Food">
								<h6 class="titleProduct">${product.title}</h6>
								<h5 class="text-primary mb-0">$ ${product.price.current}</h5>
								<div class="btn-action d-flex justify-content-center">
									<a class="btn btn-primary py-2 px-3 add-to-cart" href="#" data-id="${product.id}"><i class="bi bi-cart"></i></a>
								</div>
							</div>`;
					}
				}
				writingProductsOnDiscount(productOnDc);
				document.getElementById("allProducts").innerHTML = html1;
				bindCartEvents()
			}

			//writing products
			function writingProductsOnDiscount(listOfProducts) {
				var owlItems = [];
				var owlContainer = document.querySelector("#owl-container");
				for (let product of listOfProducts) {
					var htmlp = document.createElement("div");
					htmlp.classList.add("item");
					htmlp.classList.add("pb-5");
					if (product.price.previous != "") {
						htmlp.innerHTML = `
                      <div class="product-item position-relative bg-light d-flex flex-column text-center item">
                          <img class="img-fluid mb-4" src="img/${
                            product.img.src
                          }.png" alt="${[product.img.alt]}">
                          <h6 class="text-uppercase">Pet Food ${
                            product.title
                          }</h6>
                          <h5 class="text-primary mb-0"><s>$${
                            product.price.previous
                          }</s></h5>
                          <h5 class="text-primary mb-0">$${
                            product.price.current
                          }</h5>
                          <div class="btn-action d-flex justify-content-center">
                              <a class="btn btn-primary py-2 px-3 add-to-cart" href="#" data-id="${product.id}"><i class="bi bi-cart"></i></a>
                      </div>
                  </div>`;
						owlItems.push(htmlp);
					}

				}
				owlItems.forEach((item) => {
					owlContainer.appendChild(item);
				});
				$(owlContainer).owlCarousel({
					autoplay: true,
					smartSpeed: 1000,
					margin: 45,
					dots: false,
					loop: true,
					nav: true,
					navText: [
						'<i class="bi bi-arrow-left"></i>',
						'<i class="bi bi-arrow-right"></i>',
					],
					responsive: {
						0: {
							items: 1,
						},
						768: {
							items: 2,
						},
						992: {
							items: 3,
						},
						1200: {
							items: 4,
						},
					},
				});
			}
			//add to cart
			function bindCartEvents() {
				$(".add-to-cart").click(addToCart);
			}

			function addToCart(a) {
				a.preventDefault();
				let id = $(this).data("id");

				var productInCart = productsInCart();

				if (productInCart == null) {
					addFirstItemToLocalStorage();
					alertify.success("Product successfully added to cart.")

				} else {
					if (productIsAlreadyInCart()) {
						updateQuantity();
						alertify.success("")
					} else {
						addToLocalStorage();
						alertify.success("Product successfully added to cart.")
					};
				}

				function productIsAlreadyInCart() {
					return productInCart.filter(p => p.id == id).length;
				}

				function addToLocalStorage() {
					let productsLS = productsInCart();
					productsLS.push({
						id: id,
						quantity: 1
					});
					localStorage.setItem("productInCart", JSON.stringify(productsLS));
				}

				function updateQuantity() {
					let productInCart = productsInCart();
					for (let p of productInCart) {
						if (p.id == id) {
							p.quantity++;
							break;
						}
					}

					localStorage.setItem("productInCart", JSON.stringify(productInCart));
				}

				function addFirstItemToLocalStorage() {
					let newProduct = [{
						id: id,
						quantity: 1
					}];
					localStorage.setItem("productInCart", JSON.stringify(newProduct));
				}
			}

		} else if (currentPage == "price.html") {
			//price.json
			$.ajax({
				url: "data/servicePrices.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingPrice(data);
				},
				error: function(err) {
					console.error(err);
				}
			});
			//writing Price
			function writingPrice(listOfServicePrices) {
				let html = "";
				for (let servicePrice of listOfServicePrices) {
					html += `<div class="col-lg-4">
            <div class="bg-light text-center pt-5 mt-lg-5">
                <h2 class="text-uppercase">${servicePrice.title}</h2>
                <h6 class="text-body mb-5">${servicePrice.subtitle}</h6>
                <div class="text-center bg-primary p-4 mb-2">
                    <h1 class="display-4 text-white mb-0">
                        <small class="align-top"
                            style="font-size: 22px; line-height: 45px;">$</small>${servicePrice.price}<small
                            class="align-bottom" style="font-size: 16px; line-height: 40px;">/
                            Mo</small>
                    </h1>
                </div>
                <div class="text-center p-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                    <span>Pet feeding</span>${servicePrice.services.PetFeeding ? '<i class="bi bi-check2 fs-4 text-primary"></i>' : '<i class="bi bi-x fs-4 text-danger"></i>'}
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                    <span>Pet grooming</span>${servicePrice.services.PetGrooming ? '<i class="bi bi-check2 fs-4 text-primary"></i>' : '<i class="bi bi-x fs-4 text-danger"></i>'}
                    
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                    <span>Pet boarding</span>${servicePrice.services.PetBoarding ? '<i class="bi bi-check2 fs-4 text-primary"></i>' : '<i class="bi bi-x fs-4 text-danger"></i>'}
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                    <span>Pet training</span>${servicePrice.services.PetTraining ? '<i class="bi bi-check2 fs-4 text-primary"></i>' : '<i class="bi bi-x fs-4 text-danger"></i>'}
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                    <span>Pet treatment</span>${servicePrice.services.PetTreatment ? '<i class="bi bi-check2 fs-4 text-primary"></i>' : '<i class="bi bi-x fs-4 text-danger"></i>'}
                    </div>
                  </div>
              </div>
            </div>`
				}
				document.getElementById("price").innerHTML = html;
			}
		} else if (currentPage == "team.html") {
			//team.json
			$.ajax({
				url: "data/team.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingTeam(data)
				},
				error: function(err) {
					console.error(err);
				}
			})

			//clients.json
			$.ajax({
				url: "data/clients.json",
				method: "get",
				dataType: "json",
				success: function(data) {
					writingClients(data)
				},
				error: function(err) {
					console.error(err);
				}
			})

			function writingClients(listOfClients) {
				var owlItems = [];
				var owlContainer = document.querySelector("#clients-container");
				for (let client of listOfClients) {
					var htmlp = document.createElement("div");
					htmlp.classList.add("item");
					htmlp.classList.add("client-item");
					htmlp.innerHTML = `<div class="testimonial-item text-center">
					<div class="position-relative mb-4">
						<img class="img-fluid mx-auto" src="img/${client.img.src}.jpg" alt="${client.img.alt}">
						<div class="position-absolute top-100 start-50 translate-middle d-flex align-items-center justify-content-center bg-white" style="width: 45px; height: 45px;">
							<i class="bi bi-chat-square-quote text-primary"></i>
						</div>
					</div>
					<p>${client.text}</p>
					<hr class="w-25 mx-auto">
					<h5 class="text-uppercase">${client.title}</h5>
					<span>${client.department}</span>
					</div>`
					owlItems.push(htmlp);
				}
				owlItems.forEach((item) => {
					owlContainer.appendChild(item);
				});
				//client carousel
				$(".testimonial-carousel").owlCarousel({
					autoplay: true,
					smartSpeed: 1000,
					margin: 45,
					dots: false,
					loop: true,
					nav: true,
					navText: [
						'<i class="bi bi-arrow-left"></i>',
						'<i class="bi bi-arrow-right"></i>',
					],
					responsive: {
						0: {
							items: 1,
						}
					},
				});
			}

			//writing team 
			function writingTeam(listOfTeam) {
				var owlItems = [];
				var owlContainer = document.querySelector("#owl-container");
				for (let team of listOfTeam) {
					var htmlp = document.createElement("div");
					htmlp.classList.add("item");
					htmlp.classList.add("team-item");
					htmlp.innerHTML = `<div class="position-relative overflow-hidden">
                <img class="img-fluid w-100" src="img/${team.img.src}.jpg" alt="${team.img.alt}">
                <div class="team-overlay">
                    <div class="d-flex align-items-center justify-content-start">
                        <a class="btn btn-light btn-square mx-1" href="#"><i class="bi bi-twitter"></i></a>
                        <a class="btn btn-light btn-square mx-1" href="#"><i class="bi bi-facebook"></i></a>
                        <a class="btn btn-light btn-square mx-1" href="#"><i class="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div class="bg-light text-center p-4">
                <h5 class="text-uppercase">${team.fullName}</h5>
                <p class="m-0">${team.designation}</p>
            </div>`
					owlItems.push(htmlp);
				}
				owlItems.forEach((item) => {
					owlContainer.appendChild(item);
				});
				// Team carousel
				$(".team-carousel").owlCarousel({
					autoplay: true,
					smartSpeed: 1000,
					margin: 45,
					dots: false,
					loop: true,
					nav: true,
					navText: [
						'<i class="bi bi-arrow-left"></i>',
						'<i class="bi bi-arrow-right"></i>',
					],
					responsive: {
						0: {
							items: 1,
						},
						768: {
							items: 2,
						},
						992: {
							items: 3,
						},
						1200: {
							items: 4,
						},
					},
				});
			}
		} else if (currentPage == "cart.html") {

			let productsFromCart = productsInCart();

			if (productsFromCart != null) {
				displayCart();
			} else {
				showEmptyCart();
			}
		} else if (currentPage == "contact.html") {
			document.getElementById("btnSend").addEventListener("click", formValidate);
			document.getElementById("btnSend").addEventListener("click", function() {
				flag = true
			});

		}
	});

	// Get products in cart.
	function productsInCart() {
		return JSON.parse(localStorage.getItem("productInCart"));
	}

	function showEmptyCart() {

		document.getElementById("show").classList.remove("emptyC");
		document.getElementById("content").innerHTML = `<h2 class="m-0 text-uppercase text-dark">Want to shop?<a href="product.html"> Click Here!</a></h2>`;
	}

	function displayCart() {
		let products = productsInCart();
		if (products == null) {
			showEmptyCart();
			return;
		}

		$.ajax({
			url: "data/allProducts.json",
			method: "GET",
			dataType: "json",
			success: function(data) {
				data = data.filter(el => {
					for (let p of products) {
						if (el.id == p.id) {
							el.quantity = p.quantity;
							return true;
						}
					}
					return false;
				});
				generateTable(data);
			}
		})
	}

	function generateTable(products) {

		if (products.length == 0) {
			showEmptyCart();
			return;
		}
		let html = `<button id="btnClear" class="btn btn-primary">Clear Cart</button>
	<table id="hideTable" class="timetable_sub"> 
                  <thead>
                    <tr>
                      <th>SL No.</th>
                      <th>Product Image</th>
                      <th>Title</th>
                      <th>Base Price</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>`;

		for (let i = 0; i < products.length; i++) {
			html += generateTr(products[i], i);
		}

		html += `</tbody>
          </table>`

		document.getElementById("show").classList.add("emptyC");
		document.getElementById("content").innerHTML = html;
		$(".btnRemove").click(removeFromCart);
		$("#btnClear").click(clearCart);

	}

	function generateTr(product, index) {
		return `<tr>
              <td>${index + 1}</td>
              <td><img src="${product.price.previous=="" ? `img/allProducts/`: `img/`}${product.img.src}.${product.price.previous=="" ? `jpg`: `png`}" style='height:100px' alt="${product.img.alt}"></td>
              <td>${product.title}</td>
              <td>$${product.price.current}</td>
              <td>${product.quantity}</td>
              <td>$${parseFloat(product.price.current) * product.quantity}</td>
              <td><button class="btnRemove btn btn-primary" data-id="${product.id}">Remove</button></td>`
	}

	function removeFromCart() {
		let id = $(this).data("id");
		let products = productsInCart();
		let filtered = products.filter(p => p.id != id);

		alertify.success('You have successfully removed product from cart.');
		localStorage.setItem("productInCart", JSON.stringify(filtered));

		displayCart();
	}

	function clearCart() {
		let products = productsInCart();
		if (products != null) {
			localStorage.removeItem("productInCart");
			alertify.success('You have successfully removed all products from cart.');

			showEmptyCart();

		} else {
			alertify.error("You have not ordered any product.");
		}
	}

	// Sticky Navbar
	$(window).scroll(function() {
		if ($(this).scrollTop() > 40) {
			$(".navbar").addClass("sticky-top");
		} else {
			$(".navbar").removeClass("sticky-top");
		}
	});

	// Modal Video
	$(document).ready(function() {
		var $videoSrc;
		$(".btn-play").click(function() {
			$videoSrc = $(this).data("src");
		});

		$("#videoModal").on("shown.bs.modal", function(e) {
			$("#video").attr(
				"src",
				$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
			);
		});

		$("#videoModal").on("hide.bs.modal", function(e) {
			$("#video").attr("src", $videoSrc);
		});

	});

	// Back to top button
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$(".back-to-top").fadeIn("slow");
		} else {
			$(".back-to-top").fadeOut("slow");
		}
	});
	$(".back-to-top").click(function() {
		$("html, body").animate({
			scrollTop: 0
		}, 1500, "easeInOutExpo");
		return false;
	});

	//regex
	function formValidate() {
		var nameContact = document.getElementById("name");
		var email = document.getElementById("email");
		var phoneContact = document.getElementById("phone");
		var textArea = document.getElementById("message");

		var reText = /^[A-Za-z0-9\s!@#$%^&*()_+=-`~\\\]\[{}|';:/.,?><]{2,}$/;
		var reName = /^[A-ZŠĐČĆŽ][a-zšđčćž]{1,11}(\s[A-ZŠĐČĆŽ][a-zšđčćž]{1,11})+$/;
		var reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		var rePhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

		var messageFullName = "You didn't enter Full Name correctly! Example: John Doe.";
		var messageEmail = "You didn't enter Email correctly! Example: john.doe@gmail.com";
		var messagePhone = "You didn't enter Phone correctly! Example: 0631234567";
		var messageText = "You didn't enter Message correctly! Example: Hello World!";

		checkRegex(reName, nameContact, messageFullName);
		checkRegex(reEmail, email, messageEmail);
		checkRegex(rePhone, phoneContact, messagePhone);
		checkRegex(reText, textArea, messageText);

		if (flag) {
			let divSuccess = document.querySelector("#success");
			divSuccess.setAttribute("class", "alert alert-success mt-4");

			divSuccess.innerHTML = `Thanks ${nameContact.value}, we will reach You as soon as possible!`;

			document.getElementById("form").reset();
		}
	}

	function checkRegex(regex, object, message) {
		if (!regex.test(object.value)) {
			object.nextElementSibling.classList.remove("hide");
			object.nextElementSibling.innerHTML = message;
			flag = false;
		} else {
			object.nextElementSibling.classList.add("hide");
		}
	}
})(jQuery);