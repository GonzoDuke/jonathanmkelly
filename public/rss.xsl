<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="robots" content="noindex"/>
        <title><xsl:value-of select="/rss/channel/title"/> &#8212; RSS</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin"/>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&amp;family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&amp;family=DM+Mono:wght@300;400&amp;display=swap" rel="stylesheet"/>
        <style>
          :root {
            --bg: #1a1a20;
            --fg: #f0ece4;
            --muted: rgba(240, 236, 228, 0.55);
            --faint: rgba(240, 236, 228, 0.35);
            --line: rgba(240, 236, 228, 0.12);
            --serif: 'Cormorant Garamond', 'Georgia', serif;
            --body: 'Newsreader', 'Georgia', serif;
            --mono: 'DM Mono', 'Menlo', monospace;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            background: var(--bg);
            color: var(--fg);
            font-family: var(--body);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          body {
            min-height: 100vh;
            line-height: 1.6;
            padding: 48px 24px 96px;
          }
          main {
            max-width: 720px;
            margin: 0 auto;
          }
          .back {
            display: inline-block;
            font-family: var(--mono);
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--faint);
            text-decoration: none;
            margin-bottom: 48px;
            transition: color 0.2s ease;
          }
          .back:hover { color: var(--fg); }
          h1 {
            font-family: var(--serif);
            font-weight: 500;
            font-size: clamp(42px, 6vw, 64px);
            line-height: 1.05;
            letter-spacing: -0.01em;
            margin-bottom: 18px;
          }
          .desc {
            font-family: var(--serif);
            font-style: italic;
            font-size: clamp(17px, 2.2vw, 20px);
            color: var(--muted);
            margin-bottom: 36px;
            line-height: 1.5;
          }
          .hint {
            font-family: var(--mono);
            font-size: 12px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--faint);
            margin-bottom: 10px;
          }
          .feed-url {
            display: block;
            font-family: var(--mono);
            font-size: 13px;
            color: var(--fg);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--line);
            padding: 14px 18px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: nowrap;
            margin-bottom: 64px;
            user-select: all;
          }
          .items {
            list-style: none;
            border-top: 1px solid var(--line);
          }
          .items li {
            padding: 32px 0;
            border-bottom: 1px solid var(--line);
          }
          .items a {
            text-decoration: none;
            color: var(--fg);
            display: block;
            margin-bottom: 8px;
          }
          .item-title {
            font-family: var(--serif);
            font-weight: 500;
            font-size: clamp(22px, 3vw, 28px);
            line-height: 1.25;
            letter-spacing: -0.005em;
            transition: opacity 0.2s ease;
          }
          .items a:hover .item-title { opacity: 0.65; }
          .item-date {
            font-family: var(--mono);
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--faint);
            margin-bottom: 10px;
          }
          .item-desc {
            font-family: var(--body);
            font-size: 16px;
            color: var(--muted);
            line-height: 1.55;
          }
          @media (max-width: 540px) {
            body { padding: 32px 18px 72px; }
            .back { margin-bottom: 32px; }
            .feed-url { margin-bottom: 48px; font-size: 12px; padding: 12px 14px; }
            .items li { padding: 24px 0; }
          }
        </style>
      </head>
      <body>
        <main>
          <a href="/" class="back">&#8592; Back to site</a>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
          <p class="hint">Paste this URL into your feed reader to subscribe</p>
          <code class="feed-url"><xsl:value-of select="/rss/channel/link"/>rss.xml</code>
          <ol class="items">
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                  <span class="item-title"><xsl:value-of select="title"/></span>
                </a>
                <p class="item-date"><xsl:value-of select="pubDate"/></p>
                <p class="item-desc"><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ol>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
