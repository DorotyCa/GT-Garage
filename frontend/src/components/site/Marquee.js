const ITEMS = [
  "Polish faruri și stopuri",
  "Detailing interior & exterior",
  "Atenție la fiecare detaliu",
  "Vulcanizare profesională",
  "Echipamente moderne",
  "Experiență în domeniul auto din 2016",
];

export const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div data-testid="ethos-marquee" className="border-y border-carbon-600 bg-carbon-900 overflow-hidden py-5">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display font-bold uppercase tracking-widest text-lg text-slate-300 px-6">{item}</span>
                <span className="text-kinetic font-mono text-sm">///</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
