// 全局變數
let totalBlocks = 0;
let calculationHistory = [];

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化應用程式
function initializeApp() {
    // 設置事件監聽器
    setupEventListeners();
    
    // 初始化球殼厚度輸入框的顯示/隱藏
    updateShellThicknessVisibility();
    
    console.log('Minecraft 建築小幫手已載入完成！');
}

// 設置事件監聽器
function setupEventListeners() {
    // 球體樣式變更時顯示/隱藏球殼厚度輸入框
    document.getElementById('sphere-style').addEventListener('change', updateShellThicknessVisibility);
    
    // 方塊類型變更時顯示/隱藏自定義方塊名稱輸入框
    document.getElementById('block-type').addEventListener('change', updateCustomBlockNameVisibility);
    
    // 為所有數字輸入框添加驗證
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', validateNumberInput);
    });
}

// 更新球殼厚度輸入框的顯示/隱藏
function updateShellThicknessVisibility() {
    const sphereStyle = document.getElementById('sphere-style').value;
    const shellThicknessGroup = document.getElementById('shell-thickness-group');
    
    if (sphereStyle === 'shell') {
        shellThicknessGroup.style.display = 'block';
    } else {
        shellThicknessGroup.style.display = 'none';
    }
}

// 更新自定義方塊名稱輸入框的顯示/隱藏
function updateCustomBlockNameVisibility() {
    const blockType = document.getElementById('block-type').value;
    const customBlockName = document.getElementById('custom-block-name');
    
    if (blockType === 'custom') {
        customBlockName.style.display = 'block';
    } else {
        customBlockName.style.display = 'none';
    }
}

// 驗證數字輸入
function validateNumberInput(event) {
    const value = parseInt(event.target.value);
    if (value < 1) {
        event.target.value = 1;
    }
}

// 基礎形狀計算器
function calculateBasic() {
    const length = parseInt(document.getElementById('length').value);
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    const wallThickness = parseInt(document.getElementById('wall-thickness').value);
    
    if (!validateInputs([length, width, height, wallThickness])) {
        return;
    }
    
    // 計算實心建築的方塊數量
    const solidBlocks = length * width * height;
    
    // 計算空心建築的方塊數量
    const innerLength = length - (2 * wallThickness);
    const innerWidth = width - (2 * wallThickness);
    const innerHeight = height - (2 * wallThickness);
    
    let hollowBlocks = 0;
    if (innerLength > 0 && innerWidth > 0 && innerHeight > 0) {
        const outerVolume = length * width * height;
        const innerVolume = innerLength * innerWidth * innerHeight;
        hollowBlocks = outerVolume - innerVolume;
    } else {
        hollowBlocks = solidBlocks; // 如果牆壁太厚，就等於實心
    }
    
    // 計算牆壁方塊數量
    const wallBlocks = (2 * length * height + 2 * width * height) * wallThickness;
    
    // 計算地板和天花板
    const floorCeilingBlocks = 2 * length * width;
    
    const results = {
        solid: solidBlocks,
        hollow: hollowBlocks,
        walls: wallBlocks,
        floorCeiling: floorCeilingBlocks,
        total: hollowBlocks
    };
    
    displayResults('basic-results', '基礎形狀計算結果', results);
    addToTotal(hollowBlocks, '基礎形狀建築');
}

// 圓形建築計算器
function calculateCircle() {
    const radius = parseInt(document.getElementById('radius').value);
    const height = parseInt(document.getElementById('circle-height').value);
    const wallThickness = parseInt(document.getElementById('circle-wall-thickness').value);
    
    if (!validateInputs([radius, height, wallThickness])) {
        return;
    }
    
    // 計算圓形面積
    const outerArea = Math.PI * radius * radius;
    const innerRadius = radius - wallThickness;
    const innerArea = innerRadius > 0 ? Math.PI * innerRadius * innerRadius : 0;
    
    // 計算實心圓柱體
    const solidBlocks = Math.round(outerArea * height);
    
    // 計算空心圓柱體
    const hollowBlocks = Math.round((outerArea - innerArea) * height);
    
    // 計算圓周長度
    const circumference = 2 * Math.PI * radius;
    const wallBlocks = Math.round(circumference * height * wallThickness);
    
    const results = {
        solid: solidBlocks,
        hollow: hollowBlocks,
        walls: wallBlocks,
        circumference: Math.round(circumference),
        total: hollowBlocks
    };
    
    displayResults('circle-results', '圓形建築計算結果', results);
    addToTotal(hollowBlocks, '圓形建築');
}

// 樓梯計算器
function calculateStairs() {
    const length = parseInt(document.getElementById('stairs-length').value);
    const width = parseInt(document.getElementById('stairs-width').value);
    const height = parseInt(document.getElementById('stairs-height').value);
    
    if (!validateInputs([length, width, height])) {
        return;
    }
    
    // 計算樓梯方塊數量
    let totalStairBlocks = 0;
    let stepBlocks = 0;
    
    // 每層樓梯的方塊數量
    for (let i = 1; i <= height; i++) {
        const stepLength = Math.ceil(length * (i / height));
        stepBlocks += stepLength * width;
    }
    
    // 計算側邊牆壁
    const sideWalls = 2 * length * height;
    
    // 計算總數
    totalStairBlocks = stepBlocks + sideWalls;
    
    const results = {
        steps: stepBlocks,
        sideWalls: sideWalls,
        total: totalStairBlocks,
        stepCount: height,
        averageStepLength: Math.round(length / height)
    };
    
    displayResults('stairs-results', '樓梯計算結果', results);
    addToTotal(totalStairBlocks, '樓梯');
}

// 金字塔計算器
function calculatePyramid() {
    const baseLength = parseInt(document.getElementById('pyramid-base').value);
    const height = parseInt(document.getElementById('pyramid-height').value);
    const style = document.getElementById('pyramid-style').value;
    
    if (!validateInputs([baseLength, height])) {
        return;
    }
    
    let totalBlocks = 0;
    let layerCount = 0;
    
    // 計算每層的方塊數量
    for (let i = 0; i < height; i++) {
        const currentLayerLength = baseLength - (2 * i);
        if (currentLayerLength > 0) {
            const layerBlocks = currentLayerLength * currentLayerLength;
            totalBlocks += layerBlocks;
            layerCount++;
        }
    }
    
    let hollowBlocks = 0;
    let roomBlocks = 0;
    
    if (style === 'hollow') {
        // 計算空心金字塔
        const innerBaseLength = Math.max(1, baseLength - 4);
        const innerHeight = Math.max(1, height - 2);
        
        let innerBlocks = 0;
        for (let i = 0; i < innerHeight; i++) {
            const currentInnerLength = innerBaseLength - (2 * i);
            if (currentInnerLength > 0) {
                innerBlocks += currentInnerLength * currentInnerLength;
            }
        }
        hollowBlocks = totalBlocks - innerBlocks;
    } else if (style === 'hollow-with-rooms') {
        // 計算帶房間的空心金字塔
        const roomSize = Math.max(3, Math.floor(baseLength / 4));
        const roomCount = Math.floor((baseLength - 2) / (roomSize + 1));
        roomBlocks = roomCount * roomSize * roomSize * Math.floor(height / 2);
        hollowBlocks = totalBlocks - roomBlocks;
    } else {
        // 實心金字塔
        hollowBlocks = totalBlocks;
    }
    
    const results = {
        solid: totalBlocks,
        hollow: hollowBlocks,
        rooms: roomBlocks,
        layers: layerCount,
        total: hollowBlocks
    };
    
    displayResults('pyramid-results', '金字塔計算結果', results);
    addToTotal(hollowBlocks, '金字塔');
}

// 球體計算器
function calculateSphere() {
    const radius = parseInt(document.getElementById('sphere-radius').value);
    const style = document.getElementById('sphere-style').value;
    const shellThickness = parseInt(document.getElementById('shell-thickness').value) || 1;
    
    if (!validateInputs([radius])) {
        return;
    }
    
    let totalBlocks = 0;
    let hollowBlocks = 0;
    
    // 計算球體體積（近似值）
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    totalBlocks = Math.round(volume);
    
    if (style === 'hollow') {
        // 空心球體
        const innerRadius = Math.max(1, radius - 1);
        const innerVolume = (4/3) * Math.PI * Math.pow(innerRadius, 3);
        hollowBlocks = Math.round(volume - innerVolume);
    } else if (style === 'shell') {
        // 指定厚度的球殼
        const innerRadius = Math.max(1, radius - shellThickness);
        const innerVolume = (4/3) * Math.PI * Math.pow(innerRadius, 3);
        hollowBlocks = Math.round(volume - innerVolume);
    } else {
        // 實心球體
        hollowBlocks = totalBlocks;
    }
    
    // 計算表面積
    const surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
    
    const results = {
        solid: totalBlocks,
        hollow: hollowBlocks,
        surfaceArea: Math.round(surfaceArea),
        diameter: radius * 2,
        total: hollowBlocks
    };
    
    displayResults('sphere-results', '球體計算結果', results);
    addToTotal(hollowBlocks, '球體');
}

// 總計計算器
function calculateTotal() {
    const blockType = document.getElementById('block-type').value;
    const customBlockName = document.getElementById('custom-block-name').value;
    
    // 更新總方塊數量顯示
    document.getElementById('total-blocks').value = totalBlocks;
    
    // 計算預估建造時間
    const estimatedTime = calculateEstimatedTime(totalBlocks);
    document.getElementById('estimated-time').value = estimatedTime;
    
    // 顯示詳細結果
    const resultsDiv = document.getElementById('total-blocks').parentElement.parentElement;
    let resultsHtml = `
        <div class="results show">
            <h3>總計計算結果</h3>
            <div class="result-item">
                <span class="result-label">總方塊數量:</span>
                <span class="result-value">${totalBlocks.toLocaleString()} 個</span>
            </div>
            <div class="result-item">
                <span class="result-label">預估建造時間:</span>
                <span class="result-value">${estimatedTime}</span>
            </div>
            <div class="result-item">
                <span class="result-label">方塊類型:</span>
                <span class="result-value">${getBlockTypeName(blockType, customBlockName)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">計算項目數:</span>
                <span class="result-value">${calculationHistory.length} 項</span>
            </div>
        </div>
    `;
    
    // 移除舊的結果顯示
    const oldResults = resultsDiv.querySelector('.results');
    if (oldResults) {
        oldResults.remove();
    }
    
    // 添加新的結果顯示
    resultsDiv.insertAdjacentHTML('beforeend', resultsHtml);
}

// 重置所有計算
function resetAll() {
    totalBlocks = 0;
    calculationHistory = [];
    
    // 重置所有輸入框
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        if (input.id === 'total-blocks') {
            input.value = 0;
        } else if (input.id === 'estimated-time') {
            input.value = '';
        } else {
            // 恢復預設值
            const defaultValues = {
                'length': 10, 'width': 10, 'height': 5, 'wall-thickness': 1,
                'radius': 10, 'circle-height': 5, 'circle-wall-thickness': 1,
                'stairs-length': 10, 'stairs-width': 3, 'stairs-height': 5,
                'pyramid-base': 20, 'pyramid-height': 10,
                'sphere-radius': 10, 'shell-thickness': 2
            };
            if (defaultValues[input.id]) {
                input.value = defaultValues[input.id];
            }
        }
    });
    
    // 隱藏所有結果
    const results = document.querySelectorAll('.results');
    results.forEach(result => {
        result.classList.remove('show');
    });
    
    // 重置選擇框
    document.getElementById('pyramid-style').value = 'solid';
    document.getElementById('sphere-style').value = 'solid';
    document.getElementById('block-type').value = 'stone';
    
    // 更新顯示
    updateShellThicknessVisibility();
    updateCustomBlockNameVisibility();
    
    console.log('所有計算已重置');
}

// 驗證輸入值
function validateInputs(values) {
    for (let value of values) {
        if (isNaN(value) || value < 1) {
            alert('請輸入有效的正整數！');
            return false;
        }
    }
    return true;
}

// 顯示計算結果
function displayResults(elementId, title, results) {
    const resultsDiv = document.getElementById(elementId);
    
    let html = `<h3>${title}</h3>`;
    
    for (let [key, value] of Object.entries(results)) {
        if (key !== 'total') {
            const label = getResultLabel(key);
            html += `
                <div class="result-item">
                    <span class="result-label">${label}:</span>
                    <span class="result-value">${value.toLocaleString()} 個</span>
                </div>
            `;
        }
    }
    
    html += `
        <div class="result-item">
            <span class="result-label">總計:</span>
            <span class="result-value">${results.total.toLocaleString()} 個</span>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');
}

// 獲取結果標籤
function getResultLabel(key) {
    const labels = {
        solid: '實心方塊',
        hollow: '空心方塊',
        walls: '牆壁方塊',
        floorCeiling: '地板/天花板',
        steps: '樓梯方塊',
        sideWalls: '側邊牆壁',
        rooms: '房間方塊',
        layers: '層數',
        surfaceArea: '表面積',
        diameter: '直徑',
        circumference: '圓周長度',
        stepCount: '階梯數',
        averageStepLength: '平均階梯長度'
    };
    return labels[key] || key;
}

// 添加到總計
function addToTotal(blocks, description) {
    totalBlocks += blocks;
    calculationHistory.push({
        blocks: blocks,
        description: description,
        timestamp: new Date()
    });
    
    // 更新總計顯示
    document.getElementById('total-blocks').value = totalBlocks;
    
    console.log(`已添加 ${blocks} 個方塊 (${description})，總計: ${totalBlocks}`);
}

// 計算預估建造時間
function calculateEstimatedTime(blocks) {
    const blocksPerMinute = 100; // 假設每分鐘放置100個方塊
    const minutes = Math.ceil(blocks / blocksPerMinute);
    
    if (minutes < 60) {
        return `${minutes} 分鐘`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} 小時 ${remainingMinutes} 分鐘`;
    } else {
        const days = Math.floor(minutes / 1440);
        const remainingHours = Math.floor((minutes % 1440) / 60);
        return `${days} 天 ${remainingHours} 小時`;
    }
}

// 獲取方塊類型名稱
function getBlockTypeName(blockType, customName) {
    const blockTypes = {
        'stone': '石頭',
        'wood': '木材',
        'brick': '磚塊',
        'glass': '玻璃',
        'concrete': '混凝土',
        'custom': customName || '自定義方塊'
    };
    return blockTypes[blockType] || '未知方塊';
}

// 工具函數：格式化數字
function formatNumber(num) {
    return num.toLocaleString();
}

// 工具函數：顯示通知
function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後自動移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 