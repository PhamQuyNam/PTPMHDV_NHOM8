const apiBaseURL = "http://127.0.0.1:5000"; // Địa chỉ máy chủ
const token = localStorage.getItem("adminToken"); // Lấy token từ localStorage

// Hàm gọi API để tải tất cả hóa đơn
async function loadOrders() {
    try {
        const response = await fetch(`${apiBaseURL}/hoa_don`, {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error("Lỗi khi tải hóa đơn:", error);
    }
}

// Hàm hiển thị dữ liệu lên bảng
function renderOrders(orders) {
    const tableBody = document.getElementById("order-body");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    orders.forEach(order => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user_id}</td>
            <td>${renderOrderDetails(order.information)}</td>
            <td>${order.sum_price.toLocaleString()} VNĐ</td>
            <td>${order.tt_hoadon}</td>
            <td>
                <button class="btn btn-danger" onclick="rejectOrder(${order.id})">Từ chối</button>
            </td>
            <td>
            <button class="btn btn-success" onclick="approveOrder(${order.id})">Phê duyệt</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Chuyển đổi thông tin đơn hàng JSON thành chuỗi dễ đọc
function renderOrderDetails(information) {
    try {
        const details = JSON.parse(information);
        return details.map(item => `${item.book_name} (SL: ${item.quantity})`).join(", ");
    } catch (error) {
        console.error("Lỗi khi chuyển đổi thông tin đơn hàng:", error);
        return "Không có thông tin";
    }
}

// Hàm phê duyệt tất cả hóa đơn
async function approveAllOrders() {
    try {
        const response = await fetch(`${apiBaseURL}/phe_duyet_all_hoa_don`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            alert("Đã phê duyệt tất cả hóa đơn!");
            loadOrders();
        } else {
            console.error("Lỗi: Phê duyệt tất cả hóa đơn thất bại.");
        }
    } catch (error) {
        console.error("Lỗi khi phê duyệt tất cả hóa đơn:", error);
    }
}

// Hàm phê duyệt một đơn hàng
async function approveOrder(orderId) {
    try {
        const response = await fetch(`${apiBaseURL}/phe_duyet_hoa_don/${orderId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            alert(`Đã phê duyệt đơn hàng ${orderId}`);
            loadOrders();
        } else {
            console.error(`Lỗi: Phê duyệt đơn hàng ${orderId} thất bại.`);
        }
    } catch (error) {
        console.error(`Lỗi khi phê duyệt đơn hàng ${orderId}:`, error);
    }
}

// Hàm từ chối một đơn hàng
async function rejectOrder(orderId) {
    try {
        const response = await fetch(`${apiBaseURL}/tu_choi_hoa_don/${orderId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            alert(`Đã từ chối đơn hàng ${orderId}`);
            loadOrders();
        } else {
            console.error(`Lỗi: Từ chối đơn hàng ${orderId} thất bại.`);
        }
    } catch (error) {
        console.error(`Lỗi khi từ chối đơn hàng ${orderId}:`, error);
    }
}

// Tải danh sách hóa đơn khi trang được load
window.onload = loadOrders;

// Gắn sự kiện cho nút phê duyệt tất cả
document.getElementById("approveAllButton").addEventListener("click", approveAllOrders);
