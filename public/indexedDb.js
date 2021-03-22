const indexedDb = window.indexedDB;

let db;

const request = indexedDb.open ('budget',1)

request.onupgradeneeded = (event) => {
let db = event.target.result
db.createObjectStore('pending',{
  autoIncrement: true
}) 
}
request.onsuccess = (event) => {
  db = event.target.result
  if (navigator.onLine){

  }
}
