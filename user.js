// display books for user
async function displayBooksForUser(bookContainer) {
    let db = firebase.firestore();
    let bookcontainer = document.getElementById(bookContainer);
    try {
        let books = await db.collection("cars").get();

        if (books.empty) {
            let alert = document.createElement("p");
            alert.className = "text-center";
            alert.textContent = "No books found.";
            bookcontainer.appendChild(alert);
            return;
        }

        books.forEach(doc => {
            let book = doc.data();
            book.id = doc.id;

            let bookDiv = document.createElement("div");
            bookDiv.className = "book-card";

            let bookImage = document.createElement("img");
            bookImage.src = book.url_image;
            bookImage.alt = book.name;
            bookImage.className = "book-image";

            let bookName = document.createElement("h3");
            bookName.textContent = book.name;

            let author = document.createElement("p");
            author.textContent = `Author: ${book.author}`;

            let genre = document.createElement("p");
            genre.textContent = `Genre: ${book.gener}`;

            // let description = document.createElement("p");
            // description.textContent = book.description;

            let price = document.createElement("p");
            price.textContent = `Price: ${book.price} EP`;

            let status = document.createElement("p");
            status.textContent = `Status: ${book.status}`;

            let addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "Add to Cart";
            addToCartBtn.className = "btn btn-success";
            addToCartBtn.addEventListener("click", () => {
                addToCart(book);
            });

            bookDiv.appendChild(bookImage);
            bookDiv.appendChild(bookName);
            bookDiv.appendChild(author);
            bookDiv.appendChild(genre);
            // bookDiv.appendChild(description);
            bookDiv.appendChild(price);
            bookDiv.appendChild(status);
            bookDiv.appendChild(addToCartBtn);

            bookcontainer.appendChild(bookDiv);
        });
    } catch (error) {
        console.error("Error fetching books:", error);

        let errorMsg = document.createElement("p");
        errorMsg.className = "text-danger";
        errorMsg.textContent = "Error loading books.";
        bookcontainer.appendChild(errorMsg);
    }
}
// run display books function 
window.addEventListener("DOMContentLoaded", () => {
    displayBooksForUser("bookContainer");
});

// add to cart function
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingBook = cart.find(item => item.id === book.id);
    // check if the book already added or not
    if (existingBook) {
        // if existed , the user can add the same books 5 times only 
        if (existingBook.quantity < 5) {
            existingBook.quantity += 1;
            alert(`You added the ${existingBook.name}  ${existingBook.quantity} times`);
        } else {
            alert("You can't add the same book more than 5");
        }
    } else {
        // if the book not added into the cart before
        book.quantity = 1;
        cart.push(book);
        alert("Book added to cart");
    }

    // store the cart into localstorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Cart operations
function loadCart() {
    let cartContainer = document.getElementById("cartContainer");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCostEl = document.getElementById("totalCost");
    cartContainer.innerHTML = "";

    // let total = 0;
    let total = calculateTotal(cart);
    totalCostEl.textContent = `Total: ${total} EP`;

    cart.forEach(book => {
        // total += book.price * book.quantity;

        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        let card = document.createElement("div");
        card.className = "card h-100";

        let bookImg = document.createElement("img");
        bookImg.src = book.url_image;
        bookImg.alt = book.name;
        bookImg.className = "card-img-top";

        let cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column justify-content-between";

        let bookName = document.createElement("h5");
        bookName.className = "card-title";
        bookName.textContent = book.name;

        // let author = document.createElement("p");
        // author.className = "card-text";
        // author.textContent = `Author: ${book.author}`;

        let price = document.createElement("p");
        price.className = "card-text";
        price.textContent = `Price: ${book.price} EP`;

        let controlDiv = document.createElement("div");
        controlDiv.className = "d-flex align-items-center justify-content-between";

        // Quantity controls
        let btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";
        btnGroup.role = "group";
        // minus the amount of books button
        let minusBtn = document.createElement("button");
        minusBtn.className = "btn btn-sm btn-outline-secondary";
        minusBtn.textContent = "-";
        minusBtn.onclick = () => decreaseQuantity(book.id);

        let quantitySpan = document.createElement("span");
        quantitySpan.className = "mx-2";
        quantitySpan.textContent = book.quantity;

        // plus the amount of books button
        let plusBtn = document.createElement("button");
        plusBtn.className = "btn btn-sm btn-outline-secondary";
        plusBtn.textContent = "+";
        plusBtn.onclick = () => increaseQuantity(book.id);

        btnGroup.appendChild(minusBtn);
        btnGroup.appendChild(quantitySpan);
        btnGroup.appendChild(plusBtn);
        // remove the book button
        let removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-sm btn-danger";
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(book.id);

        controlDiv.appendChild(btnGroup);
        controlDiv.appendChild(removeBtn);

        cardBody.appendChild(bookName);
        // cardBody.appendChild(author);
        cardBody.appendChild(price);
        cardBody.appendChild(controlDiv);

        card.appendChild(bookImg);
        card.appendChild(cardBody);
        col.appendChild(card);
        cartContainer.appendChild(col);
    });

    document.getElementById("totalCost").textContent = total;
}
// budget for test
if (!localStorage.getItem("budget")) {
    localStorage.setItem("budget", "1000");
}
document.getElementById("checkoutBtn").addEventListener("click", checkout);
async function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = calculateTotal(cart);
    // let userId = firebase.auth().currentUser.uid; //if there is auth in firebase
    let budget = parseFloat(localStorage.getItem("budget") || 0);
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }
    // when the auth is work
    try {
        // ====================================
        //     let userRef = db.collection("users").doc(userId);
        //     let userDoc = await userRef.get();

        //     if (!userDoc.exists) {
        //         alert("User not found.");
        //         return;
        //     }
        // let userData = userDoc.data();
        // let currentBudget = userData.budget;
        // ========================================
        if (total > budget) {
            alert("You don't have enough money");
            return;
        }
        // save the order in orders collection
        let order = {
            // ===============
            // userId, //if there is auth in firebase
            // ===============
            items: cart,
            total,
            date: new Date().toISOString()
        };
        await db.collection("orders").add(order);

        // minus the total cost from user budget and update the budget in the localstorage
        budget -= total;
        localStorage.setItem("budget", budget);
        // ==================================
        // await userRef.update({
        //     budget: currentBudget - total
        // });
        // ==================================
        // delete the order cart from the localstorage
        localStorage.removeItem("cart");
        // if the order made successfully
        alert("Order made successfully");
        // return the user to home page 
        window.location.href = "user.html";
    } catch (error) {
        console.error("Error make order:", error);
        alert("something went wrong during checkout");
    }
}


// calculate total
function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
// increase amount of books function
function increaseQuantity(bookId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(b => b.id === bookId);
    if (item && item.quantity < 5) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    } else {
        alert("You reched the max limit (5)")
    }
}
// decrease amount of books function
function decreaseQuantity(bookId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(b => b.id === bookId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    } else {
        alert(`If you want to remove ${item.name} book , you can click 'Remove' button`)
    }
}
// remove book function
function removeFromCart(bookId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(book => book.id !== bookId);
    if (confirm(`Are you sure you want to remove book from your cart? `)) {
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
}



window.addEventListener("DOMContentLoaded", () => {
    loadCart();
});