---
title: 'Task Master AI - Quick Reference'
pdfUrl: '/pdf/cheatsheets/en/taskmaster_cheatsheet.pdf'
tags: ['tools', 'AI', 'programming', 'task-master']
readingTime: 3
wordCount: 414
publishDate: 2025-10-02
draft: false
featured: true
description: 'AI-Powered Task Management for Development Projects • github.com/eyaltoledano/claude-task-master'
customCSS: |
  @media print {
              body { margin: 0; padding: 5mm; }
              .no-print { display: none; }
          }

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              font-size: 14px;
              line-height: 1.4;
              color: #1a1a1a;
              background: #f8f9fa;
              padding: 12px;
              max-width: 1400px;
              margin: 0 auto;
          }

          .container {
              background: white;
              border-radius: 6px;
              padding: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 12px;
          }

          .header h1 {
              font-size: 26px;
              color: #2563eb;
              margin-bottom: 3px;
              font-weight: 700;
          }

          .header p {
              font-size: 12px;
              color: #64748b;
          }

          .content {
              display: flex;
              flex-direction: column;
              gap: 12px;
          }

          .columns-container {
              display: flex;
              gap: 16px;
              align-items: flex-start;
          }

          .column {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 12px;
              min-width: 0;
          }
          
          .section {
              break-inside: avoid;
          }

          .section h2 {
              font-size: 17px;
              color: #2563eb;
              margin-bottom: 7px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-weight: 600;
              border-bottom: 1px solid #2563eb;
              padding: 5px 8px 4px 8px;
              background: #eff6ff;
              border-radius: 3px;
              margin-left: -8px;
              margin-right: -8px;
          }

          .command {
              margin-bottom: 8px;
              padding-left: 10px;
              border-left: 1px solid #e2e8f0;
          }

          .command:last-child {
              margin-bottom: 0;
          }

          .cmd {
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 12px;
              color: #0f172a;
              display: block;
              margin-bottom: 3px;
              font-weight: 500;
              line-height: 1.3;
          }

          .desc {
              font-size: 11px;
              color: #64748b;
              font-style: italic;
          }
          
          .param {
              color: #7c3aed;
              font-weight: 600;
          }

          .flag {
              color: #059669;
          }

          .alt h2 {
              color: #059669;
              border-bottom-color: #059669;
              background: #ecfdf5;
          }

          .alt {
              background: #dcfce7;
              border-left-color: #059669;
              border-radius: 4px;
              padding: 8px 6px;
          }

          .alt h2 {
              color: #059669;
              background: #ecfdf5;
              border-radius: 3px;
          }

          .info-box {
              background: #fef3c7;
              border-left: 3px solid #f59e0b;
              padding: 8px;
              border-radius: 4px;
              break-inside: avoid;
              margin-bottom: 8px;
          }

          .info-box h3 {
              font-size: 15px;
              color: #92400e;
              margin-bottom: 7px;
              font-weight: 600;
          }

          .info-box ul {
              list-style: none;
              font-size: 12px;
              color: #78350f;
          }

          .info-box li {
              margin-bottom: 4px;
              padding-left: 14px;
              position: relative;
          }

          .info-box li:before {
              content: "▸";
              position: absolute;
              left: 0;
              color: #f59e0b;
          }

          .badge {
              display: inline-block;
              font-size: 10px;
              padding: 3px 6px;
              background: #dbeafe;
              color: #1e40af;
              border-radius: 3px;
              font-weight: 600;
              margin-left: 4px;
          }
---

<div class="container">
        <div class="header">
            <h1>⚡ Task Master AI - Quick Reference</h1>
            <p>AI-Powered Task Management for Development Projects • github.com/eyaltoledano/claude-task-master</p>
        </div>
        
        <div class="content">
            <div class="columns-container">
                <div class="column">
                    <div class="section">
                        <h2>🚀 Setup & Init</h2>
                        <div class="command">
                            <code class="cmd">task-master init</code>
                            <span class="desc">Initialize new project with Task Master</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master parse-prd <span class="param">&lt;file&gt;</span></code>
                            <span class="desc">Parse PRD and generate initial tasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master generate</code>
                            <span class="desc">Generate task files from tasks.json</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>📋 View Tasks</h2>
                        <div class="command">
                            <code class="cmd">task-master list</code>
                            <span class="desc">List all tasks with status overview</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master list <span class="flag">--status=</span><span class="param">&lt;status&gt;</span></code>
                            <span class="desc">Filter tasks by status</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master list <span class="flag">--with-subtasks</span></code>
                            <span class="desc">Include subtasks in listing</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master next</code>
                            <span class="desc">Show next task to work on</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master show <span class="param">&lt;id&gt;</span></code>
                            <span class="desc">Show specific task details</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master show <span class="param">1.2</span></code>
                            <span class="desc">View specific subtask</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>✏️ Update Tasks</h2>
                        <div class="command">
                            <code class="cmd">task-master update <span class="flag">--from=</span><span class="param">&lt;id&gt;</span> <span class="flag">--prompt=</span>"..."</code>
                            <span class="desc">Update from specific task</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master update-task <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--prompt=</span>"..."</code>
                            <span class="desc">Update single task</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master update-subtask <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--prompt=</span>"..."</code>
                            <span class="desc">Append to subtask</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>🎯 Task Status</h2>
                        <div class="command">
                            <code class="cmd">task-master set-status <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--status=</span><span class="param">&lt;status&gt;</span></code>
                            <span class="desc">Set single task status</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master set-status <span class="flag">--id=</span><span class="param">1,2,3</span> <span class="flag">--status=</span><span class="param">&lt;status&gt;</span></code>
                            <span class="desc">Bulk status update</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master set-status <span class="flag">--id=</span><span class="param">1.1,1.2</span> <span class="flag">--status=</span><span class="param">&lt;status&gt;</span></code>
                            <span class="desc">Update subtask status</span>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="section">
                        <h2>🔍 Expand & Research</h2>
                        <div class="command">
                            <code class="cmd">task-master expand <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--num=</span><span class="param">&lt;n&gt;</span></code>
                            <span class="desc">Expand task with subtasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master expand <span class="flag">--all</span></code>
                            <span class="desc">Expand all pending tasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master expand <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--research</span></code>
                            <span class="desc">Research-backed expansion</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master expand <span class="flag">--all --force</span></code>
                            <span class="desc">Force regenerate subtasks</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>📊 Analysis</h2>
                        <div class="command">
                            <code class="cmd">task-master analyze-complexity</code>
                            <span class="desc">Analyze all task complexity</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master complexity-report</code>
                            <span class="desc">Display complexity report</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master analyze-complexity <span class="flag">--research</span></code>
                            <span class="desc">Research-backed analysis</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master analyze-complexity <span class="flag">--threshold=</span><span class="param">6</span></code>
                            <span class="desc">Custom complexity threshold</span>
                        </div>
                    </div>

                    <div class="section">
                        <h2>🔗 Dependencies</h2>
                        <div class="command">
                            <code class="cmd">task-master add-dependency <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--depends-on=</span><span class="param">&lt;id&gt;</span></code>
                            <span class="desc">Add task dependency</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master remove-dependency <span class="flag">--id=</span><span class="param">&lt;id&gt;</span> <span class="flag">--depends-on=</span><span class="param">&lt;id&gt;</span></code>
                            <span class="desc">Remove dependency</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master validate-dependencies</code>
                            <span class="desc">Validate dependencies</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master fix-dependencies</code>
                            <span class="desc">Auto-fix dependencies</span>
                        </div>
                    </div>

                    <div class="section alt">
                        <h2>🧹 Maintenance</h2>
                        <div class="command">
                            <code class="cmd">task-master clear-subtasks <span class="flag">--id=</span><span class="param">&lt;id&gt;</span></code>
                            <span class="desc">Clear subtasks from task</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master clear-subtasks <span class="flag">--all</span></code>
                            <span class="desc">Clear all subtasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master add-task <span class="flag">--prompt=</span>"..."</code>
                            <span class="desc">Add new task with AI</span>
                        </div>
                        <div class="command">
                            <code class="cmd">task-master add-task <span class="flag">--prompt=</span>"..." <span class="flag">--dependencies=</span><span class="param">1,2</span></code>
                            <span class="desc">Add task with dependencies</span>
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="section alt">
                        <h2>💬 MCP Chat Commands</h2>
                        <div class="command">
                            <code class="cmd">Initialize taskmaster-ai in my project</code>
                            <span class="desc">Set up Task Master</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Parse my PRD at .taskmaster/docs/prd.txt</code>
                            <span class="desc">Parse requirements</span>
                        </div>
                        <div class="command">
                            <code class="cmd">What's the next task I should work on?</code>
                            <span class="desc">Get next task</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Help me implement task <span class="param">3</span></code>
                            <span class="desc">Get AI assistance</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Show me tasks <span class="param">1, 3, 5</span></code>
                            <span class="desc">View multiple tasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Expand task <span class="param">4</span></code>
                            <span class="desc">Break into subtasks</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Research best practices for [topic]</code>
                            <span class="desc">Research-backed info</span>
                        </div>
                        <div class="command">
                            <code class="cmd">Change main model to <span class="param">claude-code/sonnet</span></code>
                            <span class="desc">Switch AI model</span>
                        </div>
                    </div>

                    <div class="section info-box">
                        <h3>🎛️ Research Flag</h3>
                        <ul>
                            <li>Add <code class="flag">--research</code> to update-task, update-subtask, expand, or analyze-complexity</li>
                            <li>Uses Perplexity AI for research-backed enhancements</li>
                            <li>Requires PERPLEXITY_API_KEY in config</li>
                            <li>Example: <code>task-master expand --id=5 --research</code></li>
                        </ul>
                    </div>

                    <div class="section info-box">
                        <h3>⚙️ Quick Tips</h3>
                        <ul>
                            <li><strong>Task IDs:</strong> Use comma-separated: <code>1,2,3</code></li>
                            <li><strong>Subtasks:</strong> Reference as <code>parentId.subtaskId</code> (e.g., <code>5.2</code>)</li>
                            <li><strong>Statuses:</strong> pending, in-progress, completed, review, deferred, cancelled</li>
                            <li><strong>MCP Mode:</strong> Use natural language in editor chat</li>
                            <li><strong>Claude Code:</strong> No API key needed with local Claude</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
