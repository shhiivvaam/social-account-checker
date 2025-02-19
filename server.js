const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const platformRegex = {
    instagram: /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9_](?:[A-Za-z0-9_]|\.(?!\.)){0,28}[A-Za-z0-9_])\/?$/,
    facebook: /^(?:https?:\/\/)?(?:www\.)?(?:facebook|fb)\.com\/(?!(?:marketplace|gaming|watch|me|messages|help|search|groups))([A-z0-9_\-\.]+)\/?$/,
    twitter: /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?@?([A-z0-9_]+)\/?$/
};

function validateURL(url, platform) {
    if (!platformRegex[platform]) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    return platformRegex[platform].test(url);
}

async function checkInstagramAccount(username) {
    const url = `https://www.instagram.com/${username}/`;

    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const profileName = $('meta[property="og:title"]').attr('content');
            if (profileName && profileName.includes(username)) {
                return { exists: true, message: `The Instagram account @${username} exists.` };
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { exists: false, message: `The Instagram account @${username} does not exist.` };
        } else {
            return { exists: false, message: `Error checking account: ${error.message}` };
        }
    }
    return { exists: false, message: `The Instagram account @${username} does not exist.` };
}

async function checkFacebookAccount(username) {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...');

    try {
        await page.goto(`https://www.facebook.com/${username}`, { waitUntil: 'domcontentloaded' });
        
        const isLoginPage = await page.$('input[name="email"]') !== null;
        if (isLoginPage) return { exists: false, message: 'Login wall encountered' };

        const metaUrl = await page.$eval('meta[property="og:url"]', el => el?.content).catch(() => '');
        if (metaUrl.includes(username)) return { exists: true, message: `The Facebook account @${username} exists.` };

        const errorMsg = await page.$eval('div[aria-label="Content Not Found"]', el => el?.innerText).catch(() => '');
        if (errorMsg) return { exists: false, message: `The Facebook account @${username} does not exist.` };
    } finally {
        await browser.close();
    }
    return { exists: false, message: `The Facebook account @${username} does not exist.` };
}

async function checkTwitterAccount(username) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(`https://twitter.com/${username}`, { waitUntil: 'domcontentloaded' });
        
        const profileHeader = await page.waitForSelector('[data-testid="UserName"]', { timeout: 5000 }).catch(() => null);
        if (profileHeader) return { exists: true, message: `The Twitter account @${username} exists.` };

        const pageText = await page.evaluate(() => document.body.innerText);
        if (pageText.includes('Account suspended') || pageText.includes('Not found')) return { exists: false, message: `The Twitter account @${username} does not exist.` };
    } finally {
        await browser.close();
    }
    return { exists: false, message: `The Twitter account @${username} does not exist.` };
}

async function validateSocialMediaLink(url, platform) {
    if (!validateURL(url, platform)) {
        return { valid: false, message: `Invalid ${platform} URL.` };
    }

    const username = url.match(platformRegex[platform])[1];

    switch (platform) {
        case 'instagram':
            return await checkInstagramAccount(username);
        case 'facebook':
            return await checkFacebookAccount(username);
        case 'twitter':
            return await checkTwitterAccount(username);
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}

(async () => {
    const instagramLink = 'https://www.instagram.com/shhiivvaam';
    const facebookLink = 'https://www.facebook.com/shhiivvaam';
    const twitterLink = 'https://twitter.com/shhiivvaam';

    console.log(await validateSocialMediaLink(instagramLink, 'instagram'));
    console.log(await validateSocialMediaLink(facebookLink, 'facebook'));
    console.log(await validateSocialMediaLink(twitterLink, 'twitter'));
})();