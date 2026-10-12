export function JsonLd({ data }: { data: object }) {
  // Escaping "<" prevents a string field (e.g. a title) from containing
  // "</script>" and breaking out of this script tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- JSON-LD has no safe alternative to a raw script tag; the "<" escape above guards against breakout.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
