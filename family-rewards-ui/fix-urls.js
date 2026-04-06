const fs = require('fs');
const files = [
  './src/app/admin/stars/stars.component.ts',
  './src/app/admin/rewards/rewards.component.ts',
  './src/app/admin/penalties/penalties.component.ts',
  './src/app/admin/children/children.component.ts',
  './src/app/app.ts',
  './src/app/leaderboard/leaderboard.component.ts',
  './src/app/child/dashboard/child-dashboard.component.ts'
];
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('environment.apiUrl')) {
     const isAppTs = f.includes('app.ts');
     const isLeaderboard = f.includes('leaderboard.component.ts');
     let rel = '../../../environments/environment';
     if (isAppTs) rel = './environments/environment';
     if (isLeaderboard) rel = '../../environments/environment';
     
     if (!content.includes(rel)) {
         content = `import { environment } from '${rel}';\n` + content;
     }
  }
  content = content.replace(/http:\/\/localhost:5000/g, `\${environment.apiUrl.replace('/api', '')}`);
  fs.writeFileSync(f, content);
}
console.log('Fixed URLs in ts files');
