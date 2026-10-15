const {test}=require('node:test');
const assert=require('node:assert/strict');
const Core=require('../dist/store-core.js');
test('pincode check never invents coverage and matches only configured delivery areas',()=>{
 assert.equal(Core.deliveryStatus({},'388001').state,'unknown');
 const settings={serviceablePincodes:'388001, 380001\n400001'};
 assert.equal(Core.deliveryStatus(settings,'388001').state,'available');
 assert.equal(Core.deliveryStatus(settings,'110001').state,'unavailable');
 for(const p of ['38800','038800','3880010','<script>',''])assert.equal(Core.deliveryStatus(settings,p).state,'invalid');
});
test('admin delivery configuration rejects malformed coverage without breaking older states',()=>{
 const state=Core.seed();state.settings.serviceablePincodes='388001, 380001';assert.doesNotThrow(()=>Core.validate(state));
 state.settings.serviceablePincodes='388001, all';assert.throws(()=>Core.validate(state),/6-digit serviceable pincodes/);
 delete state.settings.serviceablePincodes;assert.doesNotThrow(()=>Core.validate(state));
});
test('WhatsApp handoff needs a configured valid number and preserves the message as data',()=>{
 assert.equal(Core.whatsappLink({},'hello'),'');
 assert.equal(Core.whatsappLink({whatsappNumber:'javascript:alert(1)'},'hello'),'');
 const message='Medicine quotation\nName: Sample & family\nPincode: 388001';
 const link=new URL(Core.whatsappLink({whatsappNumber:'919876543210'},message));
 assert.equal(link.origin,'https://wa.me');assert.equal(link.pathname,'/919876543210');assert.equal(link.searchParams.get('text'),message);
 assert(!link.searchParams.has('document'));assert(!link.searchParams.has('file'));
});
test('business WhatsApp default activates existing blank states without overriding later admin changes',()=>{
 const state=Core.seed();assert.equal(state.settings.whatsappNumber,'917265884137');assert(Core.whatsappLink(state.settings,'Quote').startsWith('https://wa.me/917265884137?'));
 delete state.contactSetupVersion;state.settings.whatsappNumber='';Core.validate(state);assert.equal(state.settings.whatsappNumber,'917265884137');
 state.settings.whatsappNumber='';Core.validate(state);assert.equal(state.settings.whatsappNumber,'');
 delete state.contactSetupVersion;state.settings.whatsappNumber='919876543210';Core.validate(state);assert.equal(state.settings.whatsappNumber,'919876543210');
});
