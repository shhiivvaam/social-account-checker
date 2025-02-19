# Social Account Checker

## Overview

**Social Account Checker** is an NPM package that allows developers to verify the existence of a social media account for a given username on platforms like Instagram, Facebook, and Twitter. This package is useful for applications that need to validate social media presence, prevent fake accounts, or enhance user verification.

## Features
- Supports **Instagram, Facebook, and Twitter**.
- Provides two ways to check an account:
  - By validating a **full social media URL**.
  - By directly passing the **platform name and username**.
- Uses **Axios, Cheerio, and Puppeteer** for web scraping and verification.
- Returns structured responses indicating account existence.

## Installation

Install the package using npm:
```sh
npm install social-account-checker
```

## Usage

### 1. Validate Social Media Link

This method accepts a full social media URL and platform name.

```javascript
const { validateSocialMediaLink } = require('social-account-checker');

(async () => {
    const instagramLink = 'https://www.instagram.com/shhiivvaam';
    const facebookLink = 'https://www.facebook.com/shhiivvaam';
    const twitterLink = 'https://twitter.com/shhiivvaam';

    console.log(await validateSocialMediaLink(instagramLink, 'instagram'));
    console.log(await validateSocialMediaLink(facebookLink, 'facebook'));
    console.log(await validateSocialMediaLink(twitterLink, 'twitter'));
})();
```

### 2. Check Account by Platform and Username

This method accepts a platform name and username to check if the account exists.

```javascript
const { checkAccount } = require('social-account-checker');

(async () => {
    console.log(await checkAccount("instagram", 'shhiivvaam'));
    console.log(await checkAccount("facebook", 'shhiivvaam'));
    console.log(await checkAccount("twitter", 'shhiivvaam'));
})();
```

## Response Format
The functions return an object with the following structure:
```json
{
  "exists": true,
  "message": "The Instagram account @shhiivvaam exists."
}
```
If the account does not exist, the response will indicate so:
```json
{
  "exists": false,
  "message": "The Twitter account @shhiivvaam does not exist."
}
```

## Supported Platforms
- **Instagram** (`instagram`)
- **Facebook** (`facebook`)
- **Twitter** (`twitter`)

## Use Cases
- Verify user social media accounts in registration forms.
- Prevent fake profiles on your platform.
- Automate social media validation processes.

## License
This project is licensed under the MIT License.

## Contributions
Contributions are welcome! Feel free to submit an issue or pull request on GitHub.

## Author
Developed by @shhiivvaam ✅.

## Contact
For any questions or support, please reach out to ✉️ life.shivam2394@gmail.com.
