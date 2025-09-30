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
- The converted markdown file by the process of publishing cheatsheets: @src/content/cheatsheets/en/python-cheatsheet.md
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
  s

## TODO List

- [x] Add a banner and consent mode: Choose a platform, such as Cookie Information, Complianz, or another Google-certified CMP. For Astro, the @jop-software/astro-cookieconsent package is a popular option that wraps the vanilla-cookieconsent library.
- [ ] Add support of i18n for the website itself, so far support Chinese, English and Japanese only.
- [x] Add support of i18n for the new contents -- including how to translate the contents automatically.
- [x] Move scripts/postsurfing/README.md into docs and rename it, it will be treated as a part of the documentation. → Moved to docs/postsurfing-cli.md
- [ ] Define the SOP of generating and publishing new contents.
- [ ] Add new category 'cheatsheet'
