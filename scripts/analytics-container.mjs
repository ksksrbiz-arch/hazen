// Build a reviewable GTM import from the UI-exported base container.
import {readFile, writeFile} from 'node:fs/promises';
const source = process.argv[2];
const output = process.argv[3];
if (!source || !output) throw new Error('Usage: node scripts/analytics-container.mjs export.json output.json');
const data = JSON.parse(await readFile(source, 'utf8'));
const cv = data.containerVersion;
if (cv.container.publicId !== 'GTM-WG4QVGN8') throw new Error('Wrong container');
const ids = {accountId: cv.accountId, containerId: cv.containerId};
const param = (key, value) => ({type: 'TEMPLATE', key, value});
const row = (key, value) => ({type: 'MAP', map: [param('parameter', key), param('parameterValue', value)]});
const fields = [
  'page_location',
  'page_referrer',
  'page_title',
  'page_type',
  'action',
  'placement',
  'item_id',
  'form_type',
  'search_scope',
  'listing_owner',
  'listing_id',
  'count',
  'percent'
];
cv.variable = fields.map((field, index) => ({
  ...ids,
  variableId: String(20 + index),
  name: 'DLV - ' + field,
  type: 'v',
  parameter: [param('name', field), {type: 'INTEGER', key: 'dataLayerVersion', value: '2'}]
}));
const events = [
  ...(await readFile('src/analytics.js', 'utf8'))
    .match(/const events = new Set\(\[([^\]]+)\]/)[1]
    .matchAll(/'([^']+)'/g)
].map(m => m[1]);
const trigger = (id, name, pattern) => ({
  ...ids,
  triggerId: id,
  name,
  type: 'CUSTOM_EVENT',
  customEventFilter: [{type: 'MATCH_REGEX', parameter: [param('arg0', '{{_event}}'), param('arg1', pattern)]}],
  filter: [
    {
      type: 'MATCH_REGEX',
      parameter: [
        param('arg0', '{{Page Hostname}}'),
        param('arg1', '^(bradhazen\\.com|bradhazen\\.realtypronw\\.net)$')
      ]
    }
  ]
});
cv.trigger = [
  trigger('10', 'Brad - analytics ready', '^brad_analytics_ready$'),
  trigger('11', 'Brad - approved interactions', '^(' + events.join('|') + ')$')
];
const base = cv.tag.find(t => t.tagId === '3');
base.firingTriggerId = ['10'];
base.parameter = [
  param('destinationId', 'G-QSEE7DZFHP'),
  {
    type: 'LIST',
    key: 'configSettingsTable',
    list: [
      row('send_page_view', 'false'),
      row('page_location', '{{DLV - page_location}}'),
      row('page_referrer', '{{DLV - page_referrer}}'),
      row('allow_google_signals', 'false'),
      row('allow_ad_personalization_signals', 'false')
    ]
  }
];
cv.tag.push({
  ...ids,
  tagId: '7',
  name: 'GA4 - Brad website interactions',
  type: 'gaawe',
  parameter: [
    param('measurementIdOverride', 'G-QSEE7DZFHP'),
    param('eventName', '{{Event}}'),
    {type: 'LIST', key: 'eventSettingsTable', list: fields.map(field => row(field, '{{DLV - ' + field + '}}'))}
  ],
  firingTriggerId: ['11'],
  tagFiringOption: 'ONCE_PER_EVENT',
  consentSettings: {
    consentStatus: 'NEEDED',
    consentType: {type: 'LIST', list: [{type: 'TEMPLATE', value: 'analytics_storage'}]}
  }
});
for (const setting of cv.gtagConfig) {
  if (setting.type === 'ogt_auto_events' && setting.parameter.some(p => p.value !== 'false'))
    throw new Error('Automatic events must be off');
  if (setting.type === 'ogt_1p_data_v2' && !setting.parameter.some(p => p.key === 'isEnabled' && p.value === 'false'))
    throw new Error('User data must be off');
}
await writeFile(output, JSON.stringify(data, null, 2) + '\n');
console.log('Prepared two tags, two triggers, ' + fields.length + ' variables. No personal-data collection.');
