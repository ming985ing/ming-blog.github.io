// 打字机修复脚本 - 解决文本闪现问题
(function() {
'use strict';

// 配置参数（可修改）
const config = {
    text: '志之所趋，无远弗届，穷山距海，不能限也',
    typeSpeed: 30,
    startDelay: 0,    // 开始前延迟，让用户看到空白状态
    backSpeed: 30,
    backDelay: 1200,
    cursorChar: '|'
};

// 1. 尽早准备副标题（防止闪现）
function prepareSubtitleEarly() {
    const subtitleEl = document.getElementById('subtitle');
    if (!subtitleEl) return null;
    
    // 获取原始文本
    let originalText = subtitleEl.textContent.trim();
    if (!originalText || originalText === '...' || originalText === 'undefined') {
    originalText = config.text;
    }
    
    // 立即清空并保存文本到data属性
    subtitleEl.textContent = '';
    subtitleEl.dataset.typedText = originalText;
    subtitleEl.style.visibility = 'hidden';  // 先隐藏，避免闪烁
    
    return { element: subtitleEl, text: originalText };
}

// 2. 加载Typed.js
function loadTypedJS() {
    return new Promise((resolve) => {
    if (typeof Typed !== 'undefined') {
        resolve();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.12';
    script.onload = resolve;
    script.onerror = resolve;  // 即使加载失败也继续
    document.head.appendChild(script);
    });
}

// 3. 初始化打字机（从空白开始）
function initTypedFromEmpty() {
    const subtitleEl = document.getElementById('subtitle');
    if (!subtitleEl || subtitleEl.dataset.typedInitialized) return;
    
    const text = subtitleEl.dataset.typedText || config.text;
    
    // 标记已初始化
    subtitleEl.dataset.typedInitialized = 'true';
    
    // 创建打字机容器
    const container = document.createElement('span');
    container.className = 'typed-container';
    subtitleEl.appendChild(container);
    
    // 检查Typed.js是否可用
    if (typeof Typed === 'undefined') {
    console.warn('Typed.js 未加载，直接显示文本');
    container.textContent = text;
    subtitleEl.style.visibility = 'visible';
    return;
    }
    
    try {
    // 初始化打字机，关键参数：startEmpty
    const typed = new Typed(container, {
        strings: [text],
        startEmpty: true,            // 从空白开始打字
        typeSpeed: config.typeSpeed,
        startDelay: config.startDelay,
        backSpeed: config.backSpeed,
        backDelay: config.backDelay,
        loop: false,
        showCursor: true,
        cursorChar: config.cursorChar,
        smartBackspace: true,
        onBegin: function() {
        // 打字开始时显示元素
        subtitleEl.style.visibility = 'visible';
        console.log('打字机开始（从空白开始）');
        },
        onComplete: function() {
        console.log('打字完成');
        }
    });
    
    // 保存实例供调试
    window.typedInstance = typed;
    
    } catch (error) {
    console.error('打字机初始化失败:', error);
    container.textContent = text;
    subtitleEl.style.visibility = 'visible';
    }
}

// 4. 主执行流程
function main() {
    console.log('开始设置打字机（无闪现版）...');
    
    // 第一步：尽早清空副标题
    prepareSubtitleEarly();
    
    // 第二步：加载Typed.js
    loadTypedJS().then(() => {
    // 第三步：延迟初始化，确保一切就绪
    setTimeout(initTypedFromEmpty, 500);
    });
}

// 根据页面状态启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    // 如果DOM已经加载，延迟执行以确保主题JS已运行
    setTimeout(main, 100);
}

// 调试辅助
window.fixTypedFlash = function() {
    const subtitleEl = document.getElementById('subtitle');
    if (subtitleEl) {
    delete subtitleEl.dataset.typedInitialized;
    initTypedFromEmpty();
    }
};
})();