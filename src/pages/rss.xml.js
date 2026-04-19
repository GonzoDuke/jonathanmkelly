import rss from '@astrojs/rss';
import { AA_PIECES, DET_PIECES, PIECES } from '../data/pieces.js';

export function GET(context) {
  const aa = AA_PIECES
    .filter(p => p.status === 'live')
    .map(p => ({
      title: p.title,
      description: p.subtitle || '',
      link: `/agency-artifact/${p.id}/`,
      pubDate: new Date(),
    }));

  const det = DET_PIECES
    .filter(p => p.status === 'live')
    .map(p => ({
      title: p.title,
      description: p.subtitle || '',
      link: `/detourist/${p.id}/`,
      pubDate: new Date(),
    }));

  const poems = PIECES
    .filter(p => p.status === 'live')
    .map(p => ({
      title: p.title,
      description: p.type === 'poem' ? 'Poem' : '',
      link: `/${p.id}/`,
      pubDate: p.date ? new Date(`${p.date}-01-01T00:00:00Z`) : new Date(),
    }));

  return rss({
    title: 'Jonathan M. Kelly',
    description: 'Poet. Writer.',
    site: context.site,
    stylesheet: '/rss.xsl',
    items: [...aa, ...det, ...poems],
    customData: '<language>en-us</language>',
  });
}
