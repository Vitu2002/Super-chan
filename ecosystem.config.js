module.exports = {
  apps : [{
    name   : "anti-phishing",
    script : "npx ts-node --transpile-only src/modules/anti-phishing/core/index.ts"
  }, {
    name   : "captcha",
    script : "npx ts-node --transpile-only src/modules/captcha/core/index.ts"
  }, {
    name   : "links-manager",
    script : "npx ts-node --transpile-only src/modules/express/core/index.ts"
  }, {
    name   : "roles",
    script : "npx ts-node --transpile-only src/modules/roles/core/index.ts"
  }, {
    name   : "slashs",
    script : "npx ts-node --transpile-only src/modules/slashs/core/index.ts"
  }]
}
