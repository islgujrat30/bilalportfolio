const url = 'https://bilalportfolio.pages.dev/?v=' + Date.now();
fetch(url).then(r => r.text()).then(async html => {
  const matches = [...html.matchAll(/src="(\/assets\/[^"]+\.js)"/g)];
  if (matches.length > 0) {
    for (const m of matches) {
      const jsUrl = 'https://bilalportfolio.pages.dev' + m[1];
      console.log('Fetching', jsUrl);
      const js = await fetch(jsUrl).then(r => r.text());
      console.log('JS contains iframeName:', js.includes('hidden_iframe_'));
      if (js.includes('hidden_iframe_')) {
        console.log('FOUND IT!');
        return;
      }
    }
    console.log('NONE of the JS chunks contain the hidden iframe fix.');
  } else { console.log('No JS found'); }
});
