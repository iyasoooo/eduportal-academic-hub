# CloudLab Deployment Guide (Netlify & Vercel)

This deployment guide provides a step-by-step workflow for setting up local version control, uploading your code to GitHub, and deploying it live on Netlify or Vercel. 

---

## Part 1: Local Version Control (Git)

Before launching to the cloud, initialize version control locally on your machine.

1. **Open terminal** (e.g. Git Bash, Command Prompt, or PowerShell) inside your project directory (`c:\Users\iyasoooo\Desktop\ARC4213`).
2. **Initialize Git**:
   ```bash
   git init
   ```
3. **Stage all files**:
   ```bash
   git add .
   ```
4. **Make initial commit**:
   ```bash
   git commit -m "Initial commit: CloudLab Web Application"
   ```

---

## Part 2: Publish Code to GitHub

Cloud hosting platforms require a remote repository to hook up their continuous integration (CI/CD) pipelines.

1. Go to [GitHub](https://github.com/) and log in (or create a free account).
2. Click **New Repository** (top right `+` menu).
3. Set the repository name (e.g. `arc4213-cloud-portal`).
4. Set the visibility to **Public** (required for easy hosting links) or **Private** (Netlify/Vercel support both, but public is easiest to share).
5. Leave "Add README.md", ".gitignore", and "License" **unchecked** (we already have local files).
6. Click **Create repository**.
7. Copy the remote URL commands provided by GitHub under "...or push an existing repository from the command line":
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual details).*

---

## Part 3: Deploying on the Cloud

Pick **either** Netlify or Vercel. Both are free and automatically build your code when you push updates.

### Option A: Deploying to Netlify (Recommended for Static Apps)
1. Go to [Netlify](https://www.netlify.com/) and sign up using your **GitHub account** (this makes linking repositories instant).
2. Once inside your Netlify dashboard, click **Add new site** -> **Import from an existing project**.
3. Select **GitHub** as the provider and authorize Netlify.
4. Search for your repository: `arc4213-cloud-portal` and select it.
5. In the **Site configuration** screen:
   - **Branch to deploy**: `main`
   - **Build command**: *Leave empty* (we are using vanilla HTML/CSS/JS with no compiler).
   - **Publish directory**: *Leave empty* or type `.` (representing the root directory).
6. Click **Deploy site**.
7. Netlify will generate a random URL (e.g. `superb-gaufre-12345.netlify.app`). Once the deploy status turns green, click the link to visit your live site!
8. *(Optional)* Go to **Site settings** -> **Change site name** to give it a custom domain (e.g. `group4-cloudlab.netlify.app`).

### Option B: Deploying to Vercel
1. Go to [Vercel](https://vercel.com/) and register using your **GitHub account**.
2. From the Vercel dashboard, click **Add New** -> **Project**.
3. You will see a list of your GitHub repositories. Click **Import** next to your `arc4213-cloud-portal` repository.
4. In the configuration settings:
   - **Framework Preset**: Select **Other**.
   - **Root Directory**: `./`
   - **Build and Output Settings**: *Do not change anything* (no build commands needed).
5. Click **Deploy**.
6. Vercel will build and launch your application globally. In under a minute, you will receive a preview link (e.g., `arc4213-cloud-portal-omega.vercel.app`).

---

## Part 4: How to Show "Updating/Modifying Deployment"
The project rubric awards **13-15 Marks** for successfully demonstrating a live update workflow during your presentation. Follow these steps during your demo to prove your CI/CD setup is active:

1. **Open style.css** in your code editor.
2. Search for the sidebar menu gradient or theme variables (e.g. change the glowing orb colors, or update the text color).
3. Save the file.
4. Run these three commands in your terminal:
   ```bash
   git add style.css
   git commit -m "UI tweak: adjusted theme gradients"
   git push origin main
   ```
5. Immediately open your Netlify or Vercel dashboard. Show the examiner that a **new deploy is automatically building** in response to your Git push.
6. Refresh your live URL and show the color change. This demonstrates a complete, automated cloud delivery pipeline!
