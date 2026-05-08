const major = Number(process.versions.node.split('.')[0]);
const supported = [22, 24];
if (!supported.includes(major)) { console.error(JSON.stringify({ ok: false, node: process.version, supported })); process.exit(1); }
console.log(JSON.stringify({ ok: true, node: process.version, preferred: '24.x LTS', supported }));
