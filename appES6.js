class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}

class UI {
  addBookToList(book){
    const list = document.querySelector("#book-list");
    // create tr
    const row = document.createElement("tr");
    // insert columns
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
    
  }

  clearFields(){
    document.querySelector("#title").value="",
    document.querySelector("#author").value="",
    document.querySelector("#isbn").value="";
  }

  deleteItem(target){
    if(target.className === "delete"){
      target.parentElement.parentElement.remove();
    }
  }

  showAlert(msg, type){
    const div = document.createElement("div");
    div.className = `alert ${type}`;
    div.appendChild(document.createTextNode(msg));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    // insert div before form
    container.insertBefore(div, form);
    setTimeout(function(){
      document.querySelector(".alert").remove();
    }, 3000);
  }
}

// local storage class
class Store {
  static getItems(){
    let books;
    if(localStorage.getItem("books") == null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }   

  static displayItems(){
    const books = Store.getItems();
    books.forEach(function(book){
      const ui = new UI;

      // add book to ui
      ui.addBookToList(book);
    })
  }

  static addItem(book){
    const books = Store.getItems();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeItem(isbn){
    const books = Store.getItems();
    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// DOM load event
document.addEventListener("DOMContentLoaded", Store.displayItems);

// event listeners
document.querySelector("#book-form").addEventListener("submit", function(e){
  // get form values
  const title = document.querySelector("#title").value,
        author = document.querySelector("#author").value,
        isbn = document.querySelector("#isbn").value;
  
  // instantiate book
  const book = new Book(title, author, isbn);

  // instantiate UI
  const ui = new UI();

  // Validate
  if(title === "" || author === "" || isbn === ""){
    // error message
    ui.showAlert("please fill in all fields", "error");
  } else {
    // add book to list
    ui.addBookToList(book);

    // add to local storage
    Store.addItem(book);

    ui.showAlert("Added the new book to list", "success");
    ui.clearFields();
    
  }
  e.preventDefault();
})

// event listener for delete
document.body.addEventListener("click", deleteItem);
function deleteItem(e){
  console.log(e.target);
  // if(e.target.parentElement.className === "delete-item secondary-content"){
  if(e.target.classList.contains("delete")){

    e.target.parentElement.remove();
  }
}


document.querySelector("#book-list").addEventListener("click", function(e){
  
  const ui = new UI();
  // e.target is the a tag
  ui.deleteItem(e.target);
  // remove from local storage
  // e.target.parentelement is the a tag td, previous element is the isbn
  Store.removeItem(e.target.parentElement.previousElementSibling.textContent);

  ui.showAlert("item deleted", "success");
  e.preventDefault();
});