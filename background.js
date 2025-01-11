chrome.action.onClicked.addListener((tab) => {
    const pdfUrlPattern = /arxiv\.org\/pdf\/(\d+\.\d+)/i;
    const pdfMatch = tab.url.match(pdfUrlPattern);
    const absUrlPattern = /arxiv\.org\/abs\/(\d+\.\d+)/i;
    const absMatch = tab.url.match(absUrlPattern);
    const alphaxivPdfUrlPattern = /alphaxiv\.org\/pdf\/(\d+\.\d+)/i;
    const alphaxivPdfMatch = tab.url.match(alphaxivPdfUrlPattern);
    const alphaxivAbsUrlPattern = /alphaxiv\.org\/abs\/(\d+\.\d+)/i;
    const alphaxivAbsMatch = tab.url.match(alphaxivAbsUrlPattern);

    let newUrl;

    if (pdfMatch) {
        const arxivId = pdfMatch[1];
        newUrl = `https://arxiv.org/abs/${arxivId}`;
    } else if (absMatch) {
        const arxivId = absMatch[1];
        newUrl = `https://arxiv.org/pdf/${arxivId}`;
    } else if (alphaxivPdfMatch) {
        const alphaxivId = alphaxivPdfMatch[1];
        newUrl = `https://alphaxiv.org/abs/${alphaxivId}`;
    } else if (alphaxivAbsMatch) {
        const alphaxivId = alphaxivAbsMatch[1];
        newUrl = `https://alphaxiv.org/pdf/${alphaxivId}`;
    } else {
        console.log(tab.url, "is not a valid Arxiv/Alphaxiv page.");
        return;
    }

    chrome.tabs.update(tab.id, { url: newUrl });
});