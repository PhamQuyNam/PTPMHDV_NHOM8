document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("adminToken");
    const currentPage = window.location.pathname;

    // Kiểm tra trang hiện tại và hành động phù hợp
    if (currentPage.includes("login_admin.html")) {
        // Nếu ở trang đăng nhập và đã có token, chuyển hướng đến trang admin
        if (token) {
            alert("You are already logged in.");
            window.location.href = "../NiceAdmin/index.html"; // Chuyển đến giao diện admin
        }
    } else if (currentPage.includes("index.html")) {
        // Nếu ở trang admin mà không có token, chuyển hướng về trang đăng nhập
        if (!token) {
            alert("Please login first.");
            window.location.href = "../UI-EcommerceApp/login_admin.html";
        } else {
            console.log("Token exists. Proceed to admin panel.");
        }
    }
});

// Xử lý sự kiện đăng nhập
document.querySelector("form")?.addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form tự động reload trang

    // Lấy dữ liệu từ form
    const name = document.querySelector('input[placeholder="Name"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !password) {
        alert("Please enter both Name and Password.");
        return;
    }

    try {
        // Gửi yêu cầu POST tới API để lấy token
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: name, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.access_token;

            // Lưu token vào localStorage
            localStorage.setItem("adminToken", token);

            alert("Welcome to the Admin Panel!");
            window.location.href = "./index.html";
        } else {
            const errorData = await response.json();
            alert(errorData.msg || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
});

// Xử lý sự kiện đăng xuất
document.querySelector("#logoutButton")?.addEventListener("click", function () {
    // Xóa token khỏi localStorage
    localStorage.removeItem("adminToken");

    alert("You have been logged out.");
    window.location.href = "../UI-EcommerceApp/login_admin.html"; // Quay lại trang đăng nhập
});
