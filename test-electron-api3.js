try {
  const m = require.resolve('electron');
  console.log('Resolved electron to:', m);
} catch(e) {
  console.log('Resolve error:', e.message);
}
console.log('Module paths:', require.resolve.paths('electron'));
