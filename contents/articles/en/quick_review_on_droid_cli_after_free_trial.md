---
title: 'Droid CLI Review: Hands-On Experience After Free Trial'
description: 'Non-Comprehensive Droid CLI review covering TUI design, model agnosticism, MCP configuration, and permission management. Compare with Claude Code, opencode, and other CLI coding agents.'
tags:
  [
    'LLM',
    'vibe coding',
    'coding agent',
    'droid',
    'factory.ai',
    'reviews',
    'CLI tools',
    'AI assistant',
    'developer productivity',
    'TUI',
  ]
readingTime: 9
wordCount: 1734
publishDate: 2025-10-21
draft: false
featured: true
image: '@assets/images/droid_cli_02.png'
author: 'Robin Min'
translations: ['en', 'zh', 'ja']
metadata:
  title: 'Droid CLI Review: Hands-On Experience After Free Trial'
  description: 'In-depth Droid CLI review after free trial. Explore TUI design, model agnosticism, MCP configuration challenges, and comparisons with Claude Code, opencode, and Gemini CLI. Learn about strengths, limitations, and improvement areas.'

  canonical: 'https://surfing.salty.vip/articles/en/quick_review_on_droid_cli_after_free_trial'

  robots:
    index: true
    follow: true

  openGraph:
    type: 'article'
    locale: 'en_US'
    siteName: 'surfing.salty.vip'
    url: 'https://surfing.salty.vip/articles/en/quick_review_on_droid_cli_after_free_trial'
    images:
      - url: '@assets/images/droid_cli_02.png'
        width: 1200
        height: 630
        alt: 'Droid CLI Terminal User Interface with Status Bar'

  twitter:
    cardType: 'summary_large_image'
    site: '@salty.vip'
    handle: '@tangmian'
---

## Quick Review on Droid CLI After a Few Days Free Trial

A few days ago, I noticed someone introduce Droid CLI on Twitter. It looked like a great tool worth trying, and since it's offering a free trial, I decided to give it a shot. It turned out to be a great decision.

I've primarily used only the Droid CLI component so far, so all my comments are based on my personal experience with it. My observations may contain some misunderstandings, but these are my genuine thoughts after several days with the free trial.

I also use other alternative tools for similar tasks, so my comparisons are based on these tools rather than a comprehensive review of all major competitors in the market. For context, I've used:

- Claude Code
- Claude Code + z.ai's GLM 4.6
- opencode
- Gemini CLI
- cursor-agent ## only a few times

### How to Use Droid CLI

You can install and run Droid CLI with the following commands:

```bash
## install droid cli on macOS
curl -fsSL https://app.factory.ai/cli | sh

# Navigate to your project
cd /path/to/your/project

# Start interactive session
droid
```

Once you've installed Droid CLI, it creates a new directory `~/.factory` in your home directory. This directory stores all configuration files and operation history data related to Droid CLI.

### What I Liked About Droid CLI

#### Concise and Clean TUI

Droid CLI provides a concise and clean TUI (Terminal User Interface) that makes interaction straightforward. It has an intuitive layout that's easy to navigate. The status bar at the bottom of the screen is particularly useful—better than other tools I've used.

I first noticed the status bar when I copied some MCP-related configuration items from another source into Droid CLI's config file `~/.factory/mcp.json`. Unfortunately, due to some compatibility issue, it displayed an MCP entry with a red cross emoji, immediately alerting me to check and fix the configuration.

Due to a recent upgrade or some other unknown reason, I can't reproduce that error with the same configuration now. I've captured another screenshot to demonstrate what it looks like. Here's the screenshot showing Droid CLI checking MCP status after launch. Any MCP issues appear in red.

![Droid CLI Status Bar with Initializing Status](@assets/images/droid_cli_01.png)

Normally, it looks like this:
![Droid CLI Status Bar with Normal Status](@assets/images/droid_cli_02.png)

Everyone is developing CLI coding agents these days. Some are doing well, others not so much. The industry is still in its early stages. We'd better to revisit some of the best practices and solid designs we adopted in the pre-GUI era.

This brings me to my love-hate relationship with opencode. Opencode takes a different approach from other CLI coding agents. The opencode team uses Go to implement their TUI directly instead of leveraging terminal emulators on the end user's side—a good choice if they want to build something unique. Unfortunately, they're still working on refinements, and the user experience isn't always smooth. This is especially noticeable when working with IDE-embedded terminals like under VSCode, Cursor, or Zed, where opencode doesn't always render correctly.

One thing I appreciate about opencode is its well-designed sections, which help me quickly identify the context of each action. When you're juggling tons of commands and interactions, this becomes invaluable. If I could make one wish for Droid CLI, I'd hope the development team takes inspiration from opencode to make their interface even more user-friendly.

![opencode](@assets/images/opencode_screenshot.png)

#### Model Agnosticism

This feature is incredibly useful to me because it allows me to switch between different models without dealing with model-specific configuration details. With its BYOK mode, you can use your own API key to access your models, ensuring maximum flexibility and control over your data.

#### Restraint and Simplicity of Design philosophy

Some developers address this flexibility through OpenRouter integration. However, I've been using Claude Code with various tool support mechanisms recently—such as Claude Code Router or environment variable configurations. This approach lets me use Claude Code consistently across different models while leveraging Claude Code's powerful ecosystem. In my opinion, this solution appears more mature than other alternatives.

Before adopting this practice (using CC-router with Claude Code), I experimented with many CLI coding agents. This consumed considerable time and effort learning each one. What frustrated me most was that each tool created its own project settings folder, cluttering my project root with numerous dot-folders.

This is another reason I appreciate Droid CLI. Despite using it in my projects, Droid CLI doesn't create any dot-folders in my project root. Restraint is a virtue.

This is also why I have mixed feelings about task-master-ai, despite using it frequently. It intervenes too heavily in project structure. I will figure out a new tools to make it work better recently, I hope.

### Where Droid CLI Could Improve

#### Inconsistent Environment Variable Handling in MCP Configuration

This is a minor issue, but I want to highlight it to save others from the frustration I experienced. As mentioned earlier, Droid CLI uses `~/.factory/mcp.json` to store MCP configuration. Most of the configuration syntax matches other tools. However, when I copied my configuration from another tool, I encountered some issues. Here's the problematic configuration (simplified):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "$CONTEXT7_API_KEY"]
    },
    "deep-graph-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-code-graph@latest", "$CODEGPT_API_KEY", "$CODEGPT_GRAPH_ID"]
    }
  }
}
```

After some trial and error, I figured out a working configuration:

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "sh",
      "args": ["-c", "npx -y @upstash/context7-mcp --api-key \"$CONTEXT7_API_KEY\""]
    },
    "deep-graph-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-code-graph@latest", "$CODEGPT_API_KEY", "$CODEGPT_GRAPH_ID"]
    }
  }
}
```

The same configuration works perfectly with other coding agents, suggesting a parsing issue in Droid CLI. I included the deep-graph-mcp configuration to illustrate another inconsistency. If someone claims that Droid CLI's MCP configuration doesn't support environment variables, that's not entirely true—my deep-graph-mcp works fine with environment variables. It looks like a bash variable escaping issue, but a little bit weird only effects on the configuration on Context7. Anyway, this suggests an inconsistent implementation rather than a fundamental limitation.

#### Lack of Hook Support

I haven't found any hook mechanism in either the local config file or the official documentation. This is clearly a missing feature that limits end users' ability to automate tasks with Droid CLI.

#### Weak Permission Management

Here's the configuration for permission control in my config file:

```json
{
  // Commands that will be automatically allowed without confirmation.
  // Add commands here that you trust and use frequently.
  // Examples: "npm test", "git commit", "yarn build"
  "commandAllowlist": ["ls", "pwd", "dir", "tree", "git diff", "git log", "git status", "git show"],

  // Commands that will ALWAYS require confirmation, regardless of autonomy level.
  // These are dangerous commands that could cause data loss or system damage.
  // Add any additional dangerous commands specific to your environment.
  "commandDenylist": [
    "rm -rf /",
    "rm -rf /*",
    "rm -rf .",
    "rm -rf ~",
    "rm -rf ~/*",
    "rm -rf $HOME",
    "rm -r /",
    "rm -r /*",
    "rm -r ~",
    "rm -r ~/*",
    "mkfs",
    "mkfs.ext4",
    "mkfs.ext3",
    "mkfs.vfat",
    "mkfs.ntfs",
    "dd if=/dev/zero of=/dev",
    "dd of=/dev",
    "shutdown",
    "reboot",
    "halt",
    "poweroff",
    "init 0",
    "init 6",
    ":(){ :|: & };:",
    ":() { :|:& };:",
    "chmod -R 777 /",
    "chmod -R 000 /",
    "chown -R",
    "format",
    "powershell Remove-Item -Recurse -Force"
  ]
}
```

When I first saw this configuration, I immediately thought of numerous ways to bypass it. I suspect every programmer could find 101 ways around it if Droid CLI controls permissions by simply checking these string arrays in the configuration file.

While the development team has predefined some potentially harmful commands, this approach is far from sufficient and doesn't adequately protect end users from dangerous operations. I understand that implementing a full-featured permission control mechanism may not be the team's current priority, but there are some quick wins available.

Implementing a perfect permission control mechanism isn't easy. Even today, I'm not satisfied with most current coding agents' solutions, including industry-leading products like Claude Code. However, we could at least implement some form of sandboxing relatively quickly.

Again, looking back at computer science history, we've encountered similar issues multiple times—and more importantly, there are mature solutions available. For example, chroot is a simple mechanism that allows a process to have a different root directory than the one it started in. This can rapidly create a sandbox environment for any process and is mature and widely used in Linux systems. I estimate that this feature could be added to Droid CLI in a day or two, especially with the support of Droid CLI itself. This enhancement would help prevent harmful operations without needing to predefine tedious command lists in the configuration file.

#### Integration with Claude Agent SDK

If I could offer the development team just one suggestion, it would be to integrate with Claude Agent SDK as soon as possible rather than reinventing the wheel. According to the official website, Droid CLI already supports custom slash commands and is working on subagent support (Custom Droids), which makes sense.

I don't know their implementation plans, but if I were leading the development team, I'd seriously consider using a mature solution like Claude Agent SDK. This would not only save time and effort but also leverage Claude's established ecosystem, including providing seamless migration paths for existing Claude Code users. It would benefit both the development team and the business.

### Reference

- [opencode](https://github.com/sst/opencode)
- [chroot](https://en.wikipedia.org/wiki/Chroot)
