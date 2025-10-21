---
title: 'Droid CLI 试用体验'
description: '非全面的 Droid CLI 评测，涵盖 TUI 设计、模型无关性、MCP 配置和权限管理。与 Claude Code、opencode 等 CLI coding agent工具对比。'
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
author: 'Robin'

metadata:
  title: 'Droid CLI 试用体验'
  description: '深度 Droid CLI 评测。探索 TUI 设计、模型无关性、MCP 配置挑战，以及与 Claude Code、opencode 和 Gemini CLI 的对比。了解优势、局限性和改进方向。'

  canonical: 'https://surfing.salty.vip/articles/cn/quick_review_on_droid_cli_after_free_trial'

  robots:
    index: true
    follow: true

  openGraph:
    type: 'article'
    locale: 'zh_CN'
    siteName: 'surfing.salty.vip'
    url: 'https://surfing.salty.vip/articles/cn/quick_review_on_droid_cli_after_free_trial'
    images:
      - url: '@assets/images/droid_cli_02.png'
        width: 1200
        height: 630
        alt: 'Droid CLI 终端用户界面及状态栏'

  twitter:
    cardType: 'summary_large_image'
    site: '@salty.vip'
    handle: '@tangmian'
---

## Droid CLI 免费试用几天后的快速评测

几天前，我在 Twitter 上看到有人介绍 Droid CLI。它看起来是一个值得一试的工具，而且正好赶上免费试用，决定试一把。事实证明，还不错。

到目前为止，我主要只使用了 Droid CLI 组件，故所有评论都基于我的个人体验。我的观察可能包含一些误解，但这些是我在免费试用几天后的真实想法。

我也使用其他替代工具来完成类似的任务，所以我的比较是基于这些工具，而不是对市场上所有主要竞争对手的全面评测。为了提供背景信息，我使用过：

- Claude Code
- Claude Code + z.ai 的 GLM 4.6
- opencode
- Gemini CLI
- cursor-agent ## 只用过几次

### 如何使用 Droid CLI

你可以使用以下命令安装并运行 Droid CLI：

```bash
## install droid cli on macOS
curl -fsSL https://app.factory.ai/cli | sh

# Navigate to your project
cd /path/to/your/project

# Start interactive session
droid
```

安装 Droid CLI 后，它会在你的主目录下创建一个新目录 `~/.factory`。这个目录存储所有与 Droid CLI 相关的配置文件和操作历史数据。

### 我喜欢 Droid CLI 的地方

#### 简洁清爽的 TUI

Droid CLI 提供了一个简洁清爽的 TUI（终端用户界面），使交互变得简单直接。它的布局直观，易于导航。屏幕底部的状态栏特别有用——比我用过的其他工具都要好。

我第一次注意到状态栏是在我将一些 MCP 相关的配置项从其他来源复制到 Droid CLI 的配置文件 `~/.factory/mcp.json` 时。不幸的是，由于某些兼容性问题，它显示了一个带有红叉emoji的 MCP 条目，立即提醒我检查并修复配置。

由于最近的升级或其他未知原因，我现在已经无法用相同的配置重现该错误。我截取了另一张截图来演示它的样子。这是 Droid CLI 在启动后检查 MCP 状态的截图。任何 MCP 问题都会以红色显示。

![Droid CLI Status Bar with Initializing Status](@assets/images/droid_cli_01.png)

正常情况下，它看起来像这样：
![Droid CLI Status Bar with Normal Status](@assets/images/droid_cli_02.png)

现在每个人都在开发 CLI coding agent。有些做得很好，有些则不那么好。显然，这个行业仍处于早期阶段。我们最好回忆一下我们在前GUI时代曾经在这方面做过的最佳实践和扎实的设计。

这让我想到了我对 opencode 的又爱又恨。Opencode 采用了与其他 CLI coding agent不同的方法。opencode 团队使用 Go 直接实现他们的 TUI，而不是利用最终用户端的终端模拟器——如果他们想构建一些独特的东西，这是一个很好的选择。不幸的是，他们仍在进行改进，用户体验并不总是很流畅。这在使用 IDE 嵌入式终端（如 VSCode、Cursor 或 Zed）时尤其明显。

我很喜欢 opencode 的一点是它设计良好的分块，这帮助我快速识别每个操作的上下文。尤其是当你处理大量命令和交互时，这变得很清晰。如果我能为 Droid CLI 许一个愿的话，我希望开发团队能从 opencode 中汲取灵感，使其界面更加用户友好些。

![opencode](@assets/images/opencode_screenshot.png)

#### 模型无关性

这个功能对我来说非常有用，因为它允许我在不同的模型之间自由切换，而无需处理特定于模型的配置细节。通过其 BYOK（自带密钥）模式，你可以使用自己的 API 密钥访问模型，确保最大的灵活性和对数据的控制。

#### 克制与简约的设计哲学

一些开发者通过 OpenRouter 集成来解决这种灵活性问题。然而，我最近一直在使用具有各种工具支持机制的 Claude Code——比如 Claude Code Router 或环境变量配置。这种方法让我能够在不同模型间一致地使用 Claude Code，同时利用 Claude Code 强大的生态系统。在我看来，这个解决方案比其他替代方案更加成熟些。

在采用这种做法（将 CC-router 与 Claude Code 一起使用）之前，我尝试了许多 CLI coding agent。这花费了相当多的时间和精力来学习每一个。最让我沮丧的是，每个工具都会在项目根目录创建自己的项目设置文件夹，用大量的点文件夹弄乱我的项目根目录。

这是我欣赏 Droid CLI 的另一个原因。尽管在项目中使用它，Droid CLI 不会在我的项目根目录中创建任何点文件夹。克制是一种美德。

这也是我对 task-master-ai 有复杂感受的原因，尽管我经常使用它。它对项目结构的干预太重了。我希望最近能找到新的工具让它更好地工作。

### Droid CLI 可以改进的地方

#### MCP 配置中不一致的环境变量处理

这是一个小问题，但我想强调一下，以免其他人经历我所经历的挫折。如前所述，Droid CLI 使用 `~/.factory/mcp.json` 来存储 MCP 配置。大多数配置语法与其他工具匹配。然而，当我从另一个工具复制配置时，我遇到了一些问题。以下是有问题的配置（简化版）：

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

经过一番试错，我找到了一个可行的配置：

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

相同的配置在其他coding agent中运行良好，这表明 Droid CLI 存在解析问题。我包含了 deep-graph-mcp 配置来说明另一个不一致的行为。如果有人声称 Droid CLI 的 MCP 配置不支持环境变量，那并不完全正确——我的 deep-graph-mcp 在环境变量下运行良好。这看起来像是一个 bash 变量转义问题，但有点奇怪的是只影响 Context7 的配置。无论如何，这表明是实现不一致，而不是根本性的限制（不支持环境变量配置）。

#### 缺乏 Hook 支持

我在本地配置文件和官方文档中都没有找到任何 hook 机制。这显然是一个缺失的功能，限制了最终用户使用 Droid CLI 自动化任务的能力。

#### 薄弱的权限管理

以下是我配置文件中权限控制的配置：

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

当我第一次看到这个配置时，我立即想到了无数绕过它的方法。我怀疑如果 Droid CLI 通过简单检查配置文件中定义的这些字符串数组来控制权限，每个程序员都可以找到 101 种绕过它的方法。

虽然开发团队已经预定义并禁止了一些可能有害的命令，但这种方法远远不够，无法充分保护最终用户免受危险操作的影响。我理解实现一个功能齐全的权限控制机制可能不是团队当前的优先事项，但仍有一些快速获胜的机会。

实现完美的权限控制机制并不容易。即使在今天，我也不满意大多数当前coding agent的解决方案，包括行业领先的产品如 Claude Code。然而，我们至少可以相对快速地实现某种形式的沙盒。

再次回顾计算机科学历史，我们会发现日光之下无新鲜事：我们曾经多次遇到类似的问题——更重要的是，已经有许多成熟的解决方案可用。例如，chroot 是一个简单的机制，允许进程拥有与启动时不同的根目录。这可以快速为任何进程创建沙盒环境，并且在 Linux 系统中非常成熟和广泛使用。我估计这个功能可以在一两天内添加到 Droid CLI 中，特别是在 Droid CLI 本身的支持下。这个增强功能将有助于防止有害操作，而无需在配置文件中预定义繁琐的命令列表。

#### 与 Claude Agent SDK 集成

如果我能给开发团队提有且仅有的一个建议话，那就是尽快与 Claude Agent SDK 集成，而不是重新发明轮子。根据官方网站，Droid CLI 已经支持自定义斜杠命令，并且正在开发子代理支持（自定义 Droids），这是有道理的。

我不知道他们的实施计划，但如果我领导开发团队，我会认真考虑使用像 Claude Agent SDK 这样的成熟解决方案。这不仅可以节省时间和精力，还可以利用 Claude 已建立的生态系统，包括为现有 Claude Code 用户提供无缝迁移路径。这将使开发团队和业务都受益。

### 参考资料

- [opencode](https://github.com/sst/opencode)
- [chroot](https://en.wikipedia.org/wiki/Chroot)
