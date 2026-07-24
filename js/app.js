// ==================== 데이터 로더 (JSON 분리 구조) ====================
        let CHEONGAN = [], JIJI = [], ILJU_DATA = {}, GAPJA = [];
        let GAN_DETAIL = {}, JI_DETAIL = {}, OHENG_DETAIL = {}, SIPSIN_DAILY = {}, ILJU_DETAIL = {};
        let DATA_READY = false;

        // ==================== [수정됨] 한국어 친근한 닉네임 사전 정의 ====================
        const SIPSIN_NICK = {
            '비견': '든든한 내편 (나와 닮은 듬직한 동반자)',
            '겁재': '자극과 경쟁 (선의의 라이벌과 리더십)',
            '식신': '재능과 식복 (우러나오는 표현력과 먹을복)',
            '상관': '재치와 아이디어 (틀을 깨는 예술가 센스)',
            '편재': '모험적 재물 (스케일이 큰 사업가 수완)',
            '정재': '착실한 재물 (노력만큼 착실히 쌓이는 알짜 자산)',
            '편관': '카리스마/돌파 (어려움을 해결하는 책임 대장)',
            '정관': '안정된 명예 (신뢰받는 공직 및 반듯한 규칙)',
            '편인': '독창적 지혜 (나만 아는 날카로운 전문 기술)',
            '정인': '공부복과 사랑 (조건 없이 나를 챙겨주는 후원자)'
        };
        const UNSEONG_NICK = {
            '장생': '새출발/축복 (갓 태어난 아기 같은 만인의 사랑)',
            '목욕': '인기/주목 (아이돌처럼 스포트라이트를 받는 매력)',
            '관대': '패기/열정 (제복을 차려입고 도전하는 청년의 힘)',
            '건록': '안정/성공 (완벽하게 사회에 정착한 늠름한 자립)',
            '제왕': '정점/리더 (스스로 운명을 개척하는 최고의 리더십)',
            '쇠': '노련/지혜 (지혜롭게 한 걸음 물러나 판을 잃는 참모)',
            '병': '감성/동정 (타인의 마음에 깊이 울림을 주는 고운 예술성)',
            '사': '집중/생각 (몸을 아끼고 고도의 수읽기를 하는 사색가)',
            '묘': '알뜰/저축 (실속 있게 차곡차곡 에너지를 모으는 저축가)',
            '절': '반전/시작 (바닥에서 다시 위로 튀어 오르는 반전 매력)',
            '태': '상상/태아 (엄마 품처럼 무한한 가능성을 꿈꾸는 상상력)',
            '양': '보호/평온 (든든한 보살핌 속에서 실력을 기르는 평온함)'
        };


        async function loadFortuneData() {
            const _v = (typeof window !== 'undefined' && window.APP_VERSION) ? window.APP_VERSION : Date.now();
            try {
                const res = await fetch('./data/fortune-data.json?v=' + _v, { cache: 'no-store' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const d = await res.json();
                CHEONGAN = d.CHEONGAN; JIJI = d.JIJI; ILJU_DATA = d.ILJU_DATA;
                GAN_DETAIL = d.GAN_DETAIL || {}; JI_DETAIL = d.JI_DETAIL || {};
                OHENG_DETAIL = d.OHENG_DETAIL || {}; SIPSIN_DAILY = d.SIPSIN_DAILY || {};
                ILJU_DETAIL = d.ILJU_DETAIL || {};
            } catch (err) {
                console.warn('CORS / 네트워크 에러로 인해 로컬 자가방어 데이터(Local Fallback)를 즉시 활성화합니다.', err);
                
                // 100% 무중단 구동을 위한 최적화 로컬 백업 명리 DB 수혈 (오류 방지용 철벽 가드)
                CHEONGAN = [
                    { name: '갑', han: '甲', oheng: '목', colorClass: 'wood-bg', textClass: 'wood-text', symbol: '큰 나무', sipsinSelf: '비견' },
                    { name: '을', han: '乙', oheng: '목', colorClass: 'wood-bg', textClass: 'wood-text', symbol: '화초/넝쿨', sipsinSelf: '겁재' },
                    { name: '병', han: '丙', oheng: '화', colorClass: 'fire-bg', textClass: 'fire-text', symbol: '태양/큰 불', sipsinSelf: '비견' },
                    { name: '정', han: '丁', oheng: '화', colorClass: 'fire-bg', textClass: 'fire-text', symbol: '촛불/별빛', sipsinSelf: '겁재' },
                    { name: '무', han: '戊', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', symbol: '큰 산', sipsinSelf: '비견' },
                    { name: '기', han: '己', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', symbol: '정원/밭', sipsinSelf: '겁재' },
                    { name: '경', han: '庚', oheng: '금', colorClass: 'metal-bg', textClass: 'metal-text', symbol: '바위/강철', sipsinSelf: '비견' },
                    { name: '신', han: '辛', oheng: '금', colorClass: 'metal-bg', textClass: 'metal-text', symbol: '보석/바늘', sipsinSelf: '겁재' },
                    { name: '임', han: '壬', oheng: '수', colorClass: 'water-bg', textClass: 'water-text', symbol: '바다/큰 강', sipsinSelf: '비견' },
                    { name: '계', han: '癸', oheng: '수', colorClass: 'water-bg', textClass: 'water-text', symbol: '봄비/이슬', sipsinSelf: '겁재' }
                ];
                JIJI = [
                    { name: '자', han: '子', animal: '쥐', oheng: '수', colorClass: 'water-bg', textClass: 'water-text', jijanggan: '계(癸)' },
                    { name: '축', han: '丑', animal: '소', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '계(癸) 신(辛) 기(己)' },
                    { name: '인', han: '寅', animal: '호랑이', oheng: '목', colorClass: 'wood-bg', textClass: 'wood-text', jijanggan: '무(戊) 병(丙) 갑(甲)' },
                    { name: '묘', han: '卯', animal: '토끼', oheng: '목', colorClass: 'wood-bg', textClass: 'wood-text', jijanggan: '갑(甲) 을(乙)' },
                    { name: '진', han: '辰', animal: '용', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '을(乙) 계(癸) 무(戊)' },
                    { name: '사', han: '巳', animal: '뱀', oheng: '화', colorClass: 'fire-bg', textClass: 'fire-text', jijanggan: '무(戊) 경(庚) 병(丙)' },
                    { name: '오', han: '오', animal: '말', oheng: '화', colorClass: 'fire-bg', textClass: 'fire-text', jijanggan: '병(丙) 기(己) 정(丁)' },
                    { name: '미', han: '미', animal: '양', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '정(丁) 을(乙) 기(己)' },
                    { name: '신', han: '신', animal: '원숭이', oheng: '금', colorClass: 'metal-bg', textClass: 'metal-text', jijanggan: '무(戊) 임(壬) 경(庚)' },
                    { name: '유', han: '유', animal: '닭', oheng: '금', colorClass: 'metal-bg', textClass: 'metal-text', jijanggan: '경(庚) 신(辛)' },
                    { name: '술', han: '술', animal: '개', oheng: '토', colorClass: 'earth-bg', textClass: 'earth-text', jijanggan: '신(辛) 정(丁) 무(戊)' },
                    { name: '해', han: '해', animal: '돼지', oheng: '수', colorClass: 'water-bg', textClass: 'water-text', jijanggan: '무(戊) 갑(甲) 임(壬)' }
                ];
                ILJU_DATA = {};
                GAN_DETAIL = {}; JI_DETAIL = {}; OHENG_DETAIL = {}; SIPSIN_DAILY = {}; ILJU_DETAIL = {};
            }

            // 60갑자 생성
            GAPJA = [];
            for (let i = 0; i < 60; i++) {
                const gan = CHEONGAN[i % 10], ji = JIJI[i % 12];
                GAPJA.push({ index: i + 1, name: gan.name + ji.name, han: gan.han + ji.han, ganIdx: i % 10, jiIdx: i % 12 });
            }
            // 미등재 일주 자동 해설 생성 (천간/지지 상세를 조합해 풍부하게)
            GAPJA.forEach(g => {
                if (!ILJU_DATA[g.name]) {
                    const gan = CHEONGAN[g.ganIdx], ji = JIJI[g.jiIdx];
                    ILJU_DATA[g.name] = {
                        desc: '하늘에서는 ' + gan.name + '(' + gan.oheng + ')의 기질이, 땅에서는 ' + ji.animal + '띠 ' + ji.name + '(' + ji.oheng + ')의 기질이 만나 서로를 받쳐주는 짜임새입니다. 위아래 기운이 각자의 몫을 다하니, 생각한 것을 손으로 옮기는 실행의 힘이 좋은 일주입니다.',
                        strengths: ['천간 ' + gan.name + '의 뚜렷한 자기 기준', '지지 ' + ji.name + '(' + ji.animal + ')의 밀고 나가는 저력', '자기만의 방식으로 성과를 내는 재주'],
                        weaknesses: ['기운이 한쪽으로 몰리는 시기에는 서두르지 않기', '지칠 때는 미루지 말고 충분히 쉬어 가기'],
                        job: gan.oheng + ' 기운과 ' + ji.oheng + ' 기운을 함께 살릴 수 있는 기획·운영, 전문 자격, 현장 관리 계열이 잘 맞습니다. 직종의 이름보다 중요한 것은 일하는 방식이니, 스스로 계획하고 결과를 확인할 수 있는 자리를 고를 때 타고난 실행력이 온전히 성과로 이어집니다.',
                        love: '서로의 영역을 존중할 때 오래가는, 신뢰가 바탕이 되는 인연을 맺습니다. 뜨겁게 타오르는 사랑보다 서서히 깊어지는 정이 어울리는 명이라, 상대를 바꾸려 하기보다 결을 이해하는 쪽을 택할 때 관계가 해마다 단단해집니다.',
                        health: gan.oheng + ' 기운과 짝을 이루는 장부의 컨디션을 평소에 살펴 주세요. 큰 병의 예고가 아니라 피로가 먼저 쌓이기 쉬운 자리라는 안내이니, 충분한 수면과 가벼운 정기 검진만으로도 넉넉히 지켜 낼 수 있습니다.'
                    };
                }
            });
            DATA_READY = true;
        }

        function showDataError(err) {
            console.error('데이터 로드 실패:', err);
            const banner = document.createElement('div');
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#7f1d1d;color:#fecaca;padding:12px 16px;font-size:13px;text-align:center;';
            banner.innerHTML = '⚠️ 운세 데이터(data/fortune-data.json)를 불러오지 못했습니다. 웹서버(GitHub Pages 등)를 통해 접속했는지, 데이터 파일이 함께 업로드되었는지 확인해 주세요.';
            document.body.prepend(banner);
        }

        const OHENG_MAP = {
            '목': { 생: '화', 극: '토', 피생: '수', 피극: '금' }, '화': { 생: '토', 극: '금', 피생: '목', 피극: '수' },
            '토': { 생: '금', 극: '수', 피생: '화', 피극: '목' }, '금': { 생: '수', 극: '목', 피생: '토', 피극: '화' },
            '수': { 생: '목', 극: '화', 피생: '금', 피극: '토' }
        };

        function getSipsin(myGanIdx, targetOheng, isTargetYang) {
            const myOheng = CHEONGAN[myGanIdx].oheng, isSameYang = ((myGanIdx % 2 === 0) === isTargetYang);
            if (myOheng === targetOheng) return isSameYang ? '비견' : '겁재';
            if (OHENG_MAP[myOheng].생 === targetOheng) return isSameYang ? '식신' : '상관';
            if (OHENG_MAP[myOheng].극 === targetOheng) return isSameYang ? '편재' : '정재';
            if (OHENG_MAP[myOheng].피극 === targetOheng) return isSameYang ? '편관' : '정관';
            if (OHENG_MAP[myOheng].피생 === targetOheng) return isSameYang ? '편인' : '정인';
            return '비견';
        }

        function getJiSipsin(myGanIdx, jiIdx) {
            const jiMainGanIdx = { 0:9, 1:5, 2:0, 3:1, 4:4, 5:2, 6:3, 7:5, 8:6, 9:7, 10:4, 11:8 }[jiIdx];
            return getSipsin(myGanIdx, CHEONGAN[jiMainGanIdx].oheng, jiMainGanIdx % 2 === 0);
        }

        const UNSEONG_NAMES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
        function getUnseong(ganIdx, jiIdx) {
            const startJi = { 0:11, 1:6, 2:2, 3:9, 4:2, 5:9, 6:5, 7:0, 8:8, 9:3 }[ganIdx];
            return UNSEONG_NAMES[(ganIdx % 2 === 0) ? (jiIdx - startJi + 12) % 12 : (startJi - jiIdx + 12) % 12];
        }

        let CURRENT_SAJU = null, isPanoramaMode = false, lastActiveTabId = 'tab-oheng';

                

        function initApp() {
            if (window._appInitialized) return;
            window._appInitialized = true;

            const today = new Date(); const tYear = today.getFullYear(), tMonth = today.getMonth() + 1, tDay = today.getDate();
            const tGapjaIdx = (tYear - 4 + 6000) % 60; const tNyeonGan = CHEONGAN[tGapjaIdx % 10], tNyeonJi = JIJI[tGapjaIdx % 12];
            const solarTermsDay = { 1:5, 2:4, 3:5, 4:5, 5:5, 6:6, 7:7, 8:7, 9:7, 10:8, 11:7, 12:7 };
            let tEffMonth = tMonth; if (tDay < solarTermsDay[tMonth]) { tEffMonth = tMonth - 1; if (tEffMonth === 0) tEffMonth = 12; }
            const wolJiIdxMap = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:0 };
            const startWolGanMap = { 0:2, 5:2, 1:4, 6:4, 2:6, 7:6, 3:8, 8:8, 4:0, 9:0 };
            const tWolGanIdx = (startWolGanMap[tGapjaIdx % 10] + (wolJiIdxMap[tEffMonth] - 2 + 12) % 12) % 10;
            const tWolGan = CHEONGAN[tWolGanIdx], tWolJi = JIJI[wolJiIdxMap[tEffMonth]];
            const headerDateSpan = document.getElementById('header-today-date');
            if (headerDateSpan) headerDateSpan.innerHTML = `기준일: <strong class="text-amber-400">${tYear}년 ${tMonth}월 ${tDay}일</strong> (${tNyeonGan.name}${tNyeonJi.name}년 · ${tWolGan.name}${tWolJi.name}월)`;

            const yearSelect = document.getElementById('birth-year'), monthSelect = document.getElementById('birth-month'), daySelect = document.getElementById('birth-day');
            const pYear = document.getElementById('partner-year'), pMonth = document.getElementById('partner-month'), pDay = document.getElementById('partner-day');

            if (!yearSelect || !monthSelect || !daySelect) return;

            // 옵션 텅 빔 현상 방지를 위해 기존 하드코딩 옵션 외 동적 채우기
            for (let y = tYear; y >= 1930; y--) {
                const gapjaIdx = (y - 4 + 6000) % 60; const gan = CHEONGAN[gapjaIdx % 10], ji = JIJI[gapjaIdx % 12];
                const yearLabel = `${y}년 (${gan.name}${ji.name}년 · ${ji.animal}띠)`;
                const opt = document.createElement('option'); opt.value = y; opt.textContent = yearLabel; if (y === 1992) opt.selected = true; yearSelect.appendChild(opt);
                if (pYear) { const optP = document.createElement('option'); optP.value = y; optP.textContent = yearLabel; if (y === 1990) optP.selected = true; pYear.appendChild(optP); }
            }

            for (let m = 1; m <= 12; m++) {
                const opt = document.createElement('option'); opt.value = m; opt.textContent = `${m}월`; if (m === 8) opt.selected = true; monthSelect.appendChild(opt);
                if (pMonth) { const optP = document.createElement('option'); optP.value = m; optP.textContent = `${m}월`; if (m === 5) optP.selected = true; pMonth.appendChild(optP); }
            }
            for (let d = 1; d <= 31; d++) {
                const opt = document.createElement('option'); opt.value = d; opt.textContent = `${d}일`; if (d === 15) opt.selected = true; daySelect.appendChild(opt);
                if (pDay) { const optP = document.createElement('option'); optP.value = d; optP.textContent = `${d}일`; if (d === 20) optP.selected = true; pDay.appendChild(optP); }
            }
            
            // [수정됨] 종합 운세 놀이터 및 사이드바 초기화 호출
            if (typeof initDailyPlaza === 'function') { initDailyPlaza(); }
        }

        // 부트스트랩: 데이터(JSON) 로드 완료 후에만 initApp 실행 (DOMReady/load 타이밍 모두 대응)
        function bootstrapApp() {
            loadFortuneData().then(initApp).catch(showDataError);
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrapApp);
        } else {
            bootstrapApp();
        }

        function toggleLeapMonth() { const type = document.querySelector('input[name="calendar_type"]:checked').value; const c = document.getElementById('leap-month-container'); if (type === 'lunar') c.classList.remove('hidden'); else { c.classList.add('hidden'); document.getElementById('is_leap_month').checked = false; } }
        function toggleTimeInput() { const u = document.getElementById('time-unknown').checked; const c = document.getElementById('time-input-container'); if (u) c.classList.add('opacity-40', 'pointer-events-none'); else c.classList.remove('opacity-40', 'pointer-events-none'); }
        function loadExample(y, m, d, cal, gen, h) {
            document.getElementById('birth-year').value = y; document.getElementById('birth-month').value = m; document.getElementById('birth-day').value = d;
            document.getElementsByName('calendar_type').forEach(r => r.checked = (r.value === cal)); toggleLeapMonth();
            document.getElementsByName('gender').forEach(r => r.checked = (r.value === gen)); document.getElementById('time-unknown').checked = false; toggleTimeInput();
            let s = 11; if (h===23||h===0) s=23; else if (h===1||h===2) s=1; else if (h===3||h===4) s=3; else if (h===5||h===6) s=5; else if (h===7||h===8) s=7; else if (h===9||h===10) s=9; else if (h===11||h===12) s=11; else if (h===13||h===14) s=13; else if (h===15||h===16) s=15; else if (h===17||h===18) s=17; else if (h===19||h===20) s=19; else if (h===21||h===22) s=21;
            document.getElementById('birth-time-sijin').value = s; document.getElementById('saju-form').dispatchEvent(new Event('submit'));
        }
        function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

        function togglePanoramaMode() {
            isPanoramaMode = !isPanoramaMode; const btnText = document.getElementById('panorama-text'); const panoramaBtn = document.getElementById('btn-panorama');
            if (isPanoramaMode) {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.add('active'));
                btnText.textContent = "📑 1단 탭별 보기 모드로 돌아가기 (접기)"; panoramaBtn.className = "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow tracking-normal";
            } else {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                const lastTab = document.getElementById(lastActiveTabId); if (lastTab) lastTab.classList.add('active');
                btnText.textContent = "📖 24대 전체 메뉴 한 번에 쭈욱 보기 (파노라마 모드)"; panoramaBtn.className = "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow tracking-normal";
            }
        }

        function switchTab(tabId) {
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            lastActiveTabId = tabId;
            if (isPanoramaMode) { isPanoramaMode = false; document.getElementById('panorama-text').textContent = "📖 24대 전체 메뉴 한 번에 쭈욱 보기 (파노라마 모드)"; document.getElementById('btn-panorama').className = "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow tracking-normal"; }
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => {
                let defaultClass = "tab-btn px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm text-gray-300 hover:bg-white/5 transition flex items-center gap-1.5 tracking-normal border border-white/10";
                if (btn.id === 'btn-tab-life') defaultClass = "tab-btn px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm text-amber-300 hover:bg-white/5 transition flex items-center gap-1.5 tracking-normal border border-amber-500/30 bg-amber-500/10";
                btn.className = defaultClass;
            });
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
                // 모바일 갤럭시/태블릿/PC에서 클릭 시 가려짐 없이 부드럽게 콘텐츠 상단으로 쾌적 정렬
                setTimeout(() => {
                    const yOffset = -70; // 헤더 높이만큼 넉넉한 여백
                    const y = targetTab.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 30);
            }
            const activeBtn = document.getElementById('btn-' + tabId);
            if (activeBtn) {
                activeBtn.className = "tab-btn px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-mystic-900 shadow-md transition flex items-center gap-1.5 tracking-normal";
            }
        }

        function copySummaryToClipboard() {
            const title = document.getElementById('res-user-title').textContent, il = document.getElementById('res-il-title').textContent, yong = document.getElementById('yongsin-oheng').textContent;
            const text = `[🌾 운세방앗간 사주 요약]\n· 대상: ${title}\n· 사주 일주: ${il}\n· 핵심 용신: ${yong}\n· 2026 운세: ⭐⭐⭐⭐ 대복록의 해`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => alert('사주 요약이 복사되었습니다!')).catch(() => fallbackCopyTextToClipboard(text));
            } else {
                fallbackCopyTextToClipboard(text);
            }
        }

        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text; textArea.style.position = "fixed"; textArea.style.left = "-9999px";
            document.body.appendChild(textArea); textArea.focus(); textArea.select();
            try { document.execCommand('copy'); alert('사주 요약이 클립보드에 복사되었습니다!'); } catch (err) { alert('복사 실패: 직접 텍스트를 선택해 복사해 주세요.'); }
            document.body.removeChild(textArea);
        }

        function calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown) {
            let solYear = year, solMonth = month, solDay = day;
            if (isLunar) { let dAdd = isLeapMonth ? 59 : 30; const dt = new Date(year, month - 1, day); dt.setDate(dt.getDate() + dAdd); solYear = dt.getFullYear(); solMonth = dt.getMonth() + 1; solDay = dt.getDate(); }
            let nyeonIdx = (solYear - 4 + 60) % 60; if (solMonth === 1 || (solMonth === 2 && solDay < 4)) nyeonIdx = (nyeonIdx - 1 + 60) % 60;
            const nyeonGapja = GAPJA[nyeonIdx]; const nyeonGanIdx = nyeonGapja.ganIdx, nyeonJiIdx = nyeonGapja.jiIdx;
            const solarTermsDay = { 1:5, 2:4, 3:5, 4:5, 5:5, 6:6, 7:7, 8:7, 9:7, 10:8, 11:7, 12:7 };
            let effMonth = solMonth; if (solDay < solarTermsDay[solMonth]) { effMonth = solMonth - 1; if (effMonth === 0) effMonth = 12; }
            const wolJiIdxMap = { 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:0 };
            const wolJiIdx = wolJiIdxMap[effMonth];
            const startWolGanMap = { 0:2, 5:2, 1:4, 6:4, 2:6, 7:6, 3:8, 8:8, 4:0, 9:0 };
            const wolGanIdx = (startWolGanMap[nyeonGanIdx] + (wolJiIdx - 2 + 12) % 12) % 10;
            const wolGan = CHEONGAN[wolGanIdx], wolJi = JIJI[wolJiIdx];
            
            // [수정됨] 서머타임/시차 오차 없는 UTC 자정 밀리초 정밀 정규화 연산
            const diffDays = Math.floor((Date.UTC(solYear, solMonth - 1, solDay) - Date.UTC(1900, 0, 1)) / (1000 * 60 * 60 * 24));
            let ilIdx = (40 + diffDays % 60) % 60; if (ilIdx < 0) ilIdx += 60;
            const ilGapja = GAPJA[ilIdx]; const ilGanIdx = ilGapja.ganIdx, ilJiIdx = ilGapja.jiIdx;
            
            let siGanIdx = 0, siJiIdx = 6, siGapja = null;
            if (!isTimeUnknown) {
                siJiIdx = Math.floor(((timeHour + 1) % 24) / 2);
                const startSiGanMap = { 0:0, 5:0, 1:2, 6:2, 2:4, 7:4, 3:6, 8:6, 4:8, 9:8 };
                siGanIdx = (startSiGanMap[ilGanIdx] + siJiIdx) % 10;
                const siGan = CHEONGAN[siGanIdx], siJi = JIJI[siJiIdx];
                siGapja = { name: `${siGan.name}${siJi.name}`, han: `${siGan.han}${siJi.han}`, ganIdx: siGanIdx, jiIdx: siJiIdx };
            }
            return { solDateStr: `${solYear}년 ${String(solMonth).padStart(2, '0')}월 ${String(solDay).padStart(2, '0')}일`, nyeon: nyeonGapja, wol: { name: `${wolGan.name}${wolJi.name}`, han: `${wolGan.han}${wolJi.han}`, ganIdx: wolGanIdx, jiIdx: wolJiIdx }, il: ilGapja, si: siGapja, isTimeUnknown: isTimeUnknown };
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        }

        function handleAnalyze(e) {
            if (e && e.preventDefault) e.preventDefault();
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            document.getElementById('loading-overlay').classList.remove('hidden');
            setTimeout(() => {
                const year = parseInt(document.getElementById('birth-year').value), month = parseInt(document.getElementById('birth-month').value), day = parseInt(document.getElementById('birth-day').value);
                const isLunar = (document.querySelector('input[name="calendar_type"]:checked').value === 'lunar');
                const isLeapMonth = isLunar && document.getElementById('is_leap_month').checked;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const isTimeUnknown = document.getElementById('time-unknown').checked;
                const timeHour = parseInt(document.getElementById('birth-time-sijin').value);
                const saju = calculateManseoryeok(year, month, day, isLunar, isLeapMonth, timeHour, isTimeUnknown);
                CURRENT_SAJU = { ...saju, gender, year, month, day, timeHour };
                const nowYr = new Date().getFullYear(); const koreanAge = nowYr - year + 1; const manAge = nowYr - year;
                const nyeonGanIdx = saju.nyeon.ganIdx; const isForward = (gender === 'M' && (nyeonGanIdx % 2 === 0)) || (gender === 'F' && (nyeonGanIdx % 2 !== 0));
                const daeunStartAge = ((day % 5) + 3);
                updateResultUI(saju, gender, koreanAge, manAge, isForward, daeunStartAge);
                document.getElementById('loading-overlay').classList.add('hidden');
                document.getElementById('result-section').classList.remove('hidden');
                document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
                if (window.lucide && typeof lucide !== 'undefined') { lucide.createIcons(); } else { setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 500); }
            }, 700);
        }

        function updateResultUI(saju, gender, koreanAge, manAge, isForward, daeunStartAge) {
            const genderStr = (gender === 'M') ? '남성 (陽)' : '여성 (陰)';
            const nowYr = new Date().getFullYear();
            const nowGapjaIdx = (nowYr - 4 + 6000) % 60;
            const nowGan = CHEONGAN[nowGapjaIdx % 10], nowJi = JIJI[nowGapjaIdx % 12];
            document.getElementById('res-user-title').textContent = `${saju.solDateStr} 출생 ${genderStr}의 사주팔자`;
            document.getElementById('res-user-subtitle').textContent = `한국 나이 ${koreanAge}세 (만 ${manAge}세) · 대운 ${isForward ? '순행' : '역행'} (${daeunStartAge}세 시작) · 분석 기준: ${nowYr}년 ${nowGan.name}${nowJi.name}년`;

            const ilGan = CHEONGAN[saju.il.ganIdx], ilJi = JIJI[saju.il.jiIdx];
            document.getElementById('res-il-title').textContent = `${saju.il.name} (${saju.il.han})`;
            document.getElementById('res-il-gan-han').textContent = ilGan.han; document.getElementById('res-il-gan-kr').textContent = `${ilGan.name} (${ilGan.oheng}) · ${ilGan.symbol.split('/')[0]}`;
            document.getElementById('res-il-gan-box').className = `w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-extrabold text-3xl sm:text-4xl border-2 shadow-xl transition transform hover:scale-105 ring-4 ring-amber-500/20 ${ilGan.colorClass}`;
            document.getElementById('res-il-ji-han').textContent = ilJi.han; document.getElementById('res-il-ji-kr').textContent = `${ilJi.name} (${ilJi.oheng}) · ${ilJi.animal}`;
            const ilJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.il.jiIdx); document.getElementById('res-il-ji-sipsin').textContent = ilJiSipsinVal + ' (' + (SIPSIN_NICK[ilJiSipsinVal] || '') + ')';
            document.getElementById('res-il-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${ilJi.colorClass}`;
            document.getElementById('res-il-jijanggan').textContent = ilJi.jijanggan; const ilUnseong = getUnseong(saju.il.ganIdx, saju.il.jiIdx); document.getElementById('res-il-unseong').textContent = ilUnseong + ' (' + (UNSEONG_NICK[ilUnseong] || '') + ')';

            const wolGan = CHEONGAN[saju.wol.ganIdx], wolJi = JIJI[saju.wol.jiIdx];
            document.getElementById('res-wol-title').textContent = `${saju.wol.name} (${saju.wol.han})`;
            const wolGanSipsin = getSipsin(saju.il.ganIdx, wolGan.oheng, saju.wol.ganIdx % 2 === 0); document.getElementById('res-wol-gan-sipsin').textContent = wolGanSipsin + ' (' + (SIPSIN_NICK[wolGanSipsin] || '') + ')';
            document.getElementById('res-wol-gan-han').textContent = wolGan.han; document.getElementById('res-wol-gan-kr').textContent = `${wolGan.name} (${wolGan.oheng})`;
            document.getElementById('res-wol-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${wolGan.colorClass}`;
            document.getElementById('res-wol-ji-han').textContent = wolJi.han; document.getElementById('res-wol-ji-kr').textContent = `${wolJi.name} (${wolJi.oheng}) · ${wolJi.animal}`;
            const wolJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx); document.getElementById('res-wol-ji-sipsin').textContent = wolJiSipsinVal + ' (' + (SIPSIN_NICK[wolJiSipsinVal] || '') + ')';
            document.getElementById('res-wol-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${wolJi.colorClass}`;
            document.getElementById('res-wol-jijanggan').textContent = wolJi.jijanggan; const wolUnseong = getUnseong(saju.il.ganIdx, saju.wol.jiIdx); document.getElementById('res-wol-unseong').textContent = wolUnseong + ' (' + (UNSEONG_NICK[wolUnseong] || '') + ')';

            const nyeonGan = CHEONGAN[saju.nyeon.ganIdx], nyeonJi = JIJI[saju.nyeon.jiIdx];
            document.getElementById('res-nyeon-title').textContent = `${saju.nyeon.name} (${saju.nyeon.han})`;
            const nyeonGanSipsin = getSipsin(saju.il.ganIdx, nyeonGan.oheng, saju.nyeon.ganIdx % 2 === 0); document.getElementById('res-nyeon-gan-sipsin').textContent = nyeonGanSipsin + ' (' + (SIPSIN_NICK[nyeonGanSipsin] || '') + ')';
            document.getElementById('res-nyeon-gan-han').textContent = nyeonGan.han; document.getElementById('res-nyeon-gan-kr').textContent = `${nyeonGan.name} (${nyeonGan.oheng})`;
            document.getElementById('res-nyeon-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${nyeonGan.colorClass}`;
            document.getElementById('res-nyeon-ji-han').textContent = nyeonJi.han; document.getElementById('res-nyeon-ji-kr').textContent = `${nyeonJi.name} (${nyeonJi.oheng}) · ${nyeonJi.animal}`;
            const nyeonJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.nyeon.jiIdx); document.getElementById('res-nyeon-ji-sipsin').textContent = nyeonJiSipsinVal + ' (' + (SIPSIN_NICK[nyeonJiSipsinVal] || '') + ')';
            document.getElementById('res-nyeon-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${nyeonJi.colorClass}`;
            document.getElementById('res-nyeon-jijanggan').textContent = nyeonJi.jijanggan; const nyeonUnseong = getUnseong(saju.il.ganIdx, saju.nyeon.jiIdx); document.getElementById('res-nyeon-unseong').textContent = nyeonUnseong + ' (' + (UNSEONG_NICK[nyeonUnseong] || '') + ')';

            if (saju.isTimeUnknown || !saju.si) {
                document.getElementById('res-si-title').textContent = '시간 미상'; document.getElementById('res-si-gan-sipsin').textContent = '-'; document.getElementById('res-si-gan-han').textContent = '?'; document.getElementById('res-si-gan-kr').textContent = '미상';
                document.getElementById('res-si-gan-box').className = "w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border border-dashed border-gray-600 bg-white/5 text-gray-500";
                document.getElementById('res-si-ji-han').textContent = '?'; document.getElementById('res-si-ji-kr').textContent = '미상'; document.getElementById('res-si-ji-sipsin').textContent = '-';
                document.getElementById('res-si-ji-box').className = "w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border border-dashed border-gray-600 bg-white/5 text-gray-500";
                document.getElementById('res-si-jijanggan').textContent = '-'; document.getElementById('res-si-unseong').textContent = '-';
            } else {
                const siGan = CHEONGAN[saju.si.ganIdx], siJi = JIJI[saju.si.jiIdx];
                document.getElementById('res-si-title').textContent = `${saju.si.name} (${saju.si.han})`;
                const siGanSipsin = getSipsin(saju.il.ganIdx, siGan.oheng, saju.si.ganIdx % 2 === 0); document.getElementById('res-si-gan-sipsin').textContent = siGanSipsin + ' (' + (SIPSIN_NICK[siGanSipsin] || '') + ')';
                document.getElementById('res-si-gan-han').textContent = siGan.han; document.getElementById('res-si-gan-kr').textContent = `${siGan.name} (${siGan.oheng})`;
                document.getElementById('res-si-gan-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${siGan.colorClass}`;
                document.getElementById('res-si-ji-han').textContent = siJi.han; document.getElementById('res-si-ji-kr').textContent = `${siJi.name} (${siJi.oheng}) · ${siJi.animal}`;
                const siJiSipsinVal = getJiSipsin(saju.il.ganIdx, saju.si.jiIdx); document.getElementById('res-si-ji-sipsin').textContent = siJiSipsinVal + ' (' + (SIPSIN_NICK[siJiSipsinVal] || '') + ')';
                document.getElementById('res-si-ji-box').className = `w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex flex-col items-center justify-center font-serif-kr font-bold text-2xl sm:text-3xl border shadow-inner transition transform hover:scale-105 ${siJi.colorClass}`;
                document.getElementById('res-si-jijanggan').textContent = siJi.jijanggan; const siUnseong = getUnseong(saju.il.ganIdx, saju.si.jiIdx); document.getElementById('res-si-unseong').textContent = siUnseong + ' (' + (UNSEONG_NICK[siUnseong] || '') + ')';
            }

            // 기존 16대 필수 연산
            renderOhengAnalysis(saju, ilGan); renderSipsinAndYongsin(saju, ilGan, wolJi); renderLifeStages(saju, ilGan, ilJi); renderHabchungAndSinsal15(saju, ilGan, ilJi); renderIljuDetail(saju.il.name, ilGan, ilJi); renderDaeun(saju, isForward, daeunStartAge, manAge); renderSeunAndGuide(saju, ilGan, ilJi);
            renderDailyFortune(saju, ilGan, ilJi); renderTojungBigyeol(CURRENT_SAJU); renderWealthMastery(saju, ilGan, wolJi); renderTaegilMastery(saju, ilGan, ilJi);
            renderSpouseProfile(saju, ilGan, ilJi); renderChildMastery(saju, ilGan, ilJi); renderCelebrityMatch(saju, ilGan, wolJi); analyzeNaming();
            
            // [수정됨] 신규 4대 글로벌 신비 운명학 연산 엔진 훅 실행
            if (typeof renderTangSaju === 'function') { renderTangSaju(saju); }
            if (typeof renderKabbalahNumerology === 'function') { renderKabbalahNumerology(year, month, day); }
            if (typeof renderChakraBalance === 'function') { renderChakraBalance(saju, ilGan); }
            if (typeof renderCelticTree === 'function') { renderCelticTree(month, day); }

            // ⭐ NEW v6.0 신규 8대 마스터 메뉴 연산
            renderHealthMastery(saju, ilGan); // 17. 건강 12경락
            renderPungsuMastery(ilGan); // 19. 양택 풍수
            renderSamjaeMastery(saju); // 20. 삼재 & 살풀이
            renderCareerMastery(saju, ilGan, wolJi); // 21. 취업/승진 적성
            renderLuckyNumMastery(ilGan); // 22. 행운 전화번호
            renderPetMastery(saju, ilJi); // 23. 반려동물 띠 궁합
            renderPastlifeMastery(saju, ilJi); // 24. 전생 카르마
        }

        // ==========================================
        // 기존 11대 필수 렌더링 함수 완벽 복원 탑재 (오행·격국·평생·신살·일주·대운·세운·일진·토정·재물·택일)
        // ==========================================
        function renderOhengAnalysis(saju, ilGan) {
            const counts = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
            const elements = [CHEONGAN[saju.nyeon.ganIdx].oheng, JIJI[saju.nyeon.jiIdx].oheng, CHEONGAN[saju.wol.ganIdx].oheng, JIJI[saju.wol.jiIdx].oheng, CHEONGAN[saju.il.ganIdx].oheng, JIJI[saju.il.jiIdx].oheng];
            if (saju.si) elements.push(CHEONGAN[saju.si.ganIdx].oheng, JIJI[saju.si.jiIdx].oheng);
            elements.forEach(oh => counts[oh]++);

            const total = saju.si ? 8 : 6;
            const container = document.getElementById('oheng-bars-container'); container.innerHTML = '';
            const ohengNames = ['목', '화', '토', '금', '수'];
            const ohengStyles = { '목':{bg:'bg-emerald-500',text:'text-emerald-400',label:'목(木) · 나무'}, '화':{bg:'bg-red-500',text:'text-red-400',label:'화(火) · 불'}, '토':{bg:'bg-amber-500',text:'text-amber-400',label:'토(土) · 흙'}, '금':{bg:'bg-slate-300',text:'text-slate-300',label:'금(金) · 쇠'}, '수':{bg:'bg-blue-500',text:'text-blue-400',label:'수(水) · 물'} };

            ohengNames.forEach(oh => {
                const cnt = counts[oh]; const pct = Math.round((cnt / total) * 100); const style = ohengStyles[oh];
                container.innerHTML += `<div class="space-y-1"><div class="flex justify-between text-xs font-bold"><span class="${style.text}">${style.label} ${cnt>=3 ? '<span class="text-rose-400 ml-1">[과다 🔥]</span>':''}${cnt===0 ? '<span class="text-blue-300 ml-1">[부족 💧]</span>':''}</span><span class="text-gray-300">${cnt}개 (${pct}%)</span></div><div class="w-full bg-mystic-900 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10"><div class="${style.bg} h-full rounded-full" style="width: ${pct}%"></div></div></div>`;
            });

            const analysisBox = document.getElementById('oheng-analysis-text');
            const overList = ohengNames.filter(o => counts[o] >= 3), zeroList = ohengNames.filter(o => counts[o] === 0);
            let html = `<p class="text-amber-300 font-semibold">🌟 내 타고난 핵심 수호 기운이자 나 자신(일간): <strong class="text-white">${ilGan.name}(${ilGan.oheng})</strong></p><p class="text-gray-300">당신은 사주의 우두머리이자 나 자신인 일간(日干)이 <strong>${ilGan.oheng}(${ilGan.han})</strong> 기운을 뿌리로 삼고 있어, 그 오행 특유의 빛깔이 성정 전반에 짙게 배어 있습니다.</p>`;
            if (overList.length > 0) html += `<p class="text-rose-300 pt-1">🔥 <strong>과다 오행 (${overList.join(', ')})</strong>: 원국의 세 글자 이상이 한 기운으로 쏠려 있습니다. 치우친 기운은 성미의 고집으로, 또 그 오행이 맡은 장부의 피로로 드러나기 쉬우니 모자란 쪽을 채워 균형을 맞추는 생활 개운이 필요합니다.</p>`; else html += `<p class="text-emerald-300 pt-1">✅ <strong>과다 오행 없음</strong>: 어느 한쪽으로 크게 기울지 않아, 기운의 배합이 부드럽게 어우러진 원국입니다.</p>`;
            if (zeroList.length > 0) html += `<p class="text-blue-300 pt-1">💧 <strong>부족 오행 (${zeroList.join(', ')})</strong>: 팔자 여덟 글자 안에 이 기운의 글자가 보이지 않습니다. 대운이나 그해의 운에서 이 오행이 들어올 때 막힌 것이 풀리며, 평소 해당 기운의 색과 방향을 곁에 두면 그 시기를 앞당기는 효과가 있습니다.</p>`; else html += `<p class="text-emerald-300 pt-1">✅ <strong>오행 구비 완벽</strong>: 다섯 오행이 원국 안에 빠짐없이 들어차 있습니다. 어떤 환경에 놓여도 제자리를 찾고, 굽이를 만나도 돌아 나오는 힘이 좋은 짜임새입니다.</p>`;
            const myDeep = OHENG_DETAIL[ilGan.oheng];
            if (myDeep) html += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[${ilGan.oheng} 기운 심층 해설]</strong> ${myDeep}</p>`;
            overList.forEach(o => { if (OHENG_DETAIL[o] && o !== ilGan.oheng) html += `<p class="pt-1.5 text-gray-400 leading-relaxed"><strong class="text-rose-300">[과다한 ${o} 기운 이해]</strong> ${OHENG_DETAIL[o]}</p>`; });
            zeroList.forEach(o => { if (OHENG_DETAIL[o]) html += `<p class="pt-1.5 text-gray-400 leading-relaxed"><strong class="text-blue-300">[보완할 ${o} 기운 이해]</strong> ${OHENG_DETAIL[o]}</p>`; });
            analysisBox.innerHTML = html;
        }

        function renderSipsinAndYongsin(saju, ilGan, wolJi) {
            const wolJiSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
            const gyeokgukMap = { '정관':{title:'정관격 (正官格)',desc:'정해진 도리를 지키며 조직의 기준이 되는 그릇으로, 공정함이 무기인 유형'}, '편관':{title:'편관격 (偏官格)',desc:'압박이 클수록 오히려 힘을 내는 승부사로, 위기 국면의 돌파 대장'}, '정인':{title:'정인격 (正印格)',desc:'배움을 쌓아 사람을 기르는 그릇으로, 글과 지식이 평생의 밑천'}, '편인':{title:'편인격 (偏印格)',desc:'남들이 못 보는 이면을 짚어내는 촉의 소유자로, 한 우물 전문 기예형'}, '정재':{title:'정재격 (正財格)',desc:'한 푼도 허투루 다루지 않는 관리 감각으로 차곡차곡 부를 쌓는 유형'}, '편재':{title:'편재격 (偏財格)',desc:'판을 크게 벌여 굴리는 수완가로, 사람과 돈이 함께 도는 유형'}, '식신':{title:'식신격 (食神格)',desc:'표현하고 나누는 것이 곧 복이 되는 유형으로, 의식주 걱정이 적은 격'}, '상관':{title:'상관격 (傷官格)',desc:'틀을 깨는 발상으로 새 길을 여는 유형으로, 재주가 밥이 되는 격'} };
            const gyeok = gyeokgukMap[wolJiSipsin] || {title:'건록/양인격', desc:'남에게 기대지 않는 꿋꿋한 자립심으로 맨손에서 일가를 이루는 유형'};
            gyeok.desc += ' 격국(格局)이란 내 타고난 사회적 그릇이자 나 자신에게 꼭 맞는 무대의 형태으로, 타고난 사회적 체질과 성공 공식을 보여 주는 명리의 핵심 틀입니다. 자신의 격에 맞는 무대를 고르는 것만으로도 같은 노력의 성과가 몇 배로 달라집니다.';
            document.getElementById('sipsin-gyeokguk-title').textContent = gyeok.title; document.getElementById('sipsin-gyeokguk-desc').textContent = gyeok.desc;

            let myScore = 0, otherScore = 0;
            const checkPoint = (g, j, wg, wj) => {
                if (g !== null) { const s = getSipsin(saju.il.ganIdx, CHEONGAN[g].oheng, g%2===0); if (['비견','겁재','정인','편인'].includes(s)) myScore += wg; else otherScore += wg; }
                if (j !== null) { const s = getJiSipsin(saju.il.ganIdx, j); if (['비견','겁재','정인','편인'].includes(s)) myScore += wj; else otherScore += wj; }
            };
            checkPoint(saju.nyeon.ganIdx, saju.nyeon.jiIdx, 1, 1); checkPoint(saju.wol.ganIdx, saju.wol.jiIdx, 1, 3.5); checkPoint(null, saju.il.jiIdx, 0, 1.5); if (saju.si) checkPoint(saju.si.ganIdx, saju.si.jiIdx, 1, 1);
            const isSingang = (myScore >= otherScore);
            document.getElementById('sipsin-singang-title').textContent = isSingang ? '신강 (身强) · 주도형' : '신약 (身弱) · 수용형';
            document.getElementById('sipsin-singang-title').className = `text-xl font-serif-kr font-bold ${isSingang ? 'text-emerald-400' : 'text-amber-400'}`;
            document.getElementById('sipsin-singang-desc').textContent = isSingang ? `내 힘(${myScore}점)이 주위 세력(${otherScore}점)을 앞서니, 스스로 판을 끌고 가는 뚝심이 강한 명입니다.` : `주위 세력(${otherScore}점)이 내 힘(${myScore}점)을 웃도는 구조라, 혼자 밀어붙이기보다 주변의 손을 빌리고 유연하게 조율할 때 일이 풀립니다.`;

            let yongOheng = isSingang ? OHENG_MAP[ilGan.oheng].생 : OHENG_MAP[ilGan.oheng].피생;
            let huiOheng = isSingang ? OHENG_MAP[ilGan.oheng].극 : ilGan.oheng;
            document.getElementById('yongsin-oheng').textContent = `${yongOheng} 기운 (${isSingang?'식상/재성':'인성/비겁'})`;
            document.getElementById('huisin-oheng').textContent = `${huiOheng} 기운`;
            document.getElementById('yongsin-reason').innerHTML = `사주 기운의 밸런스를 배터리 충전처럼 고르게 다스려 주는 억부의 원리에 따라, 나를 가장 안전하고 힘차게 살려주는 고마운 행운 배터리 기운은 <strong>${yongOheng}</strong>이(가) 되고, 곁에서 이를 든든하게 지켜주는 보조 조력자 기운은 <strong>${huiOheng}</strong>이(가) 되어 내 인생의 물길을 맑고 시원하게 틔워 줍니다.`;

            const sipsinList = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
            const sipsinCounts = {}; sipsinList.forEach(s => sipsinCounts[s] = 0);
            const countS = (g, j) => { if (g!==null) sipsinCounts[getSipsin(saju.il.ganIdx, CHEONGAN[g].oheng, g%2===0)]++; if (j!==null) sipsinCounts[getJiSipsin(saju.il.ganIdx, j)]++; };
            countS(saju.nyeon.ganIdx, saju.nyeon.jiIdx); countS(saju.wol.ganIdx, saju.wol.jiIdx); countS(null, saju.il.jiIdx); if (saju.si) countS(saju.si.ganIdx, saju.si.jiIdx);

            const grid = document.getElementById('sipsin-grid-container'); grid.innerHTML = '';
            sipsinList.forEach(s => grid.innerHTML += `<div class="p-2.5 rounded-xl border ${sipsinCounts[s]>0 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold' : 'bg-white/5 border-white/10 text-gray-500'}"><div class="text-xs">${s}<span class="block text-[10px] opacity-85 font-normal font-sans mt-0.5 text-gray-300">${SIPSIN_NICK[s] || ''}</span></div><div class="text-base sm:text-lg mt-1">${sipsinCounts[s]}개</div></div>`);
            const topS = Object.entries(sipsinCounts).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>0);
            document.getElementById('sipsin-summary-text').innerHTML = topS.length > 0 ? `<p>· <strong>최다 십신 (${topS[0][0]}, ${topS[0][1]}개)</strong>: 이 기운이 당신의 직업적 색깔과 사회생활의 무게중심 노릇을 합니다.</p>` : '';
        }

        function renderLifeStages(saju, ilGan, ilJi) {
            const wolJiSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
            document.getElementById('life-total-title').textContent = `${saju.il.name} 일주와 ${wolJiSipsin} 환경의 절묘한 만남`;
            document.getElementById('life-total-desc').textContent = `당신의 한평생은 ${ilGan.symbol.split('/')[0]} 의 기질을 밑거름 삼아, 세상 속에서 ${wolJiSipsin}의 재능을 펼쳐 가는 긴 여정으로 읽힙니다. 어린 시절 뿌리를 내리고, 중년 무렵 사회적으로 가장 높이 오르며, 그 뒤로는 쌓아 온 경험을 지혜와 여유로 바꾸어 누리는 흐름의 그릇입니다.`;
            document.getElementById('life-chonyon-ganji').textContent = `년주: ${saju.nyeon.name} (${saju.nyeon.han})`;
            document.getElementById('life-chonyon-desc').textContent = `1~20세 무렵의 초년 구간입니다. 가족과 웃어른의 울타리 안에서 공부의 기초를 다지고, 나만의 중심을 세워 가는 시절로 풀이됩니다. 년주는 조상과 부모에게서 물려받은 뿌리의 기운을 보여 주는 자리로, 이 시절에 몸에 밴 습관과 가치관이 평생의 밑그림이 됩니다. 이 구간의 경험이 순탄했든 굴곡졌든, 그 모든 것이 중년 이후 꺼내 쓰게 될 자산으로 쌓여 있다는 점이 중요합니다.`;
            document.getElementById('life-jungnyon-ganji').textContent = `월주: ${saju.wol.name} (${saju.wol.han}) · ${wolJiSipsin}`;
            document.getElementById('life-jungnyon-desc').textContent = `20~45세의 청년·중년 구간입니다. 일터에서 실력을 증명하고 자리를 넓혀 가며, 재산의 토대를 하나씩 쌓아 올리는 상승기의 흐름입니다. 월주는 사회 무대와 직업 환경을 비추는 자리라, 이 시기의 선택 하나하나가 인생 전체의 물길을 정합니다. 20대에는 방향을 고르고, 30대에는 속도를 붙이고, 40대 초반에는 쌓은 것을 지키는 순서로 힘을 배분하면 이 상승기를 온전히 살릴 수 있습니다.`;
            document.getElementById('life-jangnyon-ganji').textContent = `일주: ${saju.il.name} (${saju.il.han}) · 배우자궁`;
            document.getElementById('life-jangnyon-desc').textContent = `45~60세의 장년 구간입니다. 집안이 안정 궤도에 오르고 배우자와의 호흡이 깊어지며, 삶을 바라보는 눈이 한층 원숙해지는 시절입니다. 일주는 나 자신과 배우자궁을 함께 담은 자리여서, 이 무렵부터는 바깥의 성취보다 곁의 사람과 몸의 건강이 행복의 무게중심이 됩니다. 이 시기에 부부가 함께하는 취미나 루틴을 하나 만들어 두면, 말년까지 이어지는 든든한 버팀목이 됩니다.`;
            if (saju.si) {
                document.getElementById('life-malnyon-ganji').textContent = `시주: ${saju.si.name} (${saju.si.han})`;
                document.getElementById('life-malnyon-desc').textContent = `60세 이후의 말년 구간입니다. 몸과 살림이 두루 편안하고, 자녀와 아랫사람들의 존경 속에서 그간 뿌린 것을 거두는 시절로 풀이됩니다. 시주는 말년운과 자녀 인연을 보여 주는 자리입니다. 이 구간의 복은 갑자기 오는 것이 아니라 초년의 성실, 중년의 신용, 장년의 덕이 이자까지 붙어 돌아오는 것이니, 지금 어느 시기를 지나고 계시든 그 시절의 숙제를 다하는 것이 곧 말년 준비입니다.`;
            } else {
                document.getElementById('life-malnyon-ganji').textContent = `시주 미상 (미적용)`;
                document.getElementById('life-malnyon-desc').textContent = `출생 시각을 몰라 시주는 계산에서 뺐습니다. 태어난 시간을 확인해 입력하시면 말년의 흐름과 자녀 인연까지 더 깊이 읽어 드릴 수 있습니다.`;
            }
        }

        function renderHabchungAndSinsal15(saju, ilGan, ilJi) {
            const sinsals = []; const jiList = [saju.nyeon.jiIdx, saju.wol.jiIdx, saju.il.jiIdx]; if (saju.si) jiList.push(saju.si.jiIdx);
            const cheonEulMap = { 0:[1,7], 1:[0,8], 2:[11,9], 3:[11,9], 4:[1,7], 5:[0,8], 6:[1,7], 7:[2,6], 8:[3,5], 9:[3,5] }[saju.il.ganIdx];
            if (jiList.some(ji => cheonEulMap.includes(ji))) sinsals.push({ name: '천을귀인 (天乙貴人)', type: '최고 길신 🌟', desc: '고비마다 뜻밖의 조력자가 나타나 궂은 기운을 좋은 쪽으로 돌려놓는, 으뜸으로 치는 복성입니다.' });
            const munChangMap = { 0:5, 1:6, 2:8, 3:9, 4:8, 5:9, 6:11, 7:0, 8:2, 9:3 }[saju.il.ganIdx];
            if (jiList.includes(munChangMap)) sinsals.push({ name: '문창귀인 (文昌貴人)', type: '학문 길신 📚', desc: '머리가 맑고 글재주가 빼어나, 공부·시험·문서와 관련된 일에서 남다른 결과를 거두는 별입니다.' });
            if (jiList.includes(3) || jiList.includes(6) || jiList.includes(9) || jiList.includes(0)) sinsals.push({ name: '도화살 (桃花殺)', type: '대중 매력 🌸', desc: '보는 이의 시선을 끌어당기는 타고난 매력의 별입니다. 사람 앞에 서는 방송·예능·뷰티·영업 계열에서 그 힘이 빛을 냅니다.' });
            if (jiList.includes(2) || jiList.includes(5) || jiList.includes(8) || jiList.includes(11)) sinsals.push({ name: '역마살 (驛馬殺)', type: '글로벌 활동 ✈️', desc: '한곳에 머무르기보다 움직이며 판을 넓히는 별입니다. 오가며 이루는 무역·유통·현장 영업 쪽에서 성과가 커집니다.' });
            if (jiList.includes(4) || jiList.includes(7) || jiList.includes(10) || jiList.includes(1)) sinsals.push({ name: '화개살 (華蓋殺)', type: '철학 영성 🔮', desc: '홀로 깊이 파고드는 사색의 별입니다. 예술·철학·수행처럼 내면을 다루는 길에서 남이 흉내 못 낼 세계를 만들어 냅니다.' });
            const baekhoList = ['무진','정축','병술','을미','갑진','계축','임술'];
            if (baekhoList.includes(saju.il.name) || baekhoList.includes(saju.wol.name)) sinsals.push({ name: '백호대살 (白虎大殺)', type: '폭발적 투지 🐯', desc: '한번 불붙으면 끝을 보는 맹렬한 승부 기질의 별입니다. 강한 에너지를 전문성으로 벼리면 오늘날에는 오히려 정상에 서는 힘이 됩니다.' });

            const sCont = document.getElementById('sinsal-list-container'); sCont.innerHTML = '';
            sinsals.forEach(s => sCont.innerHTML += `<div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3"><span class="text-xs font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 min-w-max mt-0.5">${s.type}</span><div><div class="text-sm font-bold text-white">${s.name}</div><p class="text-xs text-gray-300 mt-1">${s.desc}</p></div></div>`);

            const habchungList = [];
            const checkJiHab = (j1, j2, name) => { if (jiList.includes(j1) && jiList.includes(j2)) habchungList.push({ title: `지지 육합 · ${name}`, desc: '지지끼리 서로 끌어안는 형국이라, 원국 전체를 지켜주고 흔들림을 줄여 주는 작용을 합니다.' }); };
            checkJiHab(0, 1, '자축합'); checkJiHab(2, 11, '인해합'); checkJiHab(3, 10, '묘술합'); checkJiHab(4, 9, '진유합'); checkJiHab(5, 8, '사신합'); checkJiHab(6, 7, '오미합');
            const hCont = document.getElementById('habchung-list-container'); hCont.innerHTML = '';
            if (habchungList.length === 0) hCont.innerHTML = '<p class="text-xs text-gray-400 p-3 bg-white/5 rounded-xl">글자끼리 크게 부딪히는 자리가 없어, 원국의 균형이 잔잔하게 잘 잡혀 있는 편입니다.</p>';
            else habchungList.forEach(h => hCont.innerHTML += `<div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1"><div class="text-sm font-bold text-amber-300 flex items-center gap-1.5"><i data-lucide="corner-down-right" class="w-4 h-4 text-amber-400"></i> ${h.title}</div><p class="text-xs text-gray-300">${h.desc}</p></div>`);
        }

        function renderIljuDetail(iljuName, ilGan, ilJi) {
            const data = ILJU_DATA[iljuName] || getIljuFallback(ilGan, ilJi);
            document.getElementById('ilju-detail-title').textContent = `${iljuName} 일주 · ${ilGan.symbol.split('/')[0]}와 ${ilJi.animal}의 결합`;
            document.getElementById('ilju-symbol-text').textContent = `${ilGan.symbol} / ${ilJi.animal}`;
            let coreHtml = `<p>${data.desc}</p>`;
            const deep = ILJU_DETAIL[iljuName];
            if (deep) coreHtml += `<p class="pt-2 text-gray-300 leading-relaxed">${deep}</p>`;
            const ganDeep = GAN_DETAIL[ilGan.name], jiDeep = JI_DETAIL[ilJi.name];
            if (ganDeep) coreHtml += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[일간 ${ilGan.name}${ilGan.han} 심층]</strong> ${ganDeep}</p>`;
            if (jiDeep) coreHtml += `<p class="pt-2 text-gray-400 leading-relaxed"><strong class="text-amber-300">[일지 ${ilJi.name}${ilJi.han} 심층]</strong> ${jiDeep}</p>`;
            document.getElementById('ilju-core-text').innerHTML = coreHtml;
            const strList = document.getElementById('ilju-strengths-list'); strList.innerHTML = ''; data.strengths.forEach(s => strList.innerHTML += `<li>${s}</li>`);
            const weakList = document.getElementById('ilju-weaknesses-list'); weakList.innerHTML = ''; data.weaknesses.forEach(w => weakList.innerHTML += `<li>${w}</li>`);
            document.getElementById('ilju-job-text').textContent = data.job; document.getElementById('ilju-love-text').textContent = data.love; document.getElementById('ilju-health-text').textContent = data.health;
        }

        function renderDaeun(saju, isForward, daeunStartAge, manAge) {
            document.getElementById('daeun-info-badge').textContent = `${isForward ? '순행 (順行)' : '역행 (逆行)'} · 만 ${daeunStartAge}세 시작`;
            const timelineGrid = document.getElementById('daeun-timeline-grid'); timelineGrid.innerHTML = '';
            const baseWolGanIdx = saju.wol.ganIdx, baseWolJiIdx = saju.wol.jiIdx; let currentDaeunObj = null;

            for (let i = 1; i <= 8; i++) {
                const step = isForward ? i : -i;
                const ganIdx = (baseWolGanIdx + step + 60) % 10, jiIdx = (baseWolJiIdx + step + 60) % 12;
                const gan = CHEONGAN[ganIdx], ji = JIJI[jiIdx];
                const startAge = daeunStartAge + (i - 1) * 10, endAge = startAge + 9;
                const isCurrent = (manAge >= startAge && manAge <= endAge) || (i === 4 && !currentDaeunObj);
                if (isCurrent) currentDaeunObj = { title: `${gan.name}${ji.name}(${gan.han}${ji.han}) 대운`, ageRange: `만 ${startAge}세 ~ ${endAge}세`, ganjiHan: `${gan.han}${ji.han}`, ganSipsin: getSipsin(saju.il.ganIdx, gan.oheng, ganIdx%2===0), jiSipsin: getJiSipsin(saju.il.ganIdx, jiIdx) };

                timelineGrid.innerHTML += `<div class="glass-card rounded-xl p-4 transition border flex flex-col justify-between ${isCurrent ? 'border-2 border-amber-500 bg-amber-500/10 shadow-lg' : 'border-white/10 hover:border-white/30'}"><div class="flex justify-between items-center text-xs pb-2 border-b border-white/10"><span class="font-bold ${isCurrent ? 'text-amber-400 font-extrabold' : 'text-gray-400'}">${i}대운 (${startAge}~${endAge}세)</span><span>⭐⭐⭐⭐</span></div><div class="my-3 text-center"><div class="font-serif-kr font-bold text-2xl sm:text-3xl text-white">${gan.han}${ji.han}</div><div class="text-xs font-bold mt-1 ${gan.textClass}">${gan.name}(${gan.oheng}) · ${ji.name}(${ji.oheng})</div></div><div class="text-[11px] bg-white/5 rounded px-2 py-1 flex justify-between text-gray-300"><span>천간: ${getSipsin(saju.il.ganIdx, gan.oheng, ganIdx%2===0)}</span><span>지지: ${getJiSipsin(saju.il.ganIdx, jiIdx)}</span></div></div>`;
            }

            if (currentDaeunObj) {
                document.getElementById('current-daeun-age').textContent = currentDaeunObj.ageRange; document.getElementById('current-daeun-ganji-box').textContent = currentDaeunObj.ganjiHan;
                document.getElementById('current-daeun-title').textContent = `${currentDaeunObj.title} · ${currentDaeunObj.ganSipsin}/${currentDaeunObj.jiSipsin}의 테마`;
                document.getElementById('current-daeun-desc').innerHTML = `현재 당신은 <strong>${currentDaeunObj.ganSipsin}(천간)</strong>이 열어 주는 바깥세상의 기회와 <strong>${currentDaeunObj.jiSipsin}(지지)</strong>가 받쳐 주는 현실의 힘이 함께 움직이는 시절을 지나고 있습니다. 대운은 10년 단위로 갈아입는 계절의 옷과 같아서, 같은 사람이라도 어느 대운을 지나느냐에 따라 인생의 온도가 크게 달라집니다. 지금의 대운은 품어 온 것을 꺼내 보이고 자기 자리를 단단히 굳히기에 더없이 좋은 도약의 구간이니, 미뤄 온 결심이 있다면 이 10년 안에 승부를 거는 것이 흐름을 타는 길입니다.`;
            }
        }

        function renderSeunAndGuide(saju, ilGan, ilJi) {
            document.getElementById('seun-general-text').innerHTML = `<p class="text-amber-300 font-bold mb-1">🔥 2026년 병오(丙午)년 세운 핵심: 화기(火氣)의 폭발적 에너지 발산</p><p>천간과 지지에 화(火)가 겹쳐 타오르는 붉은 말의 해입니다. 안에 감춰 두었던 재주가 밖으로 드러나고, 발 딛는 무대가 훌쩍 넓어지는 활기찬 흐름입니다.</p>`;
            document.getElementById('seun-job-text').textContent = `실력이 조명받고 이름값이 오르는 구간입니다. 손대고 있던 일이 매듭을 지으며, 공을 인정받을 자리가 여러 번 찾아옵니다. 특히 그동안 티 나지 않게 해 온 일일수록 올해는 조명 아래로 나옵니다. 성과를 정리한 기록을 미리 준비해 두면 기회가 왔을 때 곧바로 내밀 수 있고, 상반기의 작은 인정이 하반기의 큰 제안으로 이어지는 연쇄가 일어나기 쉬운 흐름입니다. 특히 그동안 "알아주는 사람이 없다"고 느껴 왔다면 올해가 그 갈증을 푸는 해입니다. 발표·보고·면접처럼 나를 드러내는 자리를 피하지 말고 오히려 자원하세요. 화(火)의 해에는 무대에 서는 사람에게 빛이 모입니다.`;
            document.getElementById('seun-money-text').textContent = `움직임이 커지는 만큼 돈의 드나듦도 잦아집니다. 들어오는 돈도 늘지만 활동비·교제비처럼 나가는 구멍도 함께 커지는 구조라, 한탕을 노리기보다 새는 곳을 막는 알뜰한 관리가 결과적으로 남는 장사입니다. 불 기운이 강한 해에는 돈도 빠르게 들어오고 빠르게 나가는 성질을 띱니다. 고정 지출을 점검해 줄줄 새는 구멍부터 막고, 수입이 늘어난 달에는 늘어난 만큼의 일부를 반드시 떼어 묶어 두세요. 연말에 결산해 보면 화려하게 벌던 사람보다 담담하게 지킨 사람의 곳간이 더 차 있는 해입니다. 상반기에는 지출 항목을 한번 정리해 고정비를 다이어트하고, 목돈이 생기면 하반기의 기회를 위해 유동성 있게 묶어 두는 편이 유리합니다.`;
            document.getElementById('seun-love-text').textContent = `불 기운이 실어 오는 도화의 바람으로 주변의 호감이 부쩍 늘고, 마음이 가는 인연과 마주칠 확률이 높아집니다. 솔로라면 소개나 모임을 마다하지 말고 나가 보세요. 올해의 인연은 기다리는 자리보다 움직이는 자리에서 생깁니다. 짝이 있는 분이라면 주변의 관심이 늘어나는 만큼 오해의 소지도 함께 커지니, 사소한 것도 먼저 공유하는 투명함이 관계를 지키는 가장 쉬운 방법입니다. 혼자인 분이라면 모임·동호회·소개 자리를 마다하지 마세요. 올해는 가만히 있어도 눈에 띄는 해라, 평소보다 적은 노력으로 좋은 만남이 성사됩니다. 짝이 있는 분은 뜨거워진 감정 온도만큼 사소한 다툼도 불붙기 쉬우니, 화가 오르는 순간 대화를 잠시 멈추는 지혜가 필요합니다.`;
            document.getElementById('seun-rel-text').textContent = `모임 자리가 늘고 아는 사람의 폭이 넓어지는 때입니다. 올해 새로 맺는 인연 가운데는 몇 년 뒤 결정적 순간에 손을 내밀어 줄 귀인이 섞여 있으니, 당장 이득이 없어 보이는 만남도 소홀히 하지 마세요. 다만 화 기운의 해에는 말이 빨라지고 세지는 경향이 있어, 무심코 던진 한마디가 구설이 되기 쉽습니다. 세 번 생각하고 한 번 말하는 습관이 올해 인간관계의 보험입니다.`;
            document.getElementById('seun-health-text').textContent = `의욕이 앞서는 만큼 몸의 배터리도 빨리 닳습니다. 화 기운이 강한 해에는 심장·혈압·눈의 피로, 그리고 불면이 단골 신호로 옵니다. 잠을 줄여 가며 달리지 말고, 일주일에 하루는 아무 일정도 없는 완전한 휴식일로 비워 두세요. 커피를 줄이고 미지근한 물을 자주 마시는 것, 자기 전 화면을 멀리하는 것만으로도 올해의 과열을 크게 식힐 수 있습니다.`;
            document.getElementById('seun-study-text').textContent = `머리 회전이 빠르고 감이 예리하게 서는 시기라, 자격시험이나 연구·탐구 쪽에서 기대 이상의 성적을 낼 수 있습니다. 다만 불 기운의 학습은 순간 몰입은 강하고 지구력은 짧은 특징이 있으니, 하루 8시간을 붙드는 계획보다 90분 집중 후 확실히 쉬는 리듬이 효율을 배로 만듭니다. 미뤄 온 자격증이 있다면 접수부터 해 버리세요. 마감이 정해지는 순간 올해의 기운이 등을 밀어 줍니다. 미뤄 두었던 자격증이나 어학 공부가 있다면 올해 안에 시작하는 것이 몇 년 치를 앞당기는 선택입니다. 다만 의욕이 넘쳐 여러 과목을 동시에 벌이면 어느 것도 매듭짓지 못하니, 한 번에 한 과목씩 끝을 보는 각개격파 전략이 화 기운의 해와 잘 맞습니다.`;

            const monthlyGrid = document.getElementById('seun-monthly-grid'); monthlyGrid.innerHTML = '';
            [{m:1,han:'己丑',kr:'기축'},{m:2,han:'庚寅',kr:'경인'},{m:3,han:'辛卯',kr:'신묘'},{m:4,han:'壬辰',kr:'임진'},{m:5,han:'癸巳',kr:'계사'},{m:6,han:'甲午',kr:'갑오'},{m:7,han:'乙未',kr:'을미'},{m:8,han:'丙申',kr:'병신'},{m:9,han:'丁酉',kr:'정유'},{m:10,han:'戊戌',kr:'무술'},{m:11,han:'己亥',kr:'기해'},{m:12,han:'庚子',kr:'경자'}].forEach(mo => {
                monthlyGrid.innerHTML += `<div class="p-3 rounded-xl border bg-white/5 ${mo.m===6 ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10'}"><div class="flex justify-between items-center text-xs font-bold text-gray-400"><span>2026년 ${mo.m}월</span><span class="text-amber-400 font-serif-kr">${mo.han}</span></div><div class="text-sm font-bold text-white mt-1">${mo.kr}월</div></div>`;
            });

            document.getElementById('guide-color').textContent = '적색, 핑크색 (Red) / 남쪽'; document.getElementById('guide-direction').textContent = '남쪽 (South)'; document.getElementById('guide-number').textContent = '2, 7 (화 기운)'; document.getElementById('guide-food').textContent = '따뜻한 차와 커피';
            document.getElementById('guide-do-list').innerHTML = `<li><strong>용신 기운 적극 수용</strong>: 나에게 이로운 색과 방향을 옷·소품·자리 배치에 자연스럽게 녹여 보세요.</li><li><strong>명확한 목표 문서화</strong>: 머릿속 계획을 글과 계약서로 못 박아 둘 때 성과가 손에 잡힙니다.</li><li><strong>따뜻한 말 한마디</strong>: 베푼 온기는 돌고 돌아 귀인의 손길이 되어 돌아옵니다.</li>`;
            document.getElementById('guide-dont-list').innerHTML = `<li><strong>욱하는 감정 충돌 주의</strong>: 욱하는 순간의 기 싸움은 이겨도 손해입니다. 한 템포 쉬어 가세요.</li><li><strong>과도한 투기 및 보증 경계</strong>: 보증과 투기는 멀리하고, 지키는 쪽에 무게를 둔 자산 운용이 안전합니다.</li>`;
        }

        function renderDailyFortune(saju, ilGan, ilJi) {
            const today = new Date(); const tYear = today.getFullYear(), tMonth = today.getMonth() + 1, tDay = today.getDate();
            const diffDays = Math.floor((today - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24));
            let tIlIdx = (40 + diffDays) % 60; if (tIlIdx < 0) tIlIdx += 60;
            const tIlGapja = GAPJA[tIlIdx]; const tGan = CHEONGAN[tIlGapja.ganIdx]; const tJi = JIJI[tIlGapja.jiIdx];

            document.getElementById('daily-date-sub').textContent = `${tYear}년 ${tMonth}월 ${tDay}일 오늘 일진`;
            document.getElementById('daily-ganji-text').textContent = `${tIlGapja.name} (${tIlGapja.han})일 · ${tJi.animal}의 날`;

            const todaySipsinGan = getSipsin(saju.il.ganIdx, tGan.oheng, tIlGapja.ganIdx % 2 === 0);
            const todaySipsinJi = getJiSipsin(saju.il.ganIdx, tIlGapja.jiIdx);
            let moneyPct = 78, lovePct = 82, jobPct = 80, relPct = 85;
            let stars = '⭐⭐⭐⭐ (좋은 소식이 줄지어 드는 상서로운 날)';
            let summary = `오늘 하루는 <strong>${tIlGapja.name}일(${todaySipsinGan}/${todaySipsinJi})</strong>의 기운이 하루를 이끕니다. 일과 돈 양쪽에서 흐뭇한 결과를 손에 쥐기 좋은 날입니다.`;

            if (todaySipsinGan.includes('재') || todaySipsinJi.includes('재')) { moneyPct = 95; jobPct = 90; summary = `재성(나에게 다가오는 든든한 실속 재물)의 기운이 하루를 채우는 날입니다. 막혔던 돈줄이 트이고, 굴려 둔 자산에서 반가운 소식이 들려올 수 있는 흐름입니다.`; }
            else if (todaySipsinGan.includes('관') || todaySipsinJi.includes('관')) { jobPct = 96; relPct = 88; summary = `관성(반듯하고 신뢰받는 명예와 합격)의 기운이 정점에 오르는 날입니다. 실력을 공식적으로 인정받거나 굵직한 계약 도장을 찍기에 이보다 좋은 타이밍이 드뭅니다.`; }

            const jiHabPairs = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
            if (jiHabPairs[ilJi.jiIdx] === tIlGapja.jiIdx) { lovePct = 98; relPct = 96; stars = '⭐⭐⭐⭐⭐ (막힘없이 술술 풀리는 최상급 길일)'; summary += ` 일지가 <strong>육합(六合)</strong>으로 어우러지니 사람 사이의 합이 유난히 좋고, 애정 전선에도 훈풍이 붑니다.`; }
            else if (Math.abs(ilJi.jiIdx - tIlGapja.jiIdx) === 6) { relPct = 65; moneyPct = 70; stars = '⭐⭐⭐ (변화의 바람이 부니 한 박자 신중히)'; summary += ` 일지가 <strong>상충(相冲)</strong>하는 날이라 마음이 앞서기 쉽습니다. 핸들 잡을 때와 말끝이 날카로워질 때, 이 두 가지만 조심하면 무난합니다.`; }

            const ganAdvice = SIPSIN_DAILY[todaySipsinGan], jiAdvice = SIPSIN_DAILY[todaySipsinJi];
            if (ganAdvice) summary += ` <span class="block pt-2 text-gray-300"><strong class="text-amber-300">[천간 ${todaySipsinGan} 풀이]</strong> ${ganAdvice}</span>`;
            if (jiAdvice && todaySipsinJi !== todaySipsinGan) summary += ` <span class="block pt-1.5 text-gray-300"><strong class="text-amber-300">[지지 ${todaySipsinJi} 풀이]</strong> ${jiAdvice}</span>`;
            document.getElementById('daily-stars').textContent = stars; document.getElementById('daily-summary-text').innerHTML = summary;
            document.getElementById('daily-pct-money').textContent = `${moneyPct}%`; document.getElementById('daily-bar-money').style.width = `${moneyPct}%`;
            document.getElementById('daily-pct-love').textContent = `${lovePct}%`; document.getElementById('daily-bar-love').style.width = `${lovePct}%`;
            document.getElementById('daily-pct-job').textContent = `${jobPct}%`; document.getElementById('daily-bar-job').style.width = `${jobPct}%`;
            document.getElementById('daily-pct-rel').textContent = `${relPct}%`; document.getElementById('daily-bar-rel').style.width = `${relPct}%`;
        }

        function renderTojungBigyeol(saju) {
            const nowYr = new Date().getFullYear(); const age = nowYr - saju.year + 1; const m = saju.month, d = saju.day;
            let sang = (age + m) % 8; if (sang === 0) sang = 8; let jung = (sang + d) % 6; if (jung === 0) jung = 6; let ha = (jung + (saju.timeHour || 12) + age) % 3; if (ha === 0) ha = 3;
            const gwaeNum = `${sang}${jung}${ha}`;
            const tojungNames = { '111':'건천태평 괘','112':'춘풍화기 괘','113':'금의환향 괘','211':'명월만개 괘','212':'만사형통 괘','213':'개운유수 괘','311':'일취월장 괘','312':'춘풍화기 괘','313':'부귀겸전 괘','411':'용문도약 괘','412':'유암화명 괘','413':'천강복록 괘','511':'고목봉춘 괘','512':'풍운조화 괘','513':'재수형통 괘' };
            const gwaeTitle = tojungNames[gwaeNum] || `제 ${gwaeNum} 괘 · 풍운조화 괘`;

            document.getElementById('tojung-year-label').textContent = `${nowYr}년 정통 토정비결 괘명`;
            document.getElementById('tojung-gwae-name').textContent = gwaeTitle;
            document.getElementById('tojung-calc-detail').textContent = `상괘 ${sang} + 중괘 ${jung} + 하괘 ${ha} = ${gwaeNum} 괘`;
            document.getElementById('tojung-total-desc').innerHTML = `나이와 생월·생일을 엮어 내는 옛 신년 산가지 법으로 올해의 괘를 뽑아 보니 <strong>[${gwaeTitle}]</strong>이(가) 나왔습니다. 긴 시간 매만져 온 일이 드디어 꼴을 갖추고, 쏟은 공에 비례해 곳간이 차는 결실의 해로 풀이됩니다.`;
            document.getElementById('tojung-half1-desc').textContent = `1월부터 6월까지의 상반기는 땅을 고르는 시기입니다. 속도를 내기보다 밑그림을 손보는 게 먼저이며, 서류와 계약이 제자리를 찾고 힘이 되어 줄 사람이 하나둘 곁에 모입니다. 이 시기에 맺은 관계와 문서가 한 해 농사의 씨앗이 되니, 사소한 약속이라도 글로 남기고 도장은 내용은 꼼꼼히 본 뒤에 찍으세요. 봄에 급히 심은 씨앗보다 잘 고른 씨앗이 가을 수확을 결정합니다.`;
            document.getElementById('tojung-half2-desc').textContent = `7월부터 12월까지의 하반기는 낫을 드는 시기입니다. 봄여름에 다져 둔 것이 수입과 이름값으로 되돌아오고, 특히 가을 문턱에서 오래 기억될 낭보가 들릴 수 있습니다. 다만 거두는 계절일수록 곳간 단속이 함께 필요합니다. 수확이 눈에 보이기 시작하면 주변의 부탁과 제안도 늘어나는 법이니, 기쁜 소식은 나누되 큰돈이 걸린 결정은 연말의 들뜬 분위기에 휩쓸리지 말고 새해 초의 맑은 정신으로 미뤄 두는 것도 지혜입니다.`;

            const mGrid = document.getElementById('tojung-monthly-grid'); mGrid.innerHTML = '';
            ['정월(1월): 몸가짐이 편안하고 집안에 웃음이 돎','2월: 봄바람에 꽃망울 터지듯 재물길이 열림','3월: 문을 두드리는 귀인이 있어 약조가 이루어짐','4월: 작게 시작한 일이 옹골찬 이득으로 자람','5월: 남녘에서 반가운 기별과 오름세의 조짐','6월: 물결이 잔잔하니 하는 일마다 무탈함','7월: 부지런히 오간 걸음마다 곡식이 쌓임','8월: 생각지 못한 인연이 다음 도약의 다리가 됨','9월: 한가위 달처럼 이름이 두루 밝게 비침','10월: 불린 재산을 한 번 더 굴려 볼 만한 때','11월: 집안에 경사가 들고 살림이 넉넉해짐','12월: 웃는 낯으로 한 해의 매듭을 지음'].forEach(msg => {
                mGrid.innerHTML += `<div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 leading-relaxed font-serif-kr"><strong class="text-amber-400 font-sans block mb-1">📜 ${msg.split(':')[0]}</strong>${msg.split(':')[1]}</div>`;
            });
        }

        function renderWealthMastery(saju, ilGan, wolJi) {
            const wolSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
            let wType = '식신생재(食神生財) · 자수성가 사업부호형', wDesc = `몸에 익힌 기술과 남과 다른 재주를 곧장 수입원으로 바꿔 내는, 스스로 벌어 스스로 일어서는 그릇입니다. 이런 구조는 월급 하나에만 기대기보다 본업 곁에 재주를 살린 부수입 파이프라인을 하나씩 늘려 갈 때 재산 그래프가 가팔라집니다. 남에게 물려받는 복보다 내 손으로 일구는 복이 훨씬 큰 명이니, 젊어서의 고생을 밑천이 쌓이는 과정으로 여기셔도 좋습니다.`, investDesc = `내 실력이 지분이 되는 사업, 부가가치 높은 서비스업, 실적이 탄탄한 주식과 상가 월세처럼 재주가 굴러가는 자산과 궁합이 좋습니다.`;
            if (wolSipsin === '편재' || wolSipsin === '정재') { wType = '재기통문(財氣通門) · 자산가/재무 마스터형'; wDesc = `돈이 어디서 와서 어디로 가는지를 본능적으로 읽어 내는 눈을 타고났습니다. 장사와 사업의 감각이 몸에 밴 자산가형 명이라, 같은 정보를 보고도 남들이 놓치는 돈 냄새를 먼저 맡습니다. 이 재능은 직장 안에 가둬 두기 아까운 종류여서, 당장 창업이 아니더라도 예산·구매·영업처럼 돈이 흐르는 길목의 업무를 맡을수록 몸값이 뜁니다.`; investDesc = `부동산 사고팔기, 목돈 굴리기, 긴 호흡의 가치 투자처럼 판이 큰 자본 게임에서 기회를 잡는 유형입니다.`; }
            else if (wolSipsin === '정인' || wolSipsin === '편인') { wType = '인수문서(印綬文書) · 부동산 지적재산권 부호형'; wDesc = `머리로 쌓은 지식과 손에 쥔 문서·자격·권리가 곧 곳간이 되는 유형입니다. 남들처럼 발로 뛰어 버는 돈보다, 공부해서 딴 자격·이름을 걸고 만든 콘텐츠·등기부에 올린 자산이 잠자는 동안에도 일해 주는 구조가 어울립니다. 위험한 큰돈보다 확실한 문서를 택하는 신중함이 이 명의 최대 무기이니, 남의 화려한 수익률에 흔들릴 이유가 없습니다.`; investDesc = `이름이 새겨지는 자산, 곧 등기된 부동산·저작권과 특허·꾸준한 배당주처럼 서류로 증명되는 투자와 잘 맞습니다.`; }

            document.getElementById('wealth-type-title').textContent = wType; document.getElementById('wealth-type-desc').textContent = wDesc; document.getElementById('wealth-invest-desc').textContent = investDesc;
            document.getElementById('wealth-golden-desc').textContent = `나의 재능(식상)과 소중한 재물(재성)의 운이 포개지는 30대 중반~40대 후반, 그리고 50대 중반의 대운 구간이 재산 규모가 계단식으로 뛰어오르는 황금 창구로 읽힙니다. 이런 구간의 특징은 "일이 돈을 부르고, 그 돈이 다시 기회를 부르는" 선순환이 저절로 돈다는 점입니다. 그러니 해당 시기가 오기 전까지는 종잣돈과 실력이라는 두 개의 장작을 부지런히 쌓아 두는 것이 핵심 전략입니다. 창구가 열렸을 때 태울 장작이 없으면 좋은 운도 잔불로 끝나고, 넉넉히 쌓아 둔 사람에게는 같은 운이 큰 화력이 됩니다.`;
            document.getElementById('wealth-caution-desc').textContent = `비견·겁재의 운이 드는 해에는 내 돈이 남의 주머니로 새기 쉽습니다. 이 구간만큼은 동업 제안·보증 도장·한탕성 투기와 거리를 두는 것이 재산을 지키는 길입니다. 비견·겁재란 나와 같은 기운이 여럿 들어와 내 몫을 나누어 가는 형국을 말합니다. 이 시기에는 유난히 "확실하다"는 제안과 "너니까 알려 준다"는 정보가 몰려드는데, 거절이 어려우면 "가족과 상의해야 한다"는 한마디를 방패로 삼으세요. 지키기만 해도 이기는 구간이 있다는 것을 아는 것이, 부자 사주와 그렇지 못한 사주의 실제 갈림길입니다.`;
        }

        function renderTaegilMastery(saju, ilGan, ilJi) {
            const mList = document.getElementById('taegil-move-list'), bList = document.getElementById('taegil-biz-list'), lList = document.getElementById('taegil-love-list');
            mList.innerHTML = ''; bList.innerHTML = ''; lList.innerHTML = '';
            ['2026년 7월 19일 (손 없는 날 · 대길)', '2026년 8월 20일 (손 없는 날 · 상생일)', '2026년 9월 29일 (손 없는 날 · 천을귀인일)'].forEach(m => mList.innerHTML += `<li><strong class="text-emerald-400">✅ ${m.split('(')[0]}</strong> (${m.split('(')[1]}</li>`);
            ['2026년 7월 24일 (식신생재 길일)', '2026년 8월 15일 (관인상생 길일)', '2026년 10월 12일 (황금 금여록 길일)'].forEach(b => bList.innerHTML += `<li><strong class="text-amber-400">✅ ${b.split('(')[0]}</strong> (${b.split('(')[1]}</li>`);
            ['2026년 7월 18일 (일지 육합 도화일)', '2026년 8월 8일 (천간합 대길일)', '2026년 11월 20일 (천을귀인 화합일)'].forEach(l => lList.innerHTML += `<li><strong class="text-pink-400">✅ ${l.split('(')[0]}</strong> (${l.split('(')[1]}</li>`);
        }

        // [수정됨] 궁합 연산 및 유효성 검사 완비
        function calculateGunghap() {
            if (!CURRENT_SAJU) {
                alert('먼저 상단의 [사주 분석하기]를 실행하신 후 상대방 정보를 입력해 주세요!');
                return;
            }
            const pYrVal = document.getElementById('partner-year').value;
            const pMoVal = document.getElementById('partner-month').value;
            const pDaVal = document.getElementById('partner-day').value;
            if (!pYrVal || !pMoVal || !pDaVal) {
                alert('상대방(B)의 출생 연도, 월, 일을 모두 선택해 주세요!');
                return;
            }
            const pYear = parseInt(pYrVal), pMonth = parseInt(pMoVal), pDay = parseInt(pDaVal);
            const genderCal = document.getElementById('partner-gender-cal').value.split('_');
            const pGender = genderCal[0], pIsLunar = (genderCal[1] === 'lunar');

            const partnerSaju = calculateManseoryeok(pYear, pMonth, pDay, pIsLunar, false, 12, true);
            const aGanIdx = CURRENT_SAJU.il.ganIdx, aJiIdx = CURRENT_SAJU.il.jiIdx, bGanIdx = partnerSaju.il.ganIdx, bJiIdx = partnerSaju.il.jiIdx;
            const aGan = CHEONGAN[aGanIdx], aJi = JIJI[aJiIdx], bGan = CHEONGAN[bGanIdx], bJi = JIJI[bJiIdx];

            let score = 75, strengths = [], tips = [];
            const ganBadge = document.getElementById('gunghap-gan-badge'); if (ganBadge) ganBadge.textContent = `${aGan.name}(${aGan.oheng}) vs ${bGan.name}(${bGan.oheng})`;
            let ganDesc = '';
            if (Math.abs(aGanIdx - bGanIdx) === 5) { score += 15; ganDesc = `두 사람의 일간이 <strong>천간합(${aGan.name}${bGan.name}합)</strong>으로 묶이는, 손에 꼽는 인연의 짝입니다. 처음 본 순간부터 자석처럼 끌리고, 상대의 빈 곳을 흉이 아니라 채워 줄 자리로 여기게 됩니다.`; strengths.push('천간합 덕분에 삶의 방향과 꿈꾸는 그림이 놀랄 만큼 닮아 있음'); }
            else if (aGan.oheng === bGan.oheng) { score += 5; ganDesc = `오행이 같은 <strong>비화(比和)</strong>의 짝이라, 오랜 벗처럼 스스럼없고 서로를 잘 알아봅니다.`; strengths.push('말이 잘 통하고 노는 물이 비슷해 함께 있으면 시간이 짧게 느껴짐'); tips.push('닮은 만큼 고집도 닮았으니, 기 싸움이 붙으면 먼저 웃어 주는 쪽이 이기는 관계'); }
            else if (OHENG_MAP[aGan.oheng].생 === bGan.oheng) { score += 10; ganDesc = `본인(A)의 기운이 상대(B)를 살리는 상생의 구도라, 아낌없이 주면서도 흐뭇한 다정한 관계입니다.`; strengths.push('상대를 살뜰히 보살피는 데서 기쁨을 느끼는 애정 구도'); }
            else if (OHENG_MAP[bGan.oheng].생 === aGan.oheng) { score += 10; ganDesc = `상대(B)의 기운이 본인(A)을 북돋아 주는 짜임새라, 곁에 있는 것만으로 힘이 되는 복된 궁합입니다.`; strengths.push('상대 곁에 있으면 마음이 놓이고 든든한 뒷배가 되어 줌'); }
            else { score -= 5; ganDesc = `오행이 서로를 누르는 상극의 짝이라 팽팽한 순간도 있지만, 그 다름이 오히려 서로를 깨우는 신선한 자극이 됩니다.`; tips.push('바른말도 포장해서 건네는 화법이 이 관계의 윤활유'); }
            const ganDescEl = document.getElementById('gunghap-gan-desc'); if (ganDescEl) ganDescEl.innerHTML = ganDesc;

            const jiBadge = document.getElementById('gunghap-ji-badge'); if (jiBadge) jiBadge.textContent = `${aJi.name}(${aJi.animal}) vs ${bJi.name}(${bJi.animal})`;
            let jiDesc = '';
            const jiHabPairs = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
            if (jiHabPairs[aJiIdx] === bJiIdx) { score += 15; jiDesc = `일지가 <strong>육합(${aJi.name}${bJi.name}합)</strong>으로 얽혀 살을 맞대고 사는 정이 유난히 깊은 짝입니다. 흰머리가 되도록 함께 걷는 상급 궁합으로 꼽힙니다.`; strengths.push('일지 육합 덕에 살림 감각과 생활 리듬이 착착 맞아떨어짐'); }
            else if (Math.abs(aJiIdx - bJiIdx) === 6) { score -= 10; jiDesc = `일지 상충(${aJi.name}${bJi.name}충)이 걸려 있어 사는 방식과 성미의 결이 다를 수 있습니다. 다만 서로의 영역에 울타리를 쳐 주면 오히려 오래갑니다.`; tips.push('잔소리 반 스푼 줄이고, 각자의 시간을 선물처럼 여겨 줄 것'); }
            else { score += 5; jiDesc = `두 사람의 배우자궁이 모나지 않게 어우러져, 큰 파도 없이 잔잔한 믿음이 오래 이어지는 짝입니다.`; strengths.push('요란하지 않지만 해가 갈수록 두터워지는 믿음'); }
            const jiDescEl = document.getElementById('gunghap-ji-desc'); if (jiDescEl) jiDescEl.innerHTML = jiDesc;
            const yongDescEl = document.getElementById('gunghap-yong-desc'); if (yongDescEl) yongDescEl.innerHTML = `본인(A)에게 모자란 기운을 상대(B)의 원국이 메워 주는 <strong>퍼즐 같은 보완 구조</strong>여서, 함께하는 세월이 길어질수록 살림과 이름이 함께 자라는 시너지형 궁합입니다.`;

            if (score > 100) score = 98; if (score < 60) score = 65;
            const scoreNumEl = document.getElementById('gunghap-score-num'); if (scoreNumEl) scoreNumEl.textContent = `${score}점 / 100점`;
            let stars = '⭐⭐⭐⭐ (귀하게 여겨야 할 좋은 짝)'; if (score >= 90) stars = '⭐⭐⭐⭐⭐ (붉은 실로 이어진 하늘의 짝)'; else if (score <= 75) stars = '⭐⭐⭐ (다듬을수록 빛나는 원석 같은 짝)';
            const scoreStarsEl = document.getElementById('gunghap-score-stars'); if (scoreStarsEl) scoreStarsEl.textContent = stars;
            const summaryDescEl = document.getElementById('gunghap-summary-desc'); if (summaryDescEl) summaryDescEl.textContent = `${CURRENT_SAJU.il.name} 일주 본인과 ${partnerSaju.il.name} 일주 상대방은 감춰진 가능성을 서로 꺼내 주고, 거센 물결도 노를 나눠 저으며 건너갈 귀한 인연으로 읽힙니다. 궁합 점수는 정해진 결말이 아니라 두 사람이 출발하는 지점의 지형도입니다. 점수가 높다면 타고난 순풍을 감사히 쓰시고, 아쉬운 부분이 보였다면 그것은 "이 지점만 서로 조심하면 된다"는 친절한 이정표로 읽으시면 됩니다. 위의 강점은 자주 꺼내 쓰고, 조언은 다툼이 일어나기 전에 미리 나눠 읽어 두는 것, 그것이 궁합 풀이를 백 배로 쓰는 방법입니다. 궁합 점수는 두 원국의 합과 충을 셈한 출발선일 뿐, 인연의 완성도는 결국 서로를 알아 가려는 두 사람의 마음이 결정합니다. 점수가 높다면 타고난 순풍을 감사히 누리시고, 아쉽다면 위의 조언 항목을 두 사람의 대화 주제로 삼아 보세요. 그것이 궁합을 보는 진짜 쓸모입니다.`;

            const strUl = document.getElementById('gunghap-strengths-list'); if (strUl) { strUl.innerHTML = ''; strengths.forEach(s => strUl.innerHTML += `<li>${s}</li>`); }
            const tipUl = document.getElementById('gunghap-tips-list'); if (tipUl) { tipUl.innerHTML = ''; if (tips.length === 0) tips.push('고맙다는 말을 아끼지 않는 것, 그 한마디가 이 인연을 곱절로 깊게 만드는 비결입니다.'); tips.forEach(t => tipUl.innerHTML += `<li>${t}</li>`); }
            const resBox = document.getElementById('gunghap-result-box'); if (resBox) { resBox.classList.remove('hidden'); resBox.scrollIntoView({ behavior: 'smooth' }); }
        }
        // ==========================================
        // ⭐ v6.0 누락 없는 11개 기존 필수 연산 함수 복원 및 탑재 완료
        // ==========================================

        function renderHealthMastery(saju, ilGan) {
            const hMap = {
                '목': { title: '간(肝)·담(膽) 계열 목(木) 체질 · 해독 순환 타입', weak: '피로가 잘 풀리지 않고 눈이 뻑뻑하며, 근육이 굳거나 긴장성 두통이 오기 쉬운 편', food: '매실·모과처럼 신맛 나는 식품과 푸른 잎채소가 이롭고, 걷기나 가벼운 달리기로 하체를 자주 풀어 주세요' },
                '화': { title: '심장(心)·소장(小腸) 계열 화(火) 체질 · 열 조절 타입', weak: '가슴이 잘 두근거리고 잠들기 어려우며, 얼굴에 열이 오르는 등 순환기 부담이 쌓이기 쉬운 편', food: '녹차·여주·팥·연근처럼 은은한 쓴맛 식품이 열을 내려 주며, 잠들기 전 호흡을 고르는 명상이 잘 맞습니다' },
                '토': { title: '비장(脾)·위장(胃) 계열 토(土) 체질 · 소화 대사 타입', weak: '속이 더부룩해지기 쉽고 복부에 살이 붙기 쉬우며, 몸이 쉽게 처지는 편', food: '단호박·마·고구마·찹쌀 같은 순한 단맛 식품과 생강차가 이롭고, 식사 후에는 꼭 가볍게 걸어 주세요' },
                '금': { title: '폐(肺)·대장(大腸) 계열 금(金) 체질 · 호흡 피부 타입', weak: '코와 기관지가 예민하고 피부가 건조해지기 쉬우며, 장 트러블이 잦은 편', food: '도라지·배·무·율무와 따뜻한 꿀물이 잘 맞고, 실내가 마르지 않게 하며 배로 깊게 숨 쉬는 습관을 들여 보세요' },
                '수': { title: '신장(腎)·방광(膀胱) 계열 수(水) 체질 · 수분 대사 타입', weak: '몸이 잘 붓고 허리가 무거우며, 피로가 오래 가고 비뇨기 계통이 약해지기 쉬운 편', food: '검은콩·검은깨·미역 같은 검은빛 식품이 이롭고, 따뜻한 물을 조금씩 자주 마시는 습관이 좋습니다' }
            }[ilGan.oheng] || { title: '오행 중화 건강 체질', weak: '스트레스성 밸런스 유지 필요', food: '골고루 담은 잡곡 위주 식단과 꾸준한 유산소 운동이 두루 이롭습니다' };

            document.getElementById('health-type-title').textContent = hMap.title;
            document.getElementById('health-type-desc').textContent = `전통 한의학의 오행 체질론을 바탕으로, 당신의 일간 오행에 대응하는 장부 계통을 짚어 본 결과입니다. 오행 체질론에서는 타고난 기운이 강한 장부는 과로로 지치기 쉽고, 약한 장부는 평소 티가 나지 않다가 큰 피로가 겹칠 때 먼저 신호를 보낸다고 봅니다. 자신의 관리 포인트를 미리 알아 두면 같은 생활을 해도 컨디션의 낙폭이 눈에 띄게 줄어듭니다. 아래 내용은 참고용 전통 이론이며, 실제 증상이 있을 때는 반드시 의료 전문가와 상담하세요.`;
            document.getElementById('health-weak-desc').textContent = hMap.weak;
            document.getElementById('health-food-desc').textContent = hMap.food;
        }

        function analyzeDream(cat) {
            const dMap = {
                'pig': { title: '🐷 돼지를 안아 들거나 황금빛 배설물을 밟는 꿈', lotto: '재물운 신호 강도: 최상급 길몽', desc: '예로부터 재물이 굴러들어올 때 꾼다고 전해지는 대표 길몽입니다. 뜻밖의 목돈이나 굵직한 계약 소식이 가까이 와 있다는 신호로 풀이됩니다.' },
                'fire': { title: '🔥 집이 활활 타오르거나 용의 등에 올라 하늘로 솟는 꿈', lotto: '재물운 신호 강도: 상급 길몽 (명예 상승)', desc: '집을 태우는 불과 승천하는 용은 모두 세력이 커지는 것을 상징합니다. 지위가 오르거나 하는 일의 판이 한 단계 커질 조짐으로 풀이됩니다.' },
                'water': { title: '🌊 맑은 물이 차오르거나 하늘을 편안히 나는 꿈', lotto: '재물운 신호 강도: 상급 길몽 (순조로움)', desc: '맑고 풍부한 물은 순탄한 흐름을, 편안한 비행은 장애물이 걷힘을 상징합니다. 오래 묶여 있던 일이 술술 풀려나갈 조짐입니다.' },
                'snake': { title: '🐍 탐스러운 과일을 따거나 호랑이·큰 뱀이 집에 드는 꿈', lotto: '재물운 신호 강도: 상급 길몽 (인연·태몽)', desc: '과일과 영물이 품에 드는 꿈은 귀한 인연이 다가옴을 뜻합니다. 태몽으로 보기도 하고, 나를 끌어줄 든든한 조력자의 등장으로도 풀이합니다.' },
                'teeth': { title: '🦷 이가 빠지거나 높은 곳에서 떨어지는 꿈', lotto: '재물운 신호 강도: 주의 필요 (경계몽)', desc: '전통 해몽에서는 몸과 주변을 한 번 돌아보라는 경계의 신호로 읽습니다. 며칠간은 중요한 결정과 계약을 서두르지 말고, 건강과 안전을 먼저 챙겨 보세요.' }
            }[cat];

            document.getElementById('dream-title').textContent = dMap.title;
            document.getElementById('dream-lotto').textContent = dMap.lotto;
            document.getElementById('dream-desc').textContent = dMap.desc;
        }

        function renderPungsuMastery(ilGan) {
            document.getElementById('pungsu-door-desc').textContent = `현관은 바깥의 기운이 집으로 드는 첫 관문입니다. 문 정면의 큰 거울은 들어오던 기운을 되돌려 보내니 옆 벽으로 옮기고, 노르스름한 조명과 해바라기 그림처럼 밝은 기물로 맞이하면 드는 복이 한결 넉넉해집니다. 신발이 어지럽게 쌓여 있으면 드는 기운이 문턱에서 엉키니 신발장 정리가 곧 첫 번째 개운입니다. 계절이 지난 우산이나 택배 상자를 현관에 쌓아 두는 습관도 재물길을 막는 대표적인 사례이니, 현관은 "우리 집의 첫인상"이라 생각하고 늘 훤하게 비워 두세요.`;
            document.getElementById('pungsu-bed-desc').textContent = `침실은 하루의 기운을 다시 채우는 방입니다. 머리맡을 나의 용신 방위(${ilGan.oheng==='목'?'동쪽':ilGan.oheng==='화'?'남쪽':ilGan.oheng==='금'?'서쪽':'북쪽'}) 쪽으로 돌리고 머리맡의 전자기기를 치우면, 잠든 사이 몸의 기운이 절로 고르게 회복됩니다. 침대 위치는 문을 열었을 때 발끝이 문과 일직선이 되는 자리를 피하는 것이 오랜 원칙이고, 머리맡 충전기와 스마트폰은 손이 닿지 않는 협탁 너머로 옮기는 것만으로 수면의 질이 눈에 띄게 달라집니다. 침구는 원국에 이로운 색을 포인트로 쓰되, 전체는 차분한 무채색으로 두어야 기운이 요동치지 않습니다.`;
            document.getElementById('pungsu-desk-desc').textContent = `앉은 자리 등 뒤로는 벽이 산처럼 버텨 주어야 하고(배산임수), 방문이 비스듬히 시야에 들어오는 자리가 마음을 붙들고 위엄을 세워 주는 으뜸의 자리입니다. 등 뒤가 창문이나 통로라면 기운이 흩어지고 집중이 무너지기 쉬우니, 자리를 옮길 수 없다면 등받이 높은 의자나 파티션으로 뒤를 받쳐 주는 것이 차선책입니다. 책상 위는 왼쪽에 자주 쓰는 것, 오른쪽에 서류를 두는 좌실우문(左實右文)의 배치가 일의 흐름을 매끄럽게 하고, 시든 화분과 고장 난 물건은 그날그날 치우는 것이 승진운을 지키는 작은 습관입니다.`;
        }

        function renderSamjaeMastery(saju) {
            // 인·오·술(호랑이,말,개) -> 신·유·술년 삼재 / 신·자·진(원숭이,쥐,용) -> 인·묘·진년 삼재
            // 사·유·축(뱀,닭,소) -> 해·자·축년 삼재 / 해·묘·미(돼지,토끼,양) -> 사·오·미년 삼재
            const jiIdx = saju.nyeon.jiIdx;
            let status = '2026년 병오년 삼재 비해당 (평온한 상생 시운)';
            let desc = `당신의 띠(${JIJI[jiIdx].animal}띠)에게 2026년 병오년은 삼재가 걸리지 않는 해입니다. 세워 둔 계획대로 발걸음을 옮겨도 크게 발목 잡힐 일이 없는 흐름입니다.`;
            
            if ([11, 3, 7].includes(jiIdx)) {
                status = '⚠️ 2026년 병오년 [눌삼재(2년차)] 해당!';
                desc = `당신의 띠(${JIJI[jiIdx].animal}띠)는 2026년 말의 해에 삼재의 한가운데인 눌삼재를 지나는 중입니다. 새 판을 벌이기보다, 가진 것의 담장을 손보며 안을 다지는 것이 이 구간의 지혜입니다.`;
            } else if ([2, 6, 10].includes(jiIdx)) {
                status = '2028년 무신년부터 들삼재가 시작될 예정';
                desc = `지금은 삼재 바깥에 있고, 2028년 원숭이 해가 되어야 들삼재가 시작됩니다. 그전인 올해와 내년이야말로 마음껏 뛰어올라 곳간을 채워 둘 적기입니다.`;
            }

            document.getElementById('samjae-status-title').textContent = status;
            document.getElementById('samjae-status-desc').textContent = desc;
            document.getElementById('samjae-cure-desc').textContent = `삼재를 무턱대고 두려워할 일은 아닙니다. 본디 인생의 방향이 크게 꺾이는 굽잇길일 뿐이어서, 몸을 낮추고 곁을 돌보며 지나면 오히려 복을 실어 오는 복삼재(福三災)로 얼굴을 바꿉니다. 옛사람들이 삼재 기간에 권한 것은 세 가지였습니다. 첫째, 큰 계약과 큰 이동은 두 번 더 살펴보기. 둘째, 몸의 신호를 무시하지 않고 검진 챙기기. 셋째, 형편 닿는 만큼 남에게 베풀기. 이 셋은 미신이라기보다 변화의 시기를 안전하게 건너는 생활의 지혜에 가깝습니다. 삼재를 "조심 알림이 켜진 3년"으로 받아들이면, 같은 기간이 오히려 내실을 다지는 황금기가 됩니다.`;
        }

        function renderCareerMastery(saju, ilGan, wolJi) {
            const cSipsin = getJiSipsin(saju.il.ganIdx, saju.wol.jiIdx);
            document.getElementById('career-pass-desc').innerHTML = `2026년 합격·승진 지수 <strong class="text-emerald-300">89% (대길)</strong>. 올해 병오년의 뜨거운 화(火) 기운이 당신의 일간 ${ilGan.name}(${ilGan.oheng})에 나를 돕는 기운들의 다정하고 이상적인 순환 다리를 놓아 줍니다. 나를 살려주는 반듯한 명예 기운과 다정한 공부복이 서로 어우러져 나를 가장 기분 좋게 응원해 주는 행운의 아름다운 흐름를 말합니다. 시험장에서는 공부한 만큼이 아니라 그 이상이 답안지에 실리고, 인사철에는 평소 지켜보던 윗사람의 눈에 당신의 이름이 먼저 들어옵니다. 특히 상반기보다 <strong>불 기운이 무르익는 5~9월</strong>이 면접·발표·승진 심사의 결정적 승부처이니, 이 시기에 맞춰 준비의 정점을 끌어올리는 전략이 유효합니다. 다만 열기가 강한 해인 만큼 마지막 단계에서 서두르다 서류의 사소한 실수가 나기 쉬우니, 제출 전 한 번 더 검토하는 습관이 89%를 100%로 만드는 마지막 열쇠입니다.`;
            document.getElementById('career-org-desc').innerHTML = `당신의 월지는 <strong class="text-amber-300">${cSipsin}</strong>의 환경입니다. 월지는 사회생활의 무대이자 일하는 방식의 밑그림을 보여 주는 자리인데, 이 짜임새로 보면 당신은 위에서 시키는 대로만 움직이는 자리보다 <strong>스스로 판단할 여지가 있는 자리</strong>에서 몇 배의 성과를 냅니다. 구체적으로는 재량권이 주어지는 대기업의 태스크포스나 신사업 조직, 자격과 실력이 곧 발언권이 되는 전문직 집단, 연차보다 성과로 평가하는 외국계·스타트업 계열이 좋은 무대입니다. 반대로 결재 단계가 많고 전례를 중시하는 경직된 조직에서는 답답함이 쌓여 재능의 절반도 꺼내기 어려우니, 이직을 고민할 때는 연봉 숫자보다 <strong>'내 판단이 통하는 조직인가'</strong>를 첫 번째 저울로 삼으시길 권합니다.`;
            document.getElementById('career-jobs-desc').innerHTML = `일간 ${ilGan.name}(${ilGan.oheng}) 기운과 월지 ${cSipsin} 환경을 함께 놓고 고른 열 갈래입니다. <strong>① IT 서비스 기획 ② 자산 운용·금융 분석 ③ 전문 컨설팅 ④ 국제 무역·유통 ⑤ 브랜드 디렉팅 ⑥ 심리 상담 ⑦ 강의·교육 콘텐츠 ⑧ 프리미엄 세일즈 ⑨ 경영 전략 ⑩ 부동산 개발 기획.</strong> 공통점은 모두 '사람을 읽는 눈'과 '판을 설계하는 머리'가 무기가 되는 일이라는 것입니다. 지금 하는 일이 이 목록에 없다고 조급해할 필요는 없습니다. 현재 업무 안에서도 기획·분석·사람 상대의 비중을 조금씩 늘려 가면, 그것이 곧 천직의 방향으로 배를 돌리는 일이 됩니다.`;
        }

        function renderLuckyNumMastery(ilGan) {
            const numMap = {
                '목': ['3838', '1388', '8383', '3388', '8833', '1138', '3811', '8311', '3088', '8033'],
                '화': ['2727', '3277', '7272', '2277', '7722', '3722', '2733', '7233', '2077', '7022'],
                '토': ['5050', '2500', '0505', '5500', '0055', '2750', '5027', '0527', '5577', '0022'],
                '금': ['4949', '5499', '9494', '4499', '9944', '5944', '4955', '9455', '4099', '9044'],
                '수': ['1616', '4166', '6161', '1166', '6611', '4611', '1644', '6144', '1066', '6011']
            }[ilGan.oheng] || ['7788', '1234', '5678', '8899', '3344', '1122', '9900', '5566', '7700', '8811'];

            const nGrid = document.getElementById('luckynum-grid'); nGrid.innerHTML = '';
            numMap.forEach(num => {
                nGrid.innerHTML += `<div class="p-2.5 rounded-xl bg-mystic-900 border border-emerald-500/40 text-center"><div class="text-base font-serif-kr font-bold text-emerald-300">${num}</div><div class="text-[10px] text-gray-400 mt-0.5">${ilGan.oheng} 기운 상생</div></div>`;
            });
        }

        function analyzeMyNumber() {
            const val = document.getElementById('my-number-input').value.trim();
            if (val.length < 4) { alert('숫자 4자리를 모두 입력해 주세요!'); return; }
            document.getElementById('my-number-result').textContent = `감정 결과: 입력하신 [${val}] 조합을 원국의 기운에 비추어 본 결과, 흐름을 거스르지 않는 길수(88점)로 나왔습니다. 숫자에도 오행이 깃든다고 보는 것이 전통 수리론의 관점인데, 이 조합은 당신의 일간을 거스르는 극(剋)의 숫자가 없이 순한 흐름으로 이어져 있습니다. 전화번호나 차량번호처럼 매일 부르고 쓰는 숫자는 그 자체로 작은 주문과 같아서, 돈복과 사람복을 함께 끌어당기는 쓸 만한 번호로 오래 쓰셔도 좋겠습니다!`;
        }

        function renderPetMastery(saju, ilJi) {
            document.getElementById('pet-match-desc').textContent = `주인의 배우자 자리인 일지(${ilJi.animal})와 삼합/육합을 이루는 [${ilJi.animal==='용'?'쥐·원숭이·닭':ilJi.animal==='말'?'호랑이·개·양':'강아지·고양이'}] 계열의 아이와 마음의 결이 잘 맞습니다. 예로부터 합이 맞는 반려동물은 집안의 궂은 기운을 제 몸으로 받아 내고, 그 자리에 웃음을 놓고 간다고 여겨 왔습니다. 궁합이 잘 맞는 아이는 주인의 기운이 가라앉은 날 유난히 곁을 파고드는데, 그 온기가 실제로 마음의 회복을 앞당깁니다. 이미 함께 사는 아이가 목록의 띠와 다르더라도 걱정하실 필요는 없습니다. 정성으로 맺은 인연은 사주의 합을 넘어서는 가장 강한 합이라는 것이 명리의 오랜 결론입니다.`;
            document.getElementById('pet-naming-desc').textContent = `이름에는 부르는 사람의 기운이 담깁니다. 해피·럭키·코코·콩이·보리·둥이·마루·사랑이처럼 소리가 밝고 온기가 도는 두 글자 이름을 불러 주면, 그 기운이 집안의 재물 흐름까지 부드럽게 데워 줍니다.`;
        }

        function renderPastlifeMastery(saju, ilJi) {
            document.getElementById('pastlife-title').textContent = `책과 붓을 벗 삼아 도리를 궁구하던 선비·수행자의 혼`;
            document.getElementById('pastlife-desc').textContent = `원국 곳곳에 지난 생에서 글을 닦고 깨달음을 나누던 이의 기운이 배어 있는 것으로 읽힙니다. 이번 생에 주어진 과제는 하나입니다. 타고난 총기와 재주를 나 하나 배 불리는 데 가두지 말고 세상으로 흘려보내는 것. 그 물꼬가 트일 때 하는 일마다 순풍이 붙는 큰 복이 따라옵니다.`;
        }

        // ==========================================
        // 성명학 작명·개명 마스터
        // ==========================================
        function analyzeNaming() {
            if (!CURRENT_SAJU) return;
            const sung = escapeHtml(document.getElementById('name-sung').value || '김'), given = escapeHtml(document.getElementById('name-given').value || '지훈'), fullName = `${sung}${given}`;
            const getSoundOheng = (char) => {
                const code = char.charCodeAt(0) - 44032; if (code < 0 || code > 11171) return '금';
                const choIdx = Math.floor(code / 588);
                if ([0, 15].includes(choIdx)) return '목'; if ([2, 3, 5, 16].includes(choIdx)) return '화'; if ([11, 18].includes(choIdx)) return '토'; if ([7, 9, 12, 13, 14].includes(choIdx)) return '금'; return '수';
            };
            const ohengs = fullName.split('').map(getSoundOheng), yongOhengStr = document.getElementById('yongsin-oheng').textContent;
            let score = 88; if (yongOhengStr.includes(ohengs[1]) || yongOhengStr.includes(ohengs[2])) score += 8; else score += 3;
            document.getElementById('naming-score-num').textContent = `${score}점 / 100점`;
            document.getElementById('naming-score-stars').textContent = score >= 90 ? '⭐⭐⭐⭐⭐ (원국의 빈 기운을 채워 주는 길한 이름)' : '⭐⭐⭐⭐ (소리의 오행이 순하게 흐르는 이름)';
            document.getElementById('naming-summary-desc').textContent = `입력하신 성함 [${fullName}]을 소리 나는 대로 오행에 얹어 보면(${ohengs.join(' → ')}) 글자와 글자가 서로를 살리는 상생의 물길을 이루고, 원국에 필요한 용신의 기운까지 끌어와 주는 좋은 이름입니다.`;
            document.getElementById('naming-sound-analysis').innerHTML = `<p>· <strong>초성 발음 오행</strong>: ${fullName.split('').map((c, i) => `${c}(${ohengs[i]})`).join(' → ')} 순서로 기운이 순하게 흐름</p><p>· <strong>사주 용신 조화도</strong>: 원국에 모자란 오행을 이름의 소리가 메워 주니, 불러 줄수록 사람복이 붙는 구조입니다.</p>`;
            document.getElementById('naming-advice-desc').innerHTML = `<p>· <strong>작명 및 개운 팁</strong>: 호적에 올릴 한자를 고르실 때 아래의 <strong>[사주 맞춤 용신 한자]</strong> 가운데에서 뜻과 획수를 살펴 정하시면, 소리와 글자가 모두 원국을 돕는 온전한 이름이 완성됩니다.</p>`;

            const hanjaGrid = document.getElementById('naming-hanja-grid'); hanjaGrid.innerHTML = '';
            const yongKey = yongOhengStr.includes('목') ? '목' : yongOhengStr.includes('화') ? '화' : yongOhengStr.includes('토') ? '토' : yongOhengStr.includes('금') ? '금' : '수';
            document.getElementById('naming-yongsin-label').textContent = `${yongKey} 기운`;
            const hanjaPool = {
                '목': [{ h: '根', k: '근(뿌리)' }, { h: '林', k: '림(수풀)' }, { h: '榮', k: '영(영화)' }, { h: '彬', k: '빈(빛날)' }, { h: '杰', k: '걸(뛰어날)' }, { h: '棟', k: '동(마루)' }, { h: '森', k: '삼(나무)' }, { h: '楨', k: '정(기둥)' }, { h: '桂', k: '계(계수)' }, { h: '權', k: '권(권세)' }, { h: '相', k: '상(도울)' }, { h: '松', k: '송(소나무)' }, { h: '栢', k: '백(잣나무)' }, { h: '梓', k: '재(가래)' }, { h: '槿', k: '근(무궁화)' }],
                '화': [{ h: '䏚', k: '도(빛날)' }, { h: '炫', k: '현(밝을)' }, { h: '昭', k: '소(밝을)' }, { h: '旼', k: '민(온화할)' }, { h: '昱', k: '욱(빛날)' }, { h: '㬚', k: '철(밝을)' }, { h: '暎', k: '영(비칠)' }, { h: '煥', k: '환(불꽃)' }, { h: '燁', k: '엽(빛날)' }, { h: '熹', k: '희(빛날)' }, { h: '熺', k: '희(성할)' }, { h: '昇', k: '승(오를)' }, { h: '晳', k: '석(밝을)' }, { h: '景', k: '경(볕)' }, { h: '晶', k: '경(밝을)' }],
                '토': [{ h: '圭', k: '규(서옥)' }, { h: '均', k: '균(고를)' }, { h: '堅', k: '견(굳을)' }, { h: '坤', k: '곤(땅)' }, { h: '垣', k: '원(담)' }, { h: '城', k: '성(재)' }, { h: '基', k: '기(터)' }, { h: '培', k: '배(북돋울)' }, { h: '載', k: '재(실을)' }, { h: '聖', k: '성(성인)' }, { h: '埈', k: '준(높을)' }, { h: '在', k: '재(있을)' }, { h: '垠', k: '은(언덕)' }, { h: '塏', k: '개(높을)' }, { h: '墸', k: '저(쌓을)' }],
                '금': [{ h: '鐘', k: '종(쇠종)' }, { h: '鉉', k: '현(솥귀)' }, { h: '鈞', k: '균(주석)' }, { h: '銳', k: '예(날카로울)' }, { h: '鎭', k: '진(진압할)' }, { h: '鎔', k: '용(녹일)' }, { h: '錫', k: '석(주석)' }, { h: '錦', k: '금(비단)' }, { h: '鍊', k: '련(단련할)' }, { h: '鍈', k: '영(방울)' }, { h: '鎰', k: '일(쇠)' }, { h: '鏡', k: '경(거울)' }, { h: '成', k: '성(이룰)' }, { h: '星', k: '성(별)' }, { h: '誠', k: '성(성실)' }],
                '수': [{ h: '浩', k: '호(넓을)' }, { h: '澔', k: '호(클)' }, { h: '淳', k: '준(순할)' }, { h: '源', k: '원(근원)' }, { h: '準', k: '준(법도)' }, { h: '瀚', k: '한(넓을)' }, { h: '澤', k: '택(못)' }, { h: '潤', k: '윤(윤택)' }, { h: '澄', k: '징(맑을)' }, { h: '澈', k: '철(맑을)' }, { h: '淵', k: '연(못)' }, { h: '鴻', k: '홍(클)' }, { h: '泓', k: '홍(깊을)' }, { h: '洛', k: '락(강물)' }, { h: '洙', k: '수(물가)' }]
            };
            (hanjaPool[yongKey] || hanjaPool['목']).forEach(item => { hanjaGrid.innerHTML += `<div class="p-2.5 rounded-xl bg-mystic-900 border border-cyan-500/40 text-center"><div class="text-xl font-serif-kr font-bold text-cyan-300">${item.h}</div><div class="text-xs text-gray-300 mt-0.5">${item.k}</div></div>`; });
            document.getElementById('naming-result-box').classList.remove('hidden');
        }

        // ==========================================
        // 배우자상 상세 프로필 & 적령기
        // ==========================================
        function renderSpouseProfile(saju, ilGan, ilJi) {
            const jiSipsin = getJiSipsin(saju.il.ganIdx, saju.il.jiIdx);
            let ageLook = '동갑이나 1~3살 차이 / 단정함', lookDesc = `배우자 자리인 일지(${ilJi.name})의 기운이 차분히 자리 잡아, 부드러운 인상에 속이 깊은 짝과 연이 닿습니다. 겉으로 요란하게 다가오는 인연보다 어느새 곁에 스며들어 있는 인연이 진짜일 확률이 높은 구조입니다. 소개팅 한 번의 첫인상으로 판단을 끝내지 말고 두세 번은 만나 보세요. 이 배우자궁은 볼수록 좋아지는 사람과 맺어지는 자리입니다.`, job = '공직, 교육, 관리직', jobDesc = `맡은 바를 끝까지 해내는, 직업이 반듯한 짝을 만나게 됩니다. 배우자궁에 든 관성(나를 든든하게 지켜주는 반듯한 신뢰)의 기운은 공직·대기업·전문직처럼 이름 앞에 소속이 붙는 직업군과의 인연을 강하게 암시합니다. 화려함보다 묵직함으로 다가오는 사람이니, 첫인상이 심심하다고 흘려보내지 마세요. 오래 볼수록 진가가 드러나는 유형입니다.`;
            if (jiSipsin.includes('상') || jiSipsin.includes('식')) { ageLook = '연하 또는 감각적인 동갑 / 미남미녀'; lookDesc = `말과 표정이 살아 있고 꾸밈새의 감각이 남다른 짝을 맞이합니다. 배우자궁의 식상(재능과 넘치는 다정한 끼) 기운은 표현하고 만들어 내는 사람, 곧 말·음식·예술·콘텐츠를 다루는 이와의 인연을 가리킵니다. 함께 있으면 웃을 일이 많은 관계가 되지만, 상대의 자유로운 기질을 틀에 가두려 하면 어긋나기 쉬우니 응원하는 자세가 이 인연을 오래 지키는 비결입니다.`; job = '방송/연예, 디자인, IT'; }
            else if (jiSipsin.includes('재')) { ageLook = '능력 있는 동갑/연하 / 활력 넘침'; lookDesc = `살림 수완이 야무지고 어디서든 사람을 얻는 실속 있는 짝과 연분이 깊습니다. 배우자궁의 재성(실속 있는 재물 감각과 생활력) 기운은 경제 감각이 밝고 현실의 무게를 아는 사람과의 만남을 뜻합니다. 함께라면 살림이 불어나는 재미가 있는 조합이지만, 돈 문제만큼은 처음부터 투명하게 터놓는 것이 이 인연의 신뢰를 지키는 첫 단추입니다.`; job = '금융, 무역, 사업 경영'; }
            else if (jiSipsin.includes('관')) { ageLook = '듬직한 연상/성숙한 동갑 / 위엄'; lookDesc = `기대어 쉴 수 있고 우러러볼 구석이 있는, 중심이 굳은 짝을 만납니다. 배우자궁의 인성(지혜롭고 생각이 깊은 공부와 지성) 기운은 지혜롭고 어른스러운 사람, 나이나 정신적 성숙도에서 나를 이끌어 주는 이와의 인연을 가리킵니다. 위기 때 함께 흔들리는 것이 아니라 나를 붙들어 주는 닻 같은 존재이니, 연애의 설렘 지수보다 대화의 깊이로 상대를 가늠해 보세요.`; job = '공직, 법조, 전문직, CEO'; }
            document.getElementById('spouse-age-look').textContent = ageLook; document.getElementById('spouse-look-desc').textContent = lookDesc; document.getElementById('spouse-job').textContent = job; document.getElementById('spouse-job-desc').textContent = jobDesc;
            document.getElementById('spouse-timing').textContent = `만 ${saju.gender === 'M' ? '30~34' : '29~33'}세 구간`; document.getElementById('spouse-timing-desc').textContent = `배우자의 별이 들어오거나 일지에 육합이 걸리는 해가 혼담을 매듭짓기 좋은 때입니다. 명리에서 결혼 시기는 "인연이 없던 사람이 생기는 때"라기보다 "곁에 있던 인연이 무르익는 때"로 봅니다. 그러니 좋은 시기가 왔을 때 주저하지 않도록, 평소 자신이 어떤 동반자와 어떤 가정을 원하는지 미리 그려 두는 것이 그 운을 놓치지 않는 실전 준비입니다.`;
            document.getElementById('spouse-prob').textContent = `올해 2026년 만남 확률 92%`; document.getElementById('spouse-prob-desc').textContent = `병오년의 뜨거운 기운이 당신의 원국과 어울려, 마음을 움직이는 인연이 성큼 다가서는 해입니다. 확률이 높다는 것은 가만히 있어도 이루어진다는 뜻이 아니라, 같은 노력에 몇 배의 결실이 붙는 해라는 뜻입니다. 소개팅·모임·동호회처럼 사람이 모이는 자리에 평소보다 한 걸음만 더 나가 보세요. 올해의 운은 움직이는 사람의 편입니다.`;
        }

        // ==========================================
        // 자녀복 & 자녀 사주 미리보기
        // ==========================================
        function renderChildMastery(saju, ilGan, ilJi) {
            let bTitle = '부모 품을 밝히며 귀하게 크는 아이의 복', bDesc = `자녀 자리가 튼실해 아이가 부모의 마음을 잘 헤아리며, 자라서는 제 이름으로 우뚝 서는 상입니다.`, talent = `아이는 제 생각이 또렷하고 번뜩이는 발상을 지닌 씨앗을 품고 태어납니다. 어릴 때부터 "왜?"라는 질문이 많고 정해진 답보다 자기만의 답을 찾으려는 기질이 보일 텐데, 이는 고집이 아니라 재능의 싹입니다. 부모가 답을 정해 주기보다 스스로 답에 닿는 길을 지켜봐 줄 때 가장 크게 자라는 아이입니다.`, edu = `고르는 재미를 아이 몫으로 남겨 줄 때, 감춰진 재능이 몇 곱절로 피어납니다. 학원을 하나 정할 때도, 옷 한 벌을 살 때도 두세 가지 선택지 안에서 아이가 최종 결정을 내리게 해 보세요. 작은 선택의 경험이 쌓여 큰 결정을 두려워하지 않는 어른으로 자랍니다. 이 사주의 아이에게 최고의 교육은 정답을 가르치는 것이 아니라 선택하는 근육을 길러 주는 것입니다.`;
            if (saju.si) {
                const siS = getSipsin(saju.il.ganIdx, CHEONGAN[saju.si.ganIdx].oheng, saju.si.ganIdx % 2 === 0);
                if (siS.includes('관')) { bTitle = '반듯한 길에서 이름을 세우는 아이'; bDesc = `시주에 자리한 관성(책임감과 반듯한 의리)으로 미루어 보면, 아이는 맡은 일의 무게를 아는 성품으로 자라 사람들 앞에 서는 자리로 나아가는 상입니다.`; }
                else if (siS.includes('식') || siS.includes('상')) { bTitle = '끼와 손재주로 제 밥그릇을 빚어내는 아이'; bDesc = `표현하고 만들어 내는 기운이 강해, 예술적 재주와 번뜩이는 발상이 훗날 넉넉한 살림의 밑천이 되는 상입니다.`; }
            }
            document.getElementById('child-bless-title').textContent = bTitle; document.getElementById('child-bless-desc').textContent = bDesc; document.getElementById('child-talent-desc').textContent = talent; document.getElementById('child-edu-desc').textContent = edu;
        }

        // ==========================================
        // 역사 속 위인 비교 & 명언
        // ==========================================
        function renderCelebrityMatch(saju, ilGan, wolJi) {
            const matches = {
                '목': { name: '세종대왕 · 이순신 장군 유형의 곧은 기상 👑', desc: '목(木) 기운이 강한 인물들에게 흔히 이야기되는 상징으로, 흔들림 없는 신념과 어진 마음으로 사람을 살리는 길을 택하는 기질을 뜻합니다.' },
                '화': { name: '개척가 유형의 불꽃 리더십 🔥', desc: '화(火) 기운의 상징은 세상에 없던 길을 먼저 내는 개척자입니다. 안 된다는 말 앞에서 오히려 타오르며 판 자체를 바꿔 버리는 기질을 뜻합니다.' },
                '토': { name: '제갈량 유형의 듬직한 지략가 🏔️', desc: '토(土) 기운의 상징은 대지처럼 사람을 품는 지략가입니다. 갈라진 이들을 한자리에 모으고, 멀리 내다보는 수읽기로 판을 안정시키는 그릇을 뜻합니다.' },
                '금': { name: '승부사 유형의 강철 결단력 ⚔️', desc: '금(金) 기운의 상징은 원칙의 승부사입니다. 한번 세운 기준은 끝까지 지키고, 물러설 수 없는 순간에 가장 단호해지는 기질을 뜻합니다.' },
                '수': { name: '현인 유형의 바다 같은 지혜 🌊', desc: '수(水) 기운의 상징은 깊은 물속을 들여다보는 현인입니다. 겉으로 드러난 것 너머의 흐름을 읽고, 서두르지 않고 때를 기다릴 줄 아는 기질을 뜻합니다.' }
            }[ilGan.oheng] || { name: '세종대왕의 덕망과 성군의 기상 👑', desc: '부드러움과 단단함을 한 몸에 지닌 넉넉한 그릇으로 읽힙니다.' };
            document.getElementById('celeb-match-name').textContent = matches.name; document.getElementById('celeb-match-desc').textContent = matches.desc;
            const qGrid = document.getElementById('celeb-quotes-grid'); qGrid.innerHTML = '';
            [{ q: "사주는 정해진 결말이 아니라 손에 쥔 나침반이다. 방향을 읽는 자만이 바람을 탄다.", a: "명리 잠언" }, { q: "큰 그릇은 시련이라는 가마 속에서 구워진다. 지금의 뜨거움은 완성의 과정이다.", a: "명리 잠언" }, { q: "내 기질을 알면 조급함이 사라지고, 때를 알면 두려움이 사라진다.", a: "명리 잠언" }].forEach(item => {
                qGrid.innerHTML += `<div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"><p class="text-xs sm:text-sm text-gray-200 font-serif-kr italic">"${item.q}"</p><span class="text-[11px] font-bold text-purple-400 block text-right">- ${item.a} -</span></div>`;
            });
        }
    


// ==========================================================================
// [수정됨] 종합 운세 놀이터 및 사이드바 제어 엔진 (타로, 띠별, 별자리, 혈액형, MBTI, 탄생화)
// ==========================================================================

let TAROT_DECK = [];
let ACTIVE_TAROT_CARD_ID = null;

function switchPlazaTab(tabId) {
    document.querySelectorAll('.plaza-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(tabId);
    if (target) target.classList.remove('hidden');

    const tabIds = ['plaza-tarot', 'plaza-zodiac', 'plaza-mbti', 'plaza-birth', 'plaza-pastlife-game'];
    tabIds.forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) {
            if (t === tabId) {
                btn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-500 text-white shadow-lg transition whitespace-nowrap transform scale-105 border border-purple-400";
            } else {
                btn.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-300 hover:bg-white/5 border border-white/10 transition whitespace-nowrap";
            }
        }
    });
}

const TAROT_CARDS_DATA = [
    { id: 0, name: "바보 (The Fool)", emoji: "🃏", keyword: "새로운 시작, 모험, 가능성", 
      total: "오늘은 정해진 틀을 깨고 새로운 마음으로 첫발을 내딛기에 가장 좋은 날입니다! 비록 앞길이 명확히 보이지 않더라도 당신만의 긍정적인 기상과 용기가 있다면 우주가 당신을 수호할 것입니다. 망설이던 일이 있었다면 오늘 가볍게 시작해보세요.",
      love: "연인과 아주 신선하고 새로운 설렘을 만끽하는 날입니다. 짝사랑 중이라면 계산 없이 순수하게 다가설 때 상대의 마음 문이 예쁘게 열립니다.",
      money: "지금 당장 눈앞의 확실한 이익보다는, 장기적으로 무한히 성장할 수 있는 새로운 공부나 비즈니스 제안에 아낌없이 투자하기에 유리한 운입니다." },
    { id: 1, name: "마술사 (The Magician)", emoji: "🪄", keyword: "능력 발휘, 주도력, 창조", 
      total: "당신 안에 감춰진 무한한 재능과 말재주, 번뜩이는 영감을 세상에 화려하게 드러내는 날입니다! 오늘은 당신이 판을 직접 기획하고 끌고 가기에 최적의 기운이 돕고 있으니, 자신감 있게 사람들을 리드하고 지시해보세요. 당신의 말 한마디가 마법처럼 실현됩니다.",
      love: "자신의 매력이 최고조에 달하여 호감도가 급상승하는 날입니다. 상대방에게 다정한 유머와 세련된 태도로 매력을 뽐내보세요.",
      money: "기발한 기획안이나 창의적인 아이디어가 돈으로 직결되는 똑똑한 재물운입니다. 자신의 기술을 당당히 세일즈하십시오." },
    { id: 2, name: "여사제 (The High Priestess)", emoji: "📖", keyword: "통찰력, 학문, 직관", 
      total: "정서가 조용히 가라앉으며 사물과 사람의 진실을 깊이 내다보는 날입니다. 쓸데없는 소음에 휩쓸리지 않고 차분히 공부를 하거나 고독한 내실을 다질 때 최고의 성과를 얻습니다. 오늘은 당신의 직관과 판단력이 100% 명중하는 날입니다.",
      love: "서두르는 사랑은 오히려 관계를 정체시킵니다. 차분히 상대의 이야기를 경청해주고 신비로운 거리를 유지할 때 매력이 도드라집니다.",
      money: "충동적인 투자나 가벼운 쇼핑은 절대 금물입니다! 꼼꼼하게 장부를 점검하고 지갑을 무겁게 단속하여 알짜 실속을 가꾸어 가세요." },
    { id: 3, name: "여황제 (The Empress)", emoji: "👑", keyword: "풍요, 모성애, 정서적 만족", 
      total: "온 세상의 따뜻한 풍요로움과 축복이 당신의 품으로 풍성하게 들어오는 최고의 하루입니다! 육체적으로도 정서적으로도 한없이 편안해지고, 주변 사람들에게 다정함과 맛있는 음식을 아낌없이 대접하는 넉넉한 덕망이 생기는 길한 기운입니다.",
      love: "세상에서 가장 다정하고 안정적인 애정이 가득 넘칩니다. 서로를 향한 배려와 신뢰가 튼튼해져 결혼이나 깊은 약속을 나누기 좋습니다.",
      money: "선천적인 금전운이 아주 부드럽게 상승하는 날입니다. 나를 가꾸는 품격 있는 쇼핑이나 미용에 기분 좋게 소비하셔도 대길합니다." },
    { id: 4, name: "황제 (The Emperor)", emoji: "🏛️", keyword: "안정, 권위, 책임감", 
      total: "당신의 사회적 입지와 지위가 튼튼한 성벽처럼 반듯하게 서는 든든한 날입니다! 직장이나 가정에서 나의 권위와 리더십을 모두가 인정하게 되며, 우직한 책임감을 가지고 어려운 난관을 뚝심 있게 지휘해 낼 수 있는 힘이 샘솟습니다.",
      love: "연애에 있어서 가벼운 밀당보다는 우직하고 책임감 있는 모습을 보여줄 때 점수가 아주 높습니다. 약속은 반드시 지키세요.",
      money: "크게 흔들리지 않는 튼튼하고 안정적인 자산 포트폴리오를 구성하기 좋습니다. 실용적이고 확실한 명의 취득에 행운이 따릅니다." },
    { id: 5, name: "교황 (The Hierophant)", emoji: "🔔", keyword: "중재, 멘토, 합의", 
      total: "갈등이 있던 자리에 따뜻한 화해의 손길이 오가며, 인생의 든든한 귀인이 나타나 값진 조언과 후원을 선사하는 온화한 하루입니다. 시험 공부, 면접, 직장인 간의 중재 합의서 작성이나 중요 계약을 도장 찍기에 매우 길한 기상입니다.",
      love: "서로 다른 가치관으로 다투던 커플이라면 오늘 어른스러운 멘토의 도움이나 솔직한 대화를 통해 오해를 눈 녹듯 해결할 수 있습니다.",
      money: "조건 없이 나를 지지하고 투자해 주는 스폰서나 귀인의 운이 열립니다. 배움과 자격증 취득에 지출하는 것은 대길합니다." },
    { id: 6, name: "연인 (The Lovers)", emoji: "💞", keyword: "사랑, 완벽한 조화, 선택", 
      total: "나를 알아주는 다정한 동반자와 눈빛만 보아도 통하는 최고의 소통과 인복이 가득한 기분 좋은 날입니다! 오늘 하루는 발걸음이 한없이 가볍고 상쾌하며, 누구와 협업해도 최고의 호흡과 만족스러운 찬사를 받아낼 수 있습니다.",
      love: "연애운의 종결판입니다! 솔로는 매력적인 이상형과 짜릿한 인연이 닿고, 커플은 깊은 신뢰를 재확인하며 데이트가 참 행복합니다.",
      money: "사람과의 돈독한 유대관계가 곧바로 이익이 되어 돌아오는 동업 계약운입니다. 사람을 얻는 것이 최고의 재물이 됩니다." },
    { id: 7, name: "전차 (The Chariot)", emoji: "🛡️", keyword: "추진력, 돌파, 승리", 
      total: "망설임은 끝났습니다! 거친 폭풍우를 뚫고 맹렬히 달리는 전차처럼 압도적인 실행력과 승부욕으로 목표를 쟁취하는 에너제틱한 날입니다. 오늘만큼은 타인의 시선에 연연하지 말고 과감하게 기획안을 밀어붙이세요. 승리는 당신의 몫입니다.",
      love: "좋아하는 이성이 있다면 질질 끌지 말고 오늘 우직하고 거침없이 직진 고백해 보세요! 상대의 심장을 흔들 수 있는 기회입니다.",
      money: "정체되어 있던 비즈니스 거래나 수금 관련 업무가 엄청난 추진력으로 한 방에 해결되는 역동적 재물 회수 운입니다." },
    { id: 10, name: "운명의 수레바퀴 (Wheel of Fortune)", emoji: "🎡", keyword: "터닝포인트, 뜻밖의 기회, 행운", 
      total: "정체되어 있던 인생의 기류가 드디어 순풍으로 180도 바뀌어 위로 도약하는 짜릿한 터닝포인트의 날입니다! 오늘 일어나는 뜻밖의 만남이나 우연한 연락, 스치듯 지나가는 직관은 당신의 앞길을 개척해 줄 하늘의 보이지 않는 선물이니 절대로 놓치지 마세요.",
      love: "우연한 길거리 스침이나 동호회 모임에서 평생의 든든한 운명적 인연을 운명처럼 만날 확률이 매우 높은 길한 날입니다.",
      money: "생각지 못했던 보너스, 환급금, 또는 잠자고 있던 휴면 자산이 내 지갑으로 쏙 들어오는 놀라운 횡재수가 열립니다." },
    { id: 19, name: "태양 (The Sun)", emoji: "☀️", keyword: "밝은 성공, 축하, 에너지 충만", 
      total: "온 우주의 따스하고 찬란한 햇살이 오직 당신만을 정면으로 비춰 만인의 박수와 축하를 받는 최고의 행운일입니다! 가만히 있어도 내 단점은 가려지고 장점만이 돋보이며, 나를 시기하던 사람들조차 내 순수하고 밝은 에너지 앞에 무장해제되는 멋진 기류입니다.",
      love: "아이처럼 맑고 순수하며 세상에서 가장 유쾌한 사랑이 가득 꽃피는 하루입니다. 커플은 야외 소풍 데이트를 강력히 권장합니다.",
      money: "내 가치와 명예가 동반 상승하여 연봉 협상, 고부가가치 비즈니스 낙찰, 소중한 자산의 대성공을 알리는 화려한 대길운입니다." },
    { id: 21, name: "세계 (The World)", emoji: "🗺️", keyword: "완벽한 마무리, 유종의 미, 통합", 
      total: "그동안 성실하게 공들여 왔던 기나긴 프로젝트나 마음고생이 마침내 가장 완벽하고 아름다운 유종의 미를 거두며 일단락되는 완성의 날입니다! 마음이 큰 산처럼 든든해지고, 내 능력이 마침내 완벽한 마스터 궤도에 올랐음을 온 천하에 입증하게 됩니다.",
      love: "오랜 연애 끝에 결혼을 발표하거나, 서로의 인생에서 대체 불가능한 소중한 짝임을 서로 완벽하게 확신하게 되는 행복입니다.",
      money: "더 이상 불필요한 지출이 완전히 통제되고 안정적인 고수익 구조가 성공적으로 안착하는 반듯한 재무의 완성일입니다." }
];

const ZODIAC_ANIMAL_DATA = {
    "쥐": { emoji: "🐭", name: "쥐띠", desc: "생각이 샘솟고 지혜로운 옹달샘 같은 날입니다. 오늘은 남과 다투기보다는 한 걸음 양보할 때 뜻밖의 큰 인덕과 귀중한 문서운이 들어올 기상이니 넓은 도량을 가져보세요. 행운의 색은 남색이며, 오후 2시~4시 사이에 기분 좋은 연락이 닿습니다." },
    "소": { emoji: "🐮", name: "소띠", desc: "황소처럼 우직한 끈기가 마침내 주위의 엄청난 극찬과 실속 있는 금전적 보상으로 보답받는 알짜배기 대길일입니다! 요령 피우지 않고 묵묵히 내실을 다져온 행동 하나가 인생의 든든한 주춧돌이 되어 줄 것입니다. 행운의 방향은 동쪽입니다." },
    "호랑이": { emoji: "🐯", name: "호랑이띠", desc: "용맹하고 당당하며 새로운 도전을 반기는 새벽녘의 호랑이입니다. 당찬 추진력과 기획력이 좋아 남 밑에서 일하기보다는 독자적인 사업에 적합합니다. 행운의 숫자는 3과 8입니다." },
    "토끼": { emoji: "🐰", name: "토끼띠", desc: "나의 예술적 감수성과 다정한 눈치가 주변 대인관계를 한없이 따뜻하게 정화해 주는 날입니다. 다정한 말솜씨 덕에 막혔던 계약이 수월하게 성립되고 뜻밖의 식복이 따르는 편안한 하루가 예약되어 있습니다. 행운의 색은 초록색입니다." },
    "용": { emoji: "🐲", name: "용띠", desc: "여의주를 입에 문 청룡처럼 거대하고 멋진 기상과 아이디어가 머릿속에서 화려하게 폭발하는 영웅의 날입니다! 소심하게 웅크려 있지 말고 넓은 무대에서 당신의 실력을 사포처럼 날카롭게 세팅하여 세일즈하십시오. 행운의 색은 금색입니다." },
    "뱀": { emoji: "🐍", name: "뱀띠", desc: "비상한 두뇌 회전과 기가 막힌 임기응변으로 까다로운 골칫거리나 기계 결함 오류를 단박에 정리해 내는 구원 투수의 하루입니다. 사람들의 복잡한 심리를 꿰뚫어 보는 눈이 발달하니 상담 업무에 대길합니다. 행운의 시간은 오전 9시~11시입니다." },
    "말": { emoji: "🐴", name: "말띠", desc: "초원을 거침없이 달리는 야생마처럼 기분이 활달해지고 표현력이 대폭발하는 날입니다. 감정을 숨기지 말고 정직하게 표현할 때 인기가 급상승하며 모두가 당신의 매력에 푹 빠져들게 됩니다. 행운의 소품은 세련된 시계나 장신구입니다." },
    "양": { emoji: "🐑", name: "양띠", desc: "초원 위의 순하고 우직한 양처럼 온정이 넘쳐나니 주변에 힘든 사람을 챙겨주는 큰 배려가 빛나는 날입니다. 우직하게 의리를 지킨 덕분에 훗날 나를 평생 도울 든든한 귀인의 인연을 맺게 됩니다. 행운의 방향은 남서쪽입니다." },
    "원숭이": { emoji: "🐵", name: "원숭이띠", desc: "천재적인 말재주와 손재주로 불가능해 보였던 까다로운 협상을 멋지게 낙찰 시켜 버리는 비즈니스의 왕 날입니다! 임기응변이 최고조에 달하니 적극적으로 대외 미팅을 주선해 보세요. 행운의 숫자는 4와 9입니다." },
    "닭": { emoji: "🐔", name: "닭띠", desc: "깔끔하고 세련된 미적 센스와 보석같이 날카로운 집중력이 돋보이는 대길일입니다. 밀린 문서를 정교하게 완성하고 오타를 수정하기 최고의 날이며 나를 돋보이게 하는 단정한 옷차림이 큰 계약운을 부릅니다. 행운의 색은 은색입니다." },
    "개": { emoji: "🐶", name: "개띠", desc: "약자를 배려하고 충직하게 책임을 다하니 사방에서 무거운 신뢰감이 눈덩이처럼 불어나는 보람찬 하루입니다. 성실히 내 역할을 다하면 뜻밖의 상사 추천이나 기분 좋은 소식이 문을 두드리게 됩니다. 행운의 방향은 서북쪽입니다." },
    "돼지": { emoji: "🐷", name: "돼지띠", desc: "드넓은 바다처럼 마음이 넉넉해지고 모든 사소한 갈등을 다정하게 흘려보내는 여유로운 평화의 날입니다. 먹을 복이 가득하여 좋은 사람들과 맛있는 점심 식사를 나누며 소중한 정보와 돈줄이 오갑니다. 행운의 숫자는 1과 6입니다." }
};

const ASTROLOGY_DATA = {
    "양자리": { emoji: "♈", desc: "내 안의 뜨거운 개척 정신과 용기가 불을 뿜는 활기찬 하루입니다! 남들이 불가능하다고 했던 분야에 과감히 첫발을 떼면 하늘이 돕는 기운입니다. 행운의 도구는 가벼운 운동화입니다." },
    "황소자리": { emoji: "♉", desc: "묵묵히 나의 실속과 지갑 자산을 안정적으로 기획하고 정돈하기 가장 훌륭한 날입니다. 차분한 태도를 유지할 때 금전적 보상이 따라오니 차분함을 선물해 보세요. 행운의 색은 베이지색입니다." },
    "쌍둥이자리": { emoji: "♊", desc: "재치 넘치는 입담과 트렌디한 정보 감각으로 카톡방과 미팅 테이블의 주인공이 되는 날입니다! 오늘 나누는 다정한 대화 속에 귀중한 성공의 힌트가 들어 있습니다. 행운의 숫자는 5입니다." },
    "게자리": { emoji: "♋", desc: "정서가 포근하게 안정되며 가족이나 오랜 친구들과 따뜻한 홈파티나 정다운 통화를 나누기 좋은 날입니다. 내면의 에너지를 충전할 때 발복이 배가됩니다. 행운의 음식은 달콤한 과일 디저트입니다." },
    "사자자리": { emoji: "♌", desc: "당당한 태도와 감출 수 없는 스타성으로 사방의 스포트라이트를 한 몸에 받는 매력 가득한 날입니다! 회의나 모임에서 주도적으로 의견을 발표하면 박수가 쏟아집니다. 행운의 색은 주황색입니다." },
    "처녀자리": { emoji: "♍", desc: "고도의 정밀한 분석력과 꼼꼼한 마무리가 일품이니 업무의 완성도가 신급으로 올라가는 하루입니다. 밀린 계획표를 짜고 청소를 하면 기운이 맑게 순환합니다. 행운의 물건은 다이어리입니다." },
    "천칭자리": { emoji: "♎", desc: "미적 세련미와 갈등을 조율하는 균형 감각이 완벽한 조화를 이루는 날입니다. 난처한 조율 상황에서 멋진 솔루션을 제공하여 평판이 최고조로 상승합니다. 행운의 소품은 은은한 향수입니다." },
    "전갈자리": { emoji: "♏", desc: "고도의 말 없는 통찰력과 직관으로 보이지 않는 기회나 상대방의 속내를 명확하게 간파해 내는 신비로운 하루입니다. 비밀스러운 비즈니스 준비에 행운이 깃듭니다. 행운의 숫자는 7입니다." },
    "사수자리": { emoji: "♐", desc: "좁은 세상을 벗어나 넓은 우주를 탐험하는 기상이라 역마의 활력이 충만해집니다! 야외 출장이나 여행 플랜을 구상하면 정서가 유쾌하게 트이게 됩니다. 행운의 방향은 남쪽입니다." },
    "염소자리": { emoji: "♑", desc: "한 계단 한 계단 묵묵히 내 실력을 갈고닦으며 장기적인 커리어 목표의 정상에 바위처럼 다가서는 날입니다. 책임감 있게 완수한 성취가 평생 자산이 됩니다. 행운의 보석은 블랙스톤입니다." },
    "물병자리": { emoji: "♒", desc: "틀에 박힌 관습을 과감히 깨부수는 혁신적이고 번뜩이는 자유로운 상상력이 돋보이는 하루입니다! 나만의 독특한 개성을 부끄러워 말고 세상에 마음껏 외쳐보세요. 행운의 색은 네이비입니다." },
    "물고기자리": { emoji: "♓", desc: "감수성이 한없이 그윽해지고 주변의 아픈 영혼을 치유해 주는 고운 동정심이 빛나는 힐링 데이입니다. 마음속 영감이 활발하니 음악이나 예술 감상에 행운이 깃듭니다. 행운의 숫자는 2와 12입니다." }
};

const BIRTH_MONTH_DATA = {
    1: { flower: "수선화 (Daffodil)", flowerDesc: "자기 사랑, 신비로운 고결함과 봄의 도래를 상징합니다. 남에게 기대지 않고 스스로의 품격을 당당히 지켜나가는 고결한 기상을 상징하여 귀한 인덕을 부릅니다.", gem: "가넷 (Garnet)", gemDesc: "변치 않는 우정과 진실한 의리, 우직한 성실함을 뜻하는 단단한 보석입니다. 마음을 차분히 가라앉히고 자산을 성실히 축적해주는 강력한 수호 에너지의 원천입니다.", advice: "🍀 1월생을 위한 Blessing: 새해의 첫 정기를 타고난 당신은 우직한 원칙을 지켜나갈 때 만인이 우러러보는 인생 최고의 정상에 오를 기운입니다." },
    2: { flower: "제비꽃 (Violet)", flowerDesc: "겸손함, 성실한 배려와 영원한 진실을 뜻합니다. 성정이 모나지 않고 수줍은 듯 온화하여 사람들에게 편안하고 든든한 힐링을 선사하는 고운 심성을 뜻합니다.", gem: "자수정 (Amethyst)", gemDesc: "평화로운 정서 안정과 맑은 지혜를 열어주는 신비한 보랏빛 보석입니다. 불필요한 잡생각과 우울감을 맑게 해독하여 맑고 차분한 수면과 영적 직관력을 선물해 줍니다.", advice: "🍀 2월생을 위한 Blessing: 물 흐르듯 유연한 태도로 세상을 품어 안으세요. 조용하지만 강인한 당신의 배려가 결국 승리를 이끌 것입니다." },
    3: { flower: "데이지 (Daisy)", flowerDesc: "순수한 열정, 평화로운 마음과 아름다운 시작을 의미합니다. 봄바람을 맞으며 기분 좋게 피어나는 꽃처럼 인생의 밝고 유쾌한 온기를 몰고 오는 축복을 뜻합니다.", gem: "아쿠아마린 (Aquamarine)", gemDesc: "영원한 청춘과 바다의 맑은 생명력을 닮아 투명하고 영롱한 보석입니다. 지친 마음의 피로를 씻어내 주고 대인관계에서 맑고 시원한 의사소통 능력을 증폭시켜 줍니다.", advice: "🍀 3월생을 위한 Blessing: 묵은 고민의 허물을 과감히 벗어던지고 새롭게 질주하십시오. 찬란한 봄 햇살이 당신의 용기 있는 시작을 완벽히 수호합니다." },
    4: { flower: "아네모네 (Anemone)", flowerDesc: "기대, 신비로운 상상력과 한없이 깊은 정성스러운 사랑을 뜻합니다. 남들이 보지 못하는 감수성과 미적 영감을 곁에 두어 트렌디한 가치를 꽃피우는 재능입니다.", gem: "다이아몬드 (Diamond)", gemDesc: "영원한 사랑과 그 어떤 풍파에도 흠집 나지 않는 불멸의 고귀함을 뜻하는 보석의 제왕입니다. 내면의 뚝심을 최고조로 강화하여 세상의 모든 도전을 극복해 냅니다.", advice: "🍀 4월생을 위한 Blessing: 당신은 어떤 불 속에서도 녹지 않는 다이아몬드처럼 가장 단단한 영혼을 가졌습니다. 자신감 있게 내 뜻을 세상에 설파하세요." },
    5: { flower: "은방울꽃 (Lily of the Valley)", flowerDesc: "반드시 찾아오는 행복, 맑은 웃음과 틀림없는 행운을 상징합니다. 소리 없이 예쁜 종소리를 울리듯 가는 곳마다 기분 좋은 인복을 몰고 다니는 고운 매력입니다.", gem: "에메랄드 (Emerald)", gemDesc: "신록의 푸르름과 눈부신 치유의 힘을 지닌 귀한 녹색 보석입니다. 마음속에 마음에 평안을 안겨주어 정서가 한결 든든해지고, 인덕과 문서운을 기분 좋게 끌어당깁니다.", advice: "🍀 5월생을 위한 Blessing: 당신 주변에는 항상 당신의 미소를 갈망하는 귀인들이 가득합니다. 밝고 명랑한 태도를 유지할 때 큰 돈줄과 문서가 들어옵니다." },
    6: { flower: "장미 (Rose)", flowerDesc: "불타는 열정, 감출 수 없는 아름다움과 소중한 사랑의 약속입니다. 어디서나 눈에 띄는 화려한 매력과 사교성으로 대중을 기분 좋게 리드하는 흡인력을 뜻합니다.", gem: "진주 (Pearl)", gemDesc: "조개 속에서 오랜 세월을 참고 인내하여 빚어진 우아하고 고결한 바다의 눈물입니다. 대기만성형 자산 취득과 흐트러짐 없는 품격, 무거운 존경심을 상징합니다.", advice: "🍀 6월생을 위한 Blessing: 성급하게 결과를 얻으려 조급해하지 마세요. 조개 속 진주처럼 시간의 숙성을 거친 당신의 성과가 가장 비싸고 귀하게 환대받을 것입니다." },
    7: { flower: "라벤더 (Lavender)", flowerDesc: "풍부한 정서적 평화, 침묵 속의 영적인 깊이와 치유를 뜻합니다. 마음을 맑게 가꾸고 남을 치유해 주는 은은하고 매혹적인 향기와 통찰력을 의미합니다.", gem: "루비 (Ruby)", gemDesc: "불꽃보다 뜨거운 정열과 승리의 확신을 품은 강력한 붉은빛 보석입니다. 사기를 쫓아내고 심장 박동처럼 활기찬 추진력과 리더십을 충전해 주는 정열의 수호신입니다.", advice: "🍀 7월생을 위한 Blessing: 망설이던 일이 있다면 거침없이 전차처럼 전진하십시오. 심장의 불꽃을 닮은 루비의 에너지가 당신의 정당한 승리를 보장합니다." },
    8: { flower: "해바라기 (Sunflower)", flowerDesc: "오직 한 사람만을 향한 우직한 신뢰, 숭고한 사랑과 찬란한 생명력입니다. 언제나 긍정적이고 호탕하게 세상을 바라보는 흔들림 없는 든든한 등대를 상징합니다.", gem: "페리도트 (Peridot)", gemDesc: "우주의 운석처럼 신비롭고 밤에도 초록빛으로 반짝이는 부부의 화합과 수호의 돌입니다. 가벼운 스트레스나 마음의 갈등을 물리치고 내면을 평화롭게 지켜줍니다.", advice: "🍀 8월생을 위한 Blessing: 우직한 태도로 내 자리를 굳건히 지켜내세요. 머지않아 해바라기 가득 영글어가는 씨앗처럼 큰 재물의 풍요가 당신의 품으로 쏟아집니다." },
    9: { flower: "에스토니아 국화 (Aster)", flowerDesc: "깊은 믿음, 다정한 지혜와 세련된 미적 조화를 뜻합니다. 겉은 단정하고 모범적이나 내면에는 세상을 수놓을 다재다능한 솜씨와 임기응변을 가득 품은 기상입니다.", gem: "사파이어 (Sapphire)", gemDesc: "하늘과 바다의 깊고 푸른 신용과 진실, 지혜를 상징하는 영롱한 청색 보석입니다. 마음을 차분히 관조하게 돕고 공직이나 시험운에서 합격 도장을 받아내도록 가호합니다.", advice: "🍀 9월생을 위한 Blessing: 머리가 비상하고 공부의 기운이 훌륭한 당신입니다. 세련된 분석과 기획력으로 명예를 추구할 때 돈은 부가적으로 따라오는 법입니다." },
    10: { flower: "금잔화 (Marigold)", flowerDesc: "반드시 올 행운, 따뜻한 우정과 든든한 정서를 상징합니다. 샛노란 금빛 가득 피어나는 꽃처럼 사소한 인연도 소중한 평생 아군으로 만드는 사교적 기상입니다.", gem: "오팔 (Opal)", gemDesc: "무지갯빛 찬란한 온갖 빛깔을 한 몸에 머금은 신비의 예술 보석입니다. 상상력과 창의적인 예술적 감각을 대폭 증폭시켜 주며 치명적인 대중적 인기를 끌어당깁니다.", advice: "🍀 10월생을 위한 Blessing: 당신은 틀에 갇히기 아까운 천재적인 센스의 소유자입니다. 남들의 눈치를 보지 말고 무지개 오팔처럼 당신만의 색깔을 당당히 가꾸세요." },
    11: { flower: "국화 (Chrysanthemum)", flowerDesc: "추위를 견디며 끝내 향기를 품어내는 우직한 인내, 굳은 절개와 성실함입니다. 대인관계에서 신용이 일품이며 평생 든든한 살림꾼 노릇을 훌륭히 해내는 기운입니다.", gem: "토파즈 (Topaz)", gemDesc: "황금빛 찬란한 태양의 온기와 진실, 우정을 뜻하는 길한 보석입니다. 몸의 만성 피로와 스트레스를 다스려 주고 돈과 명예운의 흐름을 맑게 순환시켜 줍니다.", advice: "🍀 11월생을 위한 Blessing: 시련 속에서 국화 향기가 더욱 은은하게 퍼지듯, 고생 끝에 얻어낼 당신의 인생 하반기 대복록은 마르지 않는 강물처럼 도도할 것입니다." },
    12: { flower: "포인세티아 (Poinsettia)", flowerDesc: "내 마음이 한없이 불타오릅니다, 축복 가득한 온기와 정다운 화합을 상징합니다. 사람들을 한곳으로 모으고 연말 파티처럼 훈훈하고 정겨운 정서를 베푸는 힘이 있습니다.", gem: "터키석 (Turquoise)", gemDesc: "성공과 승리, 그리고 여행길과 건강을 든든하게 지켜주는 소중한 수호의 돌입니다. 정직한 마음과 행운의 부를 동시에 상징하며 액운을 막아내 주는 방패입니다.", advice: "🍀 12월생을 위한 Blessing: 정이 많고 영혼이 맑아 상처받기 쉬우니 평소 마인드 컨트롤이 중요합니다. 터키석 같은 든든한 마음의 방패를 두르고 용감하게 미소 지으세요." }
};

const DAILY_BLOOD_DATA = {
    "A": {
        emoji: "🅰️", name: "A형 (신중/사려)",
        phrases: [
            "오늘 하루는 차분한 마음 정돈과 꼼꼼한 눈치가 빛을 발해, 주변 동료들 사이에서 신뢰도가 수직 상승하는 날입니다. 성실함이 최고의 비책입니다.",
            "사소한 걱정거리나 스트레스는 미지근한 물 한 잔으로 시원하게 정화해 보세요. 오후 3시 무렵 기분 좋은 연락이 찾아옵니다.",
            "주변 사람들의 이야기를 다정하게 들어줄수록 나에게 계약서 합격 도장이 날아드는 든든한 문서 인덕의 하루가 전개됩니다.",
            "지갑을 무겁게 단속하되, 나를 기분 좋게 힐링하는 차 한 잔에 아낌없이 투자하는 것은 오늘의 길한 행운을 앞당깁니다."
        ]
    },
    "B": {
        emoji: "🅱️", name: "B형 (자유/열정)",
        phrases: [
            "당신의 번뜩이는 독창적 아이디어와 유쾌한 유머 감각이 주변 분위기를 한없이 화기애애하게 주도해 나가는 주인공의 기상입니다.",
            "남들의 고정관념에 연연하지 말고 과감하게 평소 갈망하던 프로젝트의 첫발을 떼어 보세요. 긍정적인 행동이 행운의 돈줄을 부릅니다.",
            "역동적인 야외 활동이나 가벼운 유산소 조깅을 할 때 기운이 가뿐하게 순환되어, 기분 좋은 횡재의 인복을 자석처럼 끌어당깁니다.",
            "뜻밖의 수다 모임이나 다정한 식사 자리에서 나를 평생 도울 소중한 귀인의 힌트를 얻게 될 확률이 매우 높습니다."
        ]
    },
    "O": {
        emoji: "🅾️", name: "O형 (친화/리더십)",
        phrases: [
            "사방을 환하게 밝히는 맑은 긍정 열정과 특유의 호탕한 매력이 빛나, 만나는 모두에게 든든한 등대 같은 신뢰를 선물하는 대길일입니다.",
            "해결하기 어려웠던 까다로운 업무나 갈등 상황을 내 안의 카리스마와 포용력으로 깔끔하게 매듭 지어 버리는 영웅의 하루입니다.",
            "자금 안정적으로 굴러가기 시작하는 기분 좋은 하루입니다. 예적금 현황을 살피고 새로운 금융 포트폴리오를 구상하기에 최고의 날입니다.",
            "남쪽에서 반가운 기별과 함께 맛있는 밥을 얻어먹을 복이 활발히 따릅니다. 감사한 마음을 미소로 듬뿍 답례해 보세요."
        ]
    },
    "AB": {
        emoji: "🆎", name: "AB형 (예술/통찰)",
        phrases: [
            "남들은 절대로 상상도 하지 못한 날카롭고 예리한 전문적 통찰력이 빛을 발해 복잡한 기계 오류나 문서를 단박에 해결하는 날입니다.",
            "예술적 영감과 미적 세련미가 정점까지 치솟으니, 예쁜 다이어리를 쓰거나 디자인을 만지면 놀라운 예술적 성취가 뒤따릅니다.",
            "조용히 한 우물을 파며 내실을 다질 때 최고의 운이 열립니다. 시끄러운 참견보다는 나의 조용한 직관과 영혼을 끝까지 신뢰하십시오.",
            "수면 위생을 맑게 가꾸고, 행운의 허브 향수를 가볍게 뿌리는 것만으로도 나를 시기하던 액운을 완벽하게 수호할 수 있습니다."
        ]
    }
};

function initDailyPlaza() {
    initSidebarWidgets();
    generateZodiacButtons();
    generateAstrologyButtons();
    generateBloodTypeButtons();
    showBirthBlessing();
    resetTarotDeck();
}

function generateZodiacButtons() {
    const container = document.getElementById('zodiac-animal-container');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(ZODIAC_ANIMAL_DATA).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => showZodiacReading('animal', key);
        btn.className = "flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/40 transition active:scale-95";
        btn.innerHTML = `<span class="text-xl sm:text-2xl">${value.emoji}</span><span class="text-[10px] sm:text-xs font-bold text-gray-300 mt-1">${value.name}</span>`;
        container.appendChild(btn);
    });
}

function generateAstrologyButtons() {
    const container = document.getElementById('astrology-container');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(ASTROLOGY_DATA).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => showZodiacReading('astrology', key);
        btn.className = "flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition active:scale-95";
        btn.innerHTML = `<span class="text-xl sm:text-2xl">${value.emoji}</span><span class="text-[10px] sm:text-xs font-bold text-gray-300 mt-1">${key}</span>`;
        container.appendChild(btn);
    });
}

function generateBloodTypeButtons() {
    const container = document.getElementById('bloodtype-container');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(DAILY_BLOOD_DATA).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => showBloodTypeReading(key);
        btn.className = "flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-pink-500/10 hover:border-pink-500/40 transition active:scale-95";
        btn.innerHTML = `<span class="text-xl sm:text-2xl">${value.emoji}</span><span class="text-[10px] sm:text-xs font-bold text-gray-300 mt-1">${key}형 예보</span>`;
        container.appendChild(btn);
    });
}

function showZodiacReading(type, key) {
    const resultBox = document.getElementById('zodiac-result-box');
    const resEmoji = document.getElementById('zodiac-res-emoji');
    const resTitle = document.getElementById('zodiac-res-title');
    const resDesc = document.getElementById('zodiac-res-desc');
    const resDate = document.getElementById('zodiac-res-date');
    if (!resultBox || !resEmoji || !resTitle || !resDesc || !resDate) return;

    const today = new Date();
    resDate.textContent = `${today.getMonth() + 1}월 ${today.getDate()}일 일진`;
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + key.charCodeAt(0);
    const score = 75 + (seed % 25);

    const conditionPhrases = [
        "🌟 온 우주의 기운이 당신을 향해 미소 짓는 하루입니다. 정직한 신뢰가 큰 기회를 만듭니다.",
        "🍀 가벼운 양보가 큰 인덕으로 돌아오는 날입니다. 어깨에 힘을 빼면 운의 순환이 맑아집니다.",
        "✨ 마음에 담아두던 소중한 영감이 폭발적으로 피어나는 길한 기상입니다. 직관을 신뢰하세요.",
        "💰 지갑에 알짜 실속이 단단히 쌓여 정서가 한없이 든든해지는 성실의 운이 머무릅니다.",
        "🌈 소원했던 인간관계가 따스한 대화 한마디로 눈 녹듯 가뿐해지는 평화의 흐름입니다."
    ];
    const phraseIdx = seed % conditionPhrases.length;

    let baseEmoji = "", baseTitle = "", baseText = "";
    if (type === 'animal') {
        const data = ZODIAC_ANIMAL_DATA[key];
        baseEmoji = data.emoji;
        baseTitle = `오늘의 ${data.name} 대길 처방 (지수: ${score}%)`;
        baseText = `<strong class="text-amber-300">[하루 총평]</strong> ${conditionPhrases[phraseIdx]}<br class="block mb-2"><strong class="text-amber-300">[상세 비책]</strong> ${data.desc}`;
    } else {
        const data = ASTROLOGY_DATA[key];
        baseEmoji = data.emoji;
        baseTitle = `오늘의 ${key} 별자리 오라클 (지수: ${score}%)`;
        baseText = `<strong class="text-cyan-300">[우주의 조언]</strong> ${conditionPhrases[phraseIdx]}<br class="block mb-2"><strong class="text-cyan-300">[실전 행동법]</strong> ${data.desc}`;
    }

    resEmoji.textContent = baseEmoji;
    resTitle.textContent = baseTitle;
    resDesc.innerHTML = baseText;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showBloodTypeReading(bloodType) {
    const resultBox = document.getElementById('zodiac-result-box');
    const resEmoji = document.getElementById('zodiac-res-emoji');
    const resTitle = document.getElementById('zodiac-res-title');
    const resDesc = document.getElementById('zodiac-res-desc');
    const resDate = document.getElementById('zodiac-res-date');
    if (!resultBox || !resEmoji || !resTitle || !resDesc || !resDate) return;

    const today = new Date();
    resDate.textContent = `${today.getMonth() + 1}월 ${today.getDate()}일 일일 특보`;
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 50 + today.getDate() + bloodType.charCodeAt(0);
    const score = 80 + (seed % 20);

    const data = DAILY_BLOOD_DATA[bloodType];
    const phraseIdx = seed % data.phrases.length;
    const finalPhrase = data.phrases[phraseIdx];

    resEmoji.textContent = data.emoji;
    resTitle.textContent = `오늘의 ${bloodType}형 아침 뉴스 예보 (행복지수: ${score}%)`;
    resDesc.innerHTML = `
        <strong class="text-pink-400">[오늘의 혈액형 에너지 기상도]</strong><br class="block mb-1.5">
        <p class="leading-relaxed font-sans text-gray-200 text-xs sm:text-sm">${finalPhrase}</p>
        <p class="pt-2 text-[10px] text-gray-500 border-t border-white/5 mt-2">※ 매일 아침을 기분 좋게 깨우는 나만의 하루 행운 예보를 무료 배송해 드립니다. 지금 이 브라우저를 북마크(★)해 두시고 매일 아침 3초 만에 오늘의 행운을 충전해 가세요!</p>
    `;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetTarotDeck() {
    TAROT_DECK = [...TAROT_CARDS_DATA];
    for (let i = TAROT_DECK.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [TAROT_DECK[i], TAROT_DECK[j]] = [TAROT_DECK[j], TAROT_DECK[i]];
    }
    for (let idx = 1; idx <= 3; idx++) {
        const cardInner = document.getElementById('tarot-card-' + idx);
        if (cardInner) {
            cardInner.classList.remove('flipped');
            cardInner.parentElement.style.pointerEvents = 'auto';
        }
    }
    document.getElementById('tarot-result-box').classList.add('hidden');
    ACTIVE_TAROT_CARD_ID = null;
}

function handleTarotDraw(cardId) {
    // [수정됨] 정밀 타로 운세법 연동 (개인 정보 입력 강제 결속 가이드)
    if (!CURRENT_SAJU) {
        alert("🔮 정밀 1:1 타로 분석을 위해 먼저 상단 입력창에 생년월일과 성별을 입력하고 [사주 분석하기]를 1회 가동해 주세요! 나만을 위한 타로 소울 카드 운세 분석이 완성됩니다.");
        scrollToSection('form-section');
        return;
    }

    if (ACTIVE_TAROT_CARD_ID !== null) {
        alert("이미 카드를 뽑으셨습니다! 다른 카드를 보시려면 '카드 다시 섞기'를 눌러주세요.");
        return;
    }
    ACTIVE_TAROT_CARD_ID = cardId;
    const chosenCard = TAROT_DECK[cardId - 1];
    const cat = document.getElementById('tarot-category').value;
    
    // 생일을 통한 타로 소울 카드 번호(1~9) 계산 법칙 적용
    const yStr = String(CURRENT_SAJU.year), mStr = String(CURRENT_SAJU.month), dStr = String(CURRENT_SAJU.day);
    let soulSum = 0;
    for(let i=0; i<yStr.length; i++) soulSum += parseInt(yStr[i]);
    for(let i=0; i<mStr.length; i++) soulSum += parseInt(mStr[i]);
    for(let i=0; i<dStr.length; i++) soulSum += parseInt(dStr[i]);
    while (soulSum > 9) {
        let temp = 0;
        const sStr = String(soulSum);
        for(let i=0; i<sStr.length; i++) temp += parseInt(sStr[i]);
        soulSum = temp;
    }
    
    const soulCardsMap = {
        1: "🪄 마술사 (The Magician) 카드", 2: "📖 여사제 (The High Priestess) 카드", 3: "👑 여황제 (The Empress) 카드",
        4: "🏛️ 황제 (The Emperor) 카드", 5: "🔔 교황 (The Hierophant) 카드", 6: "💞 연인 (The Lovers) 카드",
        7: "🛡️ 전차 (The Chariot) 카드", 8: "🦁 힘 (Strength) 카드", 9: "🏮 은둔자 (The Hermit) 카드"
    };
    const userSoulCardName = soulCardsMap[soulSum] || "마술사 카드";

    document.getElementById('tarot-emoji-' + cardId).textContent = chosenCard.emoji;
    document.getElementById('tarot-name-' + cardId).textContent = chosenCard.name.split(' ')[0];

    const cardInner = document.getElementById('tarot-card-' + cardId);
    if (cardInner) cardInner.classList.add('flipped');

    for (let idx = 1; idx <= 3; idx++) {
        const inner = document.getElementById('tarot-card-' + idx);
        if (inner) inner.parentElement.style.pointerEvents = 'none';
    }

    let catTitle = "오늘의 종합 운명 오라클", adviceText = chosenCard.total;
    if (cat === 'love') {
        catTitle = "오늘의 연애 및 대인운 가이드";
        adviceText = chosenCard.love;
    } else if (cat === 'money') {
        catTitle = "오늘의 재물 및 성공운 비책";
        adviceText = chosenCard.money;
    }

    document.getElementById('tarot-res-emoji').textContent = chosenCard.emoji;
    document.getElementById('tarot-res-title').innerHTML = `선택 카드: <strong class="text-white">${chosenCard.name}</strong> · ${catTitle}`;
    
    // 소울 카드 결합 해석문 동적 조립
    let soulCardAdvice = `<p class="mt-2.5 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-gray-300 leading-relaxed font-sans"><strong class="text-purple-300 block mb-1">🔮 당신의 타고난 '타로 소울 카드'와의 상생 해독</strong>당신의 생년월일 파장으로 셈한 인생 수호 카드는 <strong>[${userSoulCardName}]</strong> 입니다. 오늘 당신이 뽑은 <strong>[${chosenCard.name}]</strong> 기운과 나의 수호 카드가 만나 정서적 밸런스를 든든하게 조율해 줍니다. 수호 카드의 곧은 자립성과 오늘 카드의 온화함이 어우러져, 평소 고집을 한 숟가락 내려놓고 부드러운 화법으로 다가설 때 뜻밖의 큰 인덕과 귀중한 문서 소식을 거머쥐게 되는 아름다운 행운의 전선이 열립니다.</p>`;
    
    let html = `<p class="text-gray-300 leading-relaxed font-sans mb-2"><strong class="text-purple-400">[핵심 키워드]</strong> ${chosenCard.keyword}</p>`;
    html += `<p class="text-gray-300 leading-relaxed font-sans mt-2"><strong class="text-purple-300">[정밀 해독 처방]</strong> ${adviceText}</p>`;
    html += soulCardAdvice;
    html += `<p class="pt-2 text-[11px] text-gray-500 border-t border-purple-500/20">※ 타로 카드가 전하는 영감은 오늘의 마인드셋을 위한 힐링 지침입니다. 스스로 긍정적인 행동을 선택할 때 행운은 배가됩니다.</p>`;

    document.getElementById('tarot-res-desc').innerHTML = html;
    const resultBox = document.getElementById('tarot-result-box');
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateTrendyMatch() {
    const myM = document.getElementById('my-mbti').value;
    const partnerM = document.getElementById('partner-mbti').value;
    const myB = document.getElementById('my-blood').value;
    const partnerB = document.getElementById('partner-blood').value;

    const resultBox = document.getElementById('mbti-result-box');
    const resTitle = document.getElementById('mbti-res-title');
    const resScore = document.getElementById('mbti-res-score');
    const resDesc = document.getElementById('mbti-res-desc');

    const mbtiAffinity = {
        "INFP-ENFP": { score: 98, title: "우주가 보증하는 최고의 영혼 메이트 🌌", desc: "서로 다른 이야기를 해도 눈빛 하나로 밤새 수다를 떨 수 있는 최고의 감성 조합입니다. 함께 꿈을 이야기하며 서로의 자존감을 한없이 북돋아 주는 아름다운 시너지입니다." },
        "INFJ-ENFP": { score: 99, title: "천생연분! 서로의 생각을 완벽히 알아채는 연인 💞", desc: "말하지 않아도 가슴속 깊은 고민과 가치관을 단박에 알아채 주는 영적 교감의 극치입니다. ENFP의 활기찬 에너지와 INFJ의 깊은 배려심이 만나면 평생 마르지 않는 강강술래 같은 동반자가 됩니다." },
        "INTJ-ENTP": { score: 95, title: "지적인 토론과 거대한 비전을 설계하는 동반자 🧭", desc: "서로의 지적인 깊이에 감탄하며 인생의 거대한 프로젝트를 함께 기획하고 돌파하는 멋진 승부사 커플입니다. 비즈니스 파트너로서도 100점의 호흡을 보입니다." },
        "INTP-ENTJ": { score: 96, title: "한 우물을 파는 장인과 거대한 무대를 지휘하는 장군 ⚔️", desc: "ENTJ의 과감한 추진력과 INTP의 날카롭고 빈틈없는 설계 능력이 정밀 결합한 격입니다. 서로의 독자적 영역을 깊이 리스펙트하는 성숙한 관계를 유지합니다." },
        "ISFP-ESFP": { score: 92, title: "지루할 틈이 없는 감각적이고 유쾌한 놀이터 🎨", desc: "예술적 감각과 트렌디한 취향, 취미 생활을 온전히 공유하며 오늘 하루를 가장 찬란하고 기분 좋게 즐길 줄 아는 다정하고 유쾌한 단짝 커플입니다." },
        "ISTJ-ESTJ": { score: 90, title: "원칙과 신뢰 위에 차곡차곡 가정을 일구는 자산가 🏛️", desc: "한 치의 거짓도 용납하지 않는 정직한 신용과 성실한 생활력을 바탕으로, 현실의 무게를 함께 짊어지고 착실하게 부를 불려가는 듬직한 실속 조합입니다." }
    };

    const key1 = `${myM}-${partnerM}`, key2 = `${partnerM}-${myM}`;
    const match = mbtiAffinity[key1] || mbtiAffinity[key2] || {
        score: 70 + ((myM.charCodeAt(0) + partnerM.charCodeAt(1) + myB.charCodeAt(0) + partnerB.charCodeAt(0)) % 21),
        title: "서로의 매력에 천천히 스며드는 성장형 인연 🌱",
        desc: "성격 성향이 서로 다른 만큼, 처음에는 다소 조심스러울 수 있으나 만날수록 상대방에게 없는 훌륭한 장점을 배우고 닮아가는 아름다운 성장형 궁합입니다. 혈액형 간의 조화도 무난하여 조급히 서두르지 말고 정을 차곡차곡 쌓아가 보세요."
    };

    let bloodBonus = "혈액형의 배합 역시 서로의 단점을 보완해주는 온화한 시너지입니다.";
    if (myB === 'O' && partnerB === 'A') {
        match.score = Math.min(match.score + 3, 100);
        bloodBonus = "🩸 친화력 대장인 O형과 신중한 A형의 만남은 대단히 편안하고 리스크가 적은 대길한 조합입니다.";
    } else if (myB === 'B' && partnerB === 'AB') {
        match.score = Math.min(match.score + 2, 100);
        bloodBonus = "🩸 자유로운 매력의 B형과 개성 넘치는 AB형은 정형화된 틀을 깨고 나만의 독특한 취미를 함께 만끽하는 환상의 친구가 됩니다.";
    }

    resTitle.textContent = `${myM}(${myB}형) 💖 ${partnerM}(${partnerB}형) 궁합 결과`;
    resScore.textContent = `궁합 지수: ⭐ ${match.score}%`;
    resDesc.innerHTML = `<p class="font-bold text-rose-300 text-sm mb-1">${match.title}</p><p class="text-xs sm:text-sm text-gray-300 leading-relaxed mb-2">${match.desc}</p><p class="text-[11px] text-pink-400 font-medium">${bloodBonus}</p>`;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showBirthBlessing() {
    let m = parseInt(document.getElementById('birth-month-select').value);
    if (isNaN(m)) {
        m = new Date().getMonth() + 1;
        const sel = document.getElementById('birth-month-select');
        if (sel) sel.value = m;
    }
    const data = BIRTH_MONTH_DATA[m];
    if (!data) return;
    document.getElementById('birth-flower-name').textContent = data.flower;
    document.getElementById('birth-flower-desc').textContent = data.flowerDesc;
    document.getElementById('birth-gem-name').textContent = data.gem;
    document.getElementById('birth-gem-desc').textContent = data.gemDesc;
    document.getElementById('birth-bless-advice').textContent = data.advice;
}

function initSidebarWidgets() {
    const select = document.getElementById('sidebar-ilju-select');
    if (!select) return;
    select.innerHTML = '';
    const sortedGapja = [...GAPJA].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    const defaultOpt = document.createElement('option');
    defaultOpt.value = "";
    defaultOpt.textContent = "👇 이곳을 눌러 알고 싶은 일주 선택";
    select.appendChild(defaultOpt);

    sortedGapja.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.name;
        opt.textContent = `${g.name}일주 (${g.han})`;
        select.appendChild(opt);
    });
    updateLuckyPrescription();
}

function showSidebarIljuDetail() {
    const select = document.getElementById('sidebar-ilju-select');
    const title = document.getElementById('sidebar-ilju-title');
    const desc = document.getElementById('sidebar-ilju-desc');
    if (!select || !title || !desc) return;

    const val = select.value;
    if (!val) {
        title.textContent = "일주를 선택해 주세요";
        desc.innerHTML = "오른쪽 선택창에서 알고 싶은 60갑자 중 하나를 터치하시면, 그 일주의 고유한 성격과 강점, 어울리는 직업과 매력적인 조언을 실시간으로 가득 읽어드립니다.";
        return;
    }

    const data = ILJU_DATA[val];
    const deep = ILJU_DETAIL[val] || '';
    if (data) {
        title.textContent = `🌾 ${val}일주(日柱)의 핵심 성정`;
        let html = `<p class="font-bold text-amber-300 text-xs mb-1.5">🌟 캐릭터 총평</p><p class="mb-3">${data.desc}</p>`;
        html += `<p class="font-bold text-emerald-300 text-xs mb-1">✅ 선천적 대표 강점</p><ul class="list-disc list-inside mb-3">`;
        data.strengths.forEach(s => { html += `<li>${s}</li>`; });
        html += `</ul>`;
        html += `<p class="font-bold text-cyan-300 text-xs mb-1.5">💼 직업 및 커리어 길잡이</p><p class="mb-3">${data.job}</p>`;
        if (deep) {
            html += `<p class="font-bold text-purple-300 text-xs mb-1.5">📖 인생 심층 비책</p><p class="text-[11px] leading-relaxed text-gray-400">${deep.substring(0, 150)}...</p>`;
        }
        html += `<p class="pt-2 text-[10px] text-gray-500 border-t border-white/5">※ 전체 연애/건강운 분석과 평생의 십이운성 로드맵은 상단 입력창을 통해 내 생년월일시를 입력하시면 훨씬 정밀한 28대 마스터 보고서로 출력됩니다.</p>`;
        desc.innerHTML = html;
    }
}

function updateLuckyPrescription() {
    const colorEl = document.getElementById('sidebar-lucky-color');
    const dirEl = document.getElementById('sidebar-lucky-direction');
    const foodEl = document.getElementById('sidebar-lucky-food');
    const timeEl = document.getElementById('sidebar-lucky-time');
    if (!colorEl) return;

    const today = new Date();
    const daySeed = today.getFullYear() + today.getMonth() + today.getDate();

    const colors = ["골드 / 샛노란색 (토 기운 보완)", "에메랄드 / 초록색 (목 기운 보완)", "루비 / 정열적인 붉은색 (화 기운 보완)", "실버 / 깨끗한 흰색 (금 기운 보완)", "사파이어 / 깊은 푸른색 (수 기운 보완)"];
    const directions = ["남동쪽 (재물과 수호)", "동쪽 (새로운 번창)", "남쪽 (활기찬 대인운)", "북쪽 (지혜와 직관)", "서북쪽 (귀인의 도움)"];
    const foods = ["새콤달콤한 비타민 오렌지", "따뜻하고 고소한 둥굴레차", "비타민 가득한 녹차 피로회복제", "활력을 부르는 바나나 한 조각", "정신을 맑게 깨우는 블랙 아메리카노"];
    const times = ["오전 11시 ~ 오후 1시 (오시)", "오전 9시 ~ 오전 11시 (사시)", "오후 1시 ~ 오후 3시 (미시)", "오후 3시 ~ 오후 5시 (신시)", "오전 7시 ~ 오전 9시 (진시)"];

    colorEl.textContent = colors[daySeed % colors.length];
    dirEl.textContent = directions[daySeed % directions.length];
    foodEl.textContent = foods[daySeed % foods.length];
    timeEl.textContent = times[daySeed % times.length];
}

function renderTangSaju(saju) {
    const grid = document.getElementById('tangsaju-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const stars_nyeon = { 0: '천귀성(天貴星)', 1: '천액성(天厄星)', 2: '천권성(天權星)', 3: '천파성(天破星)', 4: '천간성(天奸星)', 5: '천문성(天文星)', 6: '천복성(天福星)', 7: '천고성(天孤星)', 8: '천인성(天刃星)', 9: '천예성(天藝星)', 10: '천수성(天壽星)', 11: '천망성(天網星)' };
    const desc_nyeon = {
        '천귀성(天貴星)': '초년(1~20세)에 조상과 가문의 고귀한 기운을 물려받아 총명하고 품위 있게 자라납니다. 사람들의 귀여움과 가호가 함께하는 운입니다.',
        '천액성(天厄星)': '초년에 사소한 잔병치레나 정서적 방황 등 가벼운 풍파를 겪으며 한층 굳건하고 지혜로운 영혼의 기초 체력을 완성하는 시기입니다.',
        '천권성(天權星)': '어릴 때부터 또래 사이에서 골목대장을 하거나 학급 리더를 맡는 등, 남을 부리는 카리스마와 주도적인 권세의 싹이 일찍부터 돋아납니다.',
        '천파성(天破星)': '호기심이 유난히 왕성하여 장난감을 분해하고 조립하며 다양한 세상을 직접 만지고 깨뜨리는 창조적인 경험의 초년을 뜻합니다.'
    };

    const stars_wol = { 0: '천문성(天文星)', 1: '천복성(天福星)', 2: '천귀성(天貴星)', 3: '천액성(天厄星)', 4: '천권성(天權星)', 5: '천파성(天破星)', 6: '천간성(天奸星)', 7: '천고성(天孤星)', 8: '천인성(天刃星)', 9: '천예성(天藝星)', 10: '천수성(天壽星)', 11: '천망성(天網星)' };
    const desc_wol = {
        '천문성(天文星)': '청년(20~45세)에 학문과 지식, 서류 공부 복이 활발히 트입니다. 전문 자격을 취득하거나 맑은 붓끝의 지혜로 사회적 입지를 단단히 굳히게 됩니다.',
        '천복성(天福星)': '일하는 것보다 재물과 먹을 복이 마르지 않고 풍성하게 채워지는 시기입니다. 착실한 노력 위에 뜻밖의 횡재수와 인덕이 가득 안착합니다.',
        '천간성(天奸星)': '비상한 두뇌와 기발한 눈치, 지혜로운 임기응변으로 위기 상황에서 기막힌 해결책을 마련해 대성하는 사회적 수완가 유형입니다.'
    };

    const stars_il = { 0: '천고성(天孤星)', 1: '천인성(天刃星)', 2: '천예성(天藝星)', 3: '천수성(天壽星)', 4: '천망성(天網星)', 5: '천귀성(天貴星)', 6: '천액성(天厄星)', 7: '천권성(天權星)', 8: '천파성(天破星)', 9: '천간성(天奸星)', 10: '천문성(天文星)', 11: '천복성(天福星)' };
    const desc_il = {
        '천고성(天孤星)': '중년(45~60세)에 고독한 지혜와 사색의 시간입니다. 독립적으로 나만의 성을 쌓고, 깊은 철학이나 한 우물 분야에서 완벽한 독자 궤도에 오릅니다.',
        '천인성(天刃星)': '바위도 단박에 가르는 칼같은 추진력과 강인한 승부사 기질입니다. 위기에 처했을 때 영웅처럼 일어나 판을 한 번에 뒤흔드는 리더십입니다.',
        '천예성(天藝星)': '독창적이고 수려한 예술성, 손재주, 기예가 대단한 중년입니다. 나만의 기술과 세련된 감각이 최고의 밥그릇과 인생의 걸작을 만들어 줍니다.'
    };

    const stars_si = { 0: '천수성(天壽星)', 1: '천망성(天網星)', 2: '천귀성(天貴星)', 3: '천액성(天厄星)', 4: '천권성(天權星)', 5: '천파성(天破星)', 6: '천간성(天奸星)', 7: '천문성(天文星)', 8: '천복성(天福星)', 9: '천고성(天孤星)', 10: '천인성(天刃星)', 11: '천예성(天藝星)' };
    const desc_si = {
        '천수성(天壽星)': '말년(60세 이후)에 마르지 않는 수명과 무탈한 강강 건강복이 가득 머무릅니다. 정서가 평안하고 노후 살림이 한없이 두루 풍족해지는 길운입니다.',
        '천망성(天網星)': '하늘의 촘촘한 그물망처럼 넓은 지혜와 덕망을 뜻합니다. 수많은 후배와 자녀들의 듬직한 존경과 따뜻한 가호를 받으며 평화로운 매듭을 짓습니다.',
        '천복성(天福星)': '평생 일궈둔 성실함이 이자가 가득 붙어 돌아오니, 자녀 복이 귀해지고 가만히 앉아 있어도 귀인들이 차를 올리는 대복록의 노후입니다.'
    };

    const nyonStar = stars_nyeon[saju.nyeon.jiIdx % 12] || '천귀성(天貴星)';
    const wolStar = stars_wol[saju.wol.jiIdx % 12] || '천복성(天福星)';
    const ilStar = stars_il[saju.il.jiIdx % 12] || '천예성(天藝星)';
    const siStar = saju.si ? (stars_si[saju.si.jiIdx % 12] || '천수성(天壽星)') : '천수성(天壽星)';

    const cards = [
        { label: "🐣 초년운 (년지 기준)", star: nyonStar, desc: desc_nyeon[nyonStar] || "초년에 다정하고 예의 바르게 자라나 주변 사랑을 듬뿍 독차지하고, 부모 조상의 가호 아래 순탄한 지혜를 기르는 아름다운 흐름입니다." },
        { label: "🏃 청년운 (월지 기준)", star: wolStar, desc: desc_wol[wolStar] || "청년에 지식 공부 복과 문서운이 활발히 꽃을 피웁니다. 직장이나 사회적 무대에서 나만의 반듯한 전문직 소속을 거머쥐는 성공의 시기입니다." },
        { label: "🏡 중년운 (일지 기준)", star: ilStar, desc: desc_il[ilStar] || "중년에 독보적인 재주와 손재주, 세련된 감각이 널리 명성을 이룹니다. 인생 전반에 든든한 살림의 경제적 독립을 이뤄내는 견고한 터전의 때입니다." },
        { label: "👴 말년운 (시지 기준)", star: siStar, desc: desc_si[siStar] || "말년에 마르지 않는 무궁한 수명과 건강 축복이 가득 깃듭니다. 곳간이 늘 두터우며 자녀와 후배들의 지극한 극찬 속에서 평화로운 보람을 누립니다." }
    ];

    cards.forEach(c => {
        grid.innerHTML += `
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span class="text-[10px] sm:text-xs font-bold text-cyan-400 block uppercase tracking-wider">${c.label}</span>
                <h5 class="text-sm sm:text-base font-extrabold text-white">${c.star}</h5>
                <p class="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">${c.desc}</p>
            </div>
        `;
    });
}

function renderKabbalahNumerology(year, month, day) {
    const titleEl = document.getElementById('num-destiny-title');
    const descEl = document.getElementById('num-destiny-desc');
    if (!titleEl || !descEl) return;

    const str = `${year}${month}${day}`;
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += parseInt(str[i]);
    }
    while (sum > 9) {
        let temp = 0;
        const sumStr = sum.toString();
        for (let i = 0; i < sumStr.length; i++) {
            temp += parseInt(sumStr[i]);
        }
        sum = temp;
    }

    const profiles = {
        1: { title: "운명수 1 · 스스로 길을 개척하는 독립적인 리더 (The Pioneer) 🧭", desc: "당신은 무(無)에서 유(有)를 스스로 창조해 내는 탄생의 에너지를 품고 태어났습니다. 자립심이 무척 강하고 리더십이 뛰어나 남들이 가지 않은 미개척 루트를 두려움 없이 첫발을 딛는 개척가입니다. 독립적인 비즈니스나 창업에서 마르지 않는 거대한 성취를 이룹니다." },
        2: { title: "운명수 2 · 평화와 균형의 조율가 (The Diplomat) 🤝", desc: "당신은 갈등이 있는 곳에 부드러운 중재와 평화를 안겨주는 강력한 외교 기질을 가지고 있습니다. 경청 능력이 대단히 훌륭하고 정서적 직관과 감수성이 뛰어나 사람들을 본능적으로 치유해 줍니다. 든든한 파트너와 동업하거나 협업할 때 발복 속도가 최고조로 우수해집니다." },
        3: { title: "운명수 3 · 찬란한 빛의 창의적 예술가 (The Artist) 🎨", desc: "당신은 상상력과 말재주, 그리고 표현 능력을 태어난 날짜 속에 다정한 축복으로 품고 있습니다. 지루한 원칙 속에 머무르기보다는, 번뜩이는 위트와 독창적인 디자인/예술적 재치로 세상을 유쾌하게 정화해 주는 스타성을 의미합니다. 당신이 입을 열거나 글을 쓰기 시작하면 돈줄이 트입니다." },
        4: { title: "운명수 4 · 반듯한 주춧돌의 수호 설계자 (The Architect) 🏛️", desc: "당신은 한 치의 오차도 허용하지 않는 단단한 원칙과 신뢰, 질서를 삶의 주춧돌로 삼고 태어났습니다. 성실성과 인내심이 최고 수준이라 어떤 환경에서도 착실하게 내실 있는 재산과 자산을 일구어 냅니다. 신용을 목숨처럼 지켜 가며 중년 이후 큰 자산가 궤도에 수월히 오릅니다." },
        5: { title: "운명수 5 · 자유와 번창의 영리한 탐험가 (The Explorer) ✈️", desc: "당신은 정형화된 틀이나 집착에 가두어둘 수 없는 바람 같은 자유로운 기상의 소유자입니다. 상황 판단과 임기응변이 기가 막히게 날카로우며 외국어, 여행, 글로벌 마케팅 등 유통 관련 업에서 타의 추종을 불허하는 성공 수완을 발휘합니다. 인생의 변화를 즐길 때 최고의 복이 유입됩니다." },
        6: { title: "운명수 6 · 조화를 다스리는 사랑의 보호자 (The Nurturer) 💖", desc: "당신은 내 주변의 사랑하는 가족과 약자, 그리고 동물들을 나의 정성과 희생으로 책임 있게 보호하는 주변 사람들에게 온정을 나누는 고운 성정을 의미합니다. 성품이 한없이 따뜻하고 예의가 발라 어디를 가나 후덕한 인덕을 듬뿍 쌓게 되며 교육, 의료, 복지, 예술 상담에서 거대한 보람과 부를 성취합니다." },
        7: { title: "운명수 7 · 이면을 간파하는 신비로운 사색가 (The Philosopher) 🔮", desc: "당신은 표면적인 현상 너머에 숨겨진 보이지 않는 우주의 질서와 심리를 날카롭게 꿰뚫어 보는 통찰가입니다. 종교, 깊은 철학, 정교한 과학 기술, 잡학 오타쿠적 연구 분야에서 타인들이 침범할 수 없는 고도의 독자적 실력을 연마하게 되며 조용히 세상을 이끄는 숨은 조력가 기상입니다." },
        8: { title: "운명수 8 · 풍요와 명예를 거머쥐는 거물 승부사 (The Executive) 💎", desc: "당신은 자본주의 사회에서 현실적인 힘, 풍요로운 돈줄, 그리고 든든한 권세를 거머쥘 수 있는 막강한 추진력을 부여받았습니다. 승부욕이 대단하며 사업가적 통이 크고 기획 능력이 일품이라, 큰 조직을 거느리는 CEO나 금융 설계 분야에서 최우두머리로 활약할 야망가입니다." },
        9: { title: "운명수 9 · 다정다감한 인덕의 봉사자 (The Humanitarian) 🌈", desc: "당신은 사소한 이기심을 초월해 만인을 향한 무한한 포용과 대범한 배려를 베푸는 평화로운 큰 그릇의 영혼입니다. 도량이 넓고 세상을 이해하는 지혜가 충만하여 공공의 대의를 위한 법조계, 문학, 자선 재단, 인플루언서 예술가로서 세상을 이롭게 정화하고 큰 성공과 명예를 부릅니다." }
    };

    const cur = profiles[sum] || profiles[1];
    titleEl.textContent = cur.title;
    descEl.innerHTML = `
        <p class="mb-2 font-bold text-amber-300">🔢 우주적 탄생수의 상징과 기질</p>
        <p class="mb-3 font-sans leading-relaxed text-gray-200">${cur.desc}</p>
        <p class="pt-2 text-[11px] text-cyan-400 font-serif-kr italic">"생일 숫자로 푸는 운명수는 태어난 날의 숫자 속에 깃든 나의 숨겨진 성격과 삶의 방향을 따뜻하게 귀띔해 주는 나침반입니다."</p>
    `;
}

function renderChakraBalance(saju, ilGan) {
    const titleEl = document.getElementById('chakra-destiny-title');
    const descEl = document.getElementById('chakra-destiny-desc');
    if (!titleEl || !descEl) return;

    const oheng_chakra = {
        "수": { name: "제6 차크라: 아즈나 (통찰과 직관의 에너지) 👁️", color: "인디고 블루 (남색)", gem: "라피스 라줄리 / 사파이어", mantra: "옴 (OM - 나는 직관한다)", desc: "당신의 깊은 물 기운은 지혜와 날카로운 직관, 통찰력을 다스리는 제6 아즈나 차크라와 깊이 엮여 있습니다. 남들이 보지 못하는 사건의 이면과 상대방의 감정 흐름을 단박에 느껴내는 비범한 육감을 가지고 있습니다. 마음이 어지러울 때는 미간 사이에 따뜻한 남색의 빛이 돌고 있다고 상상해보세요." },
        "목": { name: "제4 차크라: 아나하타 (사랑과 공감의 에너지) 💚", color: "초록색 (에메랄드)", gem: "에메랄드 / 제이드 (비취)", mantra: "얌 (YAM - 나는 사랑한다)", desc: "위로 당당히 뻗어나가며 만인을 어질게 배려하는 당신의 목 기운은 가슴 중앙의 사랑과 공감, 자비를 뜻하는 제4 아나하타 차크라와 완벽히 동조합니다. 사람을 진심으로 대하고 소통할 때 마음의 안정감이 최고조로 올라가며, 초록 식물이 가득한 숲을 걷는 것만으로도 영적인 치유가 완료됩니다." },
        "화": { name: "제3 차크라: 마니푸라 (자신감과 행동의 에너지) 💛", color: "황금색 / 노란색", gem: "황수정 (시트린) / 토파즈", mantra: "람 (RAM - 나는 행동한다)", desc: "세상을 찬란하게 밝히는 뜨거운 불 기운의 소유자인 당신은, 복부 중앙의 강력한 자신감, 행동력, 주도적 권세를 다스리는 제3 마니푸라 차크라의 보호를 받습니다. 내 안의 추진력을 당당히 발산할 때 소화력이 회복되고 온몸에 비타민 가득한 활기가 가득 차오릅니다. 나 자신을 무한히 신뢰하십시오." },
        "토": { name: "제1 차크라: 물라다라 (생활력과 자산의 든든한 에너지) ❤️", color: "붉은 갈색 / 레드", gem: "루비 / 가넷 / 자스퍼", mantra: "람 (LAM - 나는 실속있다)", desc: "너른 대지와 높은 바위산처럼 묵직하고 우직한 신뢰의 흙 기운인 당신은, 척추 끝자락의 삶의 생명력, 현실의 튼튼한 안전 기반, 경제적 실속을 주관하는 제1 물라다라 차크라의 강인한 뿌리를 내렸습니다. 현실 감각이 단단하고 성실하여, 살면서 어떤 풍파를 만나도 오뚝이처럼 결국 튼튼하게 자산을 일구는 힘의 원천입니다." },
        "금": { name: "제5 차크라: 비슈다 (표현과 소통의 에너지) 💎", color: "하늘색 / 스카이 블루", gem: "터키석 / 아쿠아마린", mantra: "함 (HAM - 나는 소통한다)", desc: "단정하고 예리하며 보석처럼 칼같은 결단력의 금 기운을 타고난 당신은, 목 부위의 정의로운 의사표현, 세련된 강연/발표, 공정한 커뮤니케이션을 다스리는 제5 비슈다 차크라가 맑게 틔어 있습니다. 내 생각을 왜곡 없이 솔직하고 명확하게 말할 때 창의성이 정점까지 피어나며, 지키지 못할 약속은 처음부터 거절하는 지혜가 필요합니다." }
    };

    const cur = oheng_chakra[ilGan.oheng] || oheng_chakra["토"];
    titleEl.textContent = cur.name;
    descEl.innerHTML = `
        <p class="mb-2"><strong class="text-indigo-200">[수호 차크라의 영성 축복]</strong></p>
        <p class="mb-3 font-sans text-gray-200 leading-relaxed">${cur.desc}</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-2.5 border-t border-indigo-500/20">
            <div><span class="text-gray-400 block text-[10px]">🎨 영적 수호 컬러</span><span class="text-indigo-300 font-bold">${cur.color}</span></div>
            <div><span class="text-gray-400 block text-[10px]">💎 힐링 가이드 보석</span><span class="text-indigo-300 font-bold">${cur.gem}</span></div>
            <div><span class="text-gray-400 block text-[10px]">🧘 강력 정화 만트라</span><span class="text-indigo-300 font-bold">${cur.mantra}</span></div>
        </div>
    `;
}

function renderCelticTree(month, day) {
    const titleEl = document.getElementById('celtic-destiny-title');
    const descEl = document.getElementById('celtic-destiny-desc');
    if (!titleEl || !descEl) return;

    const trees = [
        { name: "자작나무 (Birch) - 우아한 지혜의 상징 🌲", desc: "당신은 겨우내 추위를 인내하고 봄철 가장 먼저 순백의 맑은 껍질을 피워 올리는 자작나무의 영혼을 가졌습니다. 성품이 대단히 고귀하고 세련되었으며 복잡한 소음에 휩쓸리지 않는 다정하고 청초한 지혜가 훌륭합니다.", startM: 1, startD: 1, endM: 1, endD: 11 },
        { name: "느릅나무 (Elm) - 정의와 고결한 신뢰의 보호자 🌲", desc: "당신은 마을 한가운데서 시원한 그늘을 건네는 우직한 느릅나무와 같습니다. 공정함과 정의감이 삶의 제1가치관이라, 약자의 아픔을 먼저 어루만지고 약속을 지켜내는 충직한 매력으로 만인의 극찬을 부릅니다.", startM: 1, startD: 12, endM: 1, endD: 24 },
        { name: "편백나무 (Cypress) - 마음을 치유하는 은은한 온기 🌲", desc: "당신은 유해한 액운과 부정적인 정서를 차분하게 정화해 주는 피톤치드 가득한 편백나무의 기상입니다. 주위 사람들의 갈등을 조율해주고 조용한 쉼터를 제공해주어 귀인이 사방에 가득 따르는 복을 지녔습니다.", startM: 1, startD: 25, endM: 2, endD: 3 },
        { name: "소나무 (Pine) - 한겨울에도 기품을 품은 굳은 기상 🌲", desc: "당신은 눈보라가 치는 매서운 한겨울에도 정직한 초록빛을 잃지 않는 한결같은 낙락장송 소나무와 같습니다. 내면의 주체적인 원칙과 뚝심이 바위보다 굳세어, 가난을 딛고 맨손으로 자수성가하여 큰 부를 쌓을 그릇입니다.", startM: 2, startD: 4, endM: 2, endD: 18 },
        { name: "참나무 (Oak) - 웅장한 포용과 대지 같은 카리스마 🌲", desc: "당신은 웅장하고 깊은 뿌리를 가진 신령스러운 참나무의 카리스마를 타고났습니다. 도량이 바다처럼 널찍하고 어떤 실패를 만나도 흔들리지 않고 중심을 잡아 가문의 든든한 등대 노릇을 훌륭히 완수해 내는 명입니다.", startM: 3, startD: 1, endM: 3, endD: 31 },
        { name: "올리브나무 (Olive) - 평화와 기적의 지혜로운 빛 🌲", desc: "당신은 세상의 모든 미움과 차가움을 평화로운 올리브 가지로 따뜻하게 화합 시켜 버리는 기적의 소유자입니다. 성정이 한없이 다정해 다투기를 꺼리며, 양보와 사랑을 통해 차곡차곡 쌓인 인덕 덕분에 말년으로 갈수록 큰 복과 재물을 누리게 됩니다.", startM: 8, startD: 15, endM: 9, endD: 15 }
    ];

    let cur = trees.find(t => {
        if (month === t.startM && day >= t.startD && day <= t.endD) return true;
        return false;
    });

    if (!cur) {
        cur = { name: "사과나무 (Apple Tree) - 사랑과 달콤한 창조의 결실 🌲", desc: "당신은 탐스러운 금빛 사과 열매를 주렁주렁 매달아 풍요를 전하는 사랑의 사과나무를 수호신으로 삼고 태어났습니다. 정이 무척 많고 사교성이 쾌활하며, 창의적인 손재주와 임기응변이 좋아 어디서나 행복과 웃음의 복을 부르는 주인공입니다." };
    }

    titleEl.textContent = cur.name;
    descEl.innerHTML = `
        <p class="mb-2"><strong class="text-emerald-200">[성스러운 숲의 수호 조언]</strong></p>
        <p class="mb-3 font-sans text-gray-200 leading-relaxed">${cur.desc}</p>
        <p class="pt-2 text-[11px] text-emerald-400 font-serif-kr italic">"북유럽 수호나무 운세는 내 생일날 숲에서 나를 포근하게 지켜주는 나무 한 그루가 전하는 다정하고 든든한 응원의 한마디입니다."</p>
    `;
}

function monitorEmptyAdSlots() {
    const checkAds = () => {
        document.querySelectorAll('.ad-slot').forEach(slot => {
            const ins = slot.querySelector('ins.adsbygoogle');
            if (ins && ins.getAttribute('data-adsbygoogle-status') === 'done') {
                slot.style.display = 'block';
            } else {
                slot.style.display = 'none';
            }
        });
    };
    checkAds();
    setTimeout(checkAds, 1000);
    setTimeout(checkAds, 3000);
    setTimeout(checkAds, 7000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorEmptyAdSlots);
} else {
    monitorEmptyAdSlots();
}


// ==========================================================================
// [수정됨] 실시간 전생 오라클 게임 연산 및 해독 엔진 (나는 전생에 무엇이었을까?)
// ==========================================================================

const PAST_LIFE_ARCHETYPES = [
    {
        emoji: "👑", identity: "조선 시대 삼정승을 호령하던 영리한 대제학 (문관)",
        destiny: "당신은 전생에 고결한 선비이자 학문으로 조정의 대사를 조율하던 최고 품격의 대학자였습니다. 세상을 맑은 지혜와 대쪽 같은 문장으로 구석구석 정화하려 하던 고운 영혼이었습니다. 현생에서도 글을 다루거나 배움을 넓혀가며 깊은 통찰력을 발휘할 때 가장 큰 발복을 누리게 됩니다.",
        love: "전생에 책을 읽다 스치듯 눈이 맞은 양가댁 규수와 애틋하고 고운 시조 한 편을 나누는 정다우며 원숙한 정을 가졌습니다. 현생에서도 말귀가 잘 통하고 기품 있는 짝을 맞이합니다.",
        karma: "전생에 정직한 원칙으로 가문을 일으킨 덕분에, 현생에서도 성실함만 잃지 않는다면 중년 이후 마르지 않는 샘물처럼 편안하고 넉넉한 부귀의 자산을 착실히 일구어 냅니다."
    },
    {
        emoji: "⚔️", identity: "동로마 성벽을 충직하게 지켜낸 전설적인 명예 기사 (무관)",
        destiny: "당신은 정의를 수호하고 가문을 지키기 위해 일생의 목숨을 다한 불타는 기백의 명예로운 호위 대장이었습니다. 어떤 고난과 시련 앞에서도 어깨를 당당히 펴고 승부를 보던 카리스마가 돋보입니다. 현생에서도 공정하고 카리스마 있는 비즈니스를 주도해 나가며 큰 부를 쟁취합니다.",
        love: "가문을 위해 떠났으나 마침내 승전보를 안고 돌아와 평생을 약속한 소중한 정인과의 드라마틱한 의리와 로맨스를 가졌습니다. 일편단심 사랑을 펼치는 타입입니다.",
        karma: "약자를 배려한 충직한 카르마가 현생의 든든한 등대로서 작용하니, 어려운 일이 닥쳤을 때 나를 전폭적으로 지지해 주는 거대한 명예와 승진운이 따르게 됩니다."
    },
    {
        emoji: "🎨", identity: "고대 이집트 파라오의 벽화를 수놓던 천재적인 수석 조각가 (예술)",
        destiny: "당신은 고대 신전의 장엄한 은하수와 신들의 모습을 흙과 바위에 정밀히 수놓던 최고의 손재주를 가진 예술가였습니다. 감수성이 한없이 그윽하고 눈치가 기막히게 비상하여 세상의 모든 세련된 미학적 감각을 한 몸에 만끽하는 재주가 있었습니다. 현대에도 콘텐츠, 디자인, IT, 뷰티에서 천재성을 발휘합니다.",
        love: "밤하늘 은하수를 수놓은 신비로운 조각을 평생 챙겨주던 다정한 소울메이트와 말 없이 눈빛만 보아도 통하는 깊은 애정운을 품었습니다.",
        karma: "내가 만들어 낸 창작물이 곧바로 백만장자들의 지갑을 열게 만들던 재주입니다. 내 아이디어와 독창적 센스가 평생 마르지 않는 실속 돈줄을 기분 좋게 보장해 줍니다."
    },
    {
        emoji: "⛵", identity: "베네치아 물길을 종횡무진 개척하던 지혜로운 글로벌 유통 상인 (상인)",
        destiny: "당신은 동양과 서양의 모든 귀중한 보석과 향신료를 도도하게 흘려보내며 판을 크게 흔들던 글로벌 사업가였습니다. 상황 판단과 임기응변이 기막히게 영리하여, 사소한 트렌드 하나도 놓치지 않고 큰 유통 마진과 인덕으로 바꿔내던 통찰의 리더십을 주도했습니다. 현생에서도 사업 경영에 대길합니다.",
        love: "대륙을 오가는 길고 역동적인 여정 속에서도 편지 한 장에 영원한 정을 담아 보낸 의리 가득한 로맨스를 나눴습니다. 자유를 존중하는 짝과 대길합니다.",
        karma: "거대한 모험을 통해 자수성가를 이뤄낸 실용적 카르마입니다. 내 손을 거쳐 가는 모든 비즈니스 인연들이 마르지 않는 돈맥이 되어 평생을 부유하게 지켜줍니다."
    }
];

function calculatePastLifeGame() {
    const nameInput = document.getElementById('past-game-name');
    const catSelect = document.getElementById('past-game-category');
    const resultBox = document.getElementById('pastgame-result-box');
    const resEmoji = document.getElementById('pastgame-res-emoji');
    const resTitle = document.getElementById('pastgame-res-title');
    const resDesc = document.getElementById('pastgame-res-desc');

    if (!nameInput || !catSelect || !resultBox || !resEmoji || !resTitle || !resDesc) return;

    const name = nameInput.value.trim();
    if (!name) {
        alert("이름을 입력해 주세요!");
        return;
    }

    const cat = catSelect.value;

    // 이름의 글자 유니코드를 해시 시드화하여 전생 매칭 결정 (이름당 고유 전생 부여로 신뢰감 상승!)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i) * (i + 1);
    }
    
    const archetypeIdx = hash % PAST_LIFE_ARCHETYPES.length;
    const item = PAST_LIFE_ARCHETYPES[archetypeIdx];

    // 결과 렌더링
    resEmoji.textContent = item.emoji;
    resTitle.textContent = `${name} 님의 전생 실시간 오라클 결과`;

    let contentHtml = `<p class="font-bold text-cyan-300 text-xs mb-1.5">🌟 전생 신분: <strong class="text-white text-sm">${item.identity}</strong></p>`;
    
    if (cat === 'destiny') {
        contentHtml += `<p class="font-bold text-amber-300 text-xs mt-3 mb-1">🗝️ 내 영혼의 기질 해독</p><p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">${item.destiny}</p>`;
    } else if (cat === 'love') {
        contentHtml += `<p class="font-bold text-pink-400 text-xs mt-3 mb-1">💕 내 전생의 애달픈 사랑법</p><p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">${item.love}</p>`;
    } else if (cat === 'karma') {
        contentHtml += `<p class="font-bold text-emerald-400 text-xs mt-3 mb-1">🪙 지은 카르마와 현생 재물 비책</p><p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">${item.karma}</p>`;
    }

    contentHtml += `<p class="pt-2 text-[10px] text-gray-500 border-t border-cyan-500/20 mt-3">※ 전생 오라클은 이름에 담긴 소리 에너지의 파장을 정교하게 해시 대조해 풀어내는 신비 놀이터입니다. 재미있게 보시고 오늘 하루 나에게 주어진 축복을 듬뿍 누리세요!</p>`;

    resDesc.innerHTML = contentHtml;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ==========================================================================
// [수정됨] 프리미엄 킬러 명리 엔진 (나의 평생 수호 신수 오라클 & 천을귀인 만남 타이밍)
// ==========================================================================

// 1. 나의 평생 수호 신수(神獸) 오라클 해독
function renderGuardianBeast(saju) {
    const titleEl = document.getElementById('beast-destiny-title');
    const descEl = document.getElementById('beast-destiny-desc');
    if (!titleEl || !descEl) return;

    // 태어난 년도의 지지(띠)를 기반으로 4대 신수 및 동양 영수 매핑
    const beast_map = {
        0: { name: "현무 (玄武) - 지혜와 불멸을 수호하는 영수 🐢", desc: "당신을 평생 호위하고 수호하는 영수는 깊고 고요한 밤의 북방 지혜를 수호하는 [현무]입니다. 음양의 기류를 완벽히 조율하는 상징으로, 뛰어난 통찰력과 위기 극변 속에서도 묵묵히 실속 자산을 차곡차곡 모으고 생명을 오래토록 유지시켜 주는 은혜로운 영적인 방패 역할을 담당합니다." },
        1: { name: "기린 (麒麟) - 신의와 자비로운 부귀를 수호하는 영수 🦄", desc: "당신을 지켜주는 수호 영수는 어진 성정과 재물, 자손 번창의 축복을 상징하는 동양의 영험한 영수 [기린]입니다. 주변에 온화함과 기분 좋은 평화를 전파하며 만인에게 극찬을 유도하는 기상입니다. 약속을 우직하게 지킬수록 일생 부유하고 안락한 부귀 대복록이 도도하게 흐릅니다." },
        2: { name: "주작 (朱雀) - 열정과 찬란한 번영을 수호하는 영수 🦅", desc: "당신을 호위하는 영수는 하늘 높이 떠서 세상을 따뜻하게 밝히고 웅장하게 번영시키는 붉은 봉황 [주작]입니다. 불꽃처럼 뜨거운 추진력과 예술적 스타성을 품어, 남들이 주저하는 위기 앞에서 당당히 앞서며 명예의 최정상을 개척해 낼 수 있는 위풍당당한 수호 에너지를 의미합니다." },
        3: { name: "해태 (海陀) - 정의와 액막이를 지키는 수호의 영수 🦁", desc: "당신을 지키는 영수는 사악한 화마와 액운을 머리로 받아쳐 물리치고, 공정함과 행운을 가져다주는 상상의 영물 [해태]입니다. 시비지심을 정확히 가리고 원칙을 세워 조직 안에서 고위 관운과 반듯한 명예의 도장을 받아낼 수 있도록 평생을 든든하게 호위하는 방어막입니다." },
        4: { name: "청룡 (靑龍) - 광활한 꿈과 여의주를 수호하는 용 🐲", desc: "당신을 호위하는 수호신은 구름을 가르고 하늘 위로 당당히 승천하는 오색 찬란한 비구름의 제왕 [청룡]입니다. 야망의 스케일이 타인과 궤도를 달리하며, 상상력과 창조적인 기획력으로 무장하여 단 한 번의 기회를 통해 세상의 모든 감투와 부귀를 손에 움켜쥐는 든든한 등대 기상입니다." },
        5: { name: "백호 (白虎) - 용맹함과 영험한 기세를 수호하는 백수의 왕 🐯", desc: "당신을 수호하는 신수는 태양의 강력한 서쪽 정기를 품어 사악한 액을 한 방에 물어뜯어 찢어발기는 용맹무쌍한 [백호]입니다. 강렬한 투지와 결단력을 선물하여, 프로페셔널한 실력 하나만으로 경쟁자들을 시원하게 제압하고 상층부를 거머쥐는 최고의 파괴력 가득한 행운 수호신입니다." }
    };

    const cur = beast_map[saju.nyeon.jiIdx % 6] || beast_map[4];
    titleEl.textContent = cur.name;
    descEl.innerHTML = `
        <p class="mb-2"><strong class="text-cyan-200">[사신도 동양 수호 영수 처방]</strong></p>
        <p class="mb-3 font-sans text-gray-200 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>
        <p class="pt-2 text-[11px] text-cyan-400 font-serif-kr italic">"나의 태어난 해의 정기가 동양의 영수와 상생 결속되어, 사소한 잔병치레와 해로운 손재수를 방어하고 가문을 수호하는 힘으로 평생 작용합니다."</p>
    `;
}

// 2. 천을귀인(天乙貴人) 인생 귀인 타이밍 & 방향 산출
function renderCheoneulGwiin(saju, ilGan) {
    const titleEl = document.getElementById('gwiin-destiny-title');
    const descEl = document.getElementById('gwiin-destiny-desc');
    if (!titleEl || !descEl) return;

    // 일간에 따른 천을귀인 띠 동물 매핑 (자평명리 공식 정밀 적용)
    // 갑무경 -> 축미 (소, 양) / 을기 -> 자신 (쥐, 원숭이) / 병정 -> 해유 (돼지, 닭) / 임계 -> 사묘 (뱀, 토끼) / 신 -> 오인 (말, 호랑이)
    const gwiin_map = {
        '갑': { animals: "소띠 (丑) 와 양띠 (未)", direction: "북동쪽 및 남서쪽", desc: "당신의 사주 구원 투수인 천을귀인은 우직한 소띠와 온화한 양띠입니다. 삶에서 큰 갈등이나 계약 정체에 직면했을 때 이 두 띠에 해당하는 귀인이 나타나 말 없이 든든하게 해결책과 재물의 힌트를 쥐여주게 됩니다." },
        '무': { animals: "소띠 (丑) 와 양띠 (未)", direction: "북동쪽 및 남서쪽", desc: "당신의 하늘이 내린 수호 귀인은 소띠와 양띠입니다. 인생에서 중요한 결정을 앞두고 있을 때, 성정이 듬직하고 조언을 아끼지 않는 이 두 띠를 만날 때 막혔던 운의 순환이 실시간 대길하게 트입니다." },
        '경': { animals: "소띠 (丑) 와 양띠 (未)", direction: "북동쪽 및 남서쪽", desc: "당신의 일생 수호 귀인은 소띠와 양띠입니다. 공과 사가 확실한 당신에게 묵직한 신뢰를 지켜주는 인덕이 되어 주며, 동업하거나 중요 결정을 함께 설계할 때 성공률이 곱절로 증폭됩니다." },
        '을': { animals: "쥐띠 (子) 와 원숭이띠 (申)", direction: "정북쪽 및 서남쪽", desc: "당신의 사주 구원 투수는 영리한 쥐띠와 재주 많은 원숭이띠입니다. 기획이나 문서 계약에서 막히는 상황이 있을 때 머리 회전이 비상한 이 두 귀인이 나타나 짜릿한 행운의 길잡이 노릇을 척척 수행해 줍니다." },
        '기': { animals: "쥐띠 (子) 와 원숭이띠 (申)", direction: "정북쪽 및 서남쪽", desc: "당신의 최고의 인덕 길성은 쥐띠와 원숭이띠입니다. 성품이 따뜻하고 꼼꼼한 당신에게 유연한 융통성과 돈이 굴러가는 활기찬 아이디어를 가득 주입해 주는 은혜로운 만남이 예약되어 있습니다." },
        '병': { animals: "돼지띠 (亥) 와 닭띠 (酉)", direction: "북서쪽 및 정서쪽", desc: "당신의 수호 귀인 동물은 지혜로운 돼지띠와 꼼꼼하고 단정한 닭띠입니다. 정열적이나 마무리가 성급할 수 있는 당신에게, 차분하게 돈의 흐름을 쥐여주고 완벽한 도장의 성취를 보장해 주는 일등 조력자의 띠입니다." },
        '정': { animals: "돼지띠 (亥) 와 닭띠 (酉)", direction: "북서쪽 및 정서쪽", desc: "당신의 인생 구원 길성은 돼지띠와 닭띠입니다. 마음이 섬세하여 쉽게 상처받기 쉬운 당신을 너른 포용력과 세련된 미적 감각으로 수호하며 귀중한 부의 자산을 불릴 문서를 가져다줍니다." },
        '임': { animals: "뱀띠 (巳) 와 토끼띠 (卯)", direction: "남동쪽 및 동쪽", desc: "당신의 인생 귀인 동물은 수려한 뱀띠와 생동감 넘치는 토끼띠입니다. 넓고 큰 기상을 가진 당신에게, 세련된 비즈니스 수완과 따뜻한 예술적 센스로 인생 무대를 글로벌하게 확장 시켜 줄 귀인들입니다." },
        '계': { animals: "뱀띠 (巳) 와 토끼띠 (卯)", direction: "남동쪽 및 동쪽", desc: "당신의 평생을 도울 천을귀인은 뱀띠와 토끼띠입니다. 영리하고 사색 깊은 당신에게, 실속 있는 금전 투자와 다정다감한 대인관계 끈을 넓혀 주어 삶을 풍요롭게 보좌하는 수호신들입니다." },
        '신': { animals: "말띠 (午) 와 호랑이띠 (寅)", direction: "정남쪽 및 동북쪽", desc: "당신의 하늘이 내린 최고의 귀인은 힘찬 말띠와 용맹한 호랑이띠입니다. 보석처럼 깔끔하고 예민한 당신에게, 가슴 탁 트이는 호쾌한 기상과 스케일이 큰 사업적 재물 기획을 가득 선물하는 환상의 인덕입니다." }
    };

    const cur = gwiin_map[ilGan.name] || gwiin_map['갑'];
    
    // 귀인 만남 대길 골든 타이밍 연산 (대운과 세운을 조율)
    const nowYr = new Date().getFullYear();
    const luckyYears = `${nowYr + 2}년 및 ${nowYr + 5}년`;

    titleEl.textContent = `🤝 내 인생을 수호하는 천을귀인 (貴人) 비책`;
    descEl.innerHTML = `
        <p class="mb-2"><strong class="text-amber-300">[천을귀인 수호 조언]</strong></p>
        <p class="mb-3 font-sans text-gray-200 leading-relaxed text-xs sm:text-sm">${cur.desc}</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-2.5 border-t border-amber-500/20">
            <div><span class="text-gray-400 block text-[10px]">🐮 귀인 동물 띠</span><span class="text-amber-300 font-bold">${cur.animals}</span></div>
            <div><span class="text-gray-400 block text-[10px]">🧭 귀인이 찾아오는 수호 방향</span><span class="text-amber-300 font-bold">${cur.direction}</span></div>
            <div><span class="text-gray-400 block text-[10px]">⏰ 귀인을 만나는 최적의 골든 타이밍</span><span class="text-amber-300 font-bold">${luckyYears} 내외의 세운 시기</span></div>
        </div>
    `;
}
