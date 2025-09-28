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

---

## TODO List

- [ ] Add a banner and consent mode: Choose a platform, such as Cookie Information, Complianz, or another Google-certified CMP. For Astro, the @jop-software/astro-cookieconsent package is a popular option that wraps the vanilla-cookieconsent library.
- [ ] Add support of i18n for the website itself, so far support Chinese, English and Japanese only.
- [ ] Add support of i18n for the new contents -- including how to translate the contents automatically.
- [ ] Move scripts/postsurfing/README.md into docs/, it will be treated as a part of the documentation.
- [ ] Define the SOP of generating and publishing new contents.
- [ ] Add new category 'cheatsheet'
