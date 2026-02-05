// 修复 meting-js 自定义元素注册
(function() {
'use strict';

// 先加载必需的库
function loadLibraries() {
    const libraries = [
    {
        name: 'APlayer',
        url: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js',
        check: () => typeof APlayer !== 'undefined'
    },
    {
        name: 'MetingJS',
        url: 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js',
        check: () => typeof MetingJSElement !== 'undefined'
    }
    ];
    
    let loadedCount = 0;
    
    libraries.forEach(lib => {
    if (lib.check()) {
        loadedCount++;
        console.log(`${lib.name} 已加载`);
    } else {
        const script = document.createElement('script');
        script.src = lib.url;
        script.onload = () => {
        console.log(`${lib.name} 加载完成`);
        loadedCount++;
        if (loadedCount === libraries.length) {
            initPlayer();
        }
        };
        script.onerror = () => {
        console.error(`${lib.name} 加载失败`);
        loadedCount++;
        };
        document.head.appendChild(script);
    }
    });
    
    // 如果都已经加载，直接初始化
    if (loadedCount === libraries.length) {
    setTimeout(initPlayer, 100);
    }
}

// 初始化播放器
function initPlayer() {
    console.log('开始初始化音乐播放器...');
    
    // 检查自定义元素是否已注册
    if (!window.customElements.get('meting-js')) {
    console.error('meting-js 自定义元素未注册！');
    
    // 尝试手动注册
    if (typeof MetingJSElement !== 'undefined') {
        try {
        window.customElements.define('meting-js', MetingJSElement);
        console.log('手动注册 meting-js 成功');
        } catch (e) {
        console.error('手动注册失败:', e);
        }
    }
    }
    
    // 创建播放器容器
    if (!document.getElementById('music-player-container')) {
    const container = document.createElement('div');
    container.id = 'music-player-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        width: 66px;
        height: 66px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(64, 224, 208, 0.3);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(container);
    
    // 创建 meting-js 元素
    const metingElement = document.createElement('meting-js');
    metingElement.id = 'music-player';
    metingElement.setAttribute('id', '8748108052');
    metingElement.setAttribute('server', 'netease');
    metingElement.setAttribute('type', 'playlist');
    metingElement.setAttribute('fixed', 'true');
    metingElement.setAttribute('mini', 'true');
    metingElement.setAttribute('autoplay', 'false');
    metingElement.setAttribute('theme', '#40e0d0');
    metingElement.setAttribute('loop', 'all');
    metingElement.setAttribute('order', 'list');
    metingElement.setAttribute('preload', 'metadata');
    metingElement.setAttribute('volume', '0.5');
    metingElement.setAttribute('mutex', 'true');
    metingElement.setAttribute('list-folded', 'true');
    metingElement.setAttribute('list-max-height', '300px');
    
    container.appendChild(metingElement);
    console.log('音乐播放器已创建');
    
    // 添加展开/收起功能
    container.addEventListener('click', function(e) {
        if (e.target.closest('.aplayer-miniswitcher')) return;
        
        const player = container.querySelector('.aplayer');
        if (player) {
        if (player.classList.contains('aplayer-mini')) {
            player.classList.remove('aplayer-mini');
            container.style.width = '400px';
            container.style.height = 'auto';
            container.style.borderRadius = '10px';
        } else {
            player.classList.add('aplayer-mini');
            container.style.width = '66px';
            container.style.height = '66px';
            container.style.borderRadius = '50%';
        }
        }
    });
    }
}

// 启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLibraries);
} else {
    loadLibraries();
}
})();