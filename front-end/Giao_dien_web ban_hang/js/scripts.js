// Khai báo các API
const getBookApi = "http://127.0.0.1:5000/book-management/books";
const getBookByIdApi = (id) => `http://127.0.0.1:5000/book-management/book/${id}`;
const addBookApi = "http://127.0.0.1:5000/book-management/book";
const getAuthorApi = "http://127.0.0.1:5000/author-management/authors";
const getCategoryApi = "http://127.0.0.1:5000/category-management/categories";
const getCartApi = "http://127.0.0.1:5000/cart_all";
const addCartApi = "http://127.0.0.1:5000/add_cart";
const removeCartApi = (cartItemId) => `http://127.0.0.1:5000/remove_cart/${cartItemId}`;
const updateCartApi = (cartItemId) => `http://127.0.0.1:5000/update_cart_item/${cartItemId}`; // API cập nhật giỏ hàng

// Biến lưu trữ giỏ hàng
let cart = [];

// Hàm bắt đầu chương trình
function start() {
    loadBook();
    handleCreateForm();
    loadAuthor();
    loadCategory();
    loadCart();
    add_hoa_don()
}

start();

// Hàm cập nhật giỏ hàng trên giao diện
function updateCartDisplay(cartItems) {
    const cartTableBody = document.querySelector("#cart-table tbody");
    cartTableBody.innerHTML = ""; // Xóa nội dung cũ

    // Hiển thị từng sách trong giỏ hàng
    cartItems.forEach(item => {
        const totalPrice = item.price * item.quantity; // Thành tiền của mỗi sách
        const row = `
            <tr>
                <td><img src="path/to/book-image/${item.book_id}.jpg" alt="${item.name}" style="width: 50px; height: auto;"></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} VNĐ</td>
                <td>${totalPrice} VNĐ</td>
                <td>
                    <button style="border: none; background: none; color: blue; cursor: pointer;" onclick="removeFromCart(${item.id})">Delete</button>
                    <button style="border: none; background: none; color: blue; cursor: pointer;" onclick="showUpdateQuantityModal(${item.id}, ${item.quantity})">Sửa số lượng</button>
                </td>
            </tr>
        `;
        cartTableBody.insertAdjacentHTML("beforeend", row); // Thêm dòng vào bảng
    });

    // Cập nhật số lượng sách trong giỏ hàng trên badge
    document.getElementById("cart-count").textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Hàm tải giỏ hàng
async function loadCart() {
    try {
        const response = await fetch(getCartApi);
        if (!response.ok) {
            throw new Error('Cart not found');
        }

        const cartItems = await response.json();
        console.log(cartItems);
        updateCartDisplay(cartItems); // Cập nhật hiển thị giỏ hàng
        
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Hàm lấy thông tin sách theo ID và xử lý khi nhấn nút "Add to Cart"
async function getBookById(id_sach, id_html_name, id_salary, id_html_page_count, id_add_to_cart_button, id_author_name) {
    try {
        const response = await fetch(getBookByIdApi(id_sach));

        if (!response.ok) {
            throw new Error('Book not found');
        }

        const book = await response.json();

        // Hiển thị tên sách
        const bookNameElement = document.getElementById(id_html_name);
        if (bookNameElement) {
            bookNameElement.textContent = `Tên sách: ${book.name}`;
        }
        
        // Hiển thị tên tác giả
        const authorNameElement = document.getElementById(id_author_name);
        if (authorNameElement) {
            authorNameElement.textContent = `Tên tác giả: ${book.author_name}`;
        }

        // Hiển thị số tiền
        const salary = parseInt(book.page_count) * 1000; // Tính tiền sách
        const bookSalaryElement = document.getElementById(id_salary);
        if (bookSalaryElement) {
            bookSalaryElement.textContent = `Giá bán: ${salary} VNĐ`;
        }

        // Hiển thị số trang
        const bookPageCountElement = document.getElementById(id_html_page_count);
        if (bookPageCountElement) {
            bookPageCountElement.textContent = `Số trang: ${book.page_count}`;
        }

        // Xử lý nút "Add to Cart"
        const addToCartButton = document.getElementById(id_add_to_cart_button);
        if (addToCartButton) {
            addToCartButton.onclick = () => addToCart(book);
        }

    } catch (error) {
        console.error('Error fetching book:', error);
    }
}

// Hàm thêm sách vào giỏ hàng với số lượng
async function addToCart(book) {
    const userId = 1; // Thay đổi thành ID người dùng thực tế
    const newBook = {
        user_id: userId,
        book_id: book.id,
        quantity: 1 // Giả định là thêm 1 cuốn sách
    };

    // Gọi API để thêm sách vào giỏ hàng
    const result = await addToCartApi(newBook);

    if (result) {
        alert("Bạn đã thêm thành công cuốn sách vào giỏ hàng");
        loadCart(); // Tải lại giỏ hàng
    }
}

// Hàm gửi dữ liệu lên API thêm vào giỏ hàng
async function addToCartApi(book) {
    const options = {
        method: 'POST',
        body: JSON.stringify(book),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(addCartApi, options);
        if (!response.ok) {
            throw new Error('Error adding book to cart');
        }
        const result = await response.json();
        console.log('Added to cart:', result);
        return result;
    } catch (error) {
        console.error('Error sending to addCartApi:', error);
        return null; // Trả về null nếu có lỗi
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
async function removeFromCart(cartItemId) {
    try {
        const response = await fetch(removeCartApi(cartItemId), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error removing item from cart');
        }

        await loadCart(); // Tải lại giỏ hàng
        alert("Bạn đã xóa thành công cuốn sách khỏi giỏ hàng");
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

// Hàm hiển thị modal cập nhật số lượng
function showUpdateQuantityModal(cartItemId, currentQuantity) {
    console.log("showUpdateQuantityModal called with:", cartItemId, currentQuantity); // Kiểm tra đầu vào
    const modal = document.getElementById("update-quantity-modal");
    const quantityInput = document.getElementById("update-quantity-input");
    quantityInput.value = currentQuantity; // Đặt giá trị hiện tại vào ô nhập

    // Thêm sự kiện cho nút xác nhận
    document.getElementById("confirm-update-button").onclick = async () => {
        const newQuantity = parseInt(quantityInput.value);
        if (newQuantity > 0) {
            await updateCartItem(cartItemId, newQuantity);
            modal.style.display = "none"; // Ẩn modal sau khi cập nhật
        } else {
            alert("Số lượng phải lớn hơn 0!");
        }
    };

    modal.style.display = "block"; // Hiển thị modal
}

// Hàm cập nhật số lượng
async function updateCartItem(cartItemId, newQuantity) {
    const updatedItem = { quantity: newQuantity }; // Chỉ cần truyền số lượng mới

    try {
        const response = await fetch(updateCartApi(cartItemId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });

        if (!response.ok) {
            throw new Error('Error updating quantity');
        }

        await loadCart(); // Tải lại giỏ hàng
        alert("Số lượng đã được cập nhật thành công!");
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

// Hàm tải danh sách sách
function loadBook() {
    const titleTable = "<tr><th>Id</th><th>Name</th><th>Page Count</th><th>Author</th></tr>";
    fetch(getBookApi)
        .then(response => response.json())
        .then(books => {
            const htmls = books.map(book => `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.name}</td>
                    <td>${book.page_count}</td>
                    <td>${book.author_name}</td>
                </tr>
            `);
            document.querySelector('#book-table tbody').innerHTML = titleTable + htmls.join('');
        })
        .catch(err => console.log(err));
}

// Hàm tải danh sách tác giả
async function loadAuthor() {
    try {
        const response = await fetch(getAuthorApi);
        const authors = await response.json();
        const authorSelect = document.getElementById("author-select");

        authors.forEach(author => {
            const option = document.createElement("option");
            option.value = author.id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching authors:', error);
    }
}

// Hàm tải danh sách thể loại
async function loadCategory() {
    try {
        const response = await fetch(getCategoryApi);
        const categories = await response.json();
        const categorySelect = document.getElementById("category-select");

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}


function handleCreateForm() {
    const createBookForm = document.getElementById("create-book-form");
    createBookForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        const bookData = {
            name: document.getElementById("book-name").value,
            author_id: document.getElementById("author-select").value,
            category_id: document.getElementById("category-select").value,
            page_count: document.getElementById("page-count").value
        };

        const response = await fetch(addBookApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            alert("Sách đã được tạo thành công!");
            loadBook(); // Tải lại danh sách sách
        } else {
            alert("Có lỗi xảy ra khi tạo sách.");
        }
    });
}
