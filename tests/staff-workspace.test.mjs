import test from 'node:test';
import assert from 'node:assert/strict';
import {isStaffEmail,validateScope} from '../src/staffAccess.js';
import {MODELS,DEFAULT_SETTINGS,validateRecords,evaluate} from '../src/technicalModel.js';
test('staff email requires an exact company domain',()=>{
  for(const email of ['john@bluelinkconsults.com',' John@BlueLinkConsults.com '])assert.equal(isStaffEmail(email),true);
  for(const email of ['john@bluelinkconsult.com','john@bluelinkconsults.com.evil.test','john@sub.bluelinkconsults.com','john@gmail.com','john@@bluelinkconsults.com','@bluelinkconsults.com'])assert.equal(isStaffEmail(email),false);
});
test('project identity and scope are required',()=>{
  assert.equal(Object.keys(validateScope({})).length,4);
  assert.deepEqual(validateScope({company:'BlueLink',contact:'Platform team',scenario:'Release review',scope:'Production'}),{});
  assert.ok(validateScope({company:'  ',contact:'Team',scenario:'A',scope:'B'})['scope.company']);
});
test('every model rejects missing required parameters and accepts its examples',()=>{
  for(const model of MODELS){assert.ok(Object.keys(validateRecords(model,[{}],DEFAULT_SETTINGS)).length>0);assert.deepEqual(validateRecords(model,model.sample,DEFAULT_SETTINGS),{});const result=evaluate(model,model.sample,DEFAULT_SETTINGS,'NGN');assert.equal(result.module,model.id);assert.ok(result.metrics.length);assert.equal(JSON.stringify(result).includes('NaN'),false);}
  assert.equal(MODELS.some(m=>m.id==='data'),false);
});
test('blank and out-of-range assumptions do not silently become zero',()=>{
 const model=MODELS[0];assert.ok(validateRecords(model,model.sample,{...DEFAULT_SETTINGS,ramp:''}).ramp);
 assert.ok(validateRecords(model,model.sample,{...DEFAULT_SETTINGS,ramp:13,months:12}).ramp);
});
test('DevOps uses release labour and tooling costs, with explicit implementation timing',()=>{
 const model=MODELS.find(m=>m.id==='devops');const result=evaluate(model,model.sample,DEFAULT_SETTINGS,'NGN');
 assert.equal(result.rowResults[0].current,60);assert.equal(result.rowResults[0].target,20);
 assert.match(result.metrics[0].value,/40/);assert.match(result.metrics[1].value,/550,000/);assert.match(result.metrics[3].value,/5,650,000/);
 const stressed=evaluate(model,model.sample,{...DEFAULT_SETTINGS,releaseMultiplier:2},'NGN');assert.equal(stressed.rowResults[0].current,120);assert.equal(stressed.rowResults[0].target,40);
 assert.ok(result.findings.some(f=>f.rule==='DO-01'&&f.title.includes('recovery')));
});
