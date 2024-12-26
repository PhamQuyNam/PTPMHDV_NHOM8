// API lấy tất cả sách
const getBooksApi = "http://127.0.0.1:5000/book-management/books";

// Biến lưu trữ danh sách sách toàn cục
let books = [];

// Hàm lấy tất cả sách từ API
function loadBooks() {
    return fetch(getBooksApi)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            books = data; // Lưu trữ sách vào biến toàn cục
            return books; // Trả về danh sách sách
        })
        .catch(error => {
            console.error('Error loading books:', error);
            alert('Có lỗi xảy ra khi tải sách!');
        });
}

// Hàm hiển thị sách trong bảng
function displayBooksInTable(books) {
    const tableBody = document.querySelector('.datatable tbody');
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (books && books.length > 0) {
        const htmls = books.map((book, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${book.name}</td>
                <td>${book.page_count || 'N/A'}</td>
                <td>${book.author_name}</td>
                <td>${book.category_name || 'N/A'}</td> 
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
        tableBody.innerHTML = htmls;
    } else {
        tableBody.innerHTML = '<tr><td colspan="6">Không có sách nào.</td></tr>';
    }
}

// Hàm xóa sách
function deleteBook(bookId) {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sách này?");
    if (confirmDelete) {
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
            books.splice(bookIndex, 1); // Xóa sách khỏi danh sách
            displayBooksInTable(books); // Cập nhật giao diện
            alert("Xóa sách thành công!");
        } else {
            alert("Không tìm thấy sách để xóa.");
        }
    }
}

// Hàm khởi tạo
function start() {
    loadBooks()
        .then(books => displayBooksInTable(books))
        .catch(error => console.error('Error loading books:', error));
}

// Gọi hàm khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', start);
