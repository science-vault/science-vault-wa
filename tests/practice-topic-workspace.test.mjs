import test from 'node:test';import assert from 'node:assert/strict';import {questionStatus,summary,safeSessionKey} from '../practice-topic-workspace-core.mjs';
test('navigator priority and counts',()=>{assert.equal(questionStatus(true,true,false),'flagged');assert.equal(questionStatus(false,false,true),'current');assert.deepEqual(summary([true,false,true],[1],3),{answered:2,unanswered:1,flagged:1,total:3})});
test('session key isolates assigned tasks',()=>{assert.notEqual(safeSessionKey(['1'],'?task=A'),safeSessionKey(['1'],'?task=B'))});
