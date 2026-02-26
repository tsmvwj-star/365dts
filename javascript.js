// 页面导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 页面导航功能
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活跃状态
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // 添加活跃状态到点击项
            this.classList.add('active');
            
            // 隐藏所有页面
            document.querySelectorAll('.content-area').forEach(page => {
                page.classList.remove('active');
            });
            
            // 显示对应页面
            const pageId = this.getAttribute('data-page') + '-page';
            document.getElementById(pageId).classList.add('active');
        });
    });
    
    // 快速操作按钮
    const profileDeposit = document.getElementById('profile-deposit');
    const profileWithdraw = document.getElementById('profile-withdraw');
    
    if (profileDeposit) {
        profileDeposit.addEventListener('click', function() {
            document.querySelector('[data-page="deposit"]').click();
        });
    }
    
    if (profileWithdraw) {
        profileWithdraw.addEventListener('click', function() {
            document.querySelector('[data-page="withdraw"]').click();
        });
    }
    
    // 选择支付方式
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // 选择存款/取款金额
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.amount-btn').forEach(b => {
                b.style.background = 'rgba(255, 255, 255, 0.1)';
                b.style.borderColor = 'rgba(255, 204, 0, 0.3)';
            });
            this.style.background = 'rgba(255, 204, 0, 0.3)';
            this.style.borderColor = '#ffcc00';
        });
    });
    
    // 主要按钮点击事件
    document.querySelectorAll('.primary-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            alert(`您点击了: ${action}\n\n这是一个演示。在实际应用中，此操作将被处理。`);
        });
    });
    
    // 菜单项点击事件
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('.menu-text').textContent;
            alert(`打开: ${text}`);
        });
    });
    
    // 促销标签页
 


     (function() {
        // 获取 tabs 容器 和 所有 tab
        const tabsContainer = document.getElementById('promoTabs');
        const tabs = document.querySelectorAll('.promo-tab');
        const contentTitle = document.getElementById('contentTitle');

        
        const contentDesc = document.getElementById('contentDesc');

        // 辅助内容映射 (仅作展示趣味)
        const contentMap = {
            'events':     { title: '🔥 精彩活动', desc: '新用户首单立减 · 限时闪购' },
            'rebate':     { title: '💰 返利专区', desc: '今日返利翻倍，最高返28%' },
            'vip':        { title: '👑 VIP 殿堂', desc: '年费会员赠专属好礼 + 无门槛券' },
            'code':       { title: '🎫 兑换中心', desc: '输入兑换码领取惊喜礼包' },
            'history':    { title: '📜 历史活动', desc: '往期返场，经典再现' },
            'pending':    { title: '⏳ 待处理', desc: '您的审核进度 · 敬请期待' }
        };

        // 当前激活的 tab 值 (直接通过class判断)
        function updateContent(activeTab) {
            if (!activeTab) return;
            const tabKey = activeTab.dataset.tab;   // events, rebate ...
            const content = contentMap[tabKey] || { title: tabKey, desc: '详情更新中' };
            if (contentTitle) contentTitle.innerText = content.title;
            if (contentDesc) contentDesc.innerText = content.desc;
        }

        // 设置激活样式 (并更新内容)
        function setActiveTab(clickedTab) {
            // 移除所有 active 类
            tabs.forEach(tab => tab.classList.remove('active'));
            // 给当前点击的 tab 添加 active
            clickedTab.classList.add('active');
            // 更新下面内容区
            updateContent(clickedTab);
        }

        // 核心方法：让被点击的 tab 滚动到容器中间 (水平居中)
        function scrollTabToCenter(targetTab) {
            if (!tabsContainer || !targetTab) return;

            // 容器可视宽度、滚动距离
            const containerRect = tabsContainer.getBoundingClientRect();
            const tabRect = targetTab.getBoundingClientRect();

            // 计算当前tab相对于容器可见区左边缘的距离
            const relativeLeft = tabRect.left - containerRect.left;
            // 计算理想的滚动距离 = 当前滚动左距 + relativeLeft - (容器宽度的一半) + (tab宽度的一半)
            // 目标：让tab的中线对准容器中线
            const targetScrollLeft = tabsContainer.scrollLeft 
                                    + relativeLeft 
                                    - (containerRect.width / 2) 
                                    + (tabRect.width / 2);

            // 平滑滚动到计算出的位置
            tabsContainer.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'          // 平滑移动
            });
        }

        // 处理点击事件
        function handleTabClick(event) {
            const clickedTab = event.currentTarget;   // 当前事件绑定的tab

            // 1. 更新激活状态 + 内容区
            setActiveTab(clickedTab);

            // 2. 执行滚动居中 (核心功能)
            scrollTabToCenter(clickedTab);
        }

        // 为每个 tab 添加点击监听
        tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // 初始化：保证内容与激活标签一致 (例如页面可能默认active在"events")
        const initialActive = document.querySelector('.promo-tab.active');
        if (initialActive) {
            updateContent(initialActive);
            // 可选：初次加载时要不要把激活项滚动到中间？为了更直观，可以主动调用一下居中。
            // 但希望初始时展示第一个即可，不打扰用户浏览。若想也居中，取消下一行注释。
            // scrollTabToCenter(initialActive);
        }

        // 额外细节：如果窗口大小改变，可能会影响居中视觉，但不影响点击后的精确定位
        // 如果希望一开始就确保激活的标签可见(且在中间)，可加下列代码（可选但非必须）
        // 但为避免初次滚动突兀，加一个延迟小量，且仅当激活项不在视野才滚动 (不过需求更强调点击后，这里简单加个200ms后柔和居中)
        // 这部分完全可不要，但为了展示“第一次进入时也能让选中标签可见”，我加一个温和处理。
        window.addEventListener('load', function() {
            // 稍微延迟确保布局稳定
            setTimeout(() => {
                const activeNow = document.querySelector('.promo-tab.active');
                if (activeNow && tabsContainer) {
                    // 检查是否在视野内 (粗略: 若完全不可见或部分溢出，可滚动)
                    const containerRect = tabsContainer.getBoundingClientRect();
                    const tabRect = activeNow.getBoundingClientRect();
                    const isVisible = tabRect.left >= containerRect.left && tabRect.right <= containerRect.right;
                    if (!isVisible) {
                        // 如果当前激活项不可见，温柔地把它带到中间 (但也可不执行)
                        // 这里采取和点击一样的居中方式，但小延迟后平滑移动，不打扰。
                        scrollTabToCenter(activeNow);
                    }
                }
            }, 100); // 短延时，不影响初始渲染
        });

    })();
    
    // 游戏项点击事件
    document.querySelectorAll('.game-item').forEach(game => {
        game.addEventListener('click', function() {
            const gameName = this.querySelector('.game-name').textContent;
            alert(`正在打开: ${gameName} 游戏`);
        });
    });

    
    // 为所有菜单按钮添加点击事件
    function setupMenuToggle(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                slidebarPanel.classList.add('active');
                overlay.classList.add('active');
            });
        }
    }
    
    // 为每个页面设置菜单按钮
    setupMenuToggle('menuToggle');
    setupMenuToggle('menuToggle2');
    setupMenuToggle('menuToggle3');
    setupMenuToggle('menuToggle4');
    setupMenuToggle('menuToggle5');
    
    // 点击关闭按钮：关闭菜单
    if (closeslidebar) {
        closeslidebar.addEventListener('click', function() {
            slidebarPanel.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // 点击遮罩层：关闭菜单
    if (overlay) {
        overlay.addEventListener('click', function() {
            slidebarPanel.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // 点击菜单项
    if (document.querySelectorAll('.slidebar-list li')) {
        document.querySelectorAll('.slidebar-list li').forEach(item => {
            item.addEventListener('click', function() {
                const itemText = this.textContent.trim();
                
                // 关闭侧边栏
                slidebarPanel.classList.remove('active');
                overlay.classList.remove('active');
                
                // 根据选项执行不同操作
                switch(itemText) {
                    case '首页':
                        document.querySelector('[data-page="home"]').click();
                        break;
                    case '个人中心':
                        document.querySelector('[data-page="profile"]').click();
                        break;
                    case '所有游戏':
                        alert('正在打开所有游戏页面...');
                        break;
                    case '客服支持':
                        alert('正在联系客服...');
                        break;
                    case '设置':
                        alert('正在打开设置页面...');
                        break;
                    case '退出登录':
                        if (confirm('确定要退出登录吗？')) {
                            alert('正在退出登录...');
                            // 这里可以添加实际的退出登录逻辑
                        }
                        break;
                    default:
                        alert(`打开: ${itemText}`);
                }
            });
        });
    }
    
    // 添加键盘支持：按ESC键关闭菜单
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (slidebarPanel) slidebarPanel.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
    });
    
    // 倒计时功能
    function startCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        if (!countdownElement) return;
        
        let time = 11 * 60 + 3; // 11分钟3秒
        
        function updateCountdown() {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            
            countdownElement.textContent = 
                `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (time > 0) {
                time--;
            } else {
                clearInterval(countdownInterval);
                countdownElement.textContent = "00:00:00";
                countdownElement.style.color = "#ff3366";
            }
        }
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // 初始化首页为活跃状态
    const homeNav = document.querySelector('[data-page="home"]');
    if (homeNav) {
        homeNav.click();
    }
    
    // 启动倒计时
    startCountdown();
});