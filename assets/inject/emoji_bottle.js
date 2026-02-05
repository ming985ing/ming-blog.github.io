    // Giscus 表情包扩展核心脚本
    (function() {
        // 表情包源（Waline 官方 B 站/QQ 表情包）
        const EMOJI_SOURCES = {
        bilibili: 'https://cdn.jsdelivr.net/gh/walinejs/emojis@latest/bilibili/emojis.json',
        qq: 'https://cdn.jsdelivr.net/gh/walinejs/emojis@latest/qq/emojis.json'
        };
        // 存储表情包数据
        let emojiData = {
        bilibili: [],
        qq: []
        };

        // 等待 Giscus 加载完成
        function waitForGiscus() {
        return new Promise(resolve => {
            const checkGiscus = setInterval(() => {
            const giscusFrame = document.querySelector('iframe.giscus-frame');
            if (giscusFrame && giscusFrame.contentDocument) {
                clearInterval(checkGiscus);
                resolve(giscusFrame);
            }
            }, 500);
        });
        }

        // 加载表情包数据
        async function loadEmojiData() {
        try {
            // 加载 B 站表情包
            const biliRes = await fetch(EMOJI_SOURCES.bilibili);
            emojiData.bilibili = await biliRes.json();
            // 加载 QQ 表情包
            const qqRes = await fetch(EMOJI_SOURCES.qq);
            emojiData.qq = await qqRes.json();
        } catch (err) {
            console.error('加载表情包失败:', err);
        }
        }

        // 创建表情包面板
        function createEmojiPanel() {
        const giscusContainer = document.querySelector('.giscus');
        if (!giscusContainer) return;

        // 创建面板 DOM
        const panel = document.createElement('div');
        panel.className = 'giscus-emoji-panel';
        panel.innerHTML = `
            <div class="giscus-emoji-tabs">
            <div class="giscus-emoji-tab active" data-tab="bilibili">B站表情</div>
            <div class="giscus-emoji-tab" data-tab="qq">QQ表情</div>
            </div>
            <div class="giscus-emoji-content active" id="bilibili-emoji"></div>
            <div class="giscus-emoji-content" id="qq-emoji"></div>
        `;

        // 插入到 Giscus 容器顶部
        giscusContainer.insertBefore(panel, giscusContainer.firstChild);

        // 渲染表情包
        renderEmoji('bilibili', emojiData.bilibili);
        renderEmoji('qq', emojiData.qq);

        // 绑定标签切换事件
        const tabs = panel.querySelectorAll('.giscus-emoji-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
            // 切换标签激活状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // 切换内容显示
            const tabName = tab.dataset.tab;
            panel.querySelectorAll('.giscus-emoji-content').forEach(cont => {
                cont.classList.remove('active');
            });
            document.getElementById(`${tabName}-emoji`).classList.add('active');
            });
        });
        }

        // 渲染表情包到面板
        function renderEmoji(type, data) {
        const container = document.getElementById(`${type}-emoji`);
        if (!container || !data.length) return;

        data.forEach(emoji => {
            const img = document.createElement('img');
            img.className = 'giscus-emoji-item';
            img.src = `https://cdn.jsdelivr.net/gh/walinejs/emojis@latest/${type}/${emoji.file}`;
            img.alt = emoji.name;
            img.title = emoji.name;
            // 绑定点击事件：插入到 Giscus 输入框
            img.addEventListener('click', () => insertEmojiToGiscus(img.src, emoji.name));
            container.appendChild(img);
        });
        }

        // 插入表情到 Giscus 输入框
        async function insertEmojiToGiscus(emojiSrc, emojiName) {
        const giscusFrame = await waitForGiscus();
        const giscusDoc = giscusFrame.contentDocument;
        // 获取 Giscus 输入框
        const input = giscusDoc.querySelector('textarea[placeholder*="评论"]') || giscusDoc.querySelector('textarea');
        if (!input) return;

        // 插入表情（Markdown 图片格式）
        const emojiMarkdown = `![${emojiName}](${emojiSrc}) `;
        const cursorPos = input.selectionStart;
        input.value = 
            input.value.substring(0, cursorPos) + 
            emojiMarkdown + 
            input.value.substring(cursorPos);
        // 聚焦输入框并移动光标
        input.focus();
        input.selectionStart = input.selectionEnd = cursorPos + emojiMarkdown.length;
        
        // 触发输入框变更事件（保证 Giscus 识别内容）
        input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 适配深色模式切换
        function adaptDarkMode() {
        const darkModeToggle = document.querySelector('.darkmode-button');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
            setTimeout(() => {
                document.body.setAttribute('data-theme', document.documentElement.getAttribute('data-theme'));
            }, 100);
            });
        }
        }

        // 初始化
        async function init() {
        await loadEmojiData();
        await waitForGiscus();
        createEmojiPanel();
        adaptDarkMode();
        }

        // 页面加载完成后初始化
        if (document.readyState === 'complete') {
        init();
        } else {
        window.addEventListener('load', init);
        }
    })();
