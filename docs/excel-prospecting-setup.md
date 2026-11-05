# Connect provider requests to Microsoft Excel Online

New verified live provider requests can be sent to your Excel workbook using a Microsoft Power Automate flow. The website retains the original requests in Netlify Forms. This connection adds new rows; it does not overwrite your follow-up notes or import older submissions automatically.

## 1. Create the workbook

Open `site/downloads/provider-prospects-template.xlsx` and upload it to your business OneDrive or SharePoint. You can rename the file. It contains a worksheet named **Prospects** and an Excel table named **ProviderProspects**. Keep the column names unchanged. The blank starter row can be deleted once the first real request arrives.

Each row includes the application reference, received time in UTC, name, email, clinical role, practice, region, procedure and product interests, comments, campaign attribution, and editable Status, FollowUpDate, FollowUpNotes, and Owner columns. Only your Microsoft account and people you share the workbook with can access its contents; the downloadable website template contains no provider data.

## 2. Connect Power Automate

Sign in at https://make.powerautomate.com with the Microsoft account that can access the workbook. Create an automated cloud flow with the **When an HTTP request is received** trigger. This trigger may require a Power Automate Premium license; the Excel Online (Business) connector requires a supported Microsoft business account.

Paste the JSON schema from `docs/provider-excel-payload-schema.json` into the trigger's Request Body JSON Schema box. The site sends JSON objects with exactly those column names. Configure the trigger for external requests using its signed URL (the “Anyone” authentication option); the URL is a secret and is kept only in the website's server configuration. Do not share it or put it in the webpage.

Set trigger **Concurrency Control** on, with a degree of parallelism of **1**, so simultaneous requests do not race during duplicate checks.

## 3. Add rows without duplicates

Add **Excel Online (Business) → List rows present in a table**. Select the OneDrive/SharePoint location, your workbook, and **ProviderProspects**. Set Filter Query using this Power Automate expression:

```
concat('Reference eq ', decodeUriComponent('%27'), replace(triggerBody()?['Reference'], decodeUriComponent('%27'), concat(decodeUriComponent('%27'), decodeUriComponent('%27'))), decodeUriComponent('%27'))
```

Add a condition: the length of the action's `value` array equals `0`. In its Yes branch, add **Excel Online (Business) → Add a row into a table**, choosing the same workbook/table. Map every table column to the corresponding trigger property (for example, FullName → FullName, Email → Email, Reference → Reference). Map Status to the supplied Status value (`New`), and the follow-up fields to their supplied blank values. In the No branch, do nothing: the request already exists.

After the condition, add an HTTP **Response** action with status **200**. Ensure it only runs when the preceding steps succeed. Configure action retries for temporary Excel errors. A successful HTTP acknowledgment should mean the Excel operation completed; a flow that acknowledges immediately can hide later workbook failures.

The stable Reference provides duplicate checking on retries. Excel connector visibility can be delayed, so review duplicate references after replaying failed runs. Do not overwrite existing rows on a retry because they may contain your follow-up edits.

## 4. Connect the website

Save the flow and copy its generated HTTP POST URL into the secure **EXCEL_PROVIDER_FLOW_URL** setup field requested by this project. Do not paste it into chat or commit it to source control. Deploy the site with the function and setting present.

## 5. Verify and follow up

Submit one provider request on the production website with **Test submission unchecked**. Confirm its reference appears once in Excel, then edit Status, FollowUpDate, FollowUpNotes, and Owner directly in Excel Online. Test submissions and deploy previews are excluded.

Use the flow's run history to check failures. Requests remain available in Netlify Forms even when the Excel connection fails; failed deliveries are not guaranteed to replay automatically. Re-run failed flow runs after fixing the connection, checking the Reference first. For earlier requests, export the provider-access form from Netlify as CSV and import the desired records manually.

Excel notification delivery to your personal email is a separate Netlify setting and is not changed by this workbook integration.
