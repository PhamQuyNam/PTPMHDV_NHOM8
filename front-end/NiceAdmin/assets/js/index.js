// countBooks.js
async function fetchBookCount() {
    try {
        const response = await fetch('http://127.0.0.1:5000/book-management/count_book');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("tongSoLuongSach").innerHTML = data.tongSoLuongSach;
    } catch (error) {
        console.error('Error fetching book count:', error);
    }
}

// Gọi hàm fetchBookCount khi tải trang
document.addEventListener("DOMContentLoaded", fetchBookCount);

// countBooks.js
async function fetchUserCount() {
    try {
        const response = await fetch('http://127.0.0.1:5000/users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById("tongsoluonguser").innerHTML = data.tongSoLuonguser;
    } catch (error) {
        console.error('Error fetching book count:', error);
    }
}

// Gọi hàm fetchBookCount khi tải trang
document.addEventListener("DOMContentLoaded", fetchUserCount);

const getBooksByCategoryApi = "http://127.0.0.1:5000/book-management/category";

// Hàm fetch dữ liệu sách theo thể loại
async function fetchBooksByCategory(categoryId) {
    try {
        const response = await fetch(`${getBooksByCategoryApi}/${categoryId}`);
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

// Khởi tạo biểu đồ ECharts sau khi lấy dữ liệu từ API cho từng thể loại
document.addEventListener("DOMContentLoaded", async () => {
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
});

 // Cập nhật thẻ span theo ngày mong muốn
 function setDateLabel(label) {
    document.getElementById('date-span').textContent = ` | ${label}`;
}

// Hàm lấy ngày hiện tại
function fetchToday() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // Lấy ngày định dạng YYYY-MM-DD
    const userId = 1;

    // Cập nhật span với "Hôm nay"
    setDateLabel(dateStr);
    fetchHoaDonCount(userId, dateStr);
}


// Hàm gọi API để lấy số lượng hóa đơn
async function fetchHoaDonCount(userId, dateStr) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/hoa_don_date/${userId}/${dateStr}`);
        
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

// Gọi API với ngày mặc định khi trang tải
document.addEventListener("DOMContentLoaded", function() {
    const userId = 1;
    const defaultDate = "2024-11-10";
    setDateLabel(defaultDate);
    fetchHoaDonCount(userId, defaultDate);
});



//Năm tháng
// Hàm lấy hóa đơn trong tháng hiện tại
function fetchThisMonth() {
    const today = new Date();
    const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const userId = 1;

    // Cập nhật span với "Theo tháng"
    setDateLabel(`Tháng ${monthStr}`);
    // Gọi API tương ứng cho tháng
    fetchHoaDonCount(userId, monthStr, "month");
}

// Hàm lấy hóa đơn trong năm hiện tại
function fetchThisYear() {
    const today = new Date();
    const yearStr = `${today.getFullYear()}`;
    const userId = 1;

    // Cập nhật span với "Theo năm"
    setDateLabel(`Năm ${yearStr}`);
    // Gọi API tương ứng cho năm
    fetchHoaDonCount(userId, yearStr, "year");
}

// Hàm gọi API để lấy số lượng hóa đơn theo ngày, tháng hoặc năm
async function fetchHoaDonCount(userId, dateStr, type="day") {
    let apiUrl = `http://127.0.0.1:5000/hoa_don_date/${userId}/${dateStr}`;
    
    if (type === "month") {
        apiUrl = `http://127.0.0.1:5000/hoa_don_month/${userId}/${dateStr}`;
    } else if (type === "year") {
        apiUrl = `http://127.0.0.1:5000/hoa_don_year/${userId}/${dateStr}`;
    }

    try {
        const response = await fetch(apiUrl);
        
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

// Gọi API với ngày mặc định khi trang tải
document.addEventListener("DOMContentLoaded", function() {
    const userId = 1;
    const defaultDate = "2024-11-10";
    setDateLabel(defaultDate);
    fetchHoaDonCount(userId, defaultDate);
});
