/**
 * Template Verification Tests
 *
 * Verifies that all templates compile and have expected exports
 */

import * as componentMgmt from '../templates/component-management';
import * as tokenMgmt from '../templates/variables-tokens';
import * as assetMgmt from '../templates/asset-management';
import * as pageMgmt from '../templates/page-operations';
import * as codeMgmt from '../templates/custom-code-injection';
import * as eventMgmt from '../templates/event-subscriptions';
import * as authMgmt from '../templates/authentication-oauth';
import * as hybridMgmt from '../templates/hybrid-app-setup';

interface TestResult {
  template: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

const results: TestResult[] = [];

function testTemplate(name: string, module: any, expectedExports: string[]): void {
  try {
    let allExported = true;
    const missing: string[] = [];

    for (const exported of expectedExports) {
      if (!module[exported]) {
        allExported = false;
        missing.push(exported);
      }
    }

    if (allExported) {
      results.push({
        template: name,
        status: 'PASS',
        message: `All exports present: ${expectedExports.join(', ')}`
      });
    } else {
      results.push({
        template: name,
        status: 'FAIL',
        message: `Missing exports: ${missing.join(', ')}`
      });
    }
  } catch (error) {
    results.push({
      template: name,
      status: 'FAIL',
      message: `Import error: ${String(error)}`
    });
  }
}

// Test each template
testTemplate('component-management', componentMgmt, ['ComponentManager']);
testTemplate('variables-tokens', tokenMgmt, ['TokenManager']);
testTemplate('asset-management', assetMgmt, ['AssetManager']);
testTemplate('page-operations', pageMgmt, ['PageManager']);
testTemplate('custom-code-injection', codeMgmt, ['CodeInjector']);
testTemplate('event-subscriptions', eventMgmt, ['EventManager']);
testTemplate('authentication-oauth', authMgmt, ['OAuthManager']);
testTemplate('hybrid-app-setup', hybridMgmt, ['HybridAppSetup']);

// Report results
console.log('\n╔════════════════════════════════════════════╗');
console.log('║     WEBFLOW EXTENSION TEMPLATE TESTS      ║');
console.log('╚════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

for (const result of results) {
  const icon = result.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${result.template}`);
  console.log(`   ${result.message}\n`);

  if (result.status === 'PASS') passed++;
  else failed++;
}

console.log('═'.repeat(44));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(44) + '\n');

if (failed > 0) {
  console.error('❌ Some templates failed verification');
  process.exit(1);
} else {
  console.log('✅ All templates verified successfully\n');
}
