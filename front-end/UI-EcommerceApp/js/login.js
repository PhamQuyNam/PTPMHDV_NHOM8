// document.querySelector("form").addEventListener("submit", async function (e) {
//     e.preventDefault(); // Ngăn chặn form reload trang

//     // Lấy dữ liệu từ form
//     const name = document.querySelector('input[placeholder="Name"]').value;
//     const password = document.querySelector('input[placeholder="Password"]').value;

//     // Kiểm tra dữ liệu đầu vào
//     if (!name || !password) {
//         alert("Vui lòng nhập đủ tài khoản và mật khẩu");
//         return;
//     }

//     try {
//         // Gửi yêu cầu GET tới API User
//         const response = await fetch(
//             `http://127.0.0.1:5000/get_user_credentials/${encodeURIComponent(name)}`
//         );

//         if (response.ok) {
//             const data = await response.json();

//             // Kiểm tra loại tài khoản và mật khẩu
//             if (data.password_admin && data.password_admin === password) {
//                 // alert("Welcome to the Admin Panel!");
//                 // Chuyển hướng đến giao diện admin
//                 window.location.href = "http://127.0.0.1:5501/web_ban_sach/front-end/NiceAdmin/index.html";
//             } else if (data.password_user && data.password_user === password) {
//                 // alert("Welcome to the User Panel!");
//                 // Chuyển hướng đến giao diện user
//                 window.location.href = "http://127.0.0.1:5501/front-end/Giao_dien_web%20ban_hang/index.html";
//             } else {
//                 alert("Mật khẩu không chính xác. Vui lòng thử lại.");
//             }
//         } else {
//             alert("Tài khoản không tìm thấy. Vui lòng kiểm tra lại thông tin đăng nhập của bạn.");
//         }
//     } catch (error) {
//         console.error("Lỗi trong quá trình đăng nhập:", error);
//         alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
//     }
// });


document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn chặn form reload trang

    // Lấy dữ liệu từ form
    const username = document.querySelector('input[placeholder="Name"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
        alert("Vui lòng nhập đủ tài khoản và mật khẩu");
        return;
    }

    try {
        // Gửi yêu cầu POST tới API /login để lấy token
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();

            // Lưu token vào localStorage
            localStorage.setItem("userToken", data.access_token);

            // Chuyển hướng dựa vào loại tài khoản
            if (username === "admin") {
                // Chuyển hướng đến giao diện admin
                window.location.href = "http://127.0.0.1:5501/front-end/Giao_dien_web%20ban_hang/index.html";
            } else {
                // Chuyển hướng đến giao diện user
                window.location.href = "http://127.0.0.1:5501/front-end/Giao_dien_web%20ban_hang/index.html";
            }
        } else {
            alert("Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.");
        }
    } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
});