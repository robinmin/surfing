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
