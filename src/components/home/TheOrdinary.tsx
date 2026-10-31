import PlateFigure from "@/components/ui/PlateFigure";
import { homeCopy, ordinaryNotes } from "@/data/exhibition";
import { getPhotographBySlug } from "@/lib/gallery";

export default function TheOrdinary() {
  const copy = homeCopy.ordinary;
  const strawHat = getPhotographBySlug("man-in-straw-hat");
  const timesSquare = getPhotographBySlug("times-square-new-years-eve");
  const foot = getPhotographBySlug("foot-on-el");

  if (!strawHat || !timesSquare || !foot) return null;

  return (
    <section
      id="the-ordinary"
      className="section ordinary theme-paper-dark"
      aria-labelledby="ordinary-title"
    >
      <div className="container">
        <header className="ordinary__head">
          <div>
            <span className="eyebrow">SECTION 07 / THE ORDINARY</span>
            <h2 id="ordinary-title" className="display display--lg" lang="en">
              THE ORDINARY
              <br />
              <em>POETRY</em>
            </h2>
          </div>

          <div className="ordinary__head-aside">
            <p className="kicker">日常的诗意</p>
            <p className="lead">{copy.standfirst}</p>
          </div>
        </header>

        <div className="ordinary__triptych">
          <PlateFigure
            photo={strawHat}
            className="ordinary__figure ordinary__figure--tall"
            ratio="3 / 4"
            sizes="(max-width: 767px) 100vw, 30vw"
          />

          <PlateFigure
            photo={timesSquare}
            className="ordinary__figure ordinary__figure--wide"
            ratio="4 / 3"
            sizes="(max-width: 767px) 100vw, 34vw"
          />

          <PlateFigure
            photo={foot}
            className="ordinary__figure ordinary__figure--portrait"
            ratio="3 / 4"
            sizes="(max-width: 767px) 100vw, 28vw"
          />
        </div>

        <div className="ordinary__notes">
          {ordinaryNotes.map((note) => (
            <article className="ordinary__note" key={note.number}>
              <span className="ordinary__num" aria-hidden="true">
                {note.number}
              </span>
              <h3 className="ordinary__note-title" lang="en">
                {note.title}
              </h3>
              <p className="ordinary__note-text">{note.text}</p>
            </article>
          ))}
        </div>

        <p className="ordinary__manifesto" data-reveal="text">
          <span className="ordinary__manifesto-mark" aria-hidden="true">
            “
          </span>
          {copy.manifesto}
        </p>
      </div>
    </section>
  );
}
