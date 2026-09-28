/**
 * Letter-roll: each glyph is stacked twice and rolls up on hover of the nearest
 * `.roll-host`, staggered left to right.
 */
export default function RollText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className}`} aria-label={text}>
      {Array.from(text).map((c, i) =>
        c === " " ? (
          <span key={i} className="roll-sp" aria-hidden>
            {" "}
          </span>
        ) : (
          <span key={i} className="roll-c" style={{ ["--i" as string]: i }} aria-hidden>
            <span>{c}</span>
            <span>{c}</span>
          </span>
        )
      )}
    </span>
  );
}
