# SmoothScar Netlify deployment

The ZIP contains the prebuilt static site with index.html at its root. Upload it to the existing smoothscar Netlify project's Deploys page for a manual deployment.

For continuous deployment, connect this repository to the existing smoothscar project (do not create a second project). Select branch `main`, build command `npm run build`, publish directory `dist`, and an empty base directory. The root netlify.toml already defines these build settings. Keep .netlify ignored by git.

The source build and form-routing checks passed before packaging. Live form collection, CSV export, and email notification delivery must be tested after deployment. A successful build alone does not verify email delivery to info@smoothscar.com.

Package SHA-256: 3e122ff81f54c726e3cd373cf6f9a99e2eb55582c9c43c47b0b4a7bf296d1afc
