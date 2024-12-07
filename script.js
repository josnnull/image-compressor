document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要的DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const controls = document.getElementById('controls');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;
    let currentImageData = null; // 存储当前图片的数据

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#0071e3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#d2d2d7';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#d2d2d7';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 处理压缩质量调节
    qualityInput.addEventListener('input', (e) => {
        const quality = parseInt(e.target.value);
        qualityValue.textContent = quality + '%';
        if (currentImageData) {
            compressImage(currentImageData, quality / 100);
        }
    });

    // 处理文件上传
    function handleFile(file) {
        // 检查文件类型
        if (!file.type.match(/image\/(jpeg|png)/)) {
            alert('请上传 PNG 或 JPG 格式的图片！');
            return;
        }

        currentFile = file;
        
        // 显示原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageData = e.target.result; // 保存图片数据
            originalImage.src = currentImageData;
            originalSize.textContent = formatFileSize(file.size);
            
            // 进行初始压缩
            compressImage(currentImageData, qualityInput.value / 100);
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(imageData, quality) {
        const img = new Image();
        img.onload = () => {
            // 创建canvas进行压缩
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 将压缩后的图片转换为blob并显示
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    compressedImage.src = url;
                    compressedSize.textContent = formatFileSize(blob.size);
                    
                    // 更新下载按钮的URL
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        const ext = currentFile.name.split('.').pop();
                        link.download = `compressed_${Date.now()}.${ext}`;
                        link.href = url;
                        link.click();
                    };
                }
            }, currentFile.type, quality);
        };
        img.src = imageData;
    }

    // 格式化文件大小显示
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 