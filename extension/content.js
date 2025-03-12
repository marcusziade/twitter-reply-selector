// Twitter Reply Auto-Selector
// This script automatically changes reply settings to "Verified accounts"

// Enable logging
const debug = true;
function log(message) {
    if (debug) {
        console.log(`[Twitter Reply Selector] ${message}`);
    }
}

// Wait for the specified time (in ms)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Find the "Everyone can reply" element using its exact CSS classes
async function findEveryoneCanReplyElement() {
    // Target the specific span with these classes that contains the text
    const candidateElements = document.querySelectorAll('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');

    for (const element of candidateElements) {
        if (element.textContent === 'Everyone can reply') {
            log("Found exact 'Everyone can reply' element");
            return element;
        }
    }

    // Try with a more general selector if the specific one fails
    const allSpans = document.querySelectorAll('span');
    for (const span of allSpans) {
        if (span.textContent === 'Everyone can reply') {
            log("Found 'Everyone can reply' with general selector");
            return span;
        }
    }

    log("Could not find 'Everyone can reply' element");
    return null;
}

// Find the clickable parent element
function findClickableParent(element) {
    // Start with the element itself
    let current = element;

    // Try to find a clickable parent (typically has role="button")
    while (current && current !== document.body) {
        if (current.getAttribute('role') === 'button' ||
            current.tagName === 'BUTTON' ||
            current.classList.contains('r-cursor-pointer')) {
            log("Found clickable parent element");
            return current;
        }
        current = current.parentElement;
    }

    // If no clear button role, go up 3 levels which often works for Twitter
    current = element;
    for (let i = 0; i < 3 && current && current !== document.body; i++) {
        current = current.parentElement;
    }

    if (current && current !== document.body) {
        log("Using parent 3 levels up as clickable element");
        return current;
    }

    log("Could not find a clickable parent");
    return null;
}

// Find the "Verified accounts" option in the dropdown
async function findVerifiedAccountsOption() {
    // Wait for dropdown to appear
    await wait(500);

    // First try with role="menuitem"
    const menuItems = document.querySelectorAll('div[role="menuitem"]');
    for (const item of menuItems) {
        if (item.textContent.includes('Verified accounts')) {
            log("Found 'Verified accounts' option by role");
            return item;
        }
    }

    // Try with a more generic approach - look for any element with this text
    const allElements = document.querySelectorAll('div, span');
    for (const el of allElements) {
        if (el.textContent === 'Verified accounts') {
            // Go up to find a clickable parent
            const clickable = findClickableParent(el);
            if (clickable) {
                log("Found 'Verified accounts' with generic selector");
                return clickable;
            }
        }
    }

    log("Could not find 'Verified accounts' option");
    return null;
}

// Main function to set reply settings to "Verified accounts"
async function setToVerifiedAccounts() {
    try {
        // Find the "Everyone can reply" element
        const everyoneElement = await findEveryoneCanReplyElement();
        if (!everyoneElement) return;

        // Find its clickable parent
        const clickableParent = findClickableParent(everyoneElement);
        if (!clickableParent) return;

        // Click to open the dropdown
        log("Clicking to open the dropdown");
        clickableParent.click();

        // Find and click the "Verified accounts" option
        const verifiedOption = await findVerifiedAccountsOption();
        if (verifiedOption) {
            log("Clicking 'Verified accounts' option");
            verifiedOption.click();
        }
    } catch (error) {
        log(`Error: ${error.message}`);
    }
}

// Check if compose area is active
function isComposeActive() {
    // Look for the tweet textarea
    const textarea = document.querySelector('[data-testid="tweetTextarea_0"]');
    return !!textarea;
}

// Monitor the page continuously
function monitorPage() {
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver(async (mutations) => {
        // Check if compose is active and "Everyone can reply" is present
        if (isComposeActive()) {
            const everyoneElement = await findEveryoneCanReplyElement();
            if (everyoneElement) {
                log("Detected active compose with 'Everyone can reply'");
                // Use a short timeout to let the UI fully render
                setTimeout(setToVerifiedAccounts, 300);
            }
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Also run periodic checks
    setInterval(async () => {
        if (isComposeActive()) {
            const everyoneElement = await findEveryoneCanReplyElement();
            if (everyoneElement) {
                log("Periodic check found 'Everyone can reply'");
                setToVerifiedAccounts();
            }
        }
    }, 2000);

    // Check when user clicks anything
    document.addEventListener('click', async () => {
        // Short delay to let UI respond to the click
        await wait(300);
        if (isComposeActive()) {
            const everyoneElement = await findEveryoneCanReplyElement();
            if (everyoneElement) {
                log("Click event triggered check");
                setToVerifiedAccounts();
            }
        }
    }, true);
}

// Initialize the extension
function initialize() {
    log("Initializing extension");

    // Check if we're on Twitter/X
    if (window.location.hostname.includes('twitter.com') ||
        window.location.hostname.includes('x.com')) {

        // Initial check after page load
        setTimeout(async () => {
            if (isComposeActive()) {
                const everyoneElement = await findEveryoneCanReplyElement();
                if (everyoneElement) {
                    log("Initial check found 'Everyone can reply'");
                    setToVerifiedAccounts();
                }
            }

            // Start monitoring
            monitorPage();
        }, 1500);

        log("Extension initialized");
    }
}

// Run when the page is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
} else {
    document.addEventListener('DOMContentLoaded', initialize);
}
