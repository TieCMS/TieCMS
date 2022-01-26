import React from "react";

const latestNews = [
  {
    title: "Lorem ipsum",
    img: "https://picsum.photos/id/1001/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: false,
  },
  {
    title: "Latest update",
    img: "https://picsum.photos/id/1002/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: false,
  },
  {
    title: "New news by newt",
    img: "https://picsum.photos/id/1003/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: true,
  },
  {
    title: "Outdated news dont read",
    img: "https://picsum.photos/id/1004/400/250",
    description:
      "Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente",
    featured: false,
  },
];

function NewsCard({ title, desc, badge, img }) {
  return (
    <div class="card card-bordered w-full">
      <figure>
        <img src={img} />
      </figure>
      <div class="card-body bg-base-200">
        <h2 class="card-title truncate">
          {badge && <div class="badge mx-2 badge-secondary">NEW</div>} {title}
        </h2>
        <p className="text-sm">{desc}</p>
        <div class="justify-end card-actions">
          <button class="btn btn-secondary">More info</button>
        </div>
      </div>
    </div>
  );
}

function News() {
  return (
    <div className="container px-4">
      <h1 className="text-3xl font-bold mb-4 underline decoration-primary decoration-4 underline-offset-4">
        Latest news
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {latestNews.map((news) => (
          <NewsCard
            title={news.title}
            desc={news.description}
            badge={news.featured}
            img={news.img}
          />
        ))}
      </div>
    </div>
  );
}

export default News;
