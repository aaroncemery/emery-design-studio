/** "One house again, / quietly." → first part, then the rest in italics. */
export function SplitHeadline({ text }: { text: string }) {
  const [first, ...rest] = text.split(" / ");
  const second = rest.join(" / ");
  return (
    <>
      {first}
      {second && (
        <>
          <br />
          <em>{second}</em>
        </>
      )}
    </>
  );
}
