import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  limit,
  getDocs,
  startAfter,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
const itemsCollection = collection(database, "items"); // Unified collection

let originalArray = [];
let selectedArray = [];

// Fetch Items from Firestore with Pagination
async function getItems(lastVisible = null) {
  try {
    let q = lastVisible ? query(itemsCollection, startAfter(lastVisible), limit(9)) : query(itemsCollection, limit(9));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      originalArray.push({ id: doc.id, ...doc.data() });
    });

    displayItems();
    return { lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  } catch (error) {
    console.error("Error fetching items: ", error);
    return { lastVisible: null };
  }
}

// Display Items
function displayItems() {
  const itemsDiv = document.getElementById("items");
  itemsDiv.innerHTML = "";

  originalArray.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.className = "card-img-top";
      img.onerror = () => img.remove();
      card.appendChild(img);
    }

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = item.name;
    cardBody.appendChild(title);

    const text = document.createElement("p");
    text.className = "card-text";
    text.textContent = `Description: ${item.description}`;
    cardBody.appendChild(text);

    const price = document.createElement("a");
    price.href = "#";
    price.className = "btn btn-primary";
    price.textContent = `${item.price} EGP`;
    cardBody.appendChild(price);

    card.appendChild(cardBody);
    itemsDiv.appendChild(card);
  });
}

// Add an Item
async function addItem(formData) {
  try {
    let querySnapshot = await getDocs(query(itemsCollection, limit(1)));

    if (!querySnapshot.empty) {
      alert("Item already exists");
      return;
    }

    formData.createdAt = new Date();
    await addDoc(itemsCollection, formData);
    alert("Item added successfully");
  } catch (error) {
    console.error("Error adding item: ", error);
    alert("Failed to add item");
  }
}

// Update an Item
async function updateItem(itemId, updatedData) {
  try {
    await updateDoc(doc(itemsCollection, itemId), updatedData);
    alert("Item updated successfully");
  } catch (error) {
    console.error("Error updating item: ", error);
    alert("Failed to update item");
  }
}

// Delete an Item
async function deleteItem(itemId) {
  try {
    await deleteDoc(doc(itemsCollection, itemId));
    alert("Item deleted successfully");
  } catch (error) {
    console.error("Error deleting item: ", error);
    alert("Failed to delete item");
  }
}

// Upload an Image to Firebase Storage
async function uploadImage(ImgInputFieldID) {
  const imageUpload = document.getElementById(ImgInputFieldID);
  const file = imageUpload.files[0];

  if (!file) {
    alert("Please select an image first");
    return;
  }

  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

// Get Image URL from Firebase Storage
async function getImageUrl(filename) {
  try {
    const imageRef = ref(storage, `images/${filename}`);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error getting image URL:", error);
    throw error;
  }
}

// Initialize Data
getItems().then(() => console.log("Items loaded"));

