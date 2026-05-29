import { Helmet } from 'react-helmet-async';

const SITE_URL  = 'https://ridenow.fr';
const SITE_NAME = 'RideNow';
const OG_IMAGE  = `${SITE_URL}/og-image.jpg`;

export default function SEO({ title, description, canonical, image, type = 'website', schema }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Chauffeur VTC Premium Paris`;
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const ogImage = image || OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={fullCanonical} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:type"        content={type} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Page-specific JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
