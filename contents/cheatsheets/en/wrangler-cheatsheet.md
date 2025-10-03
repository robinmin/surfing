---
title: 'Wrangler CLI Cheatsheet'
pdfUrl: '/pdf/cheatsheets/en/wrangler-cheatsheet.pdf'
description: 'Complete Command Reference for Cloudflare Workers'
customCSS: |
  * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 10px;
              line-height: 1.6;
          }

          .container {
              max-width: 1200px;
              margin: 0 auto;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }

          .header {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              padding: 20px;
              text-align: center;
              color: white;
          }

          .header h1 {
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }

          .header p {
              font-size: 1.2rem;
              opacity: 0.9;
          }

          .content {
              padding: 20px;
              column-count: 3;
              column-gap: 15px;
          }

          .section {
              background: white;
              border-radius: 12px;
              padding: 15px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
              border: 1px solid rgba(0, 0, 0, 0.05);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 15px;
          }

          .section:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          }

          .section h2 {
              color: #333;
              font-size: 1.4rem;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 10px;
              padding-bottom: 10px;
              border-bottom: 3px solid;
              border-image: linear-gradient(45deg, #667eea, #764ba2) 1;
          }

          .section h3 {
              color: #555;
              font-size: 1.1rem;
              margin: 15px 0 8px 0;
              font-weight: 600;
          }

          .command {
              background: #1a1a1a;
              color: #00ff88;
              padding: 12px 15px;
              border-radius: 8px;
              font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
              font-size: 0.85rem;
              margin: 8px 0;
              position: relative;
              overflow-x: auto;
              border-left: 4px solid #00ff88;
          }

          .command::before {
              content: '$';
              color: #666;
              margin-right: 8px;
          }

          .description {
              color: #666;
              font-size: 0.9rem;
              font-style: italic;
              margin-bottom: 8px;
          }

          .icon {
              width: 20px;
              height: 20px;
              display: inline-block;
          }

          .setup { border-image: linear-gradient(45deg, #4CAF50, #45a049) 1; }
          .development { border-image: linear-gradient(45deg, #2196F3, #1976D2) 1; }
          .deployment { border-image: linear-gradient(45deg, #FF9800, #F57C00) 1; }
          .storage { border-image: linear-gradient(45deg, #9C27B0, #7B1FA2) 1; }
          .monitoring { border-image: linear-gradient(45deg, #F44336, #D32F2F) 1; }
          .advanced { border-image: linear-gradient(45deg, #607D8B, #455A64) 1; }

          .config-example {
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              padding: 15px;
              margin: 10px 0;
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.8rem;
              color: #495057;
              overflow-x: auto;
          }

          .tip {
              background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
              border-left: 4px solid #2196F3;
              padding: 12px 15px;
              margin: 10px 0;
              border-radius: 0 8px 8px 0;
              font-size: 0.9rem;
          }

          .tip::before {
              content: "💡 ";
              font-weight: bold;
          }

          .footer {
              background: #2c3e50;
              color: white;
              padding: 20px;
              text-align: center;
          }

          .footer a {
              color: #3498db;
              text-decoration: none;
              margin: 0 15px;
              transition: color 0.3s ease;
          }

          .footer a:hover {
              color: #5dade2;
          }

          @media (max-width: 768px) {
              .content {
                  grid-template-columns: 1fr;
                  padding: 20px;
              }

              .header {
                  padding: 30px 20px;
              }

              .header h1 {
                  font-size: 2.2rem;
              }
          }
tags: ['javascript', 'typescript', 'angular', 'html', 'ai']
readingTime: 3
wordCount: 522
publishDate: 2025-09-30
draft: false
featured: false
---

<div class="container">
        <div class="header">
            <h1>🛠️ Wrangler CLI</h1>
            <p>Complete Command Reference for Cloudflare Workers</p>
        </div>

        <div class="content">
            <div class="section setup">
                <h2>⚙️ Setup & Authentication</h2>

                <h3>Installation</h3>
                <div class="command">npm install -g wrangler</div>
                <div class="command">yarn global add wrangler</div>

                <h3>Authentication</h3>
                <div class="command">wrangler login</div>
                <div class="description">Login via browser</div>

                <div class="command">wrangler login --api-token TOKEN</div>
                <div class="description">Use API token directly</div>

                <div class="command">wrangler whoami</div>
                <div class="description">Check auth status</div>
            </div>

            <div class="section development">
                <h2>🚀 Development</h2>

                <h3>Project Init</h3>
                <div class="command">wrangler init my-worker</div>
                <div class="command">wrangler init --type typescript</div>

                <h3>Local Development</h3>
                <div class="command">wrangler dev</div>
                <div class="description">Start dev server</div>

                <div class="command">wrangler dev --port 8787</div>
                <div class="command">wrangler dev --local</div>
                <div class="command">wrangler dev --remote</div>

                <div class="tip">Use <code>--local</code> for speed, <code>--remote</code> for edge simulation</div>
            </div>

            <div class="section deployment">
                <h2>🚀 Deployment</h2>

                <h3>Basic Deploy</h3>
                <div class="command">wrangler deploy</div>
                <div class="description">Deploy to production</div>

                <div class="command">wrangler deploy --env staging</div>
                <div class="description">Deploy to environment</div>

                <div class="command">wrangler deploy --dry-run</div>
                <div class="description">Preview deployment</div>

                <h3>Management</h3>
                <div class="command">wrangler deployments list</div>
                <div class="command">wrangler rollback</div>
                <div class="command">wrangler delete my-worker</div>
            </div>

            <div class="section storage">
                <h2>💾 KV Storage</h2>

                <h3>Namespace Management</h3>
                <div class="command">wrangler kv:namespace create "MY_KV"</div>
                <div class="command">wrangler kv:namespace list</div>
                <div class="command">wrangler kv:namespace delete --binding MY_KV</div>

                <h3>Data Operations</h3>
                <div class="command">wrangler kv:key list --binding MY_KV</div>
                <div class="command">wrangler kv:key get "key" --binding MY_KV</div>
                <div class="command">wrangler kv:key put "key" "value" --binding MY_KV</div>
                <div class="command">wrangler kv:key delete "key" --binding MY_KV</div>

                <h3>Bulk Operations</h3>
                <div class="command">wrangler kv:bulk put data.json --binding MY_KV</div>
                <div class="command">wrangler kv:bulk delete keys.json --binding MY_KV</div>
            </div>

            <div class="section storage">
                <h2>🪣 R2 Storage</h2>

                <h3>Bucket Management</h3>
                <div class="command">wrangler r2 bucket create my-bucket</div>
                <div class="command">wrangler r2 bucket list</div>
                <div class="command">wrangler r2 bucket delete my-bucket</div>

                <h3>Object Operations</h3>
                <div class="command">wrangler r2 object put bucket/file.txt --file ./local.txt</div>
                <div class="command">wrangler r2 object get bucket/file.txt --file ./download.txt</div>
                <div class="command">wrangler r2 object list my-bucket</div>
                <div class="command">wrangler r2 object delete bucket/file.txt</div>
            </div>

            <div class="section storage">
                <h2>🗄️ D1 Database</h2>

                <h3>Database Management</h3>
                <div class="command">wrangler d1 create my-database</div>
                <div class="command">wrangler d1 list</div>
                <div class="command">wrangler d1 delete my-database</div>

                <h3>SQL Operations</h3>
                <div class="command">wrangler d1 execute my-db --command "SELECT * FROM users"</div>
                <div class="command">wrangler d1 execute my-db --file schema.sql</div>

                <h3>Migrations</h3>
                <div class="command">wrangler d1 migrations create my-db "add-users-table"</div>
                <div class="command">wrangler d1 migrations apply my-db</div>
                <div class="command">wrangler d1 migrations list my-db</div>
            </div>

            <div class="section development">
                <h2>📄 Pages</h2>

                <h3>Project Management</h3>
                <div class="command">wrangler pages project create my-site</div>
                <div class="command">wrangler pages project list</div>
                <div class="command">wrangler pages project delete my-site</div>

                <h3>Deployment</h3>
                <div class="command">wrangler pages deploy ./dist</div>
                <div class="command">wrangler pages deploy ./dist --project-name my-site</div>

                <h3>Functions</h3>
                <div class="command">wrangler pages functions build</div>
                <div class="command">wrangler pages dev ./dist</div>
            </div>

            <div class="section development">
                <h2>⚡ Workers Management</h2>

                <h3>Worker Operations</h3>
                <div class="command">wrangler deploy</div>
                <div class="description">Deploy worker to production</div>

                <div class="command">wrangler deploy --name my-custom-worker</div>
                <div class="command">wrangler deploy --env staging</div>

                <h3>Worker Info</h3>
                <div class="command">wrangler list</div>
                <div class="description">List all workers</div>

                <div class="command">wrangler delete my-worker</div>
                <div class="command">wrangler subdomain get</div>
                <div class="command">wrangler subdomain set my-subdomain</div>

                <h3>Configuration</h3>
                <div class="config-example"># wrangler.toml

name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"</div>

</div>

            <div class="section monitoring">
                <h2>📊 Monitoring & Logs</h2>

                <h3>Real-time Logs</h3>
                <div class="command">wrangler tail</div>
                <div class="description">View live logs</div>

                <div class="command">wrangler tail --status error</div>
                <div class="command">wrangler tail --method POST</div>
                <div class="command">wrangler tail --search "keyword"</div>

                <h3>Analytics</h3>
                <div class="command">wrangler analytics</div>
                <div class="command">wrangler pages deployment tail</div>

                <div class="tip">Use filters: <code>--status</code>, <code>--method</code>, <code>--search</code></div>
            </div>

            <div class="section advanced">
                <h2>🔐 Secrets & Env</h2>

                <h3>Secrets Management</h3>
                <div class="command">wrangler secret put SECRET_KEY</div>
                <div class="command">wrangler secret list</div>
                <div class="command">wrangler secret delete SECRET_KEY</div>

                <h3>Environment Variables</h3>
                <div class="command">wrangler secret put KEY --env staging</div>
                <div class="command">wrangler pages secret put KEY --project-name my-site</div>

                <div class="config-example"># wrangler.toml

[vars]
ENVIRONMENT = "production"
API_URL = "https://api.example.com"

[[kv_namespaces]]
binding = "MY_KV"
id = "namespace-id"</div>

</div>

            <div class="section advanced">
                <h2>🌐 Routes & Domains</h2>

                <h3>Route Management</h3>
                <div class="command">wrangler route add "api.example.com/*" my-worker</div>
                <div class="command">wrangler route list</div>
                <div class="command">wrangler route delete route-id</div>

                <h3>Custom Domains</h3>
                <div class="command">wrangler custom-domains list</div>
                <div class="command">wrangler custom-domains create example.com</div>

                <div class="tip">Routes take precedence over custom domains</div>
            </div>

            <div class="section advanced">
                <h2>🔧 Utilities</h2>

                <h3>Validation & Info</h3>
                <div class="command">wrangler validate</div>
                <div class="description">Validate wrangler.toml</div>

                <div class="command">wrangler --version</div>
                <div class="command">wrangler --help</div>

                <h3>Debugging</h3>
                <div class="command">WRANGLER_LOG=debug wrangler dev</div>
                <div class="command">wrangler dev --log-level debug</div>

                <h3>Cache & Cleanup</h3>
                <div class="command">rm -rf node_modules .wrangler</div>
                <div class="description">Clear build cache</div>

                <div class="tip">Set <code>WRANGLER_LOG=debug</code> for detailed logging</div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Quick Reference for Cloudflare Wrangler CLI</strong></p>
            <div style="margin-top: 15px;">
                <a href="https://developers.cloudflare.com/workers/wrangler/">📚 Documentation</a>
                <a href="https://github.com/cloudflare/workers-sdk">💻 GitHub</a>
                <a href="https://discord.gg/cloudflaredev">💬 Discord</a>
                <a href="https://community.cloudflare.com/">🌐 Community</a>
            </div>
        </div>
    </div>
