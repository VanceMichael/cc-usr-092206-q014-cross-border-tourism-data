import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDomain } from '../src/domain.js';

test('样例领域标识正确', async () => {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  const value = parseDomain(raw);
  assert.equal(value.domain, 'cross-border-tourism-data');
  assert.ok(value.constraints.length >= 2);
});

test('样例覆盖来源负责与变更传播要求', async () => {
  const raw = await readFile(new URL('../fixtures/domain.json', import.meta.url), 'utf8');
  const value = parseDomain(raw);
  assert.equal(value.version, 2);
  assert.ok(value.content_types.includes('实时提醒'));
  assert.ok(value.change_events.includes('来源撤回'));
  assert.ok(value.workflow.some((step) => step.includes('审核')));
  assert.ok(value.constraints.some((item) => item.includes('完整度')));
});

test('缺少变更事件时拒绝读取', () => {
  const broken = JSON.stringify({
    domain: 'cross-border-tourism-data',
    version: 2,
    sample_id: 'record-015',
    actors: ['目的地文旅机构', '国际游客'],
    content_types: ['景点', '路线'],
    facts: ['事实一', '事实二'],
    workflow: ['来源机构提交资料', '对应机构审核'],
    constraints: ['多国文旅资料', '授权使用范围']
  });
  assert.throws(() => parseDomain(broken), /缺少必要字段/);
});
