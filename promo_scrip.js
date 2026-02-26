   (function() {
        const tabs = document.querySelectorAll('.promo-tab');
        const tabsContainer = document.getElementById('promoTabs');

        // 所有内容div的id映射
        const contentMap = {
            'events': 'events-content',
            'rebate': 'rebate-content',
            'vip': 'vip-content',
            'code': 'code-content',
            'history': 'history-content',
            'pending': 'pending-content'
        };

        // 显示对应内容，隐藏其他
        function showContent(tabKey) {
            // 隐藏所有内容块
            Object.values(contentMap).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            // 显示选中的
            const targetId = contentMap[tabKey];
            if (targetId) {
                const targetEl = document.getElementById(targetId);
                if (targetEl) targetEl.style.display = 'block';
            }
        }

        // 设置激活tab样式
        function setActiveTab(clickedTab) {
            tabs.forEach(tab => tab.classList.remove('active'));
            clickedTab.classList.add('active');
            const tabKey = clickedTab.dataset.tab;
            showContent(tabKey);
        }

        // 滚动居中
        function scrollTabToCenter(targetTab) {
            if (!tabsContainer || !targetTab) return;
            const containerRect = tabsContainer.getBoundingClientRect();
            const tabRect = targetTab.getBoundingClientRect();
            const relativeLeft = tabRect.left - containerRect.left;
            const targetScrollLeft = tabsContainer.scrollLeft 
                                    + relativeLeft 
                                    - (containerRect.width / 2) 
                                    + (tabRect.width / 2);
            tabsContainer.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        }

        // 点击事件
        function handleTabClick(event) {
            const clickedTab = event.currentTarget;
            setActiveTab(clickedTab);
            scrollTabToCenter(clickedTab);

            // 特殊：如果切换到兑换码，重新绑定一次按钮事件（避免重复）
            if (clickedTab.dataset.tab === 'code') {
                attachRedeemHandler();
            }
        }

        // 绑定兑换按钮（仅当切换至兑换码tab时重新绑定，防止多个监听）
        function attachRedeemHandler() {
            const btn = document.getElementById('redeemBtn');
            if (!btn) return;
            // 移除已有监听器（简单替换克隆）
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            // 重新绑定
            newBtn.addEventListener('click', function() {
                const input = document.getElementById('codeInput');
                const msg = document.getElementById('redeemMessage');
                const code = input ? input.value.trim() : '';
                if (msg) {
                    if (code === 'VIP888') {
                        msg.innerHTML = '✅ 兑换成功！获得VIP周卡一张';
                    } else if (code) {
                        msg.innerHTML = '❌ 无效兑换码，试试 VIP888';
                    } else {
                        msg.innerHTML = '⚠️ 请输入兑换码';
                    }
                }
            });
        }

        // 为所有tab添加监听
        tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // 初始化：根据当前active显示内容，并绑定兑换按钮
        const initialActive = document.querySelector('.promo-tab.active');
        if (initialActive) {
            showContent(initialActive.dataset.tab);
            if (initialActive.dataset.tab === 'code') {
                attachRedeemHandler();
            }
        }

        // 窗口加载后，若激活项被隐藏则自动居中
        window.addEventListener('load', function() {
            setTimeout(() => {
                const activeTab = document.querySelector('.promo-tab.active');
                if (activeTab && tabsContainer) {
                    const containerRect = tabsContainer.getBoundingClientRect();
                    const tabRect = activeTab.getBoundingClientRect();
                    const isVisible = tabRect.left >= containerRect.left && tabRect.right <= containerRect.right;
                    if (!isVisible) {
                        scrollTabToCenter(activeTab);
                    }
                }
            }, 150);
        });
    })();
/******存款****** */

        (function() {
            const input = document.getElementById('numberInput');
            const wrapper = document.getElementById('inputWrapper');
            const incBtn = document.getElementById('incrementBtn');
            const decBtn = document.getElementById('decrementBtn');
            const clearBtn = document.getElementById('clearBtn');
            const quickBtns = document.querySelectorAll('.quick-btn');

            // ----- 工具函数 -----
            function keepOnlyDigits(str) {
                return str.replace(/[^\d]/g, '');
            }

            function parseToIntegerOrZero(str) {
                if (str === '') return 0;
                let digits = str.replace(/^0+/, '');
                if (digits === '') return 0;
                return parseInt(digits, 10);
            }

            function formatDigits(str) {
                if (str === '') return '';
                let digits = str.replace(/^0+/, '');
                if (digits === '') return '0';
                return digits;
            }

            // 更新 wrapper 的 has-value 类 (控制按钮显示)
            function updateHasValueClass() {
                if (input.value !== '') {
                    wrapper.classList.add('has-value');
                } else {
                    wrapper.classList.remove('has-value');
                }
            }

            // 设置值并更新类
            function setValueAndClean(newVal) {
                let strVal = String(newVal);
                let filtered = keepOnlyDigits(strVal);
                if (filtered === '') {
                    input.value = '';  // 保持为空
                } else {
                    input.value = formatDigits(filtered);
                }
                updateHasValueClass();
            }

            function getCurrentInteger() {
                return input.value === '' ? 0 : parseToIntegerOrZero(input.value);
            }

            function changeBy(delta) {
                let current = getCurrentInteger();
                let newNum = current + delta;
                if (newNum < 0) newNum = 0;
                input.value = String(newNum);
                updateHasValueClass();
            }

            // ----- 事件绑定 -----

            // 输入时过滤并更新类
            input.addEventListener('input', function(e) {
                let raw = this.value;
                let filtered = keepOnlyDigits(raw);
                if (filtered !== raw) {
                    this.value = filtered;
                }
                // 无论过滤后是否为空，更新类
                updateHasValueClass();
            });

            // 失去焦点：如果为空则保持为空（不补零），但需要格式化已有数字
            input.addEventListener('blur', function() {
                if (this.value !== '') {
                    this.value = formatDigits(this.value);
                }
                // 如果为空，保持为空，不补0
                updateHasValueClass();
            });

            // 阻止小数点
            input.addEventListener('keydown', function(e) {
                const key = e.key;
                if (key === '.' || key === 'Decimal' || e.keyCode === 110 || e.keyCode === 190) {
                    e.preventDefault();
                }
            });

            // 上下按钮
            incBtn.addEventListener('click', function(e) {
                e.preventDefault();
                changeBy(1);
                input.focus();
            });

            decBtn.addEventListener('click', function(e) {
                e.preventDefault();
                changeBy(-1);
                input.focus();
            });

            // 清除按钮：设为空
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                input.value = '';  // 清空
                updateHasValueClass();
                input.focus();
            });

            // 快捷按钮
            quickBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const val = this.getAttribute('data-value');
                    setValueAndClean(val);
                    input.focus();
                });
            });

            // 初始化: 设置为空，没有默认值
            input.value = '';
            updateHasValueClass();  // 移除 has-value 类，按钮隐藏

            // 额外处理：如果用户通过拖拽等方式粘贴，input事件也会处理
        })();
        /*/////***复制id************** */
        const idcopy = document.querySelector('#idCopy');
const copyIdBtn = document.querySelector('#copyIdBtn');

if (idcopy && copyIdBtn) {
  copyIdBtn.addEventListener('click', function() {
    // 对于 span 元素，使用 textContent 而不是 value
    const idText = idcopy.textContent;
    
    // 使用 Clipboard API 复制
    navigator.clipboard.writeText(idText)
      .then(() => {
        alert('ID已复制到剪贴板: ' + idText);
      })
      .catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
      });
  });
}


/******提款**** */
   (function() {
            const inputField = document.getElementById('numberInputw');
            const wincBtn = document.getElementById('upBtn');
            const wdecBtn = document.getElementById('downtBtn');
            const wclearBtn = document.getElementById('clBtn');
            const wquickBtns = document.querySelectorAll('.wquick-btn');

            // 核心：彻底阻止小数点输入，只允许整数
            // 将输入值解析为整数（移除所有非数字）
            function parseToInteger(str) {
                if (!str || str.trim() === '') return NaN;
                // 只保留数字
                const digits = str.replace(/[^\d]/g, '');
                if (digits === '') return NaN;
                return parseInt(digits, 10);
            }

            // 设置输入框的值（整数，不包含任何小数点或逗号）
            function setInputValueFromInt(num) {
                if (!isNaN(num) && Number.isInteger(num)) {
                    inputField.value = num.toString();
                } else {
                    inputField.value = '';
                }
            }

            // 获取当前输入框的整数值（无效则返回0，用于加减）
            function getCurrentInt() {
                const val = parseToInteger(inputField.value);
                return isNaN(val) ? 0 : val;
            }

            // 初始化空
            inputField.value = '';

            // 增加按钮（+10）
            wincBtn.addEventListener('click', () => {
                let current = getCurrentInt();
                setInputValueFromInt(current + 10);
            });

            // 减少按钮（-10，最小0）
            wdecBtn.addEventListener('click', () => {
                let current = getCurrentInt();
                setInputValueFromInt(Math.max(0, current - 10));
            });

            // 清除按钮
            wclearBtn.addEventListener('click', () => {
                inputField.value = '';
            });

            // 快捷金额按钮（按钮值都是整数）
            wquickBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    let raw = btn.getAttribute('data-value') || btn.innerText;
                    // 提取数字
                    let num = parseInt(raw.toString().replace(/[^\d]/g, ''), 10) || 0;
                    setInputValueFromInt(num);
                });
            });

            // 关键：阻止小数点输入！
            // 方法1: 在keypress事件中拦截小数点/逗号
            inputField.addEventListener('keypress', function(e) {
                const key = e.key;
                // 如果输入的是小数点(.)或逗号(,)，直接阻止
                if (key === '.' || key === ',') {
                    e.preventDefault();
                    return;
                }
                // 只允许数字键和编辑键
                if (!/[\d]/.test(key) && 
                    key !== 'Backspace' && 
                    key !== 'Delete' && 
                    key !== 'ArrowLeft' && 
                    key !== 'ArrowRight' && 
                    key !== 'Home' && 
                    key !== 'End' && 
                    key !== 'Tab') {
                    e.preventDefault();
                }
            });

            // 方法2: 在input事件中实时过滤，确保只有数字
            inputField.addEventListener('input', function(e) {
                // 移除非数字字符
                this.value = this.value.replace(/[^\d]/g, '');
            });

            // 失去焦点时，确保是有效整数（移除前导零等问题）
            inputField.addEventListener('blur', function() {
                const trimmed = this.value.trim();
                if (trimmed === '') return;
                
                const intVal = parseToInteger(trimmed);
                if (!isNaN(intVal)) {
                    // 有效整数，直接显示（不补零）
                    this.value = intVal.toString();
                } else {
                    this.value = '';
                }
            });

            // 切换选项卡（保持不变）
            const tabs = document.querySelectorAll('.withdraw-option');
            const pixBlock = document.getElementById('pix-block');
            const bankBlock = document.getElementById('bank-block');
            const creditBlock = document.getElementById('credit-block');

            function activateBlock(method) {
                tabs.forEach(tab => {
                    const tabMethod = tab.getAttribute('data-method');
                    tab.classList.toggle('active', tabMethod === method);
                });
                [pixBlock, bankBlock, creditBlock].forEach(block => block.classList.remove('active-block'));
                if (method === 'pix' && pixBlock) pixBlock.classList.add('active-block');
                else if (method === 'bank' && bankBlock) bankBlock.classList.add('active-block');
                else if (method === 'credit' && creditBlock) creditBlock.classList.add('active-block');
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const method = this.getAttribute('data-method');
                    activateBlock(method);
                });
            });
            activateBlock('pix');
        })();