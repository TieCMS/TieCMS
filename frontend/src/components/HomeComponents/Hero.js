function Hero() {
  const heroImage = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url("https://picsum.photos/id/5/1920/560")`,
    // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${importedImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
  return (
    <div class="hero py-40 mb-12" style={heroImage}>
      <div class="text-center hero-content">
        <div class="max-w-xl">
          <h1 class="mb-5 text-4xl font-bold">
            The best CMS for World of Warcraft emulators
          </h1>
          <button class="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
