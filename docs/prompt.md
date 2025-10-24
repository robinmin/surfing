## Prompt

### Web site building

#### Background

I already prepared a script tool @scripts/create-cf-pages-site.sh to generate necessary resources for a Cloudflare Pages site with github repository. The script is under testing, so you need to find any potential issue when using.

Meanwhile, Recently, I need to build a new website to showcase some content I prepared with AI. I use Obsidian to write markdown files majorly. And I also have a lot of HTML files to upload to the website.

And, recently, I am learning Astro. So I want to build a website with Astro. I also used Hugo to build a website with markdown files. For some reason, I am not using it now. But I do want to build something like that can help to publish markdown files or HTML files easily to a website.

If We can define some ways to automatically extract metadata from markdown files which managed by Obsidian and publish to my new web site, it will be great.

#### Requirements

- Use script tool @scripts/create-cf-pages-site.sh to create a new Cloudflare Pages site and github repository. If any bug in the script, please report it to me, and fix it. Here comes the key information to use script tool @scripts/create-cf-pages-site.sh:
  - PROJECT_NAME: surfing
  - GITHUB_VISIBILITY: public
  - PRODUCTION_BRANCH: main
  - BUILD_OUTPUT_DIR: public? -- need to confirm with Astro and AstroWind
  - CLOUDFLARE_ACCOUNT_ID: I will input it when you need it.
  - CLOUDFLARE_API_TOKEN: I will input it when you need it.
  - CUSTOM_SUBDOMAIN: surfing.salty.vip
- Use the following technical tools to build the project of website:
  - Astro + Starter Templates: AstroWind (Already done)
  - Tailwind CSS (Already done)
  - Lucide Icons (Already done)
- For the implementation of the website, you need to do it with three steps: Step 1, Analyze the requirements and design the architecture of the website. Step 2, clarify with me the details of the website. Step 3, start to implement the website with above technical tools.

### publish tool

#### Background

As @README.md mentioned, it's difficult to use current system to publish markdown files or HTML files easily to a website. So I need to find a better way to build a website.

If we have customized command line toll `postsurfing` can take several paramters to help:

- decide which category we need to go with (Articles/Posts/Showcase/ and etc)
- For normal markdown file, check whether the necessary meta data in enough or not, whether we can padding them automatcly. According to the section of 'Frontmatter Schema', different category with different requirments on metada.
- For the HTML file(including Basic HTML Document and Migration Tips for Existing HTML, automaticly read the original data and convert them into the format surfing need)
- After the content been proceessed properly, run 'npm run build' to check everything is working properly or not. if yes, commit and push to github (use `gcm -m "[commit mssage here]" .` and `gpush`). Other wise, told user what happend

#### Goal

- Your works we split into 4 steps:
  - step 1, Understanding the requirment and have a roughly design on solution;
  - step 2, confirm with me the solution iteself and other unclear things, until erverything is read to implement it.
  - step 3, implemeent it and make sure everything is working well as expected.
  - step 4, add a set of comprehensive test cases for this tool in @tests, and fix all potential isssues untill all pass.
- Based on current situation, we'd better to use ts/mjs implemeent this tool into @script, then we can use some bash tools makee it's convinent to use everywhere for eevery body.
- The code must be stable and robust with well design error/exception handling, and necessary error/log information. Time goes by, nobody will remember the details of this project. we'd better to leet them what happen and how to deal with their situation.

### Fix current issues

We are building a website with GitHub Actions to publish to Cloudflare Pages. The website's URL is https://surfing.salty.vip/. Please use MCP Playwright to access it and help to identify the following issues:

- In home page's 'Latest Content' section, we did not show content block, but just three grey block without anything.
- In page 'https://surfing.salty.vip/articles/en/astro_tutorial/', we lost the content itself.
- In page 'https://surfing.salty.vip/browse/', we do have a block for 'Example Full HTML Document', but we you click on the hyperlink, you will be navigate to 'Example Full HTML Document'. Either remove the block or restore the link.(I prefer to remove it.)
- So far, we have nothing to show in page 'https://surfing.salty.vip/showcase/'. 'Surfing Platform' itself is not worthing to show as a idependent project here. Cleanup it.

### Fix missing Google Analytics code on the following pages:

- surfing.salty.vip/articles/en/astro_tutorial/
- surfing.salty.vip/articles/en/welcome-to-surfing/
- surfing.salty.vip/documents/

It looks like for the generated content we forgot the add google analytics code if the option in @src/config.yaml is turned on.s

### Add i18n support for web site

#### Background

We are working on a project based on Astro and AstroWind. Current folder is the source code's root folder. We use github Actrion to deploy the web site to cloudflare pages. You can always use MCP playwright to access the web site via https://surfing.salty.vip/ or access local server first via 'http://localhost:4321' (need to run 'npm run dev' first).

Right now we are working on supporting i18n for the web site. Here comes current requests:

As we can see the config item 'i18n' in @src/config.yaml. We want to turn this web site to support i18n with Chinese, English and Japanese.

#### Requirement

- add necessary support materials for Chinese, English and Japanese.
- Proority to choise i18n language: User preference(stored in cookcie all localStroage) > web browser's preefer language > default language 'en'
- Add a icon at the top left corner between 'Style' toggle and 'RSS' icon. Once this icon has been click, popup a dropdown list to select language, menu items including:🇨🇳, 🇺🇸, 🇯🇵. Once user selected particular one, change the i18n dynamicly and store user preferrence into cookcie all localStroage
- Forget the language of the contents and the folder of @scripts, we will have separated task on them to support i18n.

#### Current issue

A few things need to be enhnaced:

- 1, For the i18n switcher's menu item, flag only should be better as it's so clean and neat. Remove both of the name in original language and English.
- 2, we do have a language switcher now. But after we selected the language, nothing happend. I guess you forgot the prepare the string resources for i18n or missed the mechanism to switch it, For Astro i18n, you can refer to this web page on official web site for the details. Or you can use MCP Content7 to get the most latest document for Astro or AstroWind. Fix them all

We also need the support of i18n for the following pages:

- about page
- browse page
- articles page
- documents page
- showcase pages

### Refine the process of publishing cheatsheets

#### Background

According current process to publish cheatsheets, we have 3 steps to go through:

- Step 1: Call `./scripts/cheatsheet-processor.sh` to prepare and cache the HTML file
- Step 2: Use AI assistant with the streamlined prompt `docs/prompt_cheatsheets_streamlined.md`
- Step 3: Generate PDF and publish (automatic)

To streamline the whole process, we need to simplify the works in the prompt and avoid to call external function/execution external command, otherwise the process will always be interupted due to permission authorization.

#### Requirements

We also simplify the process in 4 steps, but a little bit different:

- Step 1: Renaming `./scripts/cheatsheet-processor.sh` as `./scripts/preprocess-cheatsheets.sh` and do some necessary enhance; The core functions of this script is to prepare and cache the HTML file as we are doing right now.
- Step 2: Use a optimized version of prompt `docs/prompt_cheatsheets.md`(based on current user prompt `docs/prompt_cheatsheets_streamlined.md` but remove the executions to next steps) to work with AI assistant with the refine the content itself and the layout. Trigger a call on MCP playwright to confirm with end user the refined HTML file.
- Step 3: End user review and approve the refined HTML file. If necessary, the user also need to call html2pdf to generate the PDF file and review it. In case of any issues, the user can revert to step 2 and try again with AI assistant.
- Step 4: Add a new script named as `./scripts/postprocess-cheatsheets.sh` to postprocess the follow up things to publish the cheatsheet to the website.

A few more things need to be considered:

- Both `html2pdf` and `postsurfing` will be designed as independent tools for generic purposes instead of being tightly coupled with the cheatsheet generation process.
- Prompt only focused on the content itself and the layout.

---

### Fix issues on the process of publishing cheatsheets

#### Background

I am working on fixing the issues on the process of publishing cheatsheets. You can refer to the instruction in file @docs/cheatsheet-workflow.md. And I already run a dev-server on http://localhost:4322/. You always can use MCP playwright to access the result when once we fixed something.

We use a sample to fix the issues, including:

- The original HTML file: @/Users/robin/Downloads/python-cheatsheet.html
- The converted markdown file by the process of publishing cheatsheets: @contents/cheatsheets/en/python-cheatsheet.md
- The relevant URL on dev-server: http://localhost:4322/cheatsheets/en/python-cheatsheet

And, due to the back and force of the process, we lost some beautiful design elements in @/Users/robin/Downloads/python-cheatsheet.html now, But we can refer to another file for reference @golang-cheatsheet-restored.html, especially on the title header part and the footer part.

#### Issues

Here comes the issues I found so far:

- Instead of using the website's footer, we need to use the dedicated footer for cheatsheets like @golang-cheatsheet-restored.html did. It can be applied to all cheatsheets, but you need to take care of the hyperlink of the PDF, it will be dynamically generated based on the current URL.

- Instead of using the website's title part(huge title for the cheatsheet), We need to avoid to add the title part from the website, and relay on the author of the cheatsheets provide the title part. That means you also need to refer to @golang-cheatsheet-restored.html to enhance the title part of @/Users/robin/Downloads/python-cheatsheet.html first, and then we can publish it again.

### Fix issues on the process of publishing cheatsheets(2)

#### Background & Issues

We almost get the process of publishing cheatsheets refined. But we still have the following issues:

- Invalid cache file: After I run the command `scripts/preprocess-cheatsheets.sh python-cheatsheet.html`, the orginal HTML file should be cached in temp folder /tmp, and the output of the step 1 said so. But we I copy these generated sample prompt with the full file name of the cached one with AI assistant. That cause the AI to search the file by name. Ideally, it should not happen. But for unknown reason, it happend.
- For these external HTML files for documents and cheatsheets, sometime we need to find the original version, but we did not store it. According to the orginal design, it will be removed as a cheched file.
- After several back and forth, maybe there is something wrong with the responsibility of the each parts of the process:
  - scripts/preprocess-cheatsheets.sh: Do the preprocessing of the cheatsheets, no care about the contents and their style and layout.
  - scripts/postprocess-cheatsheets.sh: Do the postprocessing of the cheatsheets, no care about the contents and their style and layout.
  - docs/prompt_cheatsheets.md: Only care about the contents and their style and layout, no further processings and dependencies.

#### Solutions

We change the original design to store these external HTML files. I already created two folder:

- originals/documents: store the original HTML files for documents
- originals/cheatsheets: store the original HTML files for cheatsheets
- Have a comprehensive scan on each part of the whole process of publishing cheatsheets, including the preprocessing, postprocessing, and the prompt. In case of any issues or against their responsibility, we will investigate and fix them.

### Improve User Experience for reading

I want to improve the user experience for reading in this website. Here comes a general suggestion from Gemini. Please help to evaluate which part of the website needs improvement, based on current project source code and best practices. Give me a list with importance value or suggestions.

```
To fine-tune your Astro + AstroWind website for professional reading, focus on optimizing typography, improving content clarity, enhancing accessibility, and boosting SEO. Since AstroWind is built with Tailwind CSS, you can make most of these adjustments by editing your configuration files and component styles.
1. Optimize typography for readability
High-quality typography is crucial for a professional reading experience.
Best fonts for extended reading
Atkinson Hyperlegible: Specifically designed for maximum readability, even for readers with low vision. You can use the accessible-astro-starter theme as a reference for implementing this font.
Serif fonts: For long-form content, fonts like Georgia or Merriweather can feel more traditional and are often preferred for their readability in print.
Fine-tune font properties
Adjust font size: Use a comfortable base font size (e.g., 18px or 20px) and a relative size unit like rem for headings and body copy to ensure a good reading experience on all devices.
Set line height (leading): Increase the line height for better spacing between lines of text. A value of 1.5 to 1.7 is a good starting point for professional content.
Define measure (line length): Aim for 45 to 75 characters per line to minimize eye strain. You can control this with the max-width CSS property on your content containers.
Optimize letter spacing (tracking): A small amount of positive letter spacing can improve readability, especially for headlines.
2. Improve content structure and clarity
Organizing your content logically helps readers quickly find and digest information.
Use semantic HTML: Ensure you are using proper HTML elements like <header>, <main>, <article>, <section>, and <nav>. AstroWind generally uses a good structure, but double-check that your custom additions don't violate these rules.
Implement a logical heading hierarchy: Use <h1> for the main title and subsequent <h2>, <h3>, etc., in a sequential order. This structure is essential for SEO and accessibility.
Break up long text: Use bullet points, numbered lists, and short paragraphs to make large blocks of text less intimidating and easier to scan.
Use content collections: Astro's content collections feature allows you to structure your content efficiently using Markdown or MDX, which is perfect for a professional blog or site.
3. Enhance accessibility and user experience
A professional site should be accessible to all users.
Check color contrast: Ensure text and background colors have sufficient contrast. AstroWind's default themes are well-designed, but use a color contrast checker when customizing.
Support keyboard navigation: Make sure all interactive elements (links, buttons, navigation) are fully accessible using only a keyboard. Ensure focus states are clearly visible.
Add skip links: For long pages with complex navigation, include a "skip to main content" link to help keyboard and screen-reader users jump past the header.
Implement dark mode: AstroWind includes dark and light mode toggles out of the box, which is a key professional feature for user comfort.
4. Improve performance and SEO
Fast, searchable content is the mark of a truly professional website.
Optimize images: Use Astro's built-in image optimization or the astro-imagetools integration to ensure images are resized and compressed for faster loading.
Manage metadata: Use Astro's SEO component or astro-seo to easily set title, meta descriptions, and Open Graph tags for each page.
Enable sitemap generation: Use Astro's sitemap integration to automatically generate an XML sitemap. This helps search engines discover and index your content more efficiently.
Leverage Astro's "islands" architecture: Astro is already performant by default, but be mindful of adding too much JavaScript. Only hydrate components when truly necessary to maintain speed.
5. Consider a different Astro theme
If AstroWind's base design is not suitable for your needs, consider a theme built specifically for professional blogs and content.
Examples of professional-focused Astro themes:
Accessible Astro Starter: A theme specifically built with high accessibility standards and excellent typography for readability.
AstroPaper: A minimal, responsive, and SEO-friendly blog theme.
Logbook Astro: A clean, minimalist theme for bloggers and writers, with a focus on readability.
```

Your previous task has been interupted by unknow reason, Continue to finished it. Here comes the original task:

### Improve User Experience for reading(2)

I agree with you to optimize it in the following items:

- 1. Progressive Reading Enhancements
- 2. Enhanced Typography Scaling
- 3. Reading Flow Optimization
- 5. Focus Management & Keyboard Navigation
- 6. Content Engagement Features
- 7. Mobile Reading Experience
- 8. Performance Enhancements

And I want to check whether we have a existing mature solution to implement:

- back-to-top button for all articles and documents;
- Floating TOC panel on the sidebar with navigation

### New cheatsheet for task-master-ai

Your task is helping to design an one page cheatsheet for daily use for specified topics as shown below.

- The cheatsheet will be designed with a focus on clarity, simplicity, and ease of use, well designed, neat and concise one page.
- To save space, please use column layout instead of current table layout
- Add some slight background color for the panel header

Current topic is: Task Management:
https://github.com/eyaltoledano/claude-task-master is an AI-powered task-management system. It can be used in MCP mode or command mode. You can refer to https://docs.task-master.dev/capabilities/cli-root-commands see the command usage.

### Reefactory One Click Login Mechanism

Take the following as a new task for task-master. After confirming these unclear parts, split it as subtasks and add them all into the task-master. Then we can start to work on it.

#### Background

As we already get the One Click Login Mechanism working(So far only tested with Google One Tap)s, It's time for us to refactory it to provide a more stable/relaiable and extendable service to the website.

#### Current Issues

- For UI-wise, current solution is not good for user reading experience.
- No authorization token cache mechanism
- Due to build and test round, we got the code a little bit messy.

#### Solutions

- For UI-wise, we do the following enhancements:
  - When user not login, we just show a grey avatar(with question mark or not we can discuss or design a better way) at current position. Once user moves the mouse over this component, we need to show a popup menu to the user to select the way to login(In case of one way login way available, this step can be skipped directly.)
  - Once user login success, change this grey avatar as the real avatar of the user(The data can be retrieved). One user mouse over again, show another popup menu with one menu item for Sign Out (For example, Auth Provider's logo + 'Sign Out' + User Email). It will trigger user logout if anyone clicks the menu item.
- For authorization token cache mechanism, we can add a token guardian to void checking the token with Supabase Auth server every time. It's a simple value stored in local storage to represent the user's latest authorization timestamp. As our website is a multiple page application, we need to ensure that the token is valid across all pages and avoid checking the token with Supabase Auth server every time.
  - If current timestamp is less than the token guardian + duration, we should not check the token with Supabase Auth server. Of course, if current timestamp < token guardian + duration but auth token already expired, we should also check the token with Supabase Auth server.
  - If current timestamp > token guardian + duration, we should check the token with Supabase Auth server.
  - auto refresh token will be enabled, as it's a feature of Supabase JS.
- As we get authorization token cache mechanism ready, we need to show the user avatar and email in the popup menu on every page (It looks like we only can see it on the home page? need to be confirmed).
- Have a comprehensive code review, and do some refactoring work to improve the code quality and maintainability, we should also consider the capacity to add some other login providers going forwards.
- Add a set of unit tests for the authorization token cache mechanism into @tests/auth/, and make sure all of them pass the tests.

## TODO List

- [x] Add a banner and consent mode: Choose a platform, such as Cookie Information, Complianz, or another Google-certified CMP. For Astro, the @jop-software/astro-cookieconsent package is a popular option that wraps the vanilla-cookieconsent library.
- [ ] Add support of i18n for the website itself, so far support Chinese, English and Japanese only.
- [x] Add support of i18n for the new contents -- including how to translate the contents automatically.
- [x] Move scripts/postsurfing/README.md into docs and rename it, it will be treated as a part of the documentation. → Moved to docs/postsurfing-cli.md
- [ ] Define the SOP of generating and publishing new contents.
- [ ] Add new category 'cheatsheet'

### 技术科普作家

#### Background

你是一位具有全栈研发背景的资深程序员，技术推广者、内容创作者；其擅长面向初级技术研发人员、科技爱好者，使用朴实又不失生动的语言将技术细节条分缕析、层层阐明原理、内核、技术细节，以及如何解决实际问题等。

这里的 `@draft/第一篇：概念篇-打破AI助手的次元壁.md` 是根据 `@draft/大纲草案_final.md` 撰写出来的系列文章中的第一篇。
本系列文章的目地是介绍目前Claude Code生态在Plugins机制正在推向市场之际，它瞄准的问题、针对这些问题的具体解决方案，以及研发人员通过利用这些机制可以如何便利自身的日常开发工作。

#### Current Status

目前的`@draft/第一篇：概念篇-打破AI助手的次元壁.md`是初版，还有不少问题。主要表现在：

- 全篇更像是一份技术文档细节，缺乏科普文章最起码的起承转合衔接，以及如何吸引读者兴趣等。
- 对于目前人工review第一遍之后的结果，皆在文中以`TODO`标记出来，等待后续补充。
- 文中部分地方不够严谨的，需要进一步查核相关文档（比如`/plugin update --check`是否存在的问题等）。

#### Goals

- 针对文章现在的缺陷，在不丢失目前的文档细节、并保持当前文章整体框架的前提下，适当增加写作细节、丰富骨架，使其更符合科普文章的常见规范。
- 尤其针对已经标记出`TODO`的地方，重点注意解决当前的问题。
- 通过查阅官方文档，合适是否存在当前有争议的地方。如有则可直接跳过；如无，则应好好考虑如何调整（是删、是改要看具体情况）
- 整体目标是文档可发布状态。所以也需要对一些错别字、语句组织予以适当调整，以便读者阅读。这本应是一个职业编辑的工作，但由于我们的敏捷发布流程，这一步将被取消。所以此处会额外做一些文字、语句校勘相关的工作，以确保文档质量。

### adjustments

`第一篇_改进版.md`已使用命令`postsurfing draft/claude_code_plugins_01.md --type articles --lang cn`作为正式版发布到本网站的`Articles`下面。该文件现在路径为 `@contents/articles/cn/claude_code_plugins_01.md`.

我已经将相关网络图片保存至本地，现需要将这些网络图片修改为本地化、方便发布时候的资源都在本站，包括：

- 将`三、破局者登场：Claude Code Plugins`的

```markdown
![Plugins](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F81805a2d45f087f2cc153168759f8bf015706b04-1920x1035.png&w=3840&q=75)
```

数据源替换为`@assets/images/claude_code_plugins.webp`。

- 将`4.4 MCP Servers（Model Context Protocol）`中的

```markdown
<img src="https://ucc.alicdn.com/pic/developer-ecology/6ibaby6qg4ku4_90f44895b25a4caf827d7b2fa49157ee.gif" alt="img" style="zoom:50%;" />
```

数据源替换为`@assets/images/mcp.gif`。

### translation

New I need you act as a senior translator to translate this Chinese version into English as a new file in @contents/articles/en/claude_code_plugins_01.md. Please keep the structure and content aligned with the original. Do not translate all
blocks (including code, diagrams, flows, scripts, and etc., unless there are some Chinese comments I already noticed). I will try to
publish it to https://medium.com/. Try your best to help native speakers understand this articles

### fix claude_code_plugins_02.md

#### Background

contents/articles/cn/claude_code_plugins_02.md is the second part of the articles based on the outlines defined in draft/大纲草案\_final.md. You can also refer to the first part at @contents/articles/cn/claude_code_plugins_01.md.

#### Current Status

Due to the nature of the second part, there are so many code blocks in it. But not every code block is well tested or reviewed. Especially so command options or APIs we need to confirm with the offcial documents to avoid potential issues.

Meanwhile, it quick lack of descriptions on the mechanisms and purposes for each section of the article. That made this part more difficult to understand.

And, I did some manual review on this document and add some TODO items within the doc, we need take proper actions to enhance the content.

#### Goals

- Have comprehensive code review for each code block to find potential issues and fix them all.
- Check with MCP Context7 to ensure the accuracy and completeness of these command lines or APIs if necessary. We need to ensure all these command lines or APIs can run and produce expected results.
- Act as a senior IT content writer to enhance the contents, make it more readable and understandable, like other normal technical tutorial articles.
- Understand the TODO items and provide proper actions for each item.

### Add content filter by language

#### Background

So far we already enabled i18n for the website. However, there are still some issues that need to be addressed such as:

- The content language is independent with the page language.
- When we provide multilingual contents(Actually the same content in different languages and in different files), in the index page of each collection and the home page, all of this different languages files are treated as different contents. That means, if we have a collection with 3 articles in English and 3 articles in Chinese, the index page will show 6 articles instead of 3 articles. And, if a user prefers in English, he or she will still see 3 English articles and 3 Chinese articles.
- When user selected a new preferred language, the list of current collection will not change.

#### Solutions

- Implement a content filter in @src/components/common/ContentFilter.astro.
- Add ContentFilter into @src/layouts/layout.astro to enable the content filter.
- When to activate the content filter(during the build time):
  - In the homepage, we always show the content in the preferred language only.
  - In each index page of each collection, if current collection enabled the content filter(check whether current collection name is in the list of enabled collections: `i18n.support_translation` in file `@src/config.yaml`), then we show the content in the preferred language only. if current collection disabled the content filter, then we show all contents for allowed languages. This is a build time check, so we need to pass the value to the generated index page.

I need you refine this requirements and get any unclear or ambiguous things confirmed with me, then work out a solid task plan with task list.

> I need you use playwright to access the dev server via http://localhost:4322/. Access it and verify whether all functionalities are working as expected. Especially, please take special care of the errors in web console. In case of any, find the root cause and fix all of them.

###

- De-coupled the event trigger and event handler on language switcher:
  - Define a new user defined event to update the language settings: `surfing_event_switch_language`. We user changed the language switcher, fire the event.
  - At the website wise, add a new event listener to handle the `surfing_event_switch_language` event at the website framework wise: `on_event_switch_language`. The functions should equal to current function, including change the i18n string at the website framework wise. and store the language settings in local storage.
  - Define a new event listener to handle the `surfing_event_switch_language` event at page wise: `on_event_switch_translation`. If we prepared the new URL based on current page's metadata information, and navigate the end user to the translated page.
  - Add a new function `init_content`, which will be called when the page is loaded. This function will accept a few content metadata as arguments during the build process(These arguments are injected by build process). For example, whether current page enabled the translation feature, and how many languages are supported(Both of them coming from the metadata defined in @src/config.yaml or the frontmatter of current page). It also need to hide/show the options of the language switcher based on the this arguments dynamically.
- Add a string array type new key `i18n.support_translation` in file @src/config.yaml to config which collection support content translation. For example:

```yaml
i18n:
  language: en
  textDirection: ltr
  support_translation:
    - articles
    - cheatsheetss
    - documents
    - others
```

This config means that the website supports translation for articles, cheatsheets, documents, and others(showcase only so far) does not support this new feature.

- Add a new field `translations` to each collection(including articles, cheatsheets, documents and showcase and etc) `src/content.config.ts`. It's also a string array, which contains the language codes of the available translations for the current content. For example, if the current content is in English and we have translations in Chinese and Japanese, the `translations` field should be `['en', 'cn', 'ja']` --- including itself, so that we will have consistent metadata for different languages.

- Enhance the build process to enable to inject these meta information into the generated HTML files to call `init_content`.
- Add utility functions:
  - get_current_language: During the build process, we can use the folder to detect which language is currently being processed. Default file path for each content is composed of the following format: `contents/<collection_name>/<language_code>/<content_id>.md`. For example, if the current language is English, the collection name is `articles`, and the content ID is `1`, the default file path will be `en/articles/1.md`. During the run time, we use the URL to detect the current language. The URL format is `https://example.com/<collection_name>/<language_code>/<content_id>`, aligned with the default file path. For example, if the URL is `https://example.com/articles/en/1`, the current language is English.
  - compose_url: Based on current URL and language code, compose the new URL for a content. For example, if the current URL is `https://example.com/articles/en/1` and the language code is `cn`, the new URL will be `https://example.com/articles/cn/1`.

- For home page(always be treated as enabled support translation) and the index page of each collection which enabled support translation, add content filter function:
  - In home page, we only to show the relevant contents for current language.
  - In index page if current collection enabled support translations, we only to show the relevant contents for current language. As a store each folder contains only one language content, that means we only need to show the content with the same language code as the current language.
  - In index page if current collection disabled support translations, we keep to show all contents.

Help to refine this requirements and work out a solid task list first.

### Fix i18n issues:

#### Background

I temporarily accepted your code right now. But we need to fix them all based on the current code base for i18n related things. One thing I noticed that there are so many constants, variables, and functions defined for SSR in previous steps inappropriately.

But we are still using them, despite we are building a static website. For example, getServerTranslation and getLanguageFromRequest in file @src/i18n/index.ts, both of them are defined for SSR. But so many places use them inappropriately. We need to use the `t` function directly which is defined in the same file, and keep the second argument with a default value, we will get the right string for i18n. If you want a better performance, you can call `getCurrentLanguage` to get current language code, and then pass it to `t` function. This will avoid to call `getCurrentLanguage` internally for each `t` function call.

Another and more important things are:

- `t` + `getCurrentLanguage` is the only right way to implement i18n. We should not use any other solution.
- `getCurrentLanguage` is the only right way to get preferred language code. We should not use any other solution.

#### Tasks

- I already commented out the unnecessary `getServerTranslation` and `getLanguageFromRequest` functions. I need your help to fix all places where they are used, and make sure that we are using the `t` function directly with the right second argument set for the current language code.
- Have a comprehensive code review to ensure that all i18n are implemented in the right way. No other ways and no missing with directly magic strings. And no alternatives for `t` function and `getCurrentLanguage`.

First understand the requirements, and then work out a solid plan with todo list. And then implement the plan.
Before the plan finished, make sure all the following command lines all go well(no errors and critical warnings):

- npm run fix
- npm run check
- npm run build

### Fix i18n issues(2nd):

Another issue is DEFAULT_LANGUAGE. It's be defined for the default value only if all ways failed to get current language code. That means no one can use it outside of @src/i18n/index.ts . I saw so many places to use it as the default language code. Here comes a wrong sample:

```typescript
import { t } from '~/i18n';
import { Icon } from 'astro-icon/components';
import { LANGUAGES, DEFAULT_LANGUAGE } from '~/i18n';

// For SSG, use default language initially (will be updated on client)
const currentLanguage = DEFAULT_LANGUAGE;
const currentLangInfo = LANGUAGES[currentLanguage];
```

then they will use `currentLangInfo` to render the web page. That's totally wrong. They should use `t` function directly with the right second argument set for the current language code also(with `getCurrentLanguage`).

For file `~/components/widgets/Header.astro` and `~/components/widgets/Footer.astro`, you can skip them for now, as we will conduct some special fix on them next round.

### Fix i18n issues(3rd):

For file `~/components/widgets/Header.astro` and `~/components/widgets/Footer.astro`, not only the wrong usage of `DEFAULT_LANGUAGE` or `t` function or any other functions we just mentioned.
The bigger problem is that they not apply i18n, they redefine all these UI strings directly with a lot of magic strings and if-else statements. This is a serious issue that against our DRY principle.
It needs to be fixed as soon as possible.

### Fix i18n issues(4th):

To make it more clear, let's move the following from file @src/utils/language.ts to @src/i18n/index.ts:

- LANG_CODE_MAP
- CONTENT_LANG_MAP
- toContentLang
- toI18nLang

I found there still another duplicated definition in file @src/components/common/ContentFilter.astro, reduce them all and replace them with the ones in @src/i18n/index.ts.

Keep things simple and consistent. It's important principle for this project. Have a comprehensive core review to avoid the simular isssues.

### Fix language switcher toggle issue

#### Background and current issue

After fixing the i18n issues for home page and the index page for each collection, we almost get the i18n ready for the whole website. But for the detail page of each collection, we still need to fix the language switcher toggle issue.

Currently, the issues are:

- The default option for language switcher toggle is not working properly. It always be `en` no matter which language is preferred by end users. but the UI is already be shown in the proper i18n language. Once use refresh the page, it will be fixed.

Actually, this option stored in `localStorage` 's LANGUAGE_STORAGE_KEY. We need to figure out how to fix it at its initialization stage.

- Static option vs dynamic option for language switcher toggle. Currently, the language switcher toggle is static, only `zh`, `en` and `ja`. But according to our previous enhancements for each collection's frontmatter definition in @src/content.config.ts, there is a new attribute `translations` has been added to support dynamic language switcher toggle. This new attribute means what kind of translations for current details are available. So the rule is quite simple:
  - If `translations` is empty or this attribute is missing, that means only current language is available -- only current language is available for the language switcher toggle.
  - If `translations` is not empty, the language switcher toggle is dynamic, only the languages in `translations` are available.

- Enhance user click event to update the language switcher toggle. Currently, once user clicks on the language switcher toggle, we will store user preference and in localStorage. Then the language will be updated. It's lack of multilingual translation support.

#### Solution and Implementation

- Fix the default option for language switcher toggle.
- Implement dynamic language switcher toggle based on the `translations` attribute in @src/content.config.ts.
- Enhance user click event to update the language switcher toggle. We changed the mechanism to:
  - If only current language is available, show a tooltips or notification to inform user that only current language is available.
  - If multiple languages are available, show a dropdown menu with the available languages.
  - Once user selects a language, update the language switcher toggle and store user preference in localStorage. Then prepare the new URL and redirect to the new URL, instead of trigger i18n update UIs directly.
- Rule to compose new URL based on the selected language. For the details page, the URL of current page always be /{collection_name}/{language_code}/{slug}. When you prepare new URL, you should use the selected language code to replace the current language code in the URL. That's all. For example, if the current URL is /articles/cn/color_common_sense_and_tools and the user selects `ja` as the language, the new URL should be /articles/ja/color_common_sense_and_tools.

This implementation will help end users to switch between different languages seamlessly for the same contents' details pages.
