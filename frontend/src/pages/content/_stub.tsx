import type { ReactNode } from "react";
import { ContentLayout } from "../../seo/ContentLayout";
import { SEOHead } from "../../seo/SEOHead";
import { getSeoForPath } from "../../seo/routes";

/**
 * Lightweight stub used by content pages whose full copy hasn't been written yet.
 * Provides the proper SEO meta block and layout chrome so the prerender works,
 * with placeholder body content that signals what's coming.
 *
 * Once a page's full content is written, remove the stub call and replace with
 * the real component (see BiodataFormatMaster.tsx for the template).
 */
export function ContentStub({
  path,
  intro,
  body,
}: {
  path: string;
  intro?: string;
  body?: ReactNode;
}) {
  const route = getSeoForPath(path);
  return (
    <>
      <SEOHead route={route} />
      <ContentLayout heading={route.title.split(" — ")[0]} subheading={intro ?? route.description}>
        {body ?? (
          <>
            <p>{route.description}</p>
            <p>
              We're putting the finishing touches on this guide. In the meantime, you can{" "}
              <a href="/biodata-format">read our master guide to marriage biodata formats</a> or{" "}
              <a href="/onboarding">create your biodata on Rishte</a> in five minutes.
            </p>
          </>
        )}
      </ContentLayout>
    </>
  );
}
