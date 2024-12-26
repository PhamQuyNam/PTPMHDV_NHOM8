// Lấy token từ localStorage
const token = localStorage.getItem("adminToken");
// Function to filter data by the last 30 days
function filterByDay() {
    const today = new Date();
    const tableBody = document.querySelector('#forecastTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        fetch(`http://127.0.0.1:5000/hoa_don_date/${formattedDate}`, {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        })
            .then(response => response.json())
            .then(data => {
                updateTable(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

// Function to filter data by the last 12 months
function filterBy3Months() {
    const today = new Date();
    const tableBody = document.querySelector('#forecastTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        const formattedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        fetch(`http://127.0.0.1:5000/hoa_don_month/${formattedMonth}`, {
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header
            }
        })
            .then(response => response.json())
            .then(data => {
                updateTable(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

// Function to update the table with fetched data
function updateTable(data) {
    const tableBody = document.querySelector('#forecastTable tbody');

    // Create a new row with the fetched data
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.date || data.month || data.year}</td>
      <td>${data.total_invoices || ''}</td>
      <td>${data.total_quantity || ''}</td>
      <td>${data.total_sum_price || ''}</td>
      <td>${data.total_invoices || ''}</td>
    `;
    tableBody.appendChild(row);
}

// Function to start the timer
function startTimer() {
    // Call the filterByDay function every minute (60000 milliseconds)
    setInterval(() => {
        filterByDay();
    }, 60000); // 1 minute
}

// Start the timer when the page loads
window.onload = function() {
    startTimer();
    filterByDay(); // Initial call to populate data immediately
};

// Function to export table data to CSV (if needed)
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
