const hTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const getHeaders = (data) => {
    const headers = [];
    hTags.forEach(el => {
        const rx = new RegExp(`<${el}.+?</${el}>`,'ig');
        let matches = data.match(rx);     

        if(matches) {
            matches = matches.map(elem => 
                elem.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, ''));
            headers.push(...matches);
        };
    });    
    return headers;
};

const printHeaders = (headers) => {
    console.log('HEADERS:');
    headers.forEach((el, index) => {
        console.log(index + 1, el);
    })
};

const getLinks = (data) => {
    let links = [];
    let matches = data.match(/<a.+?<\/a>/ig);
    if(matches) {
        links = matches.map(el => {
            return {
                url: (el.match(/href="([^\'\"]*)/))[1],              
                text: el.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, '')
            };
        })
    };
    return links;
};

const printLinks = (links) => {
    console.log('LINKS:');
    links.forEach((el, index) => {
        console.log(index + 1, el.url, el.text);
    })
};

const parseHtml = (htmlContent) => {
    
    printHeaders(getHeaders(htmlContent));

    printLinks(getLinks(htmlContent));
}

export default parseHtml;