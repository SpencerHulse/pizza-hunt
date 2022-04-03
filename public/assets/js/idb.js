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
    //uploadPizza()
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};
