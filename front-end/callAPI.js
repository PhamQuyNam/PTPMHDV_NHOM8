const getBookApi = "http://127.0.0.1:5000/book-management/books";
const addBookApi = "http://127.0.0.1:5000/book-management/book";
const getAuthorApi = "http://127.0.0.1:5000/author-management/authors";
const getCategoryApi = "http://127.0.0.1:5000/category-management/categories";

// Hàm khởi tạo
function start() {
    loadBook();
    handleCreateForm(); // Đăng ký hàm xử lý form
}
function loadBook(){
    const titleTable = "<tr><th>Id</th><th>Name</th><th>Page Count</th></tr>";
    fetch(getBookApi)
        .then(response => response.json())
        .then(books => {
            const htmls = books.map(book => {
                return `<tr>
                    <td>${book.id}</td>
                    <td>${book.name}</td>
                    <td>${book.page_count}</td>
                </tr>`;
            });
            const html = titleTable + htmls.join('');
            document.getElementById("book-block").innerHTML = html;
        })
        .catch(error => console.error("Error loading books:", error));
}
// Hàm tải danh sách sách từ API
function loadBook() {
    const titleTable = "<tr> <th>Id</th> <th>Name</th> <th>Page Count</th> </tr>";
    fetch(getBookApi)
        .then(response => response.json())
        .then(books => {
            const htmls = books.map(book => `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.name}</td>
                    <td>${book.page_count}</td>
                </tr>
            `);
            const html = titleTable + htmls.join('');
            document.getElementById("book-block").innerHTML = html;
        })
        .catch(error => console.error('Error loading books:', error));
}

// Hàm xử lý khi gửi form
function handleCreateForm() {
    var submit = document.querySelector('input[type="submit"]');

    submit.onclick = function(e) {
        e.preventDefault(); // Ngăn chặn hành động gửi form mặc định

        var name = document.querySelector('input[name="name"]').value;
        var pageCount = document.querySelector('input[name="page-count"]').value;
        
        // Lấy ID tác giả và thể loại từ input
        var authorId = parseInt(document.querySelector('input[name="author"]').value); // ID tác giả
        var categoryId = parseInt(document.querySelector('input[name="category"]').value); // ID thể loại

        // Kiểm tra nếu các trường đều có giá trị
        if (name && pageCount && !isNaN(authorId) && !isNaN(categoryId)) {
            const data = {
                name: name,
                page_count: parseInt(pageCount), // Chuyển đổi pageCount thành int
                author_id: authorId,
                category_id: categoryId
            };
            createBook(data); // Gửi dữ liệu tới API để thêm sách
        } else {
            alert("Invalid value"); // Thông báo nếu có trường không hợp lệ
        }
    }
}

// Hàm gửi yêu cầu thêm sách đến API
function createBook(data) {
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(addBookApi, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Thông báo thành công
            loadBook(); // Tải lại danh sách sách sau khi thêm
        })
        .catch(error => {
            console.error('Error adding book:', error);
            alert("Could not add the book. Please check your inputs and try again.");
        });
}

// Gọi hàm khởi tạo
start();
