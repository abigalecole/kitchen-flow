# Kitchen Flow

Grocery list, pantry, meal plan and recipes that feed into each other. Installs on your phone like an app and syncs between devices.

Setup takes about 40 minutes and is free. You'll do four things:

1. Create a Firebase project (stores your data and handles sign-in)
2. Put the app on GitHub Pages (gives it a web address)
3. Install it on your phone
4. Turn on recipe links (optional; lets you add recipes from a website link)

---

## 1. Create your Firebase project

Firebase is Google's app database. The free plan is far more than one person needs, and it doesn't ask for a credit card.

**1.1 Create the project**
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with your Google account.
2. Click **Create a project** (or **Add project**). Name it `kitchen-flow`.
3. When it asks about Google Analytics, turn it **off**. Click **Create project**.

**1.2 Turn on email sign-in**
1. In the left menu, open **Build → Authentication** and click **Get started**.
2. On the **Sign-in method** tab, choose **Email/Password**, switch on the first toggle, and click **Save**.

**1.3 Get your app settings**
1. Click the gear icon next to **Project Overview** → **Project settings**.
2. Under **Your apps**, click the web icon **`</>`**.
3. Nickname it `Kitchen Flow`. Leave "Firebase Hosting" unchecked. Click **Register app**.
4. You'll see a block of code with `const firebaseConfig = { ... }`. Keep this tab open; you'll copy these values in step 2.4.

**1.4 Create the database**
1. In the left menu, open **Build → Firestore Database** and click **Create database**.
2. Pick a location in the United States (the default is fine). Choose **Start in production mode**. Click **Create**.
3. Open the **Rules** tab. Delete what's there and paste in everything from the `firestore.rules` file in this folder. Click **Publish**.

These rules mean each signed-in person can only ever see their own kitchen.

---

## 2. Put the app on GitHub Pages

**2.1 Create a GitHub account** at [github.com](https://github.com) if you don't have one. Your username becomes part of the app's address.

**2.2 Create a repository**
1. Click **+** (top right) → **New repository**.
2. Name it `kitchen-flow`. Set it to **Public** (free GitHub Pages needs this; your data stays private in Firebase).
3. Click **Create repository**.

**2.3 Upload the files**
1. On the new repository page, click **uploading an existing file**.
2. Drag in everything from this folder, including the `icons` folder.
3. Click **Commit changes**.

**2.4 Paste your Firebase settings**
1. In the repository, click `firebase-config.js`, then the pencil icon to edit.
2. Replace each `PASTE_...` value with the matching value from step 1.3 (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). Keep the quote marks.
3. Click **Commit changes**.

These values aren't passwords. They only tell the app which Firebase project to talk to.

**2.5 Turn on GitHub Pages**
1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**. Click **Save**.
3. Wait a minute or two and refresh. The page shows your app's address, like `https://YOUR-USERNAME.github.io/kitchen-flow/`.

---

## 3. Install it on your phone

1. Open the address in **Safari** (iPhone) or **Chrome** (Android).
2. Tap **Create account** and pick an email and password.
3. Add it to your home screen:
   - **iPhone:** Share button → **Add to Home Screen**
   - **Android:** ⋮ menu → **Add to Home screen** (or **Install app**)

On your computer, open the same address and **Sign in** with the same email and password. Everything stays in sync, and the app still works offline. Changes made offline upload when you're back online.

**Lock it down (recommended):** after creating your account, go to Firebase → **Authentication → Settings → User actions** and uncheck **Enable create (sign-up)**. Then nobody else can make an account on your app.

---

## 4. Turn on recipe links (optional)

Browsers don't let a web app read other websites directly, so **Add from link** uses a small free helper on Cloudflare. It opens the recipe page for you and sends back just the recipe. No credit card needed.

**4.1 Create the helper**
1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. In the left menu, open **Workers & Pages** (under Compute) and click **Create** → **Create Worker** (start from the Hello World template).
3. Name it `kitchen-flow-import` and click **Deploy**.

**4.2 Add the code**
1. Click **Edit code**.
2. Delete everything in the editor and paste in everything from the `worker.js` file in this folder.
3. Near the top, change `YOUR-USERNAME` in the `ALLOWED` line to your GitHub username. It should look like `https://abbicole.github.io`, with no slash or `/kitchen-flow` on the end. This makes the helper work only for your app.
4. Click **Deploy**.
5. Copy the helper's address shown at the top, like `https://kitchen-flow-import.your-name.workers.dev`.

**4.3 Connect it to the app**
1. In your GitHub repository, edit `firebase-config.js` again.
2. Replace `PASTE_WORKER_URL` at the bottom with the address you copied. Keep the quote marks.
3. Click **Commit changes**.

**Adding a recipe from a link**
- **iPhone:** copy the link from Safari, open Kitchen Flow → Cook → **Add from link**, paste, and tap **Get recipe**.
- **Android:** on the recipe page, tap Share → **Kitchen Flow**. It opens straight to the recipe. (This works once the app is installed on your home screen.)

You'll see the recipe's name, servings, time, ingredients and steps to check before saving. If the site lists nutrition, it's filled in too and labeled "from the recipe site."

Most big recipe sites work, because they publish their recipes in a standard format for Google. If a site doesn't, the app tells you, and you can copy the recipe text and paste it below the link box instead.

---

## Using it

- **List:** add items like `2 lb chicken breast`. They're grouped by store aisle. Checking one off moves it to your pantry.
- **Pantry:** adjust amounts with − and +. When something runs out, **+ List** puts it back on the grocery list.
- **Plan:** add lunch and dinner for each day. **Shop for this week** adds only what you're missing.
- **Cook:** recipes are ranked by what you have. **Cook this** takes what you used out of the pantry.
- **Add from link:** paste a link from a recipe site (see step 4), or paste the text of a recipe from a PDF or Google Doc. Either way it fills in the name, servings, ingredients and steps for you to check.
- **Macros:** open a recipe → **MacroFactor card** to screenshot or copy it into MacroFactor. Then **Enter my macros** to save MacroFactor's per-serving numbers in the app. The Plan tab totals calories and protein per day.
- **Settings (gear icon):** account, sign out, and backups. Save a backup now and then; it's a file you can restore anytime.

---

## Updating the app later

1. In your repository, upload the new `index.html` (it replaces the old one).
2. Open `sw.js`, change the `VERSION` value to something new (for example `"kf-1.1"` becomes `"kf-1.2"`), and commit.
3. Close and reopen the app on your phone, sometimes twice, to pick up the update.

## Troubleshooting

- **"Email sign-in is turned off in Firebase"**: redo step 1.2.
- **Header says "Sync blocked"**: the rules from step 1.4 weren't published. Paste them again and click **Publish**.
- **Header says "On this device" and never asks you to sign in**: `firebase-config.js` still has `PASTE_` values. Redo step 2.4.
- **"The link helper doesn't recognize this app's address"**: the `ALLOWED` line in your Cloudflare worker doesn't exactly match your app's address. It should be `https://YOUR-USERNAME.github.io` with nothing after it. Fix it and click **Deploy** again.
- **"Links need a one-time setup first"**: `firebase-config.js` still has `PASTE_WORKER_URL`. Redo step 4.3.
- **The page shows a 404**: GitHub Pages can take a few minutes the first time. Check that `index.html` is at the top level of the repository, not inside a folder.
