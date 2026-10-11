import test from 'node:test';
import assert from 'node:assert/strict';
import {communityInquiryContext,inquiryDraftBody} from '../src/inquiry-model.js';

test('A known public community carries into a buyer inquiry and its prepared email',()=>{
 const context=communityInquiryContext('?community=brush-prairie',{camas:'Camas','brush-prairie':'Brush Prairie'});
 assert.deepEqual(context,{interest:'Buying a home',location:'Brush Prairie'});
 const data=new FormData();for(const [key,value] of Object.entries({...context,name:'Demo',email:'demo@example.com'}))data.set(key,value);
 assert.match(inquiryDraftBody(data),/Interest: Buying a home\nLocation \/ property: Brush Prairie/);
});
test('Unknown, duplicate and arbitrary query values cannot seed the inquiry',()=>{
 for(const search of ['', '?community=', '?community=unknown','?community=<script>','?community=__proto__','?community=camas&community=camas','?email=private@example.com&message=anything'])assert.equal(communityInquiryContext(search,{camas:'Camas'}),null);
 assert.deepEqual(communityInquiryContext('?community=camas&message=ignored',{camas:'Camas'}),{interest:'Buying a home',location:'Camas'});
});
