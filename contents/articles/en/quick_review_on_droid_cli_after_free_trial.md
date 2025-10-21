---
title: "Navigate to your project"
description: "A few days ago, I noticed someone introduced Droid CLI on twitter. It looks like a great tool I just want to have. Besides, it's providing some kind of free tri"
tags: ["javascript", "typescript", "angular", "python", "ai"]
readingTime: 9
wordCount: 1734
publishDate: 2025-10-21
draft: false
featured: false
---

## Quick Review on Droid CLI After a Few Days Free Trail

A few days ago, I noticed someone introduced Droid CLI on twitter. It looks like a great tool I just want to have. Besides, it's providing some kind of free trial so far. I decided to give it a try and it was a great decision.

I majorly just used Droid CLI part only so far, all my comments based on own experience on it. It may be wrong or some kind of misunderstanding. But that's what my thoughts after the free trial on these days.

I also use other alternatives tools to do the job, so my comparison is based on these tools, it's not a full review with the major competitors in the market. So far, I used:
- Claude Code
- Claude Code + z.ai's GLM 4.6
- opencode
- Gemini CLI
- cursor-agent  ## only a few times

### How to Use Droid CLI
You can install Droid CLI and run it by the following commands:
```bash
## install droid cli on macOS
curl -fsSL https://app.factory.ai/cli | sh

# Navigate to your project
cd /path/to/your/project

# Start interactive session
droid
```
Once you installed Droid CLI, it will create a new directory `~/.factory` under your home directory. This directory will store all the configuration files and data related to droid cli.

### What I Liked About Droid CLI
#### Concise and neat TUI
Droid CLI provides a concise and neat TUI (Terminal User Interface) that makes it easy to interact with the tool. It has a clean and intuitive layout, making it easy to navigate and use. Especially, the status bar at the bottom of the screen is very useful, better than other tools I used.

The reason I noticed its status bar is quite simple. I just copied some MCP related configuration items from others into its config file `~/.factory/mcp.json`. Unfortunately, for some incompatible reason / issue, it caused to show a MCP with a cross emoji all in red. It alerts me to check the configuration file and fix the issue.

Due to some new upgrade or other unknown reason, I can not reproduce it with the same configuration now. I just capture another screenshot to demostrate what it looks like. Here comes the screenshoot when Droid CLI is checking the MCPs status after the launch. In case of any MCP issue, it will be shown in red.

![Droid CLI Status Bar with Initializing Status](/Users/robin/projects/surfing/assets/images/droid_cli_01.png)

Normally, it looks like this one:
![Droid CLI Status Bar with Normal Status](/Users/robin/projects/surfing/assets/images/droid_cli_02.png)

Everybody is developing the CLI coding agent today. Some of them goes well, some of them goes not that well. Obviously, the industry is still in its early stages, and needs to flashback some best practices and good designs before we enter the GUI era.

Also, that's the reason I like opencodes, and that's the reason I hate it. Opencode goes a different way to build its CLI coding agent like others. Opencode team uses golang to implement their TUI directly instead of leveraging the terminal simulators on enduser's side, which is a good choice if they want to build something special. But, Unfortunately, they are still on the way, as sometimes we always found that it's still not very user-friendly. Especially, if you are working with some IDE embedded terminal, say vscode, cursor and zed, you will find that opncode is not always rendered correctly.

One thing I like about opencode is its well-designed sections, it helps me to identify the context of the action easily. When you are working tons of commands and interactions, You will find that it's very helpful. If I can make wish on Droid CLI, I hope the development team can inspire by opencode and make it more user-friendly.

![opencode](https://github.com/sst/opencode/raw/dev/packages/web/src/assets/lander/screenshot.png)

#### Model agnosticism
This feature is very useful to me, because it allows me to switch between different models and CLI tools without having to encounter any different details for each model and tools. 

#### Keep restraint
And, Someone dealing with this potential issue with OpenRouter. But for me, I tend to use Claude Code with some tools support recently. For example, Claude Code Router or Setting environment variables and etc. it helps me to use Claude Code consistently with different models, meanwhile I can leverage the powerful ecosystem of Claude Code. It looks more mature than other ways so far, in my opinion.

Before this practice(using CC-router with Claude Code), I tried so many CLI equivalents coding agents. That caused me to spend a lot of time and effort to learn and use them. Meanwhile, each tool has its own project setting folder, that really matters to me, it caused so many dot subfolders in my project root folder.

That's another reason I like Droid CLI. I used it in my project, but Droid CLI doesn't create any dot subfolders in my project root folder. Restraint is a virtue.

That's also the reason I hate one tool named as task-master-ai, despite I use it very frequently. It intervened too much for my project.

### What I think Droid CLI can be better

#### Inconsistency issue in MCP configuration with environment variables
Actually, it's a tiny issue, but I still want to point it out to avoid someone else's frustration like I did. As I mentioned before, Droid CLI uses `~/.factory/mcp.json` to store MCP configuration. Most of the configuration is the same with others. But when I copied my configuration from another tool, I encountered some issues. Here comes the problematic configuration(Already been simplified):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp",
        "--api-key",
        "$CONTEXT7_API_KEY"
      ]
    },
    "deep-graph-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-code-graph@latest",
        "$CODEGPT_API_KEY",
        "$CODEGPT_GRAPH_ID"
      ]
    }
  }
}
```

After a series of frustration, I figured out a way to work with:
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "sh",
      "args": [
        "-c",
        "npx -y @upstash/context7-mcp --api-key \"$CONTEXT7_API_KEY\""
      ]
    },
    "deep-graph-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "mcp-code-graph@latest",
        "$CODEGPT_API_KEY",
        "$CODEGPT_GRAPH_ID"
      ]
    }
  }
}
```

The same configuration is used for other coding agents and works well, so I think there must be some issue when parsing the configuration. The reason I put the configuration of deep-graph-mcp here is to show another inconsistent behavior. If someone says Drod CLI's mcp configuration does not support environment variables, it's not true. My deep-graph-mcp works well with environment variables. That's the reason I believe there must be some potential issue caused the inconsistency.

#### Lacking of Hook support mechanism
So far, I can not see any hook mechanism both in local config file and the official documentation. Obviously, it's a missing feature. It will limit the end user to do some automation tasks as well with Droid CLI.

#### Crispy Permission Management
Here comes the configuration for permission control in my config file:
```json
{
  // Commands that will be automatically allowed without confirmation.
  // Add commands here that you trust and use frequently.
  // Examples: "npm test", "git commit", "yarn build"
  "commandAllowlist": [
    "ls",
    "pwd",
    "dir",
    "tree",
    "git diff",
    "git log",
    "git status",
    "git show"
  ],

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
  ]}

```

I am not sure what your thoughts on this configuration. When I saw it at my first glance, I thought I have so many ways to bypass it. Actually, I guess that every programmer has 101 ways to bypass it, if Droid CLI controls the permissions by simple checking these string-arrays defined in the configuration file.

Despite the development team already predefined a set of commands maybe harmful, but it's still far away from enough, and can not protect end users to prevent these kinds of harmful operations. I understand that maybe it's not the development team's first priority right now to implement a full functional permission control mechanism, but we still have some quick wins. 

It's not easy to implement a perfect permission control mechanism. Even today, I am not satisfied with most of the current coding agents' solution, including the industry leading product like Claude Code. But we can at least have some kind of sandbox with a quick way.

Again, If you look back a few steps on the computer science history, you will find that we already encountered the same issue several times. And more importantly, there are so many mature solutions for this kind of issue. For example, there is a thing named as chroot. It's a simple mechanism that allows a process to have a different root directory than the one it was started in. This can be used to create a sandbox environment for any process rapidly. It's very mature and widely used in Linux systems.I guess one or two days we can attach this new feature to Droid CLI with Droid CLI's help. This tiny enhancement can help us to prevent some harmful operations and no longer need to predefine these tedious harmful commands in the configuration file as we just saw.

#### Integration with Claude Agent SDK
If I had the privilege of offering the development team one and only one suggestion, it would be integration with Claude Agent SDK as soon as possible and never ever to reinvent the wheel again. From the official website, I can see Droid CLI already supports to define slash commands now, and still one the way to support subagents(Custom Droids). It's make sense.

I don't know how they will implement these kinds of features, but if I were the development team leader, I would consider using a mature solution like Claude Agent SDK. It not only can help us to save time and effort, but also we can leverage the whole ecosystem of Claude already built up, including provide seamless migration efforts for Claude Code's existing users.

### Reference
- [opencode](https://github.com/sst/opencode)
- [chroot](https://en.wikipedia.org/wiki/Chroot)
