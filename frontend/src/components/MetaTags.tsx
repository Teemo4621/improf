import { Helmet } from 'react-helmet-async';

function MetaTags({ title, description, image, name }: { title: string, description: string, image: string, name: string }) {
    return (
        <Helmet>
            <title>{title}</title>
            <link rel='canonical' href={window.location.href} />

            <meta name='description' content={description} />
            <meta name='author' content={name} />

            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content="profile" />
            <meta property="og:site_name" content="Improf" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:secure_url" content={image} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="315" />
            <meta property="og:image:alt" content={`Profile image of ${name}`} />

            <meta name="twitter:creator" content={`@${name}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}

export default MetaTags;
