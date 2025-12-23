# Google Play Store Automated Deployment Setup

This guide explains how to set up automated deployment to Google Play Store.

## Prerequisites

1. Your app must already exist on Google Play Console
2. You need admin access to the Google Play Console
3. You need access to Google Cloud Console

## Step 1: Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Select or create a project (can be any project, doesn't need to match your app)

3. Navigate to **IAM & Admin** → **Service Accounts**

4. Click **Create Service Account**
   - Name: `play-store-publisher`
   - Description: `Service account for automated Play Store deployments`
   - Click **Create and Continue**
   - Skip the optional steps, click **Done**

5. Click on the newly created service account

6. Go to **Keys** tab → **Add Key** → **Create new key**
   - Select **JSON** format
   - Click **Create**
   - **Save this JSON file securely** - you'll need it for GitHub secrets

## Step 2: Enable Google Play Android Developer API

1. In Google Cloud Console, go to **APIs & Services** → **Library**

2. Search for **Google Play Android Developer API**

3. Click on it and click **Enable**

## Step 3: Link Service Account to Play Console

1. Go to [Google Play Console](https://play.google.com/console)

2. Navigate to **Setup** → **API access** (in the left sidebar)

3. Under **Service accounts**, find your service account or click **Link new service account**

4. If it doesn't appear automatically:
   - Copy the service account email (looks like `play-store-publisher@project-id.iam.gserviceaccount.com`)
   - Click **Link existing service account**
   - Paste the email

5. Click **Grant access** next to the service account

6. Set permissions:
   - **Account permissions**: (Optional, for all apps)
   - **App permissions**: Select your app(s) and set:
     - ✅ Release apps to testing tracks
     - ✅ Release to production, exclude devices, and use Play App Signing
     - ✅ Manage store presence (if you want to update store listing)

7. Click **Invite user** or **Apply**

## Step 4: Add GitHub Secret

1. Open the JSON key file you downloaded in Step 1

2. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

3. Click **New repository secret**

4. Name: `PLAY_STORE_SERVICE_ACCOUNT_JSON`

5. Value: **Paste the entire contents of the JSON file** (including the curly braces)

6. Click **Add secret**

## Step 5: Configure Release Track

The workflow is configured to upload to the **internal** track by default. You can change this in `.github/workflows/deploy.yml`:

```yaml
track: internal  # Options: internal, alpha, beta, production
```

Recommended release flow:
- `internal` → Internal testing (immediate)
- `alpha` → Closed testing
- `beta` → Open testing
- `production` → Production release

## Step 6: Trigger Play Store Deployment

Play Store deployment only runs on **manual workflow trigger** (to prevent accidental releases).

To deploy:
1. Go to GitHub → **Actions** → **Deploy to 1-Grid**
2. Click **Run workflow**
3. Select branch and click **Run workflow**

The workflow will:
1. Build the website and API (as usual)
2. Build the signed AAB
3. Upload the AAB to Play Store (internal track)

## Version Management

The workflow automatically sets:
- `versionCode`: GitHub Actions run number (auto-increments)
- `versionName`: `1.0.{run_number}`

Each build will have a unique, incrementing version code as required by Play Store.

## Troubleshooting

### "The package name does not match"
- Ensure `applicationId` in `android/app/build.gradle` matches your Play Store app

### "The version code has already been used"
- The workflow uses `github.run_number` which always increments
- If you see this error, manually increment the base version code in `build.gradle`

### "Service account not authorized"
- Verify the service account has correct permissions in Play Console
- Ensure the Google Play Android Developer API is enabled
- Wait a few minutes after granting permissions (can take time to propagate)

### "AAB not found"
- Check the build logs for Gradle errors
- Ensure the keystore is correctly configured

## Manual Upload Option

If automated upload fails, you can manually download the AAB:

1. Go to GitHub → **Actions** → Select the workflow run
2. Download the `app-release-aab` artifact
3. Manually upload to Play Console → **Release** → **Testing** → **Internal testing**

## Security Notes

- Never commit the service account JSON file to the repository
- The JSON is stored as a GitHub secret (encrypted)
- Rotate the service account key periodically for security
- Use minimal required permissions for the service account

