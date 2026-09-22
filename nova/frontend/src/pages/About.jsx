export default function About() {
  return (
    <div className="section py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-semibold text-ink">About NOVA</h1>
        <p className="mt-4 text-stone">
          NOVA started with a simple idea: everyday essentials shouldn't be an afterthought.
          We design clean, considered pieces — apparel, footwear, accessories and more —
          using honest materials and construction that holds up to daily life.
        </p>
        <p className="mt-4 text-stone">
          This site is a demo built for a full-stack technical assessment. The catalog,
          cart, checkout and admin dashboard are all fully functional against a real backend and database.
        </p>
      </div>

      <div className="mx-auto mt-12 aspect-[16/7] max-w-4xl overflow-hidden rounded-3xl bg-ink/5">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80"
          alt="NOVA studio"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
