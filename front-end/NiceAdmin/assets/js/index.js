// Lấy token từ localStorage
const token = localStorage.getItem("adminToken");

// Hàm fetch số lượng sách
async function fetchBookCount() {
    try {
        const response = await fetch('http://127.0.0.1:5000/book-management/count_book', {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("tongSoLuongSach").innerHTML = data.tongSoLuongSach;
    } catch (error) {
        console.error('Error fetching book count:', error);
    }
}

// Hàm fetch số lượng người dùng
async function fetchUserCount() {
    try {
        const response = await fetch('http://127.0.0.1:5000/users', {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("tongsoluonguser").innerHTML = data.tongSoLuonguser;
    } catch (error) {
        console.error('Error fetching user count:', error);
    }
}

// Hàm fetch sách theo thể loại
const getBooksByCategoryApi = "http://127.0.0.1:5000/book-management/category";
async function fetchBooksByCategory(categoryId) {
    try {
        const response = await fetch(`${getBooksByCategoryApi}/${categoryId}`, {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching books for category ${categoryId}:`, error);
        return [];
    }
}

// Khởi tạo biểu đồ ECharts
async function initChart() {
    const categories = [1, 2, 3, 4, 5]; // ID của các thể loại sách
    const chartData = [];

    for (const categoryId of categories) {
        const books = await fetchBooksByCategory(categoryId);
        chartData.push({
            value: books.length, // Số lượng sách trong thể loại
            name: `Thể loại ${categoryId}`
        });
    }

    const chart = echarts.init(document.querySelector("#trafficChart"));
    chart.setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [{
            name: 'Books by Category',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: chartData
        }]
    });
}

// Hàm gọi API để lấy số lượng hóa đơn theo ngày, tháng hoặc năm
async function fetchHoaDonCount(dateStr, type = "day") {
    let apiUrl = `http://127.0.0.1:5000/hoa_don_date/${dateStr}`;

    if (type === "month") {
        apiUrl = `http://127.0.0.1:5000/hoa_don_month/${dateStr}`;
    } else if (type === "year") {
        apiUrl = `http://127.0.0.1:5000/hoa_don_year/${dateStr}`;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('count_hoadon').textContent = data.total_invoices;
        } else {
            console.error("Lỗi khi gọi API:", response.statusText);
            document.getElementById('count_hoadon').textContent = "Error";
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        document.getElementById('count_hoadon').textContent = "Error";
    }
}

// Cập nhật tiêu đề ngày tháng năm trong phần tử HTML
function setDateLabel(label) {
    document.getElementById("date-span").textContent = ` | ${label}`;
}

// Hàm lấy ngày hiện tại
function fetchToday() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Lấy ngày định dạng YYYY-MM-DD

    // Cập nhật span với "Hôm nay"
    setDateLabel(dateStr);
    fetchHoaDonCount(dateStr);
}

// Hàm lấy hóa đơn trong tháng hiện tại
function fetchThisMonth() {
    const today = new Date();
    const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    // Cập nhật span với "Theo tháng"
    setDateLabel(`Tháng ${monthStr}`);
    // Gọi API tương ứng cho tháng
    fetchHoaDonCount(monthStr, "month");
}

// Hàm lấy hóa đơn trong năm hiện tại
function fetchThisYear() {
    const today = new Date();
    const yearStr = `${today.getFullYear()}`;

    // Cập nhật span với "Theo năm"
    setDateLabel(`Năm ${yearStr}`);
    // Gọi API tương ứng cho năm
    fetchHoaDonCount(yearStr, "year");
}

// Gọi API với ngày mặc định khi trang tải
document.addEventListener("DOMContentLoaded", async () => {
    const defaultDate = new Date().toISOString().split('T')[0]; // Ngày mặc định động

    await fetchBookCount(); // Lấy số lượng sách
    await fetchUserCount(); // Lấy số lượng người dùng
    await initChart(); // Khởi tạo biểu đồ ECharts

    setDateLabel(defaultDate);
    await fetchHoaDonCount(defaultDate); // Lấy số lượng hóa đơn cho ngày mặc định
});

// Gán các sự kiện cho các nút để lấy hóa đơn theo ngày, tháng, năm
document.getElementById("todayButton").addEventListener("click", fetchToday);
document.getElementById("thisMonthButton").addEventListener("click", fetchThisMonth);
document.getElementById("thisYearButton").addEventListener("click", fetchThisYear);
