# SPO Analytics 
## About 
Track _who_ is visiting your site!  
SPO Analytics is an SPFx Application Customizer that logs the number of times a user visits specific pages on an SPO site. The data is saved to a List on the same site. One row per user.
## Setup 
Clone, package, deploy and install this solution to your site's App Catalog
### List Setup
- Create a List with this exact name: **SPO_Analytics**
- New _Single Line of Text_ column: **Username**
- New _Number_ column for each page you want to track
  - The column names should match the page names exactly. Use the page's url to ensure that you have the corect name
    For example, create a column called **Home** if you want to track your site's homepage
  - Set the _Number of decimal places_ to 0
  - Set the _Default value_ to 0
- Ensure that everyone visiting your site can write to the **SPO_Analytics** List
  - This may involve breaking inheritance on the List and giving the _Visitors_ group _Contribute_ rights
- Sit back and watch the hits roll in!
## Troubleshooting
Open devtools, the console should be logging one of these three messages:
- 'SPO_Analytics' list does not exist on this site
  - Make sure the List is created and named correctly
- This page is not being tracked
  - There isn't a column for current page. Make sure the column exists and is named correctly
- creating item
  - :thumbsup: A new user has visited the page
- updating item
  - :thumbsup: An existing user has returned to the page
  
If you don't see any of these messages, make sure the app is installed on the site.
## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.17.4-green.svg)
