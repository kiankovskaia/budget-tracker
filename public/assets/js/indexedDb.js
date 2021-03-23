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
  if (navigator.onLine) checkDatabase();
  };

  request.onerror = (event) => {
    console.log(`Error: ${event.target.errorCode}`);
  };
  
  function saveRecord(record) {
    console.log('Saving record');
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
  
    store.add(record);
  }
  
  function checkDatabase() {
    console.log('checking DB');
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();
  
    getAll.onsuccess = () => {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept:
              'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(() => {
            const transaction = db.transaction(
              ['pending'],
              'readwrite'
            );
  
            const store = transaction.objectStore(
              'pending'
            );
  
            store.clear();
          });
      }
    };
  }
  
  // Exporting functions
  module.exports = {
    checkDatabase,
    saveRecord
  };