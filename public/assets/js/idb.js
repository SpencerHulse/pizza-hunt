let db;
// Establish a connection to indexedDB database called "pizza_hunt" and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

// This event will emit if the database version changes (nonexistent to v1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  // Save a reference to the database
  const db = event.target.result;
  // Create an object store (table) called "new_pizza",
  // set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // When db is successfully created with its object store (from oneupgradedneeded)
  // or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // Check if the app is online, if yes run uploadPizza() to send local data to the api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// Used on submit with no internet
function saveRecord(record) {
  // Open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // Access object store for "new_pizza"
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // Add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // Open a transaction with the database
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // Access the object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // Get ALL records from the store and set to a variable
  // Needs to be attached to an event listener to do anything
  const getAll = pizzaObjectStore.getAll();

  // Upon a successful getAll(), run this
  getAll.onsuccess = function () {
    // If there is data, send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // Open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // Clear all items
          pizzaObjectStore.clear();

          alert("All saved pizzas have been submitted!");
        })
        .catch((err) => console.log(err));
    }
  };
}

window.addEventListener("online", uploadPizza);
