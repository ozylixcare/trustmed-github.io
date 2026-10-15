/* Shared storefront bottom navigation and admin header navigation for the storefront and admin workspace. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TMHeaderNav=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const paths={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
 store:'<path d="M4 10v11h16V10M3 4h18l1 6a3 3 0 0 1-5 2 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5-2Z M9 21v-6h6v6"/>',
 compare:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
 quote:'<path d="M7 3h10l3 3v15H4V3h3m1 5h8m-8 4h8m-8 4h5"/>',
 account:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 cart:'<path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
 dashboard:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 chart:'<path d="M3 3v18h18M7 16v-5m5 5V7m5 9v-8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5m10-5v5M3 11h18m-14 4h2m4 0h2m-8 3h2"/>',
 box:'<path d="m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5m-9 5v10M7 4l10 6"/>',
 offer:'<path d="m3 3 9 0 10 10-9 9L3 12Z"/><circle cx="7.5" cy="7.5" r="1"/><path d="m11 15 5-5"/>',
 heart:'<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 1 10 8 16 7-6 13-11 8-16Z"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 17 6-5 4 4 3-3 5 5"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
 doctor:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
 visitors:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 marketing:'<path d="m3 10 17-7v18L3 14Zm4 6 2 5h4l-2-6M20 8h2m-2 8h2"/>',
 returns:'<path d="M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12h-3"/>',
 audit:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 12h6m-6 5h4"/>'
};
function icon(key){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[key]||paths.dashboard)+'</svg>'}
const storeLinks=[['home','Home','/'],['store','Store','/shop'],['compare','Comparison','/compare'],['quote','Quotations','/prescription'],['account','Account','/account']];
function activeStore(hash){const p=(hash||'#/').replace(/^#/,'').split('?')[0];if(['/shop','/medicines','/offers'].includes(p)||p.startsWith('/product/'))return 'store';if(p==='/compare')return 'compare';if(['/my-care','/prescription'].includes(p))return 'quote';if(p==='/account')return 'account';if(['/cart','/checkout'].includes(p))return 'cart';return p==='/'?'home':''}
function link(key,label,href,active,badge=''){return '<a class="header-tab'+(active?' is-active':'')+'" href="'+href+'"'+(active?' aria-current="page"':'')+'><span class="header-tab-icon">'+icon(key)+badge+'</span><span class="header-tab-label">'+label+'</span></a>'}
function storefront(hash){const active=activeStore(hash);return storeLinks.map(([key,label,path])=>link(key,label,'#'+path,key===active)).join('')}
const adminIcons={dashboard:'dashboard',analytics:'chart',visitors:'visitors',calendar:'calendar',orders:'quote',prescriptions:'quote',returns:'returns',products:'box',inventory:'box',discounts:'offer',customers:'account',consultations:'doctor',appointments:'calendar',offers:'offer',marketing:'marketing',behaviour:'chart',banners:'image',media:'image',images:'image',editor:'settings',settings:'settings',audit:'audit'};
function admin(groups,current){return '<nav class="mobile-header-tabs admin-header-tabs" id="admin-header-tabs" aria-label="Mobile admin navigation">'+groups.flatMap(g=>g[1]).map(([key,label])=>link(adminIcons[key],label,'#/'+key,key===current)).join('')+'</nav>'}
function revealAdmin(rail,previousScroll){const active=rail?.querySelector('[aria-current="page"]');if(!active||!rail.clientWidth)return;rail.scrollLeft=previousScroll||0;if(active.offsetLeft<rail.scrollLeft||active.offsetLeft+active.offsetWidth>rail.scrollLeft+rail.clientWidth)rail.scrollLeft=active.offsetLeft-(rail.clientWidth-active.offsetWidth)/2}
return {icon,activeStore,storefront,admin,revealAdmin};
});
