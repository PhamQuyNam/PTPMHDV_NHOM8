const apiUrl7Days = "http://127.0.0.1:5000/du_bao_hoa_don/7ngay";
const apiUrl3Months = "http://127.0.0.1:5000/du_bao_hoa_don/theothang";
const apiUrl1Year = "http://127.0.0.1:5000/du_bao_hoa_don/1nam"; // API 1 năm
const tableBody = document.querySelector("#forecastTable tbody");

function getToken() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        alert("Token không tồn tại. Vui lòng đăng nhập.");
        throw new Error("Token not found");
    }
    return token;
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm 0 nếu tháng có một chữ số
    const day = String(d.getDate()).padStart(2, '0'); // Thêm 0 nếu ngày có một chữ số
    return `${year}-${month}-${day}`;
}

function renderTable(data) {
    tableBody.innerHTML = ""; // Xóa nội dung hiện tại trong bảng
    data.forEach(item => {
        const row = document.createElement("tr");

        // Kiểm tra nếu là API theo ngày hay theo tháng
        if (item["Ngày"]) {
            // API Theo Ngày: Định dạng lại ngày
            const formattedDate = formatDate(item["Ngày"]);
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${item["Dự đoán"]}</td>
                <td>${item["Dự báo thấp nhất"]}</td>
                <td>${item["Dự đoán cao nhất"]}</td>
                <td>${item["Tổng số hóa đơn"]}</td>
            `;
        } else if (item["Tháng"]) {
            // API Theo 3 tháng (hoặc 1 năm)
            row.innerHTML = `
                <td>${item["Tháng"]}</td>
                <td>${item["Dự đoán"]}</td>
                <td>${item["Dự báo thấp nhất"]}</td>
                <td>${item["Dự đoán cao nhất"]}</td>
                <td>${item["Tổng số hóa đơn (1 năm)"]}</td>
            `;
        }
        tableBody.appendChild(row);
    });
}

async function fetchData(url) {
    const token = getToken();
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        throw new Error("Fetch failed");
    }
    return response.json();
}

function filterByDay() {
    fetchData(apiUrl7Days)
        .then(data => renderTable(data))
        .catch(error => console.error("Error fetching data:", error));
}

function filterBy3Months() {
    fetchData(apiUrl3Months)
        .then(data => renderTable(data))
        .catch(error => console.error("Error fetching data:", error));
}

function filterByYear() {
    fetchData(apiUrl1Year)
        .then(data => renderTable(data))
        .catch(error => console.error("Error fetching data:", error));
}

function exportTableToCSV() {
    const table = document.querySelector("#forecastTable");
    let csvContent = "";

    // Lấy dữ liệu từ tiêu đề bảng
    const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
    csvContent += headers.join(",") + "\n";

    // Lấy dữ liệu từ các hàng trong bảng
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td")).map(td => td.textContent.trim());
        if (cells.length > 0 && cells.some(cell => cell !== "")) {
            csvContent += cells.join(",") + "\n";
        }
    });

    // Tạo link tải file CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "du_bao_doanh_thu.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
