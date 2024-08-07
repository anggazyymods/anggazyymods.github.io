document.addEventListener('DOMContentLoaded', function() {
    const loadingContainer = document.getElementById('loading-container');
    const downloadBtn = document.getElementById('download-btn');

    // Simulasi proses loading
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingContainer.style.display = 'none'; // Sembunyikan loading
            downloadBtn.disabled = false; // Aktifkan tombol download
        }
    }, 500); // Mengupdate progress setiap 500 ms

    // Event listener untuk tombol download
    downloadBtn.addEventListener('click', function() {
        const fileUrl = 'URL_FILE_ANDA'; // Ganti dengan URL file yang sesuai
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
