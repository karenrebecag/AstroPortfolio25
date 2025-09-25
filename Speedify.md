Here is a comprehensive guide on how to connect Speedlify to an Astro portfolio site for real, continuous performance metrics, including deployment separation where Speedlify is deployed on Netlify and the Astro site on Vercel. The content is based on in-depth documentation, experienced developer tips, and practical deployment guides.

***

## Introduction to Speedlify and Astro Integration

Speedlify is an open-source tool created by Zach Leatherman to continuously measure and monitor website performance using Lighthouse metrics. It helps ensure a site stays fast over time by automating scheduled performance tests and showing stats live on a dedicated performance page.

Astro is a modern frontend framework optimized for fast static websites. For performance monitoring, the user wants to deploy their portfolio (built in Astro) on Vercel and the Speedlify instance (which runs as a separate project) on Netlify. This separation is practical for isolating the monitoring dashboard from the project itself.

***

## Step 1: Setting Up Speedlify for Performance Metrics

- Clone the Speedlify repository from GitHub:  
  ```bash
  git clone https://github.com/zachleat/speedlify.git
  cd speedlify
  npm install
  ```
- Configure the URLs you want Speedlify to monitor by editing files in `_data/sites/`. Each file represents a category and contains an array of URLs you want to track. Example format:  
  ```js
  // _data/sites/my-portfolio.js
  module.exports = {
    name: "My Portfolio",
    description: "Performance stats for my Astro portfolio site",
    options: {
      frequency: 60 * 23, // measure once every 23 hours
      freshChrome: "run", // reset Chrome state for each run
    },
    urls: [
      "https://your-astro-portfolio.vercel.app/",
    ],
  };
  ```
- The `frequency` option controls how often Speedlify repeats measurements (in minutes). Set it to avoid excessive builds affecting Netlify build limits.

***

## Step 2: Testing Speedlify Locally

Before deploying, run Speedlify locally to verify categories and URLs display correctly (without measurements which only run during builds):  
```bash
npm run start
```
The local UI will show the categories but no scores since measurements occur on build time.

***

## Step 3: Deploying Speedlify on Netlify

- Push the configured Speedlify repository to a GitHub repo.
- Log in to your Netlify account, create a new site from the GitHub repo.
- In Netlify's deploy settings, set the build command:  
  ```bash
  npm run build
  ```
- Set the publish directory to:  
  ```bash
  _site
  ```
- Deploy the site. On successful deploy, Speedlify performs Lighthouse tests against the configured URLs and shows collected metrics on the site.

***

## Step 4: Automate Performance Checks with Netlify Build Hooks and GitHub Actions

- Performance tests run only on build. Automate periodic builds so Speedlify regularly updates metrics.
- Create a Netlify Build Hook URL in the Speedlify site settings under "Build & Deploy" > "Build hooks".
- In your Speedlify GitHub repo, create a GitHub Action to trigger the build hook on a schedule (e.g., daily):  
  ```yaml
  # .github/workflows/main.yml
  name: Trigger Netlify Build daily
  
  on:
    schedule:
      - cron: "0 22 * * MON-FRI"  # Runs weekday at 22:00 UTC
  
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - name: Trigger Netlify Build Hook
          run: curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
  ```
- This triggers a new build which runs Speedlify measurement and updates data regularly without manual intervention.

***

## Step 5: Deploying Your Astro Portfolio on Vercel

- Your main Astro portfolio project remains separate.
- Push your Astro project code to GitHub.
- Connect the repo to Vercel and configure the Astro build:  
  - Build command: `npm run build`
  - Output directory: `dist`
- Vercel automatically provides deployment previews and production URLs.
- This separation ensures Speedlify independently tests your production URL without mixing project codebases.

***

## Advanced Tips and Developer Advice

- Limit the number of URLs in Speedlify config to avoid exceeding Netlify’s 15-minute build timeout on free tiers.
- Control frequency of measurements to balance data freshness and build cost.
- Use the `<speedlify-score>` web component in your portfolio to embed realtime Lighthouse scores if desired (requires referencing Speedlify docs).
- Keep Speedlify and portfolio repos separate for clarity, governance, and different deployment platforms.
- For scaling, consider paid monitoring tools once your monitoring needs surpass Speedlify’s limitations.
- Regularly review build logs and GitHub Action status for troubleshooting automation issues.

***

## References and Documentation Links

- Speedlify GitHub repository (source, config details): https://github.com/zachleat/speedlify  
- Speedlify tutorial with step-by-step deployment and automation guide by Agustinus Nathaniel: https://agustinusnathaniel.com/blog/monitor-and-measure-site-performance-with-speedlify/  
- Astro deployment guide for Netlify: https://docs.astro.build/en/guides/deploy/netlify/  
- Vercel deployment for Astro: https://vercel.com/docs/frameworks/astro  
- Netlify Build Hooks & GitHub Actions automation: https://docs.netlify.com/configure-builds/build-hooks/, https://docs.github.com/en/actions

***

This comprehensive approach ensures reliable, automated, and clean integration of Speedlify performance monitoring with your Astro portfolio deployed separately on Vercel, while leveraging Netlify’s build automation and static hosting. The system continuously gathers real-world Lighthouse metrics and displays them on a dedicated Speedlify dashboard URL.

If desired, instructions can be expanded further into a formatted 5-page document or markdown file based on this outline and references.

Sources
[1] Deploy your Astro Site to Netlify | Docs https://docs.astro.build/en/guides/deploy/netlify/
[2] Astro on Netlify https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/
[3] Create, install, and deploy an Astro site in 2 minutes https://www.youtube.com/watch?v=82AdlVK-TsY
[4] astrojs/netlify - Astro Docs https://docs.astro.build/en/guides/integrations-guide/netlify/
[5] speedlify:ssg https://www.speedlify.dev/ssg/
[6] 2023 Web Framework Performance Report - Astro https://astro.build/blog/2023-web-framework-performance-report/
[7] Monitor and Measure Site Performance from Time to ... https://agustinusnathaniel.com/blog/monitor-and-measure-site-performance-with-speedlify/
[8] 5 ways to deploy a new Netlify site https://developers.netlify.com/videos/five-ways-to-deploy-a-new-netlify-site/
[9] How to build fast websites with Astro and Netlify https://www.youtube.com/watch?v=rPRNSY8oLXc
[10] Vercel vs Netlify: Which One Should You Choose? https://www.codecademy.com/article/vercel-vs-netlify-which-one-should-you-choose
[11] Using Astro and Netlify to build and deploy a web app https://blog.logrocket.com/astro-netlify-build-deploy-web-app/
[12] Speedlify https://www.11tythemes.com/theme/zachleat-speedlify/
[13] zachleat/speedlify: Benchmark the web performance and ... https://github.com/zachleat/speedlify
[14] A Step-by-Step Guide: Deploying on Netlify https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/
[15] Build a blog tutorial: Deploy your site to the web - Astro Docs https://docs.astro.build/en/tutorial/1-setup/5/
[16] Deploying to Vercel vs Netlify: A Comparative Guide https://www.ryankatayi.com/blog/deploying-to-vercel-vs-netlify-a-comparative-guide
[17] How to host Astro websites : r/astrojs https://www.reddit.com/r/astrojs/comments/1icgimu/how_to_host_astro_websites/
[18] Build wicked fast sites with Astro: An Introduction https://www.netlify.com/blog/2021/07/08/build-wicked-fast-sites-with-astro-an-introduction/
[19] Use Speedlify to Continuously Measure Site Performance https://nicolas-hoizey.com/links/2020/07/02/use-speedlify-to-continuously-measure-site-performance/
[20] Deploy overview | Netlify Docs https://docs.netlify.com/deploy/deploy-overview/
