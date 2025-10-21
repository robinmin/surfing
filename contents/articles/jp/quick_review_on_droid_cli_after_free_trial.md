---
title: 'Droid CLI レビュー：無料トライアル後の実体験'
description: 'TUI デザイン、モデル非依存性、MCP 設定、権限管理をカバーする包括的な Droid CLI レビュー。Claude Code、opencode などの CLI コーディングエージェントとの比較。'
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
  title: 'Droid CLI レビュー：無料トライアル後の実体験'
  description: '無料トライアル後の詳細な Droid CLI レビュー。TUI デザイン、モデル非依存性、MCP 設定の課題、Claude Code、opencode、Gemini CLI との比較を探る。強み、制限、改善点について学ぶ。'

  canonical: 'https://surfing.salty.vip/articles/jp/quick_review_on_droid_cli_after_free_trial'

  robots:
    index: true
    follow: true

  openGraph:
    type: 'article'
    locale: 'ja_JP'
    siteName: 'surfing.salty.vip'
    url: 'https://surfing.salty.vip/articles/jp/quick_review_on_droid_cli_after_free_trial'
    images:
      - url: '@assets/images/droid_cli_02.png'
        width: 1200
        height: 630
        alt: 'Droid CLI ターミナルユーザーインターフェースとステータスバー'

  twitter:
    cardType: 'summary_large_image'
    site: '@salty.vip'
    handle: '@tangmian'
---

## 数日間の無料トライアル後の Droid CLI クイックレビュー

数日前、Twitter で誰かが Droid CLI を紹介しているのを見かけました。試してみる価値のある素晴らしいツールに見えたので、ちょうど無料トライアルも提供されていたため、試してみることにしました。結果的にそれは良い決断でした。

これまでのところ、主に Droid CLI コンポーネントのみを使用しているため、すべてのコメントは私の個人的な経験に基づいています。私の観察には誤解が含まれている可能性がありますが、これらは無料トライアルの数日間を経た後の率直な感想です。

私は同様のタスクに他の代替ツールも使用しているため、市場のすべての主要競合他社の包括的なレビューではなく、これらのツールに基づいた比較となっています。背景として、私が使用したことがあるのは：

- Claude Code
- Claude Code + z.ai の GLM 4.6
- opencode
- Gemini CLI
- cursor-agent ## 数回のみ

### Droid CLI の使い方

以下のコマンドで Droid CLI をインストールして実行できます：

```bash
## install droid cli on macOS
curl -fsSL https://app.factory.ai/cli | sh

# Navigate to your project
cd /path/to/your/project

# Start interactive session
droid
```

Droid CLI をインストールすると、ホームディレクトリに新しいディレクトリ `~/.factory` が作成されます。このディレクトリには、Droid CLI に関連するすべての設定ファイルと操作履歴データが保存されます。

### Droid CLI の気に入った点

#### 簡潔でクリーンな TUI

Droid CLI は、インタラクションを分かりやすくする簡潔でクリーンな TUI（ターミナルユーザーインターフェース）を提供しています。直感的なレイアウトで、ナビゲートしやすいです。画面下部のステータスバーは特に便利で、これまで使用した他のツールよりも優れています。

ステータスバーに最初に気づいたのは、他のソースから MCP 関連の設定項目を Droid CLI の設定ファイル `~/.factory/mcp.json` にコピーした時でした。残念ながら、互換性の問題により、赤いバツ印の絵文字付きで MCP エントリが表示され、設定を確認して修正するよう即座に警告してくれました。

最近のアップグレードまたは他の不明な理由により、現在は同じ設定でそのエラーを再現できなくなっています。それがどのように見えるかを示すために、別のスクリーンショットを撮りました。これは起動後に Droid CLI が MCP ステータスをチェックしているスクリーンショットです。MCP の問題があれば赤で表示されます。

![Droid CLI Status Bar with Initializing Status](@assets/images/droid_cli_01.png)

通常は次のように表示されます：
![Droid CLI Status Bar with Normal Status](@assets/images/droid_cli_02.png)

最近では誰もが CLI コーディングエージェントを開発しています。うまくいっているものもあれば、そうでないものもあります。この業界はまだ初期段階にあります。GUI 時代に移行する前に、前 GUI 時代に採用していたベストプラクティスや堅実なデザインを見直すべきでしょう。

これは opencode に対する私の愛憎の関係について考えさせます。Opencode は他の CLI コーディングエージェントとは異なるアプローチを採用しています。opencode チームは、エンドユーザー側のターミナルエミュレータを活用する代わりに、Go を使用して TUI を直接実装しています。独自のものを構築したい場合は良い選択です。残念ながら、まだ改良中であり、ユーザーエクスペリエンスは必ずしもスムーズではありません。これは VSCode、Cursor、Zed などの IDE 埋め込みターミナルで作業する場合に特に顕著で、opencode が常に正しくレンダリングされるとは限りません。

opencode について評価している点の一つは、よく設計されたセクションで、各アクションのコンテキストを素早く識別するのに役立ちます。大量のコマンドやインタラクションを扱っている時、これは非常に貴重です。Droid CLI に一つ願いを叶えられるとしたら、開発チームが opencode からインスピレーションを得て、インターフェースをさらにユーザーフレンドリーにしてくれることを望みます。

![opencode](@assets/images/opencode_screenshot.png)

#### モデル非依存性

この機能は、モデル固有の設定詳細を扱うことなく、異なるモデル間を切り替えることができるため、私にとって非常に便利です。BYOK（Bring Your Own Key）モードにより、自分の API キーを使用してモデルにアクセスでき、最大限の柔軟性とデータのコントロールが保証されます。

#### 抑制とシンプルさのデザイン哲学

一部の開発者は、OpenRouter 統合を通じてこの柔軟性に対処しています。しかし、私は最近、Claude Code Router や環境変数設定など、さまざまなツールサポートメカニズムを備えた Claude Code を使用しています。このアプローチにより、Claude Code の強力なエコシステムを活用しながら、異なるモデル間で一貫して Claude Code を使用できます。私の意見では、このソリューションは他の代替案よりも成熟しているように見えます。

この実践（CC-router と Claude Code を併用すること）を採用する前は、多くの CLI コーディングエージェントを試しました。それぞれを学習して使用するのにかなりの時間と労力を消費しました。最も困ったのは、各ツールが独自のプロジェクト設定フォルダを作成し、プロジェクトルートを多数のドットフォルダで散らかしてしまうことでした。

これは Droid CLI を評価するもう一つの理由です。プロジェクトで使用していても、Droid CLI はプロジェクトルートにドットフォルダを作成しません。抑制は美徳です。

これはまた、頻繁に使用しているにもかかわらず、task-master-ai に対して複雑な感情を持っている理由でもあります。プロジェクト構造への介入が重すぎます。最近、それをうまく機能させる新しいツールを見つけたいと思っています。

### Droid CLI が改善できる点

#### MCP 設定における環境変数処理の不一致

これは小さな問題ですが、私が経験したフラストレーションを他の人に味わってほしくないため、強調したいと思います。前述のように、Droid CLI は MCP 設定を保存するために `~/.factory/mcp.json` を使用します。設定構文のほとんどは他のツールと一致しています。しかし、別のツールから設定をコピーした時に問題が発生しました。以下は問題のある設定（簡略化版）です：

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

試行錯誤の末、動作する設定を見つけました：

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

同じ設定が他のコーディングエージェントでは完璧に動作することから、Droid CLI にパース問題があることが示唆されます。別の不一致を示すために deep-graph-mcp 設定を含めました。Droid CLI の MCP 設定が環境変数をサポートしていないと主張する人がいれば、それは完全には正しくありません。私の deep-graph-mcp は環境変数で問題なく動作します。これは bash 変数のエスケープ問題のように見えますが、Context7 の設定にのみ影響するのは少し奇妙です。いずれにせよ、これは根本的な制限ではなく、実装の不一致を示唆しています。

#### Hook サポートの欠如

ローカル設定ファイルにも公式ドキュメントにも、フックメカニズムは見つかりませんでした。これは明らかに欠けている機能で、エンドユーザーが Droid CLI でタスクを自動化する能力を制限しています。

#### 脆弱な権限管理

以下は、私の設定ファイルにおける権限制御の設定です：

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

この設定を初めて見た時、すぐに回避する方法が無数に思いつきました。Droid CLI が設定ファイルで定義されたこれらの文字列配列を単純にチェックすることで権限を制御している場合、すべてのプログラマーが 101 通りの回避方法を見つけられると思います。

開発チームは潜在的に有害なコマンドをいくつか事前定義していますが、このアプローチは十分とは程遠く、エンドユーザーを危険な操作から適切に保護できません。完全な機能を持つ権限制御メカニズムの実装が現在チームの優先事項ではないかもしれないことは理解していますが、いくつかの簡単に実現できる改善点があります。

完璧な権限制御メカニズムを実装するのは簡単ではありません。今日でも、Claude Code などの業界をリードする製品を含め、現在のコーディングエージェントのソリューションのほとんどに満足していません。しかし、少なくとも何らかの形のサンドボックスを比較的迅速に実装できるはずです。

再び、コンピュータサイエンスの歴史を振り返ると、私たちは同様の問題に何度も遭遇してきました。そしてさらに重要なのは、この種の問題に対する成熟したソリューションが数多くあることです。たとえば、chroot はプロセスが開始時とは異なるルートディレクトリを持つことを可能にする単純なメカニズムです。これにより、任意のプロセスのサンドボックス環境を迅速に作成でき、Linux システムで非常に成熟し広く使用されています。この機能は、特に Droid CLI 自身のサポートがあれば、1〜2日で Droid CLI に追加できると推定しています。この拡張機能は、設定ファイルで面倒なコマンドリストを事前定義する必要なく、有害な操作を防ぐのに役立ちます。

#### Claude Agent SDK との統合

開発チームに一つだけ提案できるとしたら、車輪の再発明をするのではなく、できるだけ早く Claude Agent SDK と統合することです。公式ウェブサイトによると、Droid CLI はすでにカスタムスラッシュコマンドをサポートしており、サブエージェントサポート（カスタム Droids）に取り組んでいるとのことで、それは理にかなっています。

実装計画は分かりませんが、もし私が開発チームをリードしているなら、Claude Agent SDK のような成熟したソリューションの使用を真剣に検討します。これは時間と労力を節約するだけでなく、Claude の確立されたエコシステムを活用でき、既存の Claude Code ユーザーにシームレスな移行パスを提供することも含まれます。これは開発チームとビジネスの両方に利益をもたらすでしょう。

### 参考資料

- [opencode](https://github.com/sst/opencode)
- [chroot](https://en.wikipedia.org/wiki/Chroot)
