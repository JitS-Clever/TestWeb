/* ═══════════════════════════════════════════════════════════
   FinVest – CleverTap Integration + Page Logic
   Inspired by Groww × Upstox design patterns
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    // CT: Page Viewed
    const urlParams = new URL(document.location).searchParams;
    const pageDict  = { PageName: 'FinVest', PageType: 'Stock Broker Platform' };
    urlParams.forEach((v, k) => { pageDict[k] = v; });
    clevertap.event.push('Page Viewed', pageDict);

    initAdCarousel();
    initMobileMenu();
    initTicker();
    initMFTabs();
    initGainersLosersTabs();

    // Give CT ~1.5s to fire native display; fall back to static data
    setTimeout(populateStaticRecentlyViewed, 1500);
});


/* ═══════════════════════════════════════════════════════════
   CT WEB NATIVE DISPLAY HANDLER

   Set up campaign in CT dashboard:
     Channel → Web Native Display  (works on ALL topics below)
     No target div needed – JS dispatches by "topic" KV key.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('CT_web_native_display', function (e) {
    console.log('[FinVest CT] Native Display received:', e.detail);
    const data = e.detail;
    clevertap.renderNotificationViewed(data);
    const kv    = data.kv;
    const topic = kv.topic;

    switch (topic) {
        /*
          ┌─ USE CASE 1: Last Visited Stock ──────────────────────────
          │  Segment: Users who viewed a stock in last 7 days
          │  Schedule: Real-time / on app open
          │  Sample KV →
          │  {
          │    "topic"      : "lastVisitedStock",
          │    "stockSymbol": "HDFCBANK",
          │    "stockName"  : "HDFC Bank Ltd.",
          │    "price"      : "1,672.30",
          │    "change"     : "+12.45",
          │    "changePct"  : "+0.75%",
          │    "high52w"    : "1,794.00",
          │    "low52w"     : "1,363.55",
          │    "mktCap"     : "₹12.7T",
          │    "pe"         : "19.2",
          │    "sector"     : "Banking",
          │    "volume"     : "14.2M",
          │    "trend"      : "up"
          │  }
          └──────────────────────────────────────────────────────────*/
        case 'lastVisitedStock':
            renderLastVisitedStock(kv);
            break;

        /*
          ┌─ USE CASE 2: Regulatory / Info Banner ────────────────────
          │  Segment: All users / KYC-pending users / specific cohorts
          │  Sample KV →
          │  {
          │    "topic"      : "regulatoryBanner",
          │    "type"       : "warning",
          │    "icon"       : "fa-triangle-exclamation",
          │    "heading"    : "SEBI Notice",
          │    "message"    : "Mandatory KYC update required by March 31.",
          │    "ctaText"    : "Update KYC",
          │    "ctaUrl"     : "#kyc",
          │    "dismissible": "true"
          │  }
          └──────────────────────────────────────────────────────────*/
        case 'regulatoryBanner':
            renderRegulatoryBanner(kv);
            break;

        /*
          ┌─ USE CASE 3: Recently Viewed (personalised) ──────────────
          │  Segment: Users with > 3 stock views in last 30 days
          │  Sample KV →
          │  {
          │    "topic"  : "recentlyViewed",
          │    "stocks" : "[{\"symbol\":\"RELIANCE\",\"name\":\"Reliance Industries\",\"price\":\"2847.50\",\"change\":\"+0.83%\",\"positive\":true,\"trend\":\"up\"},{\"symbol\":\"INFY\",\"name\":\"Infosys Ltd.\",\"price\":\"1423.55\",\"change\":\"-0.42%\",\"positive\":false,\"trend\":\"down\"}]"
          │  }
          └──────────────────────────────────────────────────────────*/
        case 'recentlyViewed':
            renderRecentlyViewed(kv);
            break;

        /*
          ┌─ USE CASE 4: Top Ad Banner (personalised promo) ──────────
          │  Segment: First-time investors / high-AUM users / etc.
          │  Sample KV →
          │  {
          │    "topic"   : "topAdBanner",
          │    "bgColor" : "linear-gradient(135deg,#7B2FF7,#F107A3)",
          │    "badge"   : "Limited Offer",
          │    "heading" : "Zero Brokerage for 30 Days",
          │    "subtext" : "Open your account today and trade for free.",
          │    "ctaText" : "Open Account",
          │    "ctaUrl"  : "#open-account",
          │    "ctaColor": "#7B2FF7"
          │  }
          └──────────────────────────────────────────────────────────*/
        case 'topAdBanner':
            renderCtAdBanner(kv);
            break;

        default:
            console.warn('[FinVest CT] Unhandled topic:', topic);
    }
});


/* ═══════════════════════════════════════════════════════════
   RENDER: Last Visited Stock
   ═══════════════════════════════════════════════════════════ */
function renderLastVisitedStock(kv) {
    const el = document.getElementById('ctLastVisitedStock');
    if (!el) return;

    const isPos   = !String(kv.change).startsWith('-');
    const chgClr  = isPos ? 'var(--positive)' : 'var(--negative)';
    const arrow   = isPos ? '▲' : '▼';
    const spark   = generateSparklineSVG(kv.trend || (isPos ? 'up' : 'down'), isPos ? '#00B386' : '#E74C3C', 60, 22);

    el.innerHTML = `
        <div class="lvs-card ct-appear"
             onclick="ctTrackStockClick('${kv.stockSymbol}','${kv.stockName}','${kv.price}')">
            <div class="lvs-top">
                <div>
                    <div class="lvs-badge">Continue where you left off</div>
                    <div class="lvs-name">${kv.stockName || kv.stockSymbol}</div>
                    <div class="lvs-sub">${kv.stockSymbol} &nbsp;·&nbsp; ${kv.sector || 'Equity'} &nbsp;·&nbsp; Vol: ${kv.volume || '—'}</div>
                </div>
                <div>
                    <div class="lvs-price">₹${kv.price}</div>
                    <div class="lvs-chg" style="color:${chgClr};">${arrow} ${kv.change} &nbsp;(${kv.changePct})</div>
                    <div style="margin-top:8px; text-align:right;">${spark}</div>
                </div>
            </div>
            <div class="lvs-stats-bar">
                <div class="lvs-stat"><div class="stat-l">52W High</div><div class="stat-v">₹${kv.high52w || '—'}</div></div>
                <div class="lvs-stat"><div class="stat-l">52W Low</div><div class="stat-v">₹${kv.low52w  || '—'}</div></div>
                <div class="lvs-stat"><div class="stat-l">Mkt Cap</div><div class="stat-v">${kv.mktCap   || '—'}</div></div>
                <div class="lvs-stat"><div class="stat-l">P/E Ratio</div><div class="stat-v">${kv.pe     || '—'}</div></div>
            </div>
            <div class="lvs-actions">
                <button class="lvs-btn lvs-buy"
                    onclick="event.stopPropagation(); ctTradeClick('${kv.stockSymbol}','Buy')">Buy</button>
                <button class="lvs-btn lvs-sell"
                    onclick="event.stopPropagation(); ctTradeClick('${kv.stockSymbol}','Sell')">Sell</button>
                <button class="lvs-btn lvs-watch"
                    onclick="event.stopPropagation(); ctWatchlistClick('${kv.stockSymbol}')">+ Watchlist</button>
            </div>
        </div>`;
}

/* ═══════════════════════════════════════════════════════════
   RENDER: Regulatory Banner
   ═══════════════════════════════════════════════════════════ */
function renderRegulatoryBanner(kv) {
    const el = document.getElementById('ctRegBanner');
    if (!el) return;
    const type = kv.type || 'info';
    const icon = kv.icon || 'fa-circle-info';
    el.className = `show ${type}`;
    el.id = 'ctRegBanner';
    el.innerHTML = `
        <i class="fas ${icon} reg-icon"></i>
        <div class="reg-msg">
            ${kv.heading ? `<strong>${kv.heading}: </strong>` : ''}${kv.message || ''}
        </div>
        ${kv.ctaText ? `<a class="reg-cta" href="${kv.ctaUrl || '#'}">${kv.ctaText} →</a>` : ''}
        ${kv.dismissible === 'true'
            ? `<button class="reg-close" onclick="dismissRegBanner()">×</button>`
            : ''}`;
    clevertap.event.push('Regulatory Banner Viewed', { Type: type, Heading: kv.heading || '' });
}

function dismissRegBanner() {
    const el = document.getElementById('ctRegBanner');
    if (el) { el.className = ''; el.innerHTML = ''; }
    clevertap.event.push('Regulatory Banner Dismissed');
}

/* ═══════════════════════════════════════════════════════════
   RENDER: Recently Viewed (CT)
   ═══════════════════════════════════════════════════════════ */
function renderRecentlyViewed(kv) {
    let stocks = [];
    try { stocks = typeof kv.stocks === 'string' ? JSON.parse(kv.stocks) : kv.stocks; }
    catch (e) { console.error('[FinVest CT] Failed to parse stocks JSON', e); return; }
    if (!stocks?.length) return;

    const el = document.getElementById('ctRecentlyViewed');
    if (!el) return;
    el.innerHTML = stocks.map(s => rvChipHTML(s)).join('');
    el.dataset.ctFilled = '1';
}

/* ═══════════════════════════════════════════════════════════
   RENDER: CT Ad Banner
   ═══════════════════════════════════════════════════════════ */
function renderCtAdBanner(kv) {
    const slot = document.getElementById('ctAdSlot');
    if (!slot) return;
    slot.innerHTML = `
        <div class="ad-slide active ct-appear"
             style="background:${kv.bgColor || 'linear-gradient(135deg,#5B6CF9,#A855F7)'}; border-radius:var(--r-xl);">
            <div class="ad-content">
                ${kv.badge ? `<div class="ad-badge">${kv.badge}</div>` : ''}
                <h2>${kv.heading || ''}</h2>
                <p>${kv.subtext || ''}</p>
                <a class="ad-cta" href="${kv.ctaUrl || '#'}"
                   style="color:${kv.ctaColor || '#5B6CF9'}"
                   onclick="ctAdClick('CT Banner')">
                   ${kv.ctaText || 'Explore'} →
                </a>
            </div>
            ${kv.imageUrl ? `<img class="ad-img" src="${kv.imageUrl}" alt="">` : ''}
        </div>`;
    slot.classList.add('visible');
    clevertap.event.push('CT Banner Viewed', { BannerName: kv.heading });
}

/* ═══════════════════════════════════════════════════════════
   STATIC FALLBACK: Recently Viewed
   ═══════════════════════════════════════════════════════════ */
const STATIC_RV_STOCKS = [
    { symbol:'HDFCBANK',   name:'HDFC Bank',          price:'1,672.30', change:'+0.75%', positive:true,  trend:'up'  },
    { symbol:'INFY',       name:'Infosys Ltd.',        price:'1,423.55', change:'-0.42%', positive:false, trend:'down'},
    { symbol:'TCS',        name:'Tata Consultancy',    price:'3,842.70', change:'+1.12%', positive:true,  trend:'up'  },
    { symbol:'RELIANCE',   name:'Reliance Industries', price:'2,847.50', change:'+0.83%', positive:true,  trend:'up'  },
    { symbol:'ITC',        name:'ITC Ltd.',            price:'428.90',   change:'-0.15%', positive:false, trend:'flat'},
    { symbol:'BAJFINANCE', name:'Bajaj Finance',       price:'6,932.10', change:'+1.45%', positive:true,  trend:'up'  },
];

function populateStaticRecentlyViewed() {
    const el = document.getElementById('ctRecentlyViewed');
    if (!el || el.dataset.ctFilled === '1') return;
    el.innerHTML = STATIC_RV_STOCKS.map(s => rvChipHTML(s)).join('');
}

function rvChipHTML(s) {
    const clr   = s.positive ? 'var(--positive)' : 'var(--negative)';
    const arrow = s.positive ? '▲' : '▼';
    const spark = generateSparklineSVG(s.trend || (s.positive ? 'up' : 'down'),
                                       s.positive ? '#00B386' : '#E74C3C', 52, 20);
    return `<div class="rv-chip" onclick="ctTrackStockClick('${s.symbol}','${s.name}','${s.price}')">
        <div>
            <div class="rc-sym">${s.symbol}</div>
            <div class="rc-name">${s.name}</div>
        </div>
        <div class="rc-mid">${spark}</div>
        <div>
            <div class="rc-price">₹${s.price}</div>
            <div class="rc-chg" style="color:${clr};">${arrow} ${s.change}</div>
        </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   SPARKLINE GENERATOR (inline SVG – no library needed)
   ═══════════════════════════════════════════════════════════ */
const SPARK_PATHS = {
    'up':          (w,h) => `M 0,${h} C ${w*.15},${h*.75} ${w*.3},${h*.6} ${w*.45},${h*.45} C ${w*.6},${h*.3} ${w*.75},${h*.2} ${w},${h*.05}`,
    'up-volatile': (w,h) => `M 0,${h*.85} C ${w*.1},${h*.6} ${w*.2},${h*.9} ${w*.32},${h*.6} C ${w*.44},${h*.35} ${w*.55},${h*.55} ${w*.68},${h*.3} C ${w*.8},${h*.1} ${w*.92},${h*.2} ${w},${h*.05}`,
    'down':        (w,h) => `M 0,${h*.05} C ${w*.15},${h*.2} ${w*.3},${h*.35} ${w*.45},${h*.5} C ${w*.6},${h*.65} ${w*.75},${h*.78} ${w},${h}`,
    'down-volatile':(w,h)=> `M 0,${h*.1} C ${w*.1},${h*.3} ${w*.2},${h*.1} ${w*.32},${h*.35} C ${w*.44},${h*.55} ${w*.55},${h*.4} ${w*.68},${h*.65} C ${w*.8},${h*.85} ${w*.92},${h*.75} ${w},${h}`,
    'flat':        (w,h) => `M 0,${h*.5} C ${w*.2},${h*.42} ${w*.35},${h*.58} ${w*.5},${h*.48} C ${w*.65},${h*.38} ${w*.8},${h*.55} ${w},${h*.5}`,
};

function generateSparklineSVG(trend, color, w, h) {
    const fn   = SPARK_PATHS[trend] || SPARK_PATHS['flat'];
    const path = fn(w, h);
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="${path}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

/* ═══════════════════════════════════════════════════════════
   CT EVENT TRACKING
   ═══════════════════════════════════════════════════════════ */
function ctTrackStockClick(symbol, name, price) {
    clevertap.event.push('Stock Viewed', { StockSymbol: symbol, StockName: name, Price: price, Source: 'FinVest Home' });
    console.log('[CT] Stock Viewed →', symbol);
}

function ctTradeClick(symbol, type) {
    clevertap.event.push('Trade Initiated', { StockSymbol: symbol, TradeType: type });
    alert(`${type} order for ${symbol} placed! (Demo)`);
}

function ctWatchlistClick(symbol) {
    clevertap.event.push('Watchlist Added', { StockSymbol: symbol });
    alert(`${symbol} added to Watchlist! (Demo)`);
}

function ctFundClick(name, category, ret1y) {
    clevertap.event.push('Fund Viewed', { FundName: name, FundCategory: category, OneYearReturns: ret1y });
    console.log('[CT] Fund Viewed →', name);
}

function ctInvestClick(name, type, ev) {
    if (ev) ev.stopPropagation();
    clevertap.event.push('Invest Clicked', { FundName: name, InvestType: type });
    alert(`${type} in "${name}" initiated! (Demo)`);
}

function ctProductClick(name) {
    clevertap.event.push('Product Clicked', { ProductName: name, Section: 'Quick Access' });
    console.log('[CT] Product Clicked →', name);
}

function ctAdClick(name) {
    clevertap.event.push('Banner Clicked', { BannerName: name, Position: 'Hero' });
}

function ctIpoClick(name, status) {
    clevertap.event.push('IPO Viewed', { IPOName: name, Status: status });
}

/* ═══════════════════════════════════════════════════════════
   AD CAROUSEL
   ═══════════════════════════════════════════════════════════ */
let adIdx = 0, adTimer = null;

function initAdCarousel() {
    const slides = document.querySelectorAll('#staticAdSlides .ad-slide');
    const dots   = document.querySelectorAll('#adDots .ad-dot');
    if (!slides.length) return;

    function showAd(idx) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[idx].classList.add('active');
        if (dots[idx]) dots[idx].classList.add('active');
        adIdx = idx;
    }
    function next() { showAd((adIdx + 1) % slides.length); }

    window.adPrev  = () => { clearInterval(adTimer); showAd((adIdx - 1 + slides.length) % slides.length); adTimer = setInterval(next, 5000); };
    window.adNext  = () => { clearInterval(adTimer); next(); adTimer = setInterval(next, 5000); };
    window.adGoTo  = (i) => { clearInterval(adTimer); showAd(i); adTimer = setInterval(next, 5000); };

    adTimer = setInterval(next, 5000);

    const wrap = document.getElementById('adCarouselWrap');
    if (wrap) {
        wrap.addEventListener('mouseenter', () => clearInterval(adTimer));
        wrap.addEventListener('mouseleave', () => { adTimer = setInterval(next, 5000); });
    }
}

/* ═══════════════════════════════════════════════════════════
   TICKER
   ═══════════════════════════════════════════════════════════ */
function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (track) track.innerHTML += track.innerHTML; // duplicate for seamless loop
}

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
    const btn  = document.getElementById('fvMenuBtn');
    const menu = document.getElementById('fvMobileMenu');
    if (btn && menu) btn.addEventListener('click', () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block');
}

/* ═══════════════════════════════════════════════════════════
   MUTUAL FUND CATEGORY TABS
   ═══════════════════════════════════════════════════════════ */
function initMFTabs() {
    document.querySelectorAll('.mf-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.mf-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.cat;
            document.querySelectorAll('#mfTableBody tr').forEach(row => {
                if (category === 'all' || row.dataset.cat === category) {
                    row.classList.remove('hidden-row');
                } else {
                    row.classList.add('hidden-row');
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   GAINERS / LOSERS TABS
   ═══════════════════════════════════════════════════════════ */
function initGainersLosersTabs() {
    document.querySelectorAll('.gl-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.gl-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const which = this.dataset.which;
            document.querySelectorAll('.gl-panel').forEach(p => p.style.display = 'none');
            const target = document.getElementById(`gl-${which}`);
            if (target) target.style.display = 'block';
        });
    });
}
