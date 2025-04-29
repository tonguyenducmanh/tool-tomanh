document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Image to Base64 functionality
    const dropZone = document.getElementById('drop-zone');
    const preview = document.getElementById('preview');
    const base64Output = document.getElementById('base64-output');
    const copyBtn = document.getElementById('copy-btn');

    // Handle paste event
    document.addEventListener('paste', (e) => {
        if (!document.getElementById('image-to-base64').classList.contains('active')) return;
        
        e.preventDefault();
        const items = e.clipboardData.items;
        
        for (let item of items) {
            if (item.type.includes('image')) {
                const blob = item.getAsFile();
                handleImageToBase64(blob);
                break;
            }
        }
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007bff';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        
        const files = e.dataTransfer.files;
        if (files[0] && files[0].type.includes('image')) {
            handleImageToBase64(files[0]);
        }
    });

    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        base64Output.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    function handleImageToBase64(blob) {
        // Create preview
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        preview.innerHTML = '';
        preview.appendChild(img);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            base64Output.value = reader.result;
        };
        reader.readAsDataURL(blob);
    }

    // Base64 to Image functionality
    const base64Input = document.getElementById('base64-input');
    const convertBtn = document.getElementById('convert-btn');
    const imagePreview = document.getElementById('image-preview');
    const downloadBtn = document.getElementById('download-btn');

    convertBtn.addEventListener('click', () => {
        const base64String = base64Input.value.trim();
        if (!base64String) {
            alert('Please enter a Base64 string');
            return;
        }

        try {
            // Clear previous preview
            imagePreview.innerHTML = '';

            // Create and display image
            const img = document.createElement('img');
            img.src = base64String;
            imagePreview.appendChild(img);

            // Enable download button
            downloadBtn.disabled = false;
        } catch (error) {
            alert('Invalid Base64 string');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const base64String = base64Input.value.trim();
        if (!base64String) return;

        // Create temporary link
        const link = document.createElement('a');
        link.href = base64String;
        link.download = 'image.' + getImageExtension(base64String);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function getImageExtension(base64String) {
        const match = base64String.match(/^data:image\/(\w+);base64,/);
        return match ? match[1] : 'png';
    }
});
